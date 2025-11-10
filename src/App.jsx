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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #450693 0%, #8C00FF 30%, #FF3F7F 70%, #FFC400 100%)' }}>
        <div className="text-center rounded-3xl shadow-2xl p-10" style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)' }}>
          <div className="relative">
            <div className="w-20 h-20 rounded-full mx-auto mb-6" style={{ 
              background: 'conic-gradient(from 0deg, #FFC400, #FF3F7F, #8C00FF, #450693, #FFC400)',
              animation: 'spin 1.5s linear infinite'
            }}>
              <div className="absolute inset-2 rounded-full" style={{ background: 'white' }}></div>
            </div>
          </div>
          <Mail className="w-14 h-14 mx-auto mb-4 animate-bounce" style={{ color: '#8C00FF' }} />
          <p className="text-xl font-black mb-2" style={{ color: '#450693' }}>CONNECTING...</p>
          <p className="text-sm font-semibold text-gray-600">Setting up your temporary mailbox</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #450693 0%, #8C00FF 30%, #FF3F7F 70%, #FFC400 100%)' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30 animate-float" style={{ background: 'radial-gradient(circle, #FF3F7F, transparent)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-30 animate-float" style={{ background: 'radial-gradient(circle, #FFC400, transparent)', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, #8C00FF, transparent)', animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative glass-modern shadow-2xl sticky top-0 z-50 border-b animate-slideInFromTop" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl shadow-2xl transform hover:rotate-12 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #8C00FF 0%, #FF3F7F 100%)', boxShadow: '0 10px 30px rgba(140, 0, 255, 0.4)' }}>
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Temp Mail</h1>
                <p className="text-xs text-white/70 hidden sm:block font-medium">Lightning Fast • Secure • Anonymous</p>
              </div>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(255, 196, 0, 0.2), rgba(255, 196, 0, 0.1))', border: '2px solid #FFC400' }}>
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#FFC400', boxShadow: '0 0 10px #FFC400' }}></div>
                <span className="text-sm font-bold text-white">ONLINE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(255, 63, 127, 0.2), rgba(255, 63, 127, 0.1))', border: '2px solid #FF3F7F' }}>
                <AlertCircle className="w-4 h-4" style={{ color: '#FF3F7F' }} />
                <span className="text-sm font-bold text-white">OFFLINE</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Email Address Card */}
        <div className="relative rounded-3xl shadow-2xl p-8 overflow-hidden animate-scaleIn" style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)' }}>
          <div className="absolute inset-0 opacity-5">
            <div style={{ background: 'linear-gradient(45deg, #8C00FF 25%, transparent 25%, transparent 75%, #FF3F7F 75%), linear-gradient(45deg, #FF3F7F 25%, transparent 25%, transparent 75%, #FFC400 75%)', backgroundSize: '30px 30px', backgroundPosition: '0 0, 15px 15px' }}></div>
          </div>
          <div className="relative space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg, #8C00FF, #FF3F7F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Your Temporary Email Address
              </h2>
              <p className="text-gray-600 font-medium">Lightning-fast disposable email for secure registrations</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={emailAddress}
                  readOnly
                  className="w-full px-6 py-4 text-lg sm:text-xl font-mono font-black rounded-2xl border-3 focus:outline-none text-center lg:text-left shadow-inner transition-all duration-300"
                  style={{ 
                    background: 'linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%)', 
                    color: '#450693', 
                    border: '3px solid transparent',
                    backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #8C00FF, #FF3F7F)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={handleCopyEmail}
                  className="group px-6 py-4 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    background: copied ? 'linear-gradient(135deg, #FFC400 0%, #FF3F7F 100%)' : 'linear-gradient(135deg, #8C00FF 0%, #450693 100%)',
                    minWidth: '140px'
                  }}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleRefreshInbox}
                  disabled={refreshing}
                  className="group px-6 py-4 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #FF3F7F 0%, #FFC400 100%)',
                    minWidth: '140px'
                  }}
                  title={refreshing ? 'Loading...' : 'Refresh inbox'}
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  <span>{refreshing ? 'Loading...' : 'Refresh'}</span>
                </button>
                <button
                  onClick={handleCreateNew}
                  className="group px-6 py-4 rounded-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFC400 0%, #FF3F7F 100%)',
                    minWidth: '140px'
                  }}
                >
                  <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>New Email</span>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 px-5 py-3 rounded-full shadow-inner" style={{ background: 'linear-gradient(135deg, rgba(140, 0, 255, 0.1), rgba(255, 63, 127, 0.05))', border: '2px solid #8C00FF' }}>
                <Clock className="w-5 h-5" style={{ color: '#8C00FF' }} />
                <span className="font-bold" style={{ color: '#450693' }}>Auto-delete in 15 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Email List and Detail */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Inbox List */}
          <div className="xl:col-span-1 rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.98)', animation: 'slideInFromLeft 0.7s ease-out' }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #450693 0%, #8C00FF 100%)' }}>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Inbox className="w-6 h-6" />
                INBOX
              </h2>
              <span className="px-4 py-1.5 rounded-full text-sm font-black" style={{ background: 'linear-gradient(135deg, #FFC400, #FF3F7F)', color: '#450693' }}>
                {emails.length}
              </span>
            </div>
            <div className="divide-y divide-gray-100" style={{ maxHeight: '650px', minHeight: '450px', overflowY: 'auto', overflowX: 'hidden' }}>
              {emails.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-bounce" style={{ background: 'linear-gradient(135deg, rgba(140, 0, 255, 0.1), rgba(255, 63, 127, 0.05))' }}>
                    <Mail className="w-10 h-10" style={{ color: '#8C00FF' }} />
                  </div>
                  <p className="text-lg font-black mb-2" style={{ color: '#450693' }}>No Emails Yet</p>
                  <p className="text-sm font-medium text-gray-600">Waiting for incoming emails...</p>
                </div>
              ) : (
                emails.map((email, index) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`relative p-5 cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 group ${
                      selectedEmail?.id === email.id ? 'shadow-lg' : ''
                    }`}
                    style={{ 
                      borderLeftColor: selectedEmail?.id === email.id ? '#8C00FF' : 'transparent',
                      background: selectedEmail?.id === email.id ? 'linear-gradient(90deg, rgba(140, 0, 255, 0.05), transparent)' : 'transparent',
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="font-black text-sm truncate flex-1 pr-2" style={{ color: '#450693' }}>
                        {email.from}
                      </p>
                      <span className="text-xs font-bold shrink-0" style={{ color: '#FF3F7F' }}>
                        {formatDate(email.receivedAt)}
                      </span>
                    </div>
                    <p className="text-base font-black truncate mb-2" style={{ color: '#450693' }}>
                      {email.subject || '(No Subject)'}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {email.bodyText || 'Empty message'}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-bold" style={{ background: 'linear-gradient(135deg, rgba(255, 196, 0, 0.15), rgba(255, 63, 127, 0.1))' }}>
                      <Clock className="w-4 h-4" style={{ color: '#FFC400' }} />
                      <span style={{ color: '#FF3F7F' }}>{getExpiryTime(email.expiresAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email Detail */}
          <div className="xl:col-span-2 rounded-3xl shadow-2xl overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.98)', animation: 'slideInFromRight 0.7s ease-out' }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #8C00FF 0%, #FF3F7F 100%)' }}>
              <Mail className="w-6 h-6 text-white" />
              <h2 className="text-lg font-extrabold text-white">
                {selectedEmail ? 'EMAIL DETAILS' : 'SELECT AN EMAIL'}
              </h2>
            </div>
            <div className="p-6" style={{ maxHeight: '650px', overflowY: 'auto' }}>
              {selectedEmail ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(140, 0, 255, 0.05), rgba(255, 196, 0, 0.05))', border: '2px solid #8C00FF' }}>
                      <label className="text-xs font-black uppercase mb-2 block" style={{ color: '#8C00FF' }}>
                        FROM
                      </label>
                      <p className="text-sm font-bold break-all" style={{ color: '#450693' }}>{selectedEmail.from}</p>
                    </div>
                    
                    <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 63, 127, 0.05), rgba(255, 196, 0, 0.05))', border: '2px solid #FF3F7F' }}>
                      <label className="text-xs font-black uppercase mb-2 block" style={{ color: '#FF3F7F' }}>
                        TO
                      </label>
                      <p className="text-sm font-bold break-all" style={{ color: '#450693' }}>{selectedEmail.to}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFC400 0%, #FF3F7F 100%)', opacity: 0.9 }}>
                    <label className="text-xs font-black uppercase text-white mb-2 block">
                      SUBJECT
                    </label>
                    <p className="text-lg font-black text-white break-words">
                      {selectedEmail.subject || '(No Subject)'}
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255, 196, 0, 0.1), rgba(140, 0, 255, 0.05))', border: '2px solid #FFC400' }}>
                    <label className="text-xs font-black uppercase mb-2 block" style={{ color: '#FFC400' }}>
                      RECEIVED
                    </label>
                    <p className="text-sm font-bold" style={{ color: '#450693' }}>
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
                  
                  <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: '3px solid', borderImage: 'linear-gradient(90deg, #8C00FF, #FF3F7F, #FFC400) 1' }}>
                    <div className="px-5 py-4" style={{ background: 'linear-gradient(90deg, #450693, #8C00FF)' }}>
                      <label className="text-base font-black text-white">
                        EMAIL CONTENT
                      </label>
                    </div>
                    <div className="p-6" style={{ maxHeight: '450px', overflowY: 'auto', background: '#ffffff' }}>
                      {selectedEmail.bodyHtml ? (
                        <div
                          className="email-content-wrapper prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedEmail.bodyHtml }}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" style={{ color: '#450693' }}>
                          {selectedEmail.bodyText || '(Empty message)'}
                        </pre>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(255, 63, 127, 0.2), rgba(255, 196, 0, 0.1))', border: '2px solid #FF3F7F' }}>
                    <Trash2 className="w-5 h-5" style={{ color: '#FF3F7F' }} />
                    <span className="font-black" style={{ color: '#450693' }}>
                      Auto-deletes {getExpiryTime(selectedEmail.expiresAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(140, 0, 255, 0.1), rgba(255, 63, 127, 0.05))' }}>
                    <Inbox className="w-12 h-12" style={{ color: '#8C00FF' }} />
                  </div>
                  <p className="text-xl font-black mb-3" style={{ color: '#450693' }}>No Email Selected</p>
                  <p className="text-base font-medium text-gray-600">Click on an email from the inbox to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="relative rounded-3xl shadow-2xl p-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #450693 0%, #8C00FF 50%, #FF3F7F 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.1) 35px, rgba(255, 255, 255, 0.1) 70px)' }} className="h-full"></div>
          </div>
          <div className="relative">
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <AlertCircle className="w-7 h-7" />
              HOW TO USE THIS SERVICE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
                <span className="flex items-center justify-center w-10 h-10 rounded-full font-black shrink-0" style={{ background: '#FFC400', color: '#450693' }}>1</span>
                <span className="text-white font-semibold">Copy the temporary email address</span>
              </div>
              <div className="flex gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
                <span className="flex items-center justify-center w-10 h-10 rounded-full font-black shrink-0" style={{ background: '#FF3F7F', color: 'white' }}>2</span>
                <span className="text-white font-semibold">Emails appear instantly in real-time</span>
              </div>
              <div className="flex gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
                <span className="flex items-center justify-center w-10 h-10 rounded-full font-black shrink-0" style={{ background: '#8C00FF', color: 'white' }}>3</span>
                <span className="text-white font-semibold">Auto-delete after 15 minutes</span>
              </div>
              <div className="flex gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}>
                <span className="flex items-center justify-center w-10 h-10 rounded-full font-black shrink-0" style={{ background: 'linear-gradient(135deg, #FFC400, #FF3F7F)', color: 'white' }}>4</span>
                <span className="text-white font-semibold">Generate new address anytime</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-12 py-8 overflow-hidden" style={{ background: 'linear-gradient(90deg, #450693 0%, #8C00FF 100%)' }}>
        <div className="absolute inset-0 opacity-20">
          <div style={{ background: 'radial-gradient(circle at 20% 50%, #FF3F7F 0%, transparent 50%), radial-gradient(circle at 80% 50%, #FFC400 0%, transparent 50%)' }} className="h-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-lg font-black text-white mb-2">
            @2026 created by Fadhli
          </p>
          <div className="flex items-center justify-center gap-3 text-sm font-bold text-white/80">
            <span>🚀 Lightning Fast</span>
            <span className="text-yellow-400">•</span>
            <span>🔒 100% Secure</span>
            <span className="text-yellow-400">•</span>
            <span>👻 Anonymous</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
