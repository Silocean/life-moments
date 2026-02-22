import { useCallback, useEffect, useState } from 'react'
import { Modal } from './Modal'
import {
  getLastPullTime,
  getLastPushTime,
  getStoredGistId,
  getStoredToken,
  pullFromGist,
  pushToGist,
  saveTokenAndGistId,
} from '../services/gistSync'

interface CloudSyncModalProps {
  open: boolean
  onClose: () => void
  exportData: () => string
  importData: (json: string) => boolean
}

export function CloudSyncModal({ open, onClose, exportData, importData }: CloudSyncModalProps) {
  const [token, setToken] = useState('')
  const [gistId, setGistId] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  const lastPush = getLastPushTime()
  const lastPull = getLastPullTime()
  const storedToken = getStoredToken()
  const storedGistId = getStoredGistId()
  const isConfigured = Boolean(storedToken)

  useEffect(() => {
    if (open) {
      setToken(storedToken)
      setGistId(storedGistId)
    }
  }, [open, storedToken, storedGistId])

  const handleSave = useCallback(() => {
    saveTokenAndGistId(token, gistId)
    setStatus('ok')
    setMessage('已保存')
    setTimeout(() => setStatus('idle'), 1500)
  }, [token, gistId])

  const handlePush = useCallback(async () => {
    const t = token.trim() || storedToken
    if (!t) {
      setMessage('请先填写 Token 并保存')
      setStatus('err')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const id = gistId.trim() || storedGistId || null
      const { gistId: newId } = await pushToGist(t, id || null, exportData())
      setMessage('已推送到云端')
      setStatus('ok')
      if (newId) setGistId(newId)
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '推送失败')
      setStatus('err')
    }
  }, [token, gistId, storedToken, storedGistId, exportData])

  const handlePull = useCallback(async () => {
    const t = token.trim() || storedToken
    const id = (gistId.trim() || storedGistId).trim()
    if (!t || !id) {
      setMessage('请先填写 Token 和 Gist ID 并保存')
      setStatus('err')
      return
    }
    setStatus('loading')
    setMessage('')
    try {
      const content = await pullFromGist(t, id)
      const ok = importData(content)
      setMessage(ok ? '已从云端拉取' : '拉取的数据格式无效')
      setStatus(ok ? 'ok' : 'err')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : '拉取失败')
      setStatus('err')
    }
  }, [token, gistId, storedToken, storedGistId, importData])

  return (
    <Modal open={open} onClose={onClose} title="云同步设置">
      <div className="space-y-4">
        {isConfigured && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
            √ 已配置 Token
            {storedGistId ? `, Gist ID: ${storedGistId.slice(0, 8)}...` : ''}
          </div>
        )}

        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
          <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-300">使用说明</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>前往 GitHub Settings → Developer settings → Personal access tokens 创建 Token。</li>
            <li>勾选 <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">gist</code> 权限，其他不需要。</li>
            <li>将生成的 Token 粘贴到下方输入框。</li>
            <li>Token 仅保存在当前浏览器本地，不会发送到其他服务器。</li>
          </ol>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            GitHub Personal Access Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="粘贴 Token"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pr-10 pl-3 text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
            <button
              type="button"
              onClick={() => setShowToken((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              aria-label={showToken ? '隐藏' : '显示'}
            >
              {showToken ? (
                <svg className="size-6 md:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="size-6 md:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Gist ID <span className="font-normal text-zinc-500">(可选，留空自动创建)</span>
          </label>
          <input
            type="text"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
            placeholder="留空则自动创建新 Gist"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            如需在新设备恢复数据，填入之前的 Gist ID
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePush}
            disabled={status === 'loading'}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            推送到云端
          </button>
          <button
            type="button"
            onClick={handlePull}
            disabled={status === 'loading'}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            从云端拉取
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
          >
            保存设置
          </button>
        </div>

        {status === 'loading' && <p className="text-sm text-zinc-500">处理中...</p>}
        {message && status !== 'loading' && (
          <p className={`text-sm ${status === 'err' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {message}
          </p>
        )}
        {(lastPush || lastPull) && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            {lastPush ? `已推送到云端 ${lastPush}` : `已从云端拉取 ${lastPull}`}
          </p>
        )}
      </div>
    </Modal>
  )
}
