import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONNECTION_STATUS,
  getNextDisconnectStatus,
  getOfflineTransitionDelay,
  shouldUseFallbackPolling,
  isHeartbeatStale,
} from './connectionStatus.js';

test('temporary disconnect enters reconnecting first', () => {
  assert.equal(
    getNextDisconnectStatus(CONNECTION_STATUS.CONNECTED),
    CONNECTION_STATUS.RECONNECTING
  );
});

test('offline status stays offline until reconnect succeeds', () => {
  assert.equal(
    getNextDisconnectStatus(CONNECTION_STATUS.OFFLINE),
    CONNECTION_STATUS.OFFLINE
  );
});

test('offline transition delay is 15000ms', () => {
  assert.equal(getOfflineTransitionDelay(), 15000);
});

test('fallback polling active only outside connected state', () => {
  assert.equal(shouldUseFallbackPolling(CONNECTION_STATUS.CONNECTED), false);
  assert.equal(shouldUseFallbackPolling(CONNECTION_STATUS.RECONNECTING), true);
  assert.equal(shouldUseFallbackPolling(CONNECTION_STATUS.OFFLINE), true);
});

test('heartbeat stale only after threshold', () => {
  const now = 100000;

  assert.equal(isHeartbeatStale(0, now), false);
  assert.equal(isHeartbeatStale(now - 44000, now), false);
  assert.equal(isHeartbeatStale(now - 46000, now), true);
});
