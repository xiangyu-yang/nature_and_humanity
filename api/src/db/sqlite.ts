import fs from 'fs';
import path from 'path';

const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname));
const DB_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'nah.json');

interface StoreData {
  users: Record<string, any>;
  baziRecords: Record<string, any>;
  constitutionResults: Record<string, any>;
  familyMembers: Record<string, any>;
  favorites: Record<string, any>;
  llmConfigs: Record<string, any>;
  chatSessions: Record<string, any>;
  knowledgeBases: Record<string, any>;
}

let storeData: StoreData = {
  users: {},
  baziRecords: {},
  constitutionResults: {},
  familyMembers: {},
  favorites: {},
  llmConfigs: {},
  chatSessions: {},
  knowledgeBases: {},
};

const tableNameMap: Record<string, keyof StoreData> = {
  'user': 'users',
  'users': 'users',
  'bazi_record': 'baziRecords',
  'bazi_records': 'baziRecords',
  'constitution_result': 'constitutionResults',
  'constitution_results': 'constitutionResults',
  'family_member': 'familyMembers',
  'family_members': 'familyMembers',
  'favorite': 'favorites',
  'favorites': 'favorites',
  'llm_config': 'llmConfigs',
  'llm_configs': 'llmConfigs',
  'chat_session': 'chatSessions',
  'chat_sessions': 'chatSessions',
  'knowledge_base': 'knowledgeBases',
  'knowledge_bases': 'knowledgeBases',
};

export function initDatabase() {
  console.log('[DB] Initializing database at:', DB_DIR);
  
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log('[DB] Created data directory:', DB_DIR);
  }
  
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      storeData = {
        users: loaded.users || {},
        baziRecords: loaded.baziRecords || {},
        constitutionResults: loaded.constitutionResults || {},
        familyMembers: loaded.familyMembers || {},
        favorites: loaded.favorites || {},
        llmConfigs: loaded.llmConfigs || {},
        chatSessions: loaded.chatSessions || {},
        knowledgeBases: loaded.knowledgeBases || {},
      };
      console.log('[DB] Loaded existing database with', Object.keys(storeData.users).length, 'users');
    } catch (err) {
      console.error('[DB] Failed to load database:', err);
      storeData = {
        users: {},
        baziRecords: {},
        constitutionResults: {},
        familyMembers: {},
        favorites: {},
        llmConfigs: {},
        chatSessions: {},
      };
    }
  }
}

function saveDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(storeData, null, 2));
    console.log('[DB] Database saved successfully to:', DB_FILE);
  } catch (err) {
    console.error('[DB] Failed to save database:', err);
  }
}

function getStoreKey(tableName: string): keyof StoreData {
  return tableNameMap[tableName.toLowerCase()] || 'users';
}

export const db = {
  run: async (sql: string, params: any[] = []) => {
    const trimmedSql = sql.replace(/\s+/g, ' ').trim();
    
    const tableMatch = trimmedSql.match(/FROM\s+(\w+)|INTO\s+(\w+)|UPDATE\s+(\w+)/i);
    const table = tableMatch ? tableMatch[1] || tableMatch[2] || tableMatch[3] : null;
    
    if (!table) return { changes: 0 };
    
    const storeKey = getStoreKey(table);
    
    if (trimmedSql.toUpperCase().startsWith('INSERT')) {
      const match = trimmedSql.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
      if (match) {
        const [, fields, values] = match;
        const fieldList = fields.split(',').map((f: string) => f.trim());
        
        const record: Record<string, any> = {};
        fieldList.forEach((field: string, index: number) => {
          record[field] = params[index];
        });
        
        if (record.id) {
          storeData[storeKey] = storeData[storeKey] || {};
          storeData[storeKey][record.id] = record;
          saveDatabase();
          return { changes: 1 };
        }
      }
    } else if (trimmedSql.toUpperCase().startsWith('UPDATE')) {
      const whereIndex = trimmedSql.toUpperCase().indexOf(' WHERE ');
      if (whereIndex > -1) {
        const setPart = trimmedSql.substring(trimmedSql.indexOf('SET ') + 4, whereIndex).trim();
        const wherePart = trimmedSql.substring(whereIndex + 7).trim();
        
        const whereMatch = wherePart.match(/^(\w+)\s*=\s*\?/);
        if (whereMatch) {
          const whereField = whereMatch[1];
          const setPairs = setPart.split(',').map((p: string) => p.trim());
          const setData: Record<string, any> = {};
          let paramIndex = 0;
          
          for (const pair of setPairs) {
            const [field] = pair.split('=').map((s: string) => s.trim());
            setData[field] = params[paramIndex++];
          }
          
          const whereValue = params[paramIndex];
          
          const tableData = storeData[storeKey] || {};
          for (const key of Object.keys(tableData)) {
            if (tableData[key][whereField] === whereValue) {
              tableData[key] = { ...tableData[key], ...setData };
              saveDatabase();
              return { changes: 1 };
            }
          }
        }
      }
    } else if (trimmedSql.toUpperCase().startsWith('DELETE')) {
      const match = trimmedSql.match(/DELETE\s+FROM\s+\w+\s+WHERE\s+(\w+)\s*=\s*\?/i);
      if (match) {
        const [, whereField] = match;
        const whereValue = params[0];
        
        const tableData = storeData[storeKey] || {};
        for (const key of Object.keys(tableData)) {
          if (tableData[key][whereField] === whereValue) {
            delete tableData[key];
            saveDatabase();
            return { changes: 1 };
          }
        }
      }
    }
    
    return { changes: 0 };
  },
  
  get: async (sql: string, params: any[] = []) => {
    const trimmedSql = sql.replace(/\s+/g, ' ').trim();
    
    const match = trimmedSql.match(/SELECT\s+\*\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*\?/i);
    if (match) {
      const [, table, whereField] = match;
      const whereValue = params[0];
      
      const storeKey = getStoreKey(table);
      const tableData = storeData[storeKey] || {};
      for (const key of Object.keys(tableData)) {
        if (tableData[key][whereField] === whereValue) {
          return tableData[key];
        }
      }
    }
    
    const limitMatch = trimmedSql.match(/SELECT\s+\*\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*\?.*LIMIT\s+1/i);
    if (limitMatch) {
      const [, table, whereField] = limitMatch;
      const whereValue = params[0];
      
      const storeKey = getStoreKey(table);
      const tableData = storeData[storeKey] || {};
      for (const key of Object.keys(tableData)) {
        if (tableData[key][whereField] === whereValue) {
          return tableData[key];
        }
      }
    }
    
    return undefined;
  },
  
  all: async (sql: string, params: any[] = []) => {
    const trimmedSql = sql.replace(/\s+/g, ' ').trim();
    
    const match = trimmedSql.match(/SELECT\s+\*\s+FROM\s+(\w+)(?:\s+WHERE\s+(\w+)\s*=\s*\?)?/i);
    if (match) {
      const [, table, whereField] = match;
      const whereValue = params[0];
      
      const storeKey = getStoreKey(table);
      const tableData = storeData[storeKey] || {};
      const results: any[] = [];
      
      for (const key of Object.keys(tableData)) {
        const record = tableData[key];
        if (!whereField || record[whereField] === whereValue) {
          results.push(record);
        }
      }
      
      return results;
    }
    
    return [];
  },
  
  exec: async (sql: string) => {
    // For CREATE TABLE statements, no action needed with JSON storage
  },
};

export { storeData };
