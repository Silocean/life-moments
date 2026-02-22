export type SortKey = 'date' | 'name' | 'days'

interface SettingsProps {
  dark: boolean
  onToggleDark: () => void
  onImport: () => void
  onExport: () => void
  sortKey: SortKey
  sortAsc: boolean
  onSortKeyChange: (key: SortKey) => void
  onSortAscToggle: () => void
  onOpenCloudSync: () => void
}

export function Settings({
  dark,
  onToggleDark,
  onImport,
  onExport,
  sortKey,
  sortAsc,
  onSortKeyChange,
  onSortAscToggle,
  onOpenCloudSync,
}: SettingsProps) {
  return (
    <div className="space-y-6 px-1">
      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">外观</h2>
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
          <span className="text-zinc-700 dark:text-zinc-300">深色模式</span>
          <button
            type="button"
            onClick={onToggleDark}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
            aria-label={dark ? '切换到浅色' : '切换到深色'}
          >
            {dark ? (
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">排序</h2>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
          <select
            value={sortKey}
            onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
            className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm text-zinc-700 focus:border-amber-500 focus:outline-none dark:border-zinc-600 dark:text-zinc-300"
          >
            <option value="date">按日期</option>
            <option value="name">按名称</option>
            <option value="days">按天数</option>
          </select>
          <button
            type="button"
            onClick={onSortAscToggle}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-700"
            title={sortAsc ? '升序' : '降序'}
          >
            {sortAsc ? '↑ 升序' : '↓ 降序'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">数据</h2>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onImport}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            导入
          </button>
          <button
            type="button"
            onClick={onExport}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            导出
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">云同步</h2>
        <button
          type="button"
          onClick={onOpenCloudSync}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          云同步设置
        </button>
      </section>
    </div>
  )
}
