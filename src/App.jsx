import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import InboxList from './components/InboxList';
import './App.css';

const Background = lazy(() => import('./components/Background'));
const HeroSection = lazy(() => import('./components/HeroSection'));
const EmailDetail = lazy(() => import('./components/EmailDetail'));

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const EMAIL_DOMAIN = import.meta.env.VITE_EMAIL_DOMAIN || 'domain-saya.my.id';

function App() {
  // States
  const [emailAddress, setEmailAddress] = useState('');
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Refs
  const socketRef = useRef(null);

  // Generate random email address
  const generateEmailAddress = useCallback(() => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${randomString}@${EMAIL_DOMAIN}`;
  }, []);

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
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 5000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setLoading(false);
      socket.emit('join-room', newEmail);
      setTimeout(() => handleInitialFetch(newEmail), 500);
    });

    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('reconnect', () => {
      setIsConnected(true);
      socket.emit('join-room', newEmail);
      setTimeout(() => handleInitialFetch(newEmail), 500);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
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

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInitialFetch = useCallback(async (email) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/emails/${email}`);
      const data = await response.json();
      if (data.success) setEmails(data.emails || []);
    } catch {
      // silent
    }
  }, []);

  const handleCreateNew = useCallback(() => {
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
  }, [emailAddress, generateEmailAddress, handleInitialFetch]);

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
      <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
        <Background />
      </Suspense>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isConnected={isConnected} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Top Section */}
          <div className={`${selectedEmail ? 'hidden lg:block' : 'block'}`}>
            <Suspense fallback={<div className="h-40 bg-white/5 rounded-2xl animate-pulse" />}>
              <HeroSection 
                emailAddress={emailAddress} 
                loading={loading}
                onCreateNew={handleCreateNew}
              />
            </Suspense>
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
              <Suspense fallback={<div className="h-full bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
              </div>}>
                <EmailDetail 
                  email={selectedEmail} 
                  onClose={() => setSelectedEmail(null)} 
                />
              </Suspense>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
