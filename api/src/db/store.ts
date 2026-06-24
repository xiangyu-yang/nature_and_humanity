// 简单的内存数据存储（开发演示用），生产可替换为 SQLite
type Store = {
  users: Map<string, any>;
  baziRecords: Map<string, any>;
  constitutionResults: Map<string, any>;
  familyMembers: Map<string, any>;
  fortuneCache: Map<string, any>;
  favorites: Map<string, any>;
};

const globalAny = globalThis as unknown as { __nah_store?: Store };

function createStore(): Store {
  return {
    users: new Map(),
    baziRecords: new Map(),
    constitutionResults: new Map(),
    familyMembers: new Map(),
    fortuneCache: new Map(),
    favorites: new Map(),
  };
}

export function initStore() {
  if (!globalAny.__nah_store) {
    globalAny.__nah_store = createStore();
  }
  return globalAny.__nah_store;
}

export function getStore(): Store {
  if (!globalAny.__nah_store) {
    globalAny.__nah_store = createStore();
  }
  return globalAny.__nah_store;
}
