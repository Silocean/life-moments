import { useCallback, useEffect, useMemo, useState } from 'react'
import { CloudSyncModal } from './components/CloudSyncModal'
import { Modal } from './components/Modal'
import { MomentCard } from './components/MomentCard'
import { MomentForm } from './components/MomentForm'
import { Settings, type SortKey } from './components/Settings'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useMoments } from './hooks/useMoments'
import type { Moment } from './types/moment'
import { formatDaysText, getDaysElapsed } from './utils/dateUtils'

function App() {
  const { moments, addMoment, updateMoment, deleteMoment, exportData, importData } = useMoments()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [cloudSyncOpen, setCloudSyncOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'moments' | 'settings'>('moments')
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [categoryFilter, setCategoryFilter] = useState<string>('全部')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortAsc, setSortAsc] = useState(true)

  const categories = useMemo(() => {
    const set = new Set(moments.map((m) => m.category).filter((c): c is string => Boolean(c)))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  }, [moments])

  useEffect(() => {
    if (categoryFilter !== '全部' && !categories.includes(categoryFilter)) {
      setCategoryFilter('全部')
    }
  }, [categoryFilter, categories])

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const filtered = useMemo(() => {
    let list = moments
    if (categoryFilter !== '全部') {
      list = list.filter((m) => m.category === categoryFilter)
    }
    return [...list].sort((a, b) => {
      const aDays = getDaysElapsed(a.date)
      const bDays = getDaysElapsed(b.date)
      let cmp = 0
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date)
      else if (sortKey === 'name') cmp = a.name.localeCompare(b.name, 'zh-CN')
      else cmp = aDays - bDays
      return sortAsc ? cmp : -cmp
    })
  }, [moments, categoryFilter, sortKey, sortAsc])

  const handleAdd = useCallback(() => {
    setEditingId(null)
    setModalOpen(true)
  }, [])

  const handleEdit = useCallback((id: string) => {
    setEditingId(id)
    setModalOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    (data: { name: string; date: string; description?: string; category?: string }) => {
      if (editingId) {
        updateMoment(editingId, data)
      } else {
        addMoment(data)
      }
      setModalOpen(false)
      setEditingId(null)
    },
    [editingId, addMoment, updateMoment],
  )

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirmId(id)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmId) {
      deleteMoment(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }, [deleteConfirmId, deleteMoment])

  const handleShare = useCallback((moment: Moment) => {
    const days = getDaysElapsed(moment.date)
    const text = formatDaysText(days)
    const shareText = `${moment.name} · ${text}`
    if (navigator.share) {
      navigator.share({
        title: '人生时刻',
        text: shareText,
      }).catch(() => {
        fallbackCopy(shareText)
      })
    } else {
      fallbackCopy(shareText)
    }
  }, [])

  const handleExport = useCallback(() => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `moments-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [exportData])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const ok = importData(reader.result as string)
        alert(ok ? '导入成功' : '导入失败，请检查文件格式')
      }
      reader.readAsText(file)
    }
    input.click()
  }, [importData])

  const editingMoment = editingId ? moments.find((m) => m.id === editingId) : null

  const headerActionsDesktop = (
    <div className="flex flex-wrap items-center gap-2 max-md:hidden">
      <button
        type="button"
        onClick={() => setDark((d) => !d)}
        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        title={dark ? '切换到浅色' : '切换到深色'}
        aria-label={dark ? '切换到浅色' : '切换到深色'}
      >
        {dark ? (
          <svg className="size-6 md:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="size-6 md:size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
      <button
        type="button"
        onClick={handleImport}
        className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        导入
      </button>
      <button
        type="button"
        onClick={handleExport}
        className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        导出
      </button>
      <button
        type="button"
        onClick={() => setCloudSyncOpen(true)}
        className="rounded-lg px-3 py-2 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        云同步
      </button>
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        添加时刻
      </button>
    </div>
  )

  const headerActionsMobile = (
    <div className="flex items-center gap-2 md:hidden">
      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
      >
        添加时刻
      </button>
    </div>
  )

  const showSettings = !isDesktop && activeTab === 'settings'
  const mainContent =
    showSettings ? (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Settings
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onImport={handleImport}
          onExport={handleExport}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSortKeyChange={setSortKey}
          onSortAscToggle={() => setSortAsc((a) => !a)}
          onOpenCloudSync={() => setCloudSyncOpen(true)}
        />
      </div>
    ) : (
      <main className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">分类</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-amber-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="全部">全部</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">排序</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-lg border border-zinc-300 bg-white px-2.5 py-2 text-sm text-zinc-700 focus:border-amber-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              <option value="date">日期</option>
              <option value="name">名称</option>
              <option value="days">天数</option>
            </select>
            <button
              type="button"
              onClick={() => setSortAsc((a) => !a)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
              title={sortAsc ? '升序' : '降序'}
            >
              {sortAsc ? '↑' : '↓'}
            </button>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/50 py-16 text-center dark:border-zinc-700 dark:bg-zinc-800/50">
            <p className="text-zinc-500 dark:text-zinc-400">
              {moments.length === 0
                ? '还没有任何时刻，点击「添加时刻」开始记录'
                : '该分类下暂无时刻'}
            </p>
            {moments.length === 0 && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 rounded-lg bg-amber-500 px-6 py-2.5 font-medium text-white transition hover:bg-amber-600"
              >
                添加第一个时刻
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {filtered.map((m) => (
              <li key={m.id}>
                <MomentCard
                  moment={m}
                  onEdit={() => handleEdit(m.id)}
                  onDelete={() => handleDeleteClick(m.id)}
                  onShare={() => handleShare(m)}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            人生时刻
          </h1>
          {headerActionsDesktop}
          {headerActionsMobile}
        </div>
      </header>

      {mainContent}

      {/* 手机端底部 Tab */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 md:hidden"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto flex max-w-4xl">
          <button
            type="button"
            onClick={() => setActiveTab('moments')}
            className={`flex-1 py-3 text-center text-sm font-medium transition ${
              activeTab === 'moments'
                ? 'text-amber-500'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            时刻
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-center text-sm font-medium transition ${
              activeTab === 'settings'
                ? 'text-amber-500'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            设置
          </button>
        </div>
      </nav>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '编辑时刻' : '添加时刻'}
      >
        <MomentForm
          initial={editingMoment ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="确认删除"
      >
        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            确定要删除该时刻吗？此操作不可恢复。
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 font-medium text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
            >
              删除
            </button>
          </div>
        </div>
      </Modal>

      <CloudSyncModal
        open={cloudSyncOpen}
        onClose={() => setCloudSyncOpen(false)}
        exportData={exportData}
        importData={importData}
      />
    </div>
  )
}

function fallbackCopy(text: string) {
  navigator.clipboard.writeText(text).then(
    () => alert('已复制到剪贴板'),
    () => alert('复制失败，请手动复制：' + text),
  )
}

export default App
