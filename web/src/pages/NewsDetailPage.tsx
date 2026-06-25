import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { TaijiLogo } from '@/components/Branding';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tag: string;
  date: string;
  source: string;
  url?: string;
  externalLink?: string;
  fetching?: boolean;
}

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchingContent, setFetchingContent] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/news/${id}`);
        const data = await response.json();
        if (data.code === 0 && data.data) {
          setArticle(data.data);
          if (data.data.fetching) {
            setFetchingContent(true);
            setPollCount(0);
          }
        } else {
          setError('文章不存在');
        }
      } catch (err) {
        setError('加载失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (article?.fetching && !article.content && pollCount < 5) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/news/${id}`);
          const data = await response.json();
          if (data.code === 0 && data.data) {
            if (data.data.content || !data.data.fetching) {
              setArticle(data.data);
              setFetchingContent(false);
              if (interval) clearInterval(interval);
            } else {
              setPollCount(prev => prev + 1);
            }
          }
        } catch (err) {
          console.error('Polling failed:', err);
          setFetchingContent(false);
          if (interval) clearInterval(interval);
        }
      }, 3000);
    } else if (pollCount >= 5) {
      setFetchingContent(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [article?.fetching, article?.content, id, pollCount]);

  const handleRetryFetch = async () => {
    if (!article?.url && !article?.externalLink) return;
    
    setFetchingContent(true);
    try {
      const response = await fetch(`/api/news/${id}`);
      const data = await response.json();
      if (data.code === 0 && data.data) {
        setArticle(data.data);
        if (!data.data.content) {
          setFetchingContent(true);
        }
      }
    } catch (err) {
      console.error('Retry fetch failed:', err);
    }
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0 && listType) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-4 space-y-1 text-ink-500">
              {currentList.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`ol-${elements.length}`} className="list-decimal pl-6 mb-4 space-y-1 text-ink-500">
              {currentList.map((item, i) => (
                <li key={i} className="leading-relaxed">{item}</li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-ink-700 mt-8 mb-4 pb-2 border-b border-ink-100">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${index}`} className="text-lg font-semibold text-ink-600 mt-6 mb-3">
            {trimmed.slice(4)}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmed.replace(/^\d+\.\s/, ''));
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        flushList();
        elements.push(
          <p key={`p-bold-${index}`} className="mb-3 font-semibold text-ink-600">
            {trimmed.slice(2, -2)}
          </p>
        );
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={`p-${index}`} className="mb-3 text-ink-500 leading-relaxed text-[15px]">
            {trimmed}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-3" />
          <p className="text-ink-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-400 mb-4">{error || '文章不存在'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-white border-b border-ink-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 grid place-items-center rounded-lg hover:bg-ink-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-ink-500" />
          </button>
          <h1 className="font-medium text-ink-700 truncate">资讯详情</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <article className="bg-white rounded-2xl card-paper p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
              {article.tag}
            </span>
            <span className="text-sm text-ink-400">{article.source}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-ink-700 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-ink-400 pb-4 mb-6 border-b border-ink-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>{article.tag}</span>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-teal-100 to-amber-100 grid place-items-center">
              <TaijiLogo size={100} className="opacity-70" />
            </div>
          </div>

          <div className="prose-custom">
            {article.content ? (
              renderContent(article.content)
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 grid place-items-center">
                  <Tag className="w-8 h-8 text-teal-500" />
                </div>
                <p className="text-ink-400 mb-2">{article.summary || '暂无详细内容'}</p>
                {fetchingContent ? (
                  <div className="flex items-center justify-center gap-2 text-teal-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>正在获取原文内容...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-ink-300 mb-4">获取原文失败，请点击下方按钮重试或前往原文查看</p>
                    {(article.url || article.externalLink) && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={handleRetryFetch}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>重新获取内容</span>
                        </button>
                        <a
                          href={article.url || article.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>前往原文查看</span>
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {(article.url || article.externalLink) && (
            <div className="mt-8 pt-6 border-t border-ink-100">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink-400">来源：{article.source}</p>
                <a
                  href={article.url || article.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>查看原文</span>
                </a>
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
