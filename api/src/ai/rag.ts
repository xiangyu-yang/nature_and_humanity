import fs from 'fs';
import path from 'path';
import { KnowledgeBaseDAO } from '../db/dao';
import { nanoid } from 'nanoid';

const VECTOR_STORE_PATH = path.join(process.cwd(), 'data', 'vector_store.json');

export type ChunkStrategy = 'fixed' | 'sentence' | 'paragraph';

export interface ChunkConfig {
  strategy: ChunkStrategy;
  chunkSize: number;
  chunkOverlap: number;
}

export interface VectorStoreItem {
  id: string;
  documentId: string;
  chunk: string;
  embedding: number[];
  tokenCount: number;
}

export interface KnowledgeDocument {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  content: string;
  createdAt: string;
  chunkCount: number;
  chunkConfig?: ChunkConfig;
  previewUrl?: string;
}

let vectorStore: VectorStoreItem[] = [];

function loadVectorStore(): void {
  try {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      const data = fs.readFileSync(VECTOR_STORE_PATH, 'utf-8');
      vectorStore = JSON.parse(data);
    }
  } catch (e) {
    console.warn('[RAG] Failed to load vector store:', e);
    vectorStore = [];
  }
}

function saveVectorStore(): void {
  try {
    const dir = path.dirname(VECTOR_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(VECTOR_STORE_PATH, JSON.stringify(vectorStore, null, 2));
  } catch (e) {
    console.warn('[RAG] Failed to save vector store:', e);
  }
}

loadVectorStore();

function tokenCount(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    if (char < 128) {
      count += 0.5;
    } else {
      count += 1;
    }
  }
  return Math.round(count);
}

function charCount(text: string): number {
  return text.length;
}

export function splitTextByFixed(content: string, chunkSize: number, chunkOverlap: number): string[] {
  const chunks: string[] = [];
  const step = chunkSize - chunkOverlap;
  
  for (let i = 0; i < content.length; i += step) {
    const chunk = content.slice(i, i + chunkSize);
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

export function splitTextBySentence(content: string, chunkSize: number, chunkOverlap: number): string[] {
  const sentences = content.split(/([。！？；\n]+)/).filter(s => s.trim());
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentChars = 0;
  
  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i];
    const separator = sentences[i + 1] || '。';
    const sentenceWithSep = sentence + separator;
    const sentenceChars = charCount(sentenceWithSep);
    
    if (currentChars + sentenceChars > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.join(''));
      
      if (chunkOverlap > 0 && currentChunk.length > 0) {
        const overlapText = currentChunk.slice(-1).join('');
        currentChunk = [overlapText];
        currentChars = charCount(overlapText);
      } else {
        currentChunk = [];
        currentChars = 0;
      }
    }
    
    currentChunk.push(sentenceWithSep);
    currentChars += sentenceChars;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(''));
  }
  
  return chunks;
}

export function splitTextByParagraph(content: string, chunkSize: number, chunkOverlap: number): string[] {
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentChars = 0;
  
  for (const paragraph of paragraphs) {
    const paragraphChars = charCount(paragraph);
    
    if (currentChars + paragraphChars > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n\n'));
      
      if (chunkOverlap > 0 && currentChunk.length > 1) {
        const overlapText = currentChunk.slice(-1).join('\n\n');
        currentChunk = [overlapText];
        currentChars = charCount(overlapText);
      } else {
        currentChunk = [];
        currentChars = 0;
      }
    }
    
    currentChunk.push(paragraph);
    currentChars += paragraphChars;
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n\n'));
  }
  
  return chunks;
}

export function splitText(content: string, config: ChunkConfig): string[] {
  const { strategy, chunkSize, chunkOverlap } = config;
  
  switch (strategy) {
    case 'sentence':
      return splitTextBySentence(content, chunkSize, chunkOverlap);
    case 'paragraph':
      return splitTextByParagraph(content, chunkSize, chunkOverlap);
    case 'fixed':
    default:
      return splitTextByFixed(content, chunkSize, chunkOverlap);
  }
}

export function createEmbedding(text: string): number[] {
  const embedding: number[] = new Array(384).fill(0);
  
  for (let i = 0; i < text.length && i < 384; i++) {
    const char = text.charCodeAt(i);
    embedding[i % 384] += char / 65535;
  }
  
  const norm = Math.sqrt(embedding.reduce((a, b) => a + b * b, 0));
  if (norm > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }
  }
  
  return embedding;
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length && i < vec2.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

async function parsePDF(filePath: string): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return cleanText(pdfData.text || '');
  } catch (e) {
    console.warn('[RAG] PDF parse error:', e);
    return extractTextFromPDFFallback(filePath);
  }
}

function extractTextFromPDFFallback(filePath: string): string {
  try {
    const content = fs.readFileSync(filePath);
    let text = '';
    let i = 0;
    
    while (i < content.length - 1) {
      if (content[i] === 0x0A && content[i + 1] === 0x0A) {
        text += '\n\n';
        i += 2;
      } else if (content[i] === 0x0A) {
        text += '\n';
        i++;
      } else if (content[i] >= 0x20 && content[i] < 0x7F) {
        text += String.fromCharCode(content[i]);
        i++;
      } else if (content[i] >= 0xE0 && content[i + 1] >= 0x80 && content[i + 2] >= 0x80) {
        const char = ((content[i] & 0x0F) << 12) | ((content[i + 1] & 0x3F) << 6) | (content[i + 2] & 0x3F);
        text += String.fromCharCode(char);
        i += 3;
      } else if (content[i] >= 0xC0 && content[i + 1] >= 0x80) {
        const char = ((content[i] & 0x1F) << 6) | (content[i + 1] & 0x3F);
        text += String.fromCharCode(char);
        i += 2;
      } else {
        i++;
      }
    }
    
    return cleanText(text);
  } catch (e) {
    throw new Error(`PDF解析失败: ${(e as Error).message}`);
  }
}

async function parseWord(filePath: string): Promise<string> {
  try {
    const AdmZip = (await import('adm-zip')).default;
    const zip = new AdmZip(filePath);
    const xmlBuffer = zip.readFile('word/document.xml');
    
    if (!xmlBuffer) {
      throw new Error('无法读取Word文档内容');
    }
    
    let xmlContent = xmlBuffer.toString('utf-8');
    if (!xmlContent.includes('<?xml')) {
      xmlContent = xmlBuffer.toString('utf-16le');
    }
    
    let text = xmlContent;
    
    text = text.replace(/<w:br[^>]*\/?>/g, '\n');
    text = text.replace(/<w:p[^>]*>/g, '\n');
    text = text.replace(/<\/w:p>/g, '\n');
    text = text.replace(/<w:tr[^>]*>/g, '\n');
    text = text.replace(/<\/w:tr>/g, '\n');
    text = text.replace(/<w:tc[^>]*>/g, '\t');
    text = text.replace(/<\/w:tc>/g, '\t');
    text = text.replace(/<w:t>/g, '');
    text = text.replace(/<\/w:t>/g, '');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));
    
    return cleanText(text);
  } catch (e) {
    throw new Error(`Word解析失败: ${(e as Error).message}`);
  }
}

function cleanText(text: string): string {
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\r/g, '\n');
  text = text.replace(/\n{4,}/g, '\n\n');
  text = text.replace(/\n{3}/g, '\n\n');
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/[ \t]+\n/g, '\n');
  text = text.replace(/\n[ \t]+/g, '\n');
  text = text.replace(/[^\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u0020-\u007e\u00a0-\u00ff\n\r]/g, '');
  
  return text.trim();
}

export async function parseDocument(
  filePath: string, 
  fileName: string, 
  options: { extractImages?: boolean; extractTables?: boolean } = {}
): Promise<{ content: string; images?: string[]; tables?: string[][] }> {
  const ext = fileName.toLowerCase().split('.').pop();
  const result: { content: string; images?: string[]; tables?: string[][] } = { content: '' };
  
  try {
    switch (ext) {
      case 'pdf':
        result.content = await parsePDF(filePath);
        break;
        
      case 'doc':
      case 'docx':
        result.content = await parseWord(filePath);
        break;
        
      case 'txt':
        result.content = cleanText(fs.readFileSync(filePath, 'utf-8'));
        break;
        
      case 'md':
        result.content = cleanText(fs.readFileSync(filePath, 'utf-8'));
        break;
        
      default:
        throw new Error(`不支持的文件类型: ${ext}`);
    }
  } catch (e) {
    throw new Error(`解析文件失败: ${(e as Error).message}`);
  }
  
  return result;
}

export async function addDocument(
  userId: string, 
  filePath: string, 
  fileName: string, 
  chunkConfig: ChunkConfig = { strategy: 'paragraph', chunkSize: 500, chunkOverlap: 50 },
  kkfileviewUrl: string = 'http://localhost:8012'
): Promise<KnowledgeDocument> {
  const parseResult = await parseDocument(filePath, fileName);
  const content = parseResult.content;
  
  if (!content.trim()) {
    throw new Error('文件内容为空');
  }
  
  const chunks = splitText(content, chunkConfig);
  const documentId = nanoid();
  const ext = fileName.toLowerCase().split('.').pop();
  
  const fileTypeMap: Record<string, string> = {
    'pdf': 'pdf',
    'doc': 'word',
    'docx': 'word',
    'txt': 'text',
    'md': 'markdown'
  };
  
  const previewUrl = `${kkfileviewUrl}/onlinePreview?url=${encodeURIComponent('file://' + filePath)}`;
  
  const document: KnowledgeDocument = {
    id: documentId,
    userId,
    fileName,
    fileType: fileTypeMap[ext || ''] || 'unknown',
    content,
    createdAt: new Date().toISOString(),
    chunkCount: chunks.length,
    chunkConfig,
    previewUrl,
  };
  
  await KnowledgeBaseDAO.insert({
    id: documentId,
    userId,
    fileName,
    fileType: document.fileType,
    content,
    chunkCount: chunks.length,
    chunkConfig: JSON.stringify(chunkConfig),
    previewUrl,
  });
  
  for (const chunk of chunks) {
    const embedding = createEmbedding(chunk);
    const vectorItem: VectorStoreItem = {
      id: nanoid(),
      documentId,
      chunk,
      embedding,
      tokenCount: tokenCount(chunk),
    };
    vectorStore.push(vectorItem);
  }
  
  saveVectorStore();
  
  return document;
}

export async function retrieve(
  query: string, 
  userId?: string, 
  topK: number = 5, 
  threshold: number = 0.15
): Promise<{ chunk: string; documentId: string; similarity: number }[]> {
  const queryEmbedding = createEmbedding(query);
  
  let candidates = vectorStore;
  
  if (userId) {
    const userDocs = await KnowledgeBaseDAO.findByUserId(userId);
    const userDocIds = new Set(userDocs.map(d => d.id));
    candidates = vectorStore.filter(v => userDocIds.has(v.documentId));
  }
  
  const results = candidates
    .map(item => ({
      chunk: item.chunk,
      documentId: item.documentId,
      similarity: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .filter(item => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  return results;
}

export async function getDocuments(userId: string): Promise<KnowledgeDocument[]> {
  const docs = await KnowledgeBaseDAO.findByUserId(userId);
  return docs.map(doc => {
    let chunkConfig: ChunkConfig | undefined;
    if (doc.chunkConfig) {
      try {
        chunkConfig = JSON.parse(doc.chunkConfig);
      } catch {}
    }
    return {
      id: doc.id,
      userId: doc.userId,
      fileName: doc.fileName,
      fileType: doc.fileType,
      content: doc.content,
      createdAt: doc.createdAt,
      chunkCount: doc.chunkCount,
      chunkConfig,
      previewUrl: doc.previewUrl,
    };
  });
}

export async function deleteDocument(userId: string, documentId: string): Promise<boolean> {
  const success = await KnowledgeBaseDAO.delete(documentId);
  
  if (success) {
    vectorStore = vectorStore.filter(v => v.documentId !== documentId);
    saveVectorStore();
  }
  
  return success;
}

export async function clearAllDocuments(userId: string): Promise<void> {
  const docs = await KnowledgeBaseDAO.findByUserId(userId);
  const docIds = new Set(docs.map(d => d.id));
  
  await KnowledgeBaseDAO.deleteByUserId(userId);
  
  vectorStore = vectorStore.filter(v => !docIds.has(v.documentId));
  saveVectorStore();
}

export async function buildRAGContext(
  query: string, 
  userId?: string
): Promise<string> {
  const results = await retrieve(query, userId, 5, 0.15);
  
  if (results.length === 0) {
    return '';
  }
  
  let context = '## 知识库相关信息\n\n';
  
  for (let i = 0; i < results.length; i++) {
    const doc = await KnowledgeBaseDAO.findById(results[i].documentId);
    const sourceName = doc?.fileName || '未知文档';
    
    context += `### 参考资料 ${i + 1}（来源：${sourceName}）\n`;
    context += `${results[i].chunk}\n\n`;
  }
  
  return context;
}