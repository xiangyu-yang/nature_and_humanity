import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, FolderOpen, AlertCircle, CheckCircle, Search, BookOpen, Eye, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { api, type KnowledgeDocument, type ChunkStrategy, type ChunkConfig } from '@/api/client';

export function KnowledgeBasePage() {
  const user = useUserStore(s => s.user);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ chunk: string; similarity: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chunkStrategy, setChunkStrategy] = useState('paragraph');
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [strategies, setStrategies] = useState<ChunkStrategy[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loadingDocIds, setLoadingDocIds] = useState<Set<string>>(new Set());
  const [kkfileviewUrl, setKkfileviewUrl] = useState('http://localhost:8012');

  useEffect(() => {
    loadDocuments();
    loadChunkStrategies();
  }, [user?.id]);

  useEffect(() => {
    if (previewUrl) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setPreviewUrl('');
    }
  }, [previewUrl]);

  const loadDocuments = async () => {
    try {
      const result = await api.getDocuments(user?.id || '');
      setDocuments(result.data);
    } catch (e) {
      console.error('加载文档失败:', e);
    }
  };

  const loadChunkStrategies = async () => {
    try {
      const result = await api.getChunkStrategies();
      setStrategies(result.data.strategies);
    } catch (e) {
      console.error('加载分片策略失败:', e);
      setStrategies([
        { id: 'fixed', name: '固定长度', description: '按固定字符数分割，适合结构化文档' },
        { id: 'sentence', name: '按句子', description: '按中文标点符号分割，保持句子完整性' },
        { id: 'paragraph', name: '按段落', description: '按空行分割，保持段落语义完整（推荐）' },
      ]);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedExtensions.includes(extension)) {
      setUploadError('只支持 PDF、Word、TXT、MD 格式的文件');
      setUploadSuccess('');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('文件大小不能超过50MB');
      setUploadSuccess('');
      return;
    }

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user?.id || 'default');
    formData.append('chunkStrategy', chunkStrategy);
    formData.append('chunkSize', chunkSize.toString());
    formData.append('chunkOverlap', chunkOverlap.toString());
    formData.append('kkfileviewUrl', kkfileviewUrl);

    try {
      const result = await api.uploadDocument(formData);
      setUploadSuccess(`文件 "${result.data.fileName}" 上传成功！共分割为 ${result.data.chunkCount} 个片段`);
      setUploadError('');
      loadDocuments();
    } catch (e: any) {
      setUploadError(e.message || '上传失败');
      setUploadSuccess('');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('确定要删除这个文档吗？')) return;

    try {
      await api.deleteDocument(documentId, user?.id || '');
      loadDocuments();
    } catch (e) {
      console.error('删除文档失败:', e);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await api.searchKnowledge(searchQuery.trim(), user?.id);
      setSearchResults(result.data);
    } catch (e) {
      console.error('搜索失败:', e);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePreview = async (doc: KnowledgeDocument) => {
    if (loadingDocIds.has(doc.id)) return;
    
    setLoadingDocIds(prev => new Set([...prev, doc.id]));
    
    try {
      console.log('开始预览文档:', doc.id, doc.fileName);
      const result = await api.getDocumentPreview(doc.id, user?.id, kkfileviewUrl);
      console.log('预览API返回:', result);
      
      if (result.data.serviceStatus) {
        console.log('预览服务状态:', result.data.serviceStatus);
      }
      
      if (result.data.previewUrl) {
        setPreviewUrl(result.data.previewUrl);
      } else {
        alert('预览链接为空');
      }
    } catch (e: any) {
      console.error('预览失败:', e);
      if (e.code === 503) {
        alert(`预览服务启动失败: ${e.message}\n请手动打开 Docker Desktop 后重试`);
      } else if (doc.previewUrl) {
        setPreviewUrl(doc.previewUrl);
      } else {
        alert('预览服务不可用');
      }
    } finally {
      setLoadingDocIds(prev => {
        const next = new Set(prev);
        next.delete(doc.id);
        return next;
      });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'word':
        return <FileText className="w-6 h-6 text-blue-500" />;
      case 'md':
        return <BookOpen className="w-6 h-6 text-orange-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '未知时间';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '未知时间';
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '未知时间';
    }
  };

  const getStrategyName = (strategyId: string | undefined) => {
    const strategy = strategies.find(s => s.id === strategyId);
    return strategy?.name || strategyId || '段落';
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-800">知识库管理</h1>
              <p className="text-ink-500 text-sm">上传文档并进行向量化存储，增强中医命理大师的问答能力</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-teal-100 text-teal-600' : 'bg-white text-ink-600 hover:bg-ink-100'} shadow-sm`}
            title="分片设置"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showSettings && (
          <div className="bg-white rounded-2xl shadow-ink-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-ink-800 mb-4">分片策略配置</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">分片策略</label>
                <select
                  value={chunkStrategy}
                  onChange={(e) => setChunkStrategy(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-ink-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                >
                  {strategies.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.description}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">kkFileView地址</label>
                <input
                  type="text"
                  value={kkfileviewUrl}
                  onChange={(e) => setKkfileviewUrl(e.target.value)}
                  placeholder="http://localhost:8012"
                  className="w-full px-4 py-2 rounded-xl border border-ink-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">分片大小 (字符)</label>
                <input
                  type="number"
                  value={chunkSize}
                  onChange={(e) => setChunkSize(parseInt(e.target.value) || 500)}
                  min={100}
                  max={2000}
                  className="w-full px-4 py-2 rounded-xl border border-ink-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ink-600 mb-2">重叠字符数</label>
                <input
                  type="number"
                  value={chunkOverlap}
                  onChange={(e) => setChunkOverlap(parseInt(e.target.value) || 50)}
                  min={0}
                  max={500}
                  className="w-full px-4 py-2 rounded-xl border border-ink-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded">推荐：paragraph策略, 500字符大小, 50字符重叠</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-ink-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
              <input
                type="text"
                placeholder="搜索知识库内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-ink-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              搜索
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div key={index} className="p-4 bg-ink-50 rounded-xl border border-ink-100">
                  <p className="text-sm text-teal-600 mb-2">相似度: {(result.similarity * 100).toFixed(2)}%</p>
                  <p className="text-ink-700 text-sm line-clamp-3">{result.chunk}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-ink-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink-800">上传文档</h2>
            <span className="text-sm text-ink-500">当前策略: {getStrategyName(chunkStrategy)} · {chunkSize}字符 · 重叠{chunkOverlap}</span>
          </div>
          
          <label className="block w-full border-2 border-dashed border-ink-200 rounded-xl p-12 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-ink-700">点击或拖拽上传文件</p>
                <p className="text-sm text-ink-500 mt-1">支持 PDF、Word、TXT、MD 格式，单文件最大 50MB</p>
              </div>
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md"
            />
          </label>

          {uploading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-teal-600">
              <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              <span>正在处理文件...</span>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              <span>{uploadError}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl">
              <CheckCircle className="w-5 h-5" />
              <span>{uploadSuccess}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-ink-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink-800">已上传文档</h2>
            <span className="text-sm text-ink-500">{documents.length} 个文档</span>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ink-100 flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-ink-400" />
              </div>
              <p className="text-ink-500">暂无文档，点击上方区域上传</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-ink-50 rounded-xl hover:bg-ink-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div>
                      <p className="font-medium text-ink-800">{doc.fileName}</p>
                      <p className="text-sm text-ink-500">
                        {doc.chunkCount} 个片段 · {getStrategyName(doc.chunkConfig?.strategy)}策略 · {formatDate(doc.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(doc)}
                      disabled={loadingDocIds.has(doc.id)}
                      className="flex items-center gap-2 px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
                      title="预览文档"
                    >
                      {loadingDocIds.has(doc.id) ? (
                        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                      <span className="text-sm">预览</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除文档"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
          <h3 className="font-medium text-teal-800 mb-2">使用说明</h3>
          <ul className="text-sm text-teal-700 space-y-1">
            <li>• 上传的文档会被自动分割为多个片段并进行向量化处理</li>
            <li>• 支持 PDF、Word（doc/docx）、TXT、Markdown 等多种格式</li>
            <li>• 点击预览按钮可使用 kkFileView 查看文档内容</li>
            <li>• 当您向中医命理大师提问时，系统会自动从知识库中检索相关内容</li>
            <li>• 检索到的内容会作为上下文提供给大模型，帮助它给出更准确的回答</li>
            <li>• 建议上传中医养生、命理知识等相关文档，以增强问答能力</li>
            <li>• 分片策略建议使用"按段落"，可以保持语义完整性</li>
          </ul>
        </div>
      </div>
    </div>
  );
}