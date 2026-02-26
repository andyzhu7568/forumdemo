const API_BASE = '';

type MessageItem = {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
};

type ListResponse = {
  data: MessageItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

const form = document.getElementById('form') as HTMLFormElement;
const authorInput = document.getElementById('author') as HTMLInputElement;
const contentInput = document.getElementById('content') as HTMLTextAreaElement;
const contentHint = document.getElementById('contentHint') as HTMLSpanElement;
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
const formError = document.getElementById('formError') as HTMLParagraphElement;
const messageList = document.getElementById('messageList') as HTMLDivElement;
const loadingEl = document.getElementById('loading') as HTMLDivElement;
const emptyEl = document.getElementById('empty') as HTMLDivElement;
const loadMoreWrap = document.getElementById('loadMore') as HTMLDivElement;
const loadMoreBtn = document.getElementById('loadMoreBtn') as HTMLButtonElement;

let currentPage = 1;
let totalPages = 1;
let isLoading = false;

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderMessage(msg: MessageItem): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'message-card';
  card.innerHTML = `
    <div class="author">${escapeHtml(msg.author)}</div>
    <div class="content">${escapeHtml(msg.content)}</div>
    <div class="time">${formatTime(msg.createdAt)}</div>
  `;
  return card;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function fetchMessages(page: number): Promise<ListResponse> {
  const res = await fetch(`${API_BASE}/api/messages?page=${page}&limit=20`);
  if (!res.ok) throw new Error('加载失败');
  return res.json();
}

function setLoading(show: boolean): void {
  isLoading = show;
  loadingEl.style.display = show ? 'block' : 'none';
}

function setEmpty(show: boolean): void {
  emptyEl.hidden = !show;
}

function setLoadMore(show: boolean, hasMore: boolean): void {
  loadMoreWrap.hidden = !show;
  loadMoreBtn.disabled = !hasMore;
  loadMoreBtn.textContent = hasMore ? '加载更多' : '没有更多了';
}

async function loadMessages(append: boolean): Promise<void> {
  if (isLoading) return;
  if (!append) {
    currentPage = 1;
    messageList.innerHTML = '';
  }
  setLoading(true);
  setEmpty(false);
  setLoadMore(false, false);
  try {
    const result = await fetchMessages(currentPage);
    totalPages = result.pagination.totalPages;
    if (result.data.length === 0 && !append) {
      setEmpty(true);
    } else {
      result.data.forEach((msg) => messageList.appendChild(renderMessage(msg)));
      const hasMore = currentPage < totalPages;
      setLoadMore(totalPages > 1, hasMore);
    }
  } catch {
    messageList.innerHTML = '<p class="error">加载失败，请刷新重试</p>';
  } finally {
    setLoading(false);
  }
}

async function submitMessage(e: Event): Promise<void> {
  e.preventDefault();
  formError.textContent = '';
  const author = authorInput.value.trim();
  const content = contentInput.value.trim();

  // 用自定义校验提示替换浏览器默认的 "Please fill out this field"
  authorInput.setCustomValidity(author ? '' : '请填写昵称');
  contentInput.setCustomValidity(content ? '' : '请填写留言内容');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitBtn.disabled = true;
  try {
    const res = await fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, content }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      formError.textContent = data.error || '发布失败';
      return;
    }
    contentInput.value = '';
    updateContentHint(0);
    const msg = data.data as MessageItem;
    messageList.insertBefore(renderMessage(msg), messageList.firstChild);
    setEmpty(false);
  } catch {
    formError.textContent = '网络错误，请重试';
  } finally {
    submitBtn.disabled = false;
  }
}

function updateContentHint(len: number): void {
  contentHint.textContent = `${len} / 2000`;
}

contentInput.addEventListener('input', () => {
  updateContentHint(contentInput.value.length);
  contentInput.setCustomValidity('');
});
authorInput.addEventListener('input', () => authorInput.setCustomValidity(''));

form.addEventListener('submit', submitMessage);
loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  loadMessages(true);
});

loadMessages(false);
