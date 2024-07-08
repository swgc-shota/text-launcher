export const chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn(),
    },
    onStartup: {
      addListener: jest.fn(),
    },
  },
  tabs: {
    onUpdated: {
      addListener: jest.fn(),
    },
    query: jest.fn((_queryInfo, callback) => callback([])),
    reload: jest.fn(),
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
  },
  windows: {
    getAll: jest.fn((_getInfo, callback) => callback([])),
  },
  storage: {
    local: {
      get: jest.fn((_keys, callback) => callback({})),
      set: jest.fn((_items, callback) => callback()),
    },
  },
  messaging: {
    addListener: jest.fn(),
  },
};
