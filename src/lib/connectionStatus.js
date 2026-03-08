export const CONNECTION_STATUS = Object.freeze({
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  OFFLINE: 'offline',
});

export const OFFLINE_TRANSITION_DELAY_MS = 15000;
export const FALLBACK_POLL_INTERVAL_MS = 10000;
export const HEARTBEAT_INTERVAL_MS = 25000;
export const HEARTBEAT_STALE_AFTER_MS = 45000;

export function getNextDisconnectStatus(currentStatus = CONNECTION_STATUS.CONNECTED) {
  return currentStatus === CONNECTION_STATUS.OFFLINE
    ? CONNECTION_STATUS.OFFLINE
    : CONNECTION_STATUS.RECONNECTING;
}

export function getOfflineTransitionDelay() {
  return OFFLINE_TRANSITION_DELAY_MS;
}

export function shouldUseFallbackPolling(status) {
  return status === CONNECTION_STATUS.RECONNECTING || status === CONNECTION_STATUS.OFFLINE;
}

export function isHeartbeatStale(lastPongAt, now = Date.now()) {
  if (!lastPongAt) {
    return false;
  }

  return now - lastPongAt > HEARTBEAT_STALE_AFTER_MS;
}
