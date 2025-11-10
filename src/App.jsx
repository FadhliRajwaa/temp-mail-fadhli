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
  const [refreshing, setRefreshing] = useState(false);
  
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
    // Cek localStorage untuk email yang sudah ada
    const savedEmail = localStorage.getItem('tempMailAddress');
    const newEmail = savedEmail || generateEmailAddress();
    
    // Simpan ke state dan localStorage
    setEmailAddress(newEmail);
    if (!savedEmail) {
      localStorage.setItem('tempMailAddress', newEmail);
    }

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

  // Handle create new email
  const handleCreateNew = () => {
    const newEmail = generateEmailAddress();
    setEmailAddress(newEmail);
    setEmails([]);
    setSelectedEmail(null);
    
    // Simpan ke localStorage
    localStorage.setItem('tempMailAddress', newEmail);
    
    // Join new room
    if (socketRef.current) {
      socketRef.current.emit('join-room', newEmail);
    }
  };

  // Handle refresh inbox
  const handleRefreshInbox = async () => {
    if (refreshing) return; // Prevent double click
    
    setRefreshing(true);
    try {
      // Fetch emails dari server
      const response = await fetch(`${BACKEND_URL}/api/emails/${emailAddress}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setEmails(data.emails || []);
          console.log('Inbox refreshed');
        }
      }
    } catch (error) {
      console.error('Error refreshing inbox:', error);
    } finally {
      // Minimum 500ms loading untuk smooth UX
      setTimeout(() => setRefreshing(false), 500);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center rounded-2xl shadow-2xl p-8 glass" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <Mail className="w-12 h-12 mx-auto mb-3 text-purple-600" />
          <p className="text-lg font-bold mb-1 text-gray-800">Connecting...</p>
          <p className="text-sm text-gray-600">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <header className="glass-dark shadow-2xl sticky top-0 z-50 border-b animate-fadeIn backdrop-blur-lg" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)', animation: 'fadeIn 0.5s ease-out' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl glow-on-hover shadow-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Temp Mail</h1>
                <p className="text-xs text-purple-200 hidden sm:block">Secure Temporary Email Service</p>
              </div>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <div className="w-2.5 h-2.5 rounded-full pulse-dot" style={{ background: '#22c55e' }}></div>
                <span className="text-xs sm:text-sm font-semibold text-green-300">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs sm:text-sm font-semibold text-red-300">Offline</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Email Address Card */}
        <div className="rounded-2xl shadow-2xl p-6 glass hover-lift" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', animation: 'scaleIn 0.6s ease-out' }}>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold mb-1" style={{ color: '#764ba2' }}>Your Temporary Email Address</h2>
              <p className="text-sm text-gray-600">Use this email for registrations and verifications</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <input
                type="text"
                value={emailAddress}
                readOnly
                className="flex-1 min-w-0 px-4 py-3 text-base sm:text-lg font-mono font-bold rounded-xl border-2 focus:outline-none text-center lg:text-left shadow-inner"
                style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', color: '#374151', borderColor: '#9ca3af' }}
              />
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <button
                  onClick={handleCopyEmail}
                  className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{
                    background: copied ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    minWidth: '120px'
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleRefreshInbox}
                  disabled={refreshing}
                  className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    minWidth: '120px'
                  }}
                  title={refreshing ? 'Loading...' : 'Refresh inbox'}
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Loading...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={handleCreateNew}
                  className="px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    minWidth: '120px'
                  }}
                >
                  <Mail className="w-5 h-5" />
                  <span>New Email</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg glass" style={{ background: 'rgba(147, 51, 234, 0.1)', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium">Auto-delete after 15 minutes</span>
            </div>
          </div>
        </div>

        {/* Email List and Detail */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Inbox List */}
          <div className="xl:col-span-1 rounded-2xl shadow-2xl overflow-hidden glass" style={{ background: 'rgba(255, 255, 255, 0.95)', animation: 'slideInFromLeft 0.7s ease-out' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5" />
                Inbox
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255, 255, 255, 0.25)', color: 'white' }}>
                {emails.length} {emails.length === 1 ? 'Email' : 'Emails'}
              </span>
            </div>
            <div className="divide-y divide-gray-100" style={{ maxHeight: '600px', minHeight: '400px', overflowY: 'auto' }}>
              {emails.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
                    <Mail className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="text-base font-bold mb-2 text-gray-800">No Emails Yet</p>
                  <p className="text-sm text-gray-600">Emails will appear here in real-time</p>
                </div>
              ) : (
                emails.map((email, index) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`email-card p-4 cursor-pointer transition-all duration-300 hover:bg-purple-50 border-l-4 ${
                      selectedEmail?.id === email.id ? 'bg-gradient-to-r from-purple-50 to-indigo-50' : ''
                    }`}
                    style={{ 
                      borderLeftColor: selectedEmail?.id === email.id ? '#764ba2' : 'transparent',
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-gray-800 truncate flex-1 pr-2">
                        {email.from}
                      </p>
                      <span className="text-xs text-purple-600 font-medium shrink-0">
                        {formatDate(email.receivedAt)}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 truncate mb-2">
                      {email.subject || '(No Subject)'}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {email.bodyText || 'Empty message'}
                    </p>
                    <div className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(147, 51, 234, 0.1)' }}>
                      <Clock className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-purple-700 font-medium">{getExpiryTime(email.expiresAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email Detail */}
          <div className="xl:col-span-2 rounded-2xl shadow-2xl overflow-hidden glass" style={{ background: 'rgba(255, 255, 255, 0.95)', animation: 'slideInFromRight 0.7s ease-out' }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' }}>
              <Mail className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white">
                {selectedEmail ? 'Email Details' : 'Select an Email'}
              </h2>
            </div>
            <div className="p-4 sm:p-6" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {selectedEmail ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl glass" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                      <label className="text-xs font-bold uppercase text-purple-600 mb-1 block">
                        From
                      </label>
                      <p className="text-sm font-semibold text-gray-800 break-all">{selectedEmail.from}</p>
                    </div>
                    
                    <div className="p-4 rounded-xl glass" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
                      <label className="text-xs font-bold uppercase text-purple-600 mb-1 block">
                        To
                      </label>
                      <p className="text-sm font-semibold text-gray-800 break-all">{selectedEmail.to}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
                    <label className="text-xs font-bold uppercase text-indigo-700 mb-1 block">
                      Subject
                    </label>
                    <p className="text-base font-bold text-gray-900 break-words">
                      {selectedEmail.subject || '(No Subject)'}
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl glass" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
                    <label className="text-xs font-bold uppercase text-amber-700 mb-1 block">
                      Received
                    </label>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(selectedEmail.receivedAt).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden shadow-inner" style={{ background: 'white', border: '1px solid #e5e7eb' }}>
                    <div className="px-4 py-3" style={{ background: 'linear-gradient(90deg, #f9fafb 0%, #f3f4f6 100%)' }}>
                      <label className="text-sm font-bold text-gray-700">
                        Email Content
                      </label>
                    </div>
                    <div className="p-4 sm:p-6" style={{ maxHeight: '400px', overflowY: 'auto', background: '#ffffff' }}>
                      {selectedEmail.bodyHtml ? (
                        <div
                          className="email-content-wrapper prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                          {selectedEmail.bodyText || '(Empty message)'}
                        </pre>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      Auto-deletes {getExpiryTime(selectedEmail.expiresAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' }}>
                    <Inbox className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="text-lg font-bold mb-2 text-gray-800">No Email Selected</p>
                  <p className="text-sm text-gray-600">Click on an email to view its details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl shadow-2xl p-6 glass" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shrink-0" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>1</span>
              <span className="text-white text-sm">Copy the email address for registrations</span>
            </div>
            <div className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shrink-0" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>2</span>
              <span className="text-white text-sm">Incoming emails appear in real-time</span>
            </div>
            <div className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shrink-0" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>3</span>
              <span className="text-white text-sm">All emails auto-delete after 15 minutes</span>
            </div>
            <div className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold shrink-0" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>4</span>
              <span className="text-white text-sm">Click "New Email" for a different address</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-6 glass-dark border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium text-purple-200">
            © 2024 Temp Mail Service
          </p>
          <p className="text-xs text-purple-300 mt-1">
            Secure • Fast • Anonymous
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
