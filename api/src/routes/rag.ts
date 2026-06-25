import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { addDocument, getDocuments, deleteDocument, clearAllDocuments, buildRAGContext, retrieve, splitText, type ChunkConfig } from '../ai/rag';
import { ensureKkFileViewAvailable, checkKkFileViewRunning, checkKkFileViewHealth } from '../ai/kkfileview';
import { KnowledgeBaseDAO } from '../db/dao';

export const ragRouter = Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function fixFilenameEncoding(filename: string): string {
  try {
    const fixed = Buffer.from(filename, 'latin1').toString('utf8');
    if (fixed.includes('\u0000')) {
      return filename;
    }
    return fixed;
  } catch {
    return filename;
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = fixFilenameEncoding(file.originalname)
      .replace(/[\/\\:*?"<>|]/g, '_')
      .replace(/\.\./g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];
    
    const fileName = fixFilenameEncoding(file.originalname);
    const lowerName = fileName.toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || 
        allowedExtensions.some(ext => lowerName.endsWith(ext))) {
      cb(null, true);
    } else {
      cb(new Error('只支持 PDF、Word、TXT、MD 文件'));
    }
  },
});

ragRouter.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const userId = req.body.userId || 'default';
    const chunkStrategy = req.body.chunkStrategy || 'paragraph';
    const chunkSize = parseInt(req.body.chunkSize) || 500;
    const chunkOverlap = parseInt(req.body.chunkOverlap) || 50;
    const kkfileviewUrl = req.body.kkfileviewUrl || 'http://localhost:8012';
    
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ code: 400, message: '请选择文件' });
    }
    
    const originalFileName = fixFilenameEncoding(file.originalname);
    
    const chunkConfig: ChunkConfig = {
      strategy: chunkStrategy,
      chunkSize,
      chunkOverlap,
    };
    
    const filePath = path.join(uploadDir, file.filename);
    
    const document = await addDocument(userId, filePath, originalFileName, chunkConfig, kkfileviewUrl);
    
    const httpFileUrl = `http://host.docker.internal:4000/uploads/${file.filename}`;
    const base64Url = Buffer.from(httpFileUrl, 'utf-8').toString('base64');
    const previewUrl = `${kkfileviewUrl}/onlinePreview?url=${encodeURIComponent(base64Url)}`;
    
    await KnowledgeBaseDAO.update(document.id, {
      previewUrl,
    });
    
    res.json({
      code: 0,
      data: {
        id: document.id,
        fileName: document.fileName,
        fileType: document.fileType,
        chunkCount: document.chunkCount,
        chunkConfig: document.chunkConfig,
        previewUrl,
        createdAt: document.createdAt,
      },
    });
  } catch (e: any) {
    if (req.file) {
      try {
        fs.unlinkSync(path.join(uploadDir, req.file.filename));
      } catch {}
    }
    res.status(500).json({ code: 500, message: e.message || '上传失败' });
  }
});

ragRouter.get('/documents/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const documents = await getDocuments(userId);
    
    res.json({
      code: 0,
      data: documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        chunkCount: doc.chunkCount,
        chunkConfig: doc.chunkConfig,
        previewUrl: doc.previewUrl,
        createdAt: doc.createdAt,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '获取文档列表失败' });
  }
});

ragRouter.get('/documents/:userId/:documentId', async (req, res) => {
  try {
    const { userId, documentId } = req.params;
    const documents = await getDocuments(userId);
    const doc = documents.find(d => d.id === documentId);
    
    if (!doc) {
      return res.status(404).json({ code: 404, message: '文档不存在' });
    }
    
    res.json({
      code: 0,
      data: {
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        content: doc.content,
        chunkCount: doc.chunkCount,
        chunkConfig: doc.chunkConfig,
        previewUrl: doc.previewUrl,
        createdAt: doc.createdAt,
      },
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '获取文档详情失败' });
  }
});

ragRouter.delete('/documents/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.query.userId as string || 'default';
    
    const documents = await getDocuments(userId);
    const doc = documents.find(d => d.id === documentId);
    
    if (doc && doc.previewUrl) {
      const match = doc.previewUrl.match(/file:\/\/(.+)/);
      if (match) {
        try {
          fs.unlinkSync(match[1]);
        } catch {}
      }
    }
    
    const success = await deleteDocument(userId, documentId);
    
    if (success) {
      res.json({ code: 0, data: { success: true } });
    } else {
      res.status(404).json({ code: 404, message: '文档不存在' });
    }
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '删除失败' });
  }
});

ragRouter.delete('/documents', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'default';
    
    await clearAllDocuments(userId);
    
    res.json({ code: 0, data: { success: true } });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '清空失败' });
  }
});

ragRouter.post('/search', async (req, res) => {
  try {
    const { query, userId, topK, threshold } = req.body;
    
    if (!query) {
      return res.status(400).json({ code: 400, message: '请输入查询内容' });
    }
    
    const results = await retrieve(query, userId, topK || 5, threshold || 0.15);
    
    res.json({
      code: 0,
      data: results.map(r => ({
        chunk: r.chunk,
        similarity: r.similarity,
      })),
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '搜索失败' });
  }
});

ragRouter.post('/context', async (req, res) => {
  try {
    const { query, userId } = req.body;
    
    if (!query) {
      return res.status(400).json({ code: 400, message: '请输入查询内容' });
    }
    
    const context = await buildRAGContext(query, userId);
    
    res.json({
      code: 0,
      data: {
        context,
        hasContext: context.length > 0,
      },
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '获取上下文失败' });
  }
});

ragRouter.post('/preview', async (req, res) => {
  try {
    const { documentId, userId, kkfileviewUrl } = req.body;
    
    if (!documentId) {
      return res.status(400).json({ code: 400, message: '请提供文档ID' });
    }
    
    const documents = await getDocuments(userId || 'default');
    const doc = documents.find(d => d.id === documentId);
    
    if (!doc) {
      return res.status(404).json({ code: 404, message: '文档不存在' });
    }
    
    const kkResult = await ensureKkFileViewAvailable();
    if (!kkResult.success) {
      return res.status(503).json({ 
        code: 503, 
        message: `预览服务不可用: ${kkResult.message}`,
        data: {
          fileName: doc.fileName,
          fileType: doc.fileType,
        }
      });
    }
    
    let previewUrl = doc.previewUrl;
    
    if (previewUrl) {
      if (kkfileviewUrl && !previewUrl.includes(kkfileviewUrl)) {
        const match = previewUrl.match(/url=([^&]+)/);
        if (match) {
          const fileUrl = decodeURIComponent(match[1]);
          let decodedFileUrl = fileUrl;
          try {
            decodedFileUrl = Buffer.from(fileUrl, 'base64').toString('utf-8');
          } catch {}
          const newBase64Url = Buffer.from(decodedFileUrl, 'utf-8').toString('base64');
          previewUrl = `${kkfileviewUrl}/onlinePreview?url=${encodeURIComponent(newBase64Url)}`;
        }
      }
    }
    
    if (!previewUrl) {
      const fileUrl = `http://host.docker.internal:4000/uploads/${doc.fileName}`;
      const base64Url = Buffer.from(fileUrl, 'utf-8').toString('base64');
      previewUrl = `${kkResult.url}/onlinePreview?url=${encodeURIComponent(base64Url)}`;
    }
    
    res.json({
      code: 0,
      data: {
        previewUrl,
        fileName: doc.fileName,
        fileType: doc.fileType,
        serviceStatus: kkResult.message,
      },
    });
  } catch (e: any) {
    res.status(500).json({ code: 500, message: e.message || '获取预览链接失败' });
  }
});

ragRouter.get('/preview/health', async (req, res) => {
  try {
    const kkResult = await ensureKkFileViewAvailable();
    res.json({
      code: kkResult.success ? 0 : 503,
      data: {
        available: kkResult.success,
        message: kkResult.message,
        url: kkResult.url,
      },
    });
  } catch (e: any) {
    res.json({
      code: 500,
      data: {
        available: false,
        message: e.message || '检测失败',
        url: '',
      },
    });
  }
});

ragRouter.get('/chunk-strategies', async (req, res) => {
  res.json({
    code: 0,
    data: {
      strategies: [
        { id: 'fixed', name: '固定长度', description: '按固定字符数分割，适合结构化文档' },
        { id: 'sentence', name: '按句子', description: '按中文标点符号分割，保持句子完整性' },
        { id: 'paragraph', name: '按段落', description: '按空行分割，保持段落语义完整（推荐）' },
      ],
      defaultConfig: {
        strategy: 'paragraph',
        chunkSize: 500,
        chunkOverlap: 50,
      },
    },
  });
});