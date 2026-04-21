import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { io } from 'socket.io-client';
import Background from './components/Background';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import InboxList from './components/InboxList';
import './App.css';
import { buildMailboxUrl, getInitialMailboxEmail } from './lib/mailboxLink';
import {
  CONNECTION_STATUS,
  FALLBACK_POLL_INTERVAL_MS,
  HEARTBEAT_INTERVAL_MS,
  getNextDisconnectStatus,
  getOfflineTransitionDelay,
  isHeartbeatStale,
  shouldUseFallbackPolling,
} from './lib/connectionStatus';

const EmailDetail = lazy(() => import('./components/EmailDetail'));

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const EMAIL_DOMAIN = import.meta.env.VITE_EMAIL_DOMAIN || 'domain-saya.my.id';

function generateEmailAddress() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < 8; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomString + '@' + EMAIL_DOMAIN;
}

function getInitialEmailAddress() {
  try {
    const savedEmail = localStorage.getItem('tempMailAddress');
    const generatedEmail = generateEmailAddress();

    const initialEmail = getInitialMailboxEmail({
      pathname: window.location.pathname,
      search: window.location.search,
      savedEmail,
      generatedEmail,
      domain: EMAIL_DOMAIN,
    });

    localStorage.setItem('tempMailAddress', initialEmail);
    return initialEmail;
  } catch {
    return generateEmailAddress();
  }
}

function App() {
  const [emailAddress, setEmailAddress] = useState(getInitialEmailAddress);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.RECONNECTING);
  const [refreshing, setRefreshing] = useState(false);

  const socketRef = useRef(null);
  const currentEmailRef = useRef(emailAddress);
  const connectionStatusRef = useRef(CONNECTION_STATUS.RECONNECTING);
  const offlineTimerRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const fallbackPollIntervalRef = useRef(null);
  const lastPongAtRef = useRef(0);
  const mailboxLink = buildMailboxUrl(window.location.origin, emailAddress);

  const handleInitialFetch = useCallback(async (email) => {
    try {
      const response = await fetch(BACKEND_URL + '/api/emails/' + encodeURIComponent(email));
      const data = await response.json();
      if (data.success) setEmails(data.emails || []);
    } catch {
      // silently ignore fetch errors
    }
  }, []);

  useEffect(() => {
    currentEmailRef.current = emailAddress;
    window.history.replaceState(null, '', '/' + emailAddress);
  }, [emailAddress]);

  useEffect(() => {
    connectionStatusRef.current = connectionStatus;
  }, [connectionStatus]);

  useEffect(() => {
    const clearOfflineTimer = () => {
      if (offlineTimerRef.current) {
        window.clearTimeout(offlineTimerRef.current);
        offlineTimerRef.current = null;
      }
    };

    const scheduleOfflineTransition = () => {
      if (offlineTimerRef.current || connectionStatusRef.current === CONNECTION_STATUS.OFFLINE) {
        return;
      }
      offlineTimerRef.current = window.setTimeout(() => {
        offlineTimerRef.current = null;
        setConnectionStatus(CONNECTION_STATUS.OFFLINE);
      }, getOfflineTransitionDelay());
    };

    const enterReconnectState = () => {
      setConnectionStatus((currentStatus) => getNextDisconnectStatus(currentStatus));
      scheduleOfflineTransition();
    };

    const markConnected = () => {
      lastPongAtRef.current = Date.now();
      clearOfflineTimer();
      setConnectionStatus(CONNECTION_STATUS.CONNECTED);
    };

    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      randomizationFactor: 0.5,
      timeout: 20000,
    });

    socketRef.current = socket;

    const handleSocketConnect = () => {
      const activeEmail = currentEmailRef.current;
      markConnected();
      socket.emit('join-room', activeEmail);
      handleInitialFetch(activeEmail);
    };

    const handleSocketDisconnect = (reason) => {
      console.warn('Socket disconnected:', reason);
      enterReconnectState();
    };

    const handleSocketConnectError = (err) => {
      console.error('Socket connection error:', err);
      enterReconnectState();
    };

    const handleServerPong = () => {
      markConnected();
    };

    socket.on('connect', handleSocketConnect);
    socket.on('disconnect', handleSocketDisconnect);
    socket.on('connect_error', handleSocketConnectError);
    socket.on('server-pong', handleServerPong);

    const handleNewEmail = (email) => {
      setEmails((prev) => {
        if (prev.some((e) => e.id === email.id)) return prev;
        return [email, ...prev];
      });

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Email', { body: email.subject });
      }
    };

    const handleEmailHistory = (history) => {
      setEmails(history);
    };

    socket.on('email-history', handleEmailHistory);
    socket.on('new-email', handleNewEmail);

    heartbeatIntervalRef.current = window.setInterval(() => {
      if (!socket.connected) {
        enterReconnectState();
        return;
      }
      if (isHeartbeatStale(lastPongAtRef.current)) {
        enterReconnectState();
      }
      socket.emit('client-ping', { sentAt: Date.now() });
    }, HEARTBEAT_INTERVAL_MS);

    handleInitialFetch(currentEmailRef.current);

    return () => {
      clearOfflineTimer();
      if (heartbeatIntervalRef.current) {
        window.clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      if (fallbackPollIntervalRef.current) {
        window.clearInterval(fallbackPollIntervalRef.current);
        fallbackPollIntervalRef.current = null;
      }
      socket.off('connect', handleSocketConnect);
      socket.off('disconnect', handleSocketDisconnect);
      socket.off('connect_error', handleSocketConnectError);
      socket.off('server-pong', handleServerPong);
      socket.off('email-history', handleEmailHistory);
      socket.off('new-email', handleNewEmail);
      socket.disconnect();
    };
  }, [handleInitialFetch]);

  useEffect(() => {
    if (fallbackPollIntervalRef.current) {
      window.clearInterval(fallbackPollIntervalRef.current);
      fallbackPollIntervalRef.current = null;
    }

    if (!shouldUseFallbackPolling(connectionStatus)) {
      return undefined;
    }

    fallbackPollIntervalRef.current = window.setInterval(() => {
      handleInitialFetch(currentEmailRef.current);
    }, FALLBACK_POLL_INTERVAL_MS);

    return () => {
      if (fallbackPollIntervalRef.current) {
        window.clearInterval(fallbackPollIntervalRef.current);
        fallbackPollIntervalRef.current = null;
      }
    };
  }, [connectionStatus, handleInitialFetch]);

  const handleCreateNew = useCallback(() => {
    const oldEmail = currentEmailRef.current;
    const newEmail = generateEmailAddress();

    socketRef.current?.emit('leave-room', oldEmail);

    setEmailAddress(newEmail);
    currentEmailRef.current = newEmail;
    setEmails([]);
    setSelectedEmail(null);
    localStorage.setItem('tempMailAddress', newEmail);

    if (socketRef.current?.connected) {
      socketRef.current.emit('join-room', newEmail);
      handleInitialFetch(newEmail);
    }
  }, [handleInitialFetch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleInitialFetch(currentEmailRef.current);
    setRefreshing(false);
  }, [handleInitialFetch]);

  return (
    <div className="relative min-h-screen text-[#1c1917]">
      <Background />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header connectionStatus={connectionStatus} />

        <main className="pt-16 sm:pt-[4.5rem] mx-auto flex w-full max-w-[85rem] flex-1 flex-col gap-4 px-3 py-4 sm:px-5 sm:py-6 lg:gap-5 lg:px-8 lg:py-8">
          {/* Hero section - hidden when email selected on mobile */}
          <div className={selectedEmail ? 'hidden lg:block' : 'block'}>
            <HeroSection
              emailAddress={emailAddress}
              mailboxLink={mailboxLink}
              onRefresh={handleRefresh}
              onCreateNew={handleCreateNew}
              refreshing={refreshing}
            />
          </div>

          {/* Main content grid */}
          <div className="grid flex-1 grid-cols-1 gap-4 lg:h-[calc(100vh-18rem)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-5">
            {/* Inbox List */}
            <div className={selectedEmail ? 'hidden lg:block h-full' : 'h-full'}>
              <InboxList
                emails={emails}
                selectedEmail={selectedEmail}
                onSelectEmail={setSelectedEmail}
              />
            </div>

            {/* Email Detail */}
            <div className="h-full">
              <Suspense
                fallback={(
                  <div className="card-surface flex h-full min-h-[24rem] items-center justify-center rounded-2xl sm:rounded-3xl">
                    <div className="h-8 w-8 rounded-full border-2 border-stone-200 border-t-teal-500 animate-spin" />
                  </div>
                )}
              >
                <EmailDetail email={selectedEmail} onClose={() => setSelectedEmail(null)} />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
