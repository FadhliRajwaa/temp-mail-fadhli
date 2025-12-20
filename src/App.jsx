import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Background from './components/Background';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import InboxList from './components/InboxList';
import EmailDetail from './components/EmailDetail';
import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const EMAIL_DOMAIN = import.meta.env.VITE_EMAIL_DOMAIN || 'domain-saya.my.id';
const AUTO_REFRESH_INTERVAL = 30000;

function App() {
  // States
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Refs
  const socketRef = useRef(null);
  const autoRefreshIntervalRef = useRef(null);

  // Generate random email address
  const generateEmailAddress = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) { // Shorter is trendier
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${randomString}@${EMAIL_DOMAIN}`;
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('tempMailAddress');
    const newEmail = savedEmail || generateEmailAddress();
    
    setEmailAddress(newEmail);
    if (!savedEmail) {
      localStorage.setItem('tempMailAddress', newEmail);
    }

    // Initialize Socket
    socketRef.current = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setLoading(false);
      socket.emit('join-room', newEmail);
      handleInitialFetch(newEmail);
    });

    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('reconnect', () => {
      setIsConnected(true);
      socket.emit('join-room', newEmail);
      handleInitialFetch(newEmail);
    });

    // Handle incoming emails
    const handleNewEmail = (email) => {
      setEmails((prev) => {
        if (prev.some(e => e.id === email.id)) return prev;
        return [email, ...prev];
      });
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Email', { body: email.subject });
      }
    };

    socket.on('email-history', (history) => setEmails(history));
    socket.on('new-email', handleNewEmail);
    socket.on('newEmail', (email) => {
      if (email.to?.toLowerCase() === newEmail.toLowerCase()) handleNewEmail(email);
    });

    // Auto Refresh
    autoRefreshIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) handleInitialFetch(newEmail);
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      socket.disconnect();
      if (autoRefreshIntervalRef.current) clearInterval(autoRefreshIntervalRef.current);
    };
  }, []);

  const handleInitialFetch = async (email) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/emails/${email}`);
      const data = await response.json();
      if (data.success) setEmails(data.emails || []);
    } catch {
      // silent
    }
  };

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await handleInitialFetch(emailAddress);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleCreateNew = () => {
    const oldEmail = emailAddress;
    const newEmail = generateEmailAddress();
    
    socketRef.current?.emit('leave-room', oldEmail);
    
    setEmailAddress(newEmail);
    setEmails([]);
    setSelectedEmail(null);
    localStorage.setItem('tempMailAddress', newEmail);
    
    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', newEmail);
      handleInitialFetch(newEmail);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-violet-600/30 border-t-violet-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-violet-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans text-slate-200 selection:bg-violet-500/30 selection:text-violet-200">
      <Background />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isConnected={isConnected} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Top Section */}
          <div className={`${selectedEmail ? 'hidden lg:block' : 'block'}`}>
            <HeroSection 
              emailAddress={emailAddress} 
              loading={loading}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onCreateNew={handleCreateNew}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-380px)] min-h-[500px]">
            <div className="lg:col-span-4 h-full">
              <InboxList 
                emails={emails} 
                selectedEmail={selectedEmail} 
                onSelectEmail={setSelectedEmail}
                loading={loading}
              />
            </div>
            
            <div className="lg:col-span-8 h-full">
              <EmailDetail 
                email={selectedEmail} 
                onClose={() => setSelectedEmail(null)} 
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
