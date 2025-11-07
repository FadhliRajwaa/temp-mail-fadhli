import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  Mail, 
  RefreshCw, 
  Copy, 
  CheckCircle, 
  Clock, 
  Inbox,
  Trash2,
  AlertCircle
} from 'lucide-react';
import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const EMAIL_DOMAIN = import.meta.env.VITE_EMAIL_DOMAIN || 'domain-saya.my.id';

function App() {
  // States
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Refs
  const socketRef = useRef(null);

  // Generate random email address (no dashes)
  const generateEmailAddress = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 12; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${randomString}@${EMAIL_DOMAIN}`;
  };

  // Initialize email address and socket connection
  useEffect(() => {
    // Generate initial email
    const newEmail = generateEmailAddress();
    setEmailAddress(newEmail);

    // Setup Socket.io connection
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
      setLoading(false);
      
      // Join room for this email
      socket.emit('join-room', newEmail);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
      setLoading(false);
    });

    // Email events
    socket.on('email-history', (history) => {
      console.log('📧 Received email history:', history);
      setEmails(history);
    });

    socket.on('new-email', (email) => {
      console.log('📬 New email received:', email);
      setEmails((prev) => [email, ...prev]);
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Email Baru!', {
          body: `Dari: ${email.from}\nSubject: ${email.subject}`,
          icon: '/mail-icon.png'
        });
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.emit('leave-room', newEmail);
        socket.disconnect();
      }
    };
  }, []);

  // Handle email address change
  const handleGenerateNew = () => {
    const socket = socketRef.current;
    
    if (socket && emailAddress) {
      // Leave current room
      socket.emit('leave-room', emailAddress);
    }
    
    // Generate new email
    const newEmail = generateEmailAddress();
    setEmailAddress(newEmail);
    setEmails([]);
    setSelectedEmail(null);
    
    if (socket && socket.connected) {
      // Join new room
      socket.emit('join-room', newEmail);
    }
  };

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`;
    return date.toLocaleString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Calculate time until expiry
  const getExpiryTime = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry - now;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 0) return 'Kadaluwarsa';
    if (diffMins < 60) return `${diffMins} menit lagi`;
    return 'Lebih dari 1 jam';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F9F7F7 0%, #DBE2EF 100%)' }}>
        <div className="text-center rounded-xl shadow-lg p-6 border" style={{ background: 'white', borderColor: '#DBE2EF' }}>
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: '#3F72AF' }}></div>
          <Mail className="w-8 h-8 mx-auto mb-2" style={{ color: '#3F72AF' }} />
          <p className="text-sm font-bold mb-1" style={{ color: '#112D4E' }}>Menghubungkan...</p>
          <p className="text-xs" style={{ color: '#3F72AF' }}>Mohon tunggu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F9F7F7 0%, #DBE2EF 100%)' }}>
      {/* Header */}
      <header className="backdrop-blur-md shadow-lg sticky top-0 z-50 border-b" style={{ backgroundColor: 'rgba(17, 45, 78, 0.95)', borderBottomColor: '#3F72AF' }}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: '#3F72AF' }}>
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">Temp Mail</h1>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(63, 114, 175, 0.2)', border: '1px solid #3F72AF' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#3F72AF' }}></div>
                <span className="text-xs font-semibold text-white hidden sm:inline">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444' }}>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold text-red-200 hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-3 space-y-3">
        {/* Email Address Card */}
        <div className="rounded-lg shadow-lg p-3 border" style={{ background: 'white', borderColor: '#DBE2EF' }}>
          <div className="space-y-2">
            <p className="text-center text-xs font-medium" style={{ color: '#3F72AF' }}>Alamat Email Sementara Anda</p>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={emailAddress}
                readOnly
                className="flex-1 min-w-0 px-3 py-2 text-sm font-mono font-semibold rounded-lg border focus:outline-none text-center md:text-left"
                style={{ background: '#F9F7F7', color: '#112D4E', borderColor: '#DBE2EF' }}
              />
              <button
                onClick={handleCopyEmail}
                className="md:w-auto px-4 py-2 rounded-lg font-semibold shadow flex items-center justify-center gap-2 text-sm"
                style={{ background: copied ? '#112D4E' : '#3F72AF', color: 'white' }}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin</span>
                  </>
                )}
              </button>
              <button
                onClick={handleGenerateNew}
                className="md:w-auto px-4 py-2 rounded-lg font-semibold shadow flex items-center justify-center gap-2 text-sm"
                style={{ background: '#DBE2EF', color: '#112D4E' }}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Buat Baru</span>
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs px-2 py-1 rounded" style={{ background: 'rgba(63,114,175,0.08)', border: '1px solid #3F72AF', color: '#3F72AF' }}>
              <Clock className="w-3.5 h-3.5" />
              <span>Auto-hapus 15 menit</span>
            </div>
          </div>
        </div>

        {/* Email List and Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Inbox List */}
          <div className="lg:col-span-1 rounded-lg shadow-lg overflow-hidden border" style={{ background: 'white', borderColor: '#DBE2EF' }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#3F72AF' }}>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                Inbox
              </h2>
              <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255, 255, 255, 0.3)', color: 'white' }}>
                {emails.length}
              </span>
            </div>
            <div className="divide-y max-h-[350px] overflow-y-auto" style={{ borderColor: '#DBE2EF' }}>
              {emails.length === 0 ? (
                <div className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: '#DBE2EF' }}>
                    <Mail className="w-6 h-6" style={{ color: '#3F72AF' }} />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#112D4E' }}>Belum Ada Email</p>
                  <p className="text-xs" style={{ color: '#3F72AF' }}>Email akan muncul real-time</p>
                </div>
              ) : (
                emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-3 cursor-pointer transition-colors border-l-4 ${
                      selectedEmail?.id === email.id ? '' : 'border-transparent'
                    }`}
                    style={{ 
                      borderLeftColor: selectedEmail?.id === email.id ? '#3F72AF' : 'transparent',
                      background: selectedEmail?.id === email.id ? '#F9F7F7' : 'transparent'
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-xs truncate flex-1" style={{ color: '#112D4E' }}>
                        {email.from}
                      </p>
                      <span className="text-xs ml-2 shrink-0" style={{ color: '#3F72AF' }}>
                        {formatDate(email.receivedAt)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold truncate mb-1" style={{ color: '#112D4E' }}>
                      {email.subject}
                    </p>
                    <p className="text-xs truncate mb-2" style={{ color: '#3F72AF' }}>
                      {email.bodyText.substring(0, 50)}...
                    </p>
                    <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded" style={{ background: 'rgba(63, 114, 175, 0.1)', color: '#3F72AF' }}>
                      <Clock className="w-3 h-3" />
                      <span>{getExpiryTime(email.expiresAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email Detail */}
          <div className="lg:col-span-2 rounded-lg shadow-lg overflow-hidden border" style={{ background: 'white', borderColor: '#DBE2EF' }}>
            <div className="px-3 py-2 flex items-center gap-2" style={{ background: '#112D4E' }}>
              <Mail className="w-4 h-4 text-white" />
              <h2 className="text-sm font-bold text-white">
                {selectedEmail ? 'Detail Email' : 'Pilih Email'}
              </h2>
            </div>
            <div className="p-3 max-h-[350px] overflow-y-auto">
              {selectedEmail ? (
                <div className="space-y-2">
                  <div className="p-2 rounded-lg border" style={{ background: '#F9F7F7', borderColor: '#DBE2EF' }}>
                    <label className="text-xs font-semibold uppercase mb-0.5 block" style={{ color: '#3F72AF' }}>
                      Dari
                    </label>
                    <p className="text-sm font-medium" style={{ color: '#112D4E' }}>{selectedEmail.from}</p>
                  </div>
                  
                  <div className="p-2 rounded-lg border" style={{ background: '#F9F7F7', borderColor: '#DBE2EF' }}>
                    <label className="text-xs font-semibold uppercase mb-0.5 block" style={{ color: '#3F72AF' }}>
                      Kepada
                    </label>
                    <p className="text-sm font-medium" style={{ color: '#112D4E' }}>{selectedEmail.to}</p>
                  </div>
                  
                  <div className="p-2 rounded-lg border" style={{ background: '#DBE2EF', borderColor: '#3F72AF' }}>
                    <label className="text-xs font-semibold uppercase mb-0.5 block" style={{ color: '#112D4E' }}>
                      Subject
                    </label>
                    <p className="text-sm font-bold" style={{ color: '#112D4E' }}>
                      {selectedEmail.subject}
                    </p>
                  </div>
                  
                  <div className="p-2 rounded-lg border" style={{ background: '#F9F7F7', borderColor: '#DBE2EF' }}>
                    <label className="text-xs font-semibold uppercase mb-0.5 block" style={{ color: '#3F72AF' }}>
                      Tanggal
                    </label>
                    <p className="text-sm font-medium" style={{ color: '#112D4E' }}>
                      {new Date(selectedEmail.receivedAt).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-2" style={{ borderColor: '#DBE2EF' }}>
                    <label className="text-xs font-semibold uppercase mb-1 block" style={{ color: '#112D4E' }}>
                      Isi Email
                    </label>
                    {selectedEmail.bodyHtml ? (
                      <div
                        className="max-w-none p-2 rounded-lg text-sm"
                        style={{ background: '#F9F7F7' }}
                        dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                      />
                    ) : (
                      <div className="p-2 rounded-lg" style={{ background: '#F9F7F7' }}>
                        <pre className="text-sm whitespace-pre-wrap font-sans" style={{ color: '#112D4E' }}>
                          {selectedEmail.bodyText || '(Email kosong)'}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded" style={{ background: 'rgba(63, 114, 175, 0.1)', border: '1px solid #3F72AF' }}>
                    <Clock className="w-3.5 h-3.5" style={{ color: '#3F72AF' }} />
                    <span className="text-xs font-medium" style={{ color: '#112D4E' }}>
                      Hapus {getExpiryTime(selectedEmail.expiresAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: '#DBE2EF' }}>
                    <Mail className="w-6 h-6" style={{ color: '#3F72AF' }} />
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: '#112D4E' }}>Pilih email</p>
                  <p className="text-xs" style={{ color: '#3F72AF' }}>Klik untuk detail</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-lg shadow-lg p-3 border" style={{ background: '#3F72AF', borderColor: '#112D4E' }}>
          <h3 className="text-sm font-bold text-white mb-2">Cara Menggunakan</h3>
          <ul className="space-y-1.5 text-white text-xs">
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">1.</span>
              <span>Salin alamat email dan gunakan untuk registrasi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">2.</span>
              <span>Email masuk akan muncul secara real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">3.</span>
              <span>Semua email akan terhapus otomatis setelah 15 menit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold shrink-0">4.</span>
              <span>Klik "Buat Baru" untuk mendapatkan alamat email berbeda</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-2 mt-4" style={{ background: '#112D4E', borderTopColor: '#3F72AF' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-medium" style={{ color: '#DBE2EF' }}>
            © 2026 Temp Mail | Dibuat oleh Fadhli
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
