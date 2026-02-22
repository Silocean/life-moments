const GIST_FILENAME = 'moments.json'
const STORAGE_KEY_TOKEN = 'gist-sync-token'
const STORAGE_KEY_GIST_ID = 'gist-sync-gist-id'
const STORAGE_KEY_LAST_PUSH = 'gist-sync-last-push'
const STORAGE_KEY_LAST_PULL = 'gist-sync-last-pull'

export function getStoredToken(): string {
  return localStorage.getItem(STORAGE_KEY_TOKEN) ?? ''
}

export function getStoredGistId(): string {
  return localStorage.getItem(STORAGE_KEY_GIST_ID) ?? ''
}

export function saveTokenAndGistId(token: string, gistId: string): void {
  if (token.trim()) localStorage.setItem(STORAGE_KEY_TOKEN, token.trim())
  else localStorage.removeItem(STORAGE_KEY_TOKEN)
  if (gistId.trim()) localStorage.setItem(STORAGE_KEY_GIST_ID, gistId.trim())
  else localStorage.removeItem(STORAGE_KEY_GIST_ID)
}

export function getLastPushTime(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_PUSH)
}

export function getLastPullTime(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_PULL)
}

function setLastPushTime(): void {
  localStorage.setItem(STORAGE_KEY_LAST_PUSH, new Date().toLocaleTimeString('zh-CN', { hour12: false }))
}

function setLastPullTime(): void {
  localStorage.setItem(STORAGE_KEY_LAST_PULL, new Date().toLocaleTimeString('zh-CN', { hour12: false }))
}

export async function pushToGist(token: string, gistId: string | null, content: string): Promise<{ gistId: string }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }

  if (gistId) {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        files: { [GIST_FILENAME]: { content } },
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
    }
    setLastPushTime()
    return { gistId }
  }

  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      description: '人生时刻 - 数据备份',
      public: false,
      files: { [GIST_FILENAME]: { content } },
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  const data = (await res.json()) as { id: string }
  setLastPushTime()
  if (data.id) {
    localStorage.setItem(STORAGE_KEY_GIST_ID, data.id)
  }
  return { gistId: data.id }
}

export async function pullFromGist(token: string, gistId: string): Promise<string> {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  const data = (await res.json()) as { files?: Record<string, { content?: string }> }
  const content = data.files?.[GIST_FILENAME]?.content
  if (content == null) throw new Error('Gist 中未找到 moments 数据')
  setLastPullTime()
  return content
}
