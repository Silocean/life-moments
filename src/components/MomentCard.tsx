import { useEffect, useRef, useState } from 'react'
import type { Moment } from '../types/moment'
import { formatDaysText, formatDisplayDate, getDaysElapsed, getMilestoneLabel, isMilestone } from '../utils/dateUtils'

interface MomentCardProps {
  moment: Moment
  onEdit: () => void
  onDelete: () => void
  onShare: () => void
}

export function MomentCard({ moment, onEdit, onDelete, onShare }: MomentCardProps) {
  const days = getDaysElapsed(moment.date)
  const milestone = getMilestoneLabel(days, moment.date)
  const isMilestoneDay = isMilestone(days)
  const daysText = formatDaysText(days)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const actionsMenu = (
    <div className="relative md:hidden" ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        aria-label="更多操作"
        aria-expanded={menuOpen}
      >
        <svg className="size-6 shrink-0 md:size-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18" r="1.5" />
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute right-0 top-full z-10 mt-1 min-w-[7rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-600 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => {
              onShare()
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="size-5 shrink-0 md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit()
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <svg className="size-5 shrink-0 md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            编辑
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete()
              setMenuOpen(false)
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg className="size-5 shrink-0 md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            删除
          </button>
        </div>
      )}
    </div>
  )

  const actionButtonsDesktop = (
    <div className="hidden gap-1 md:flex">
      <button
        type="button"
        onClick={onShare}
        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        title="分享"
        aria-label="分享"
      >
        <svg className="size-5 md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
        title="编辑"
        aria-label="编辑"
      >
        <svg className="size-5 md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        title="删除"
        aria-label="删除"
      >
        <svg className="size-5 md:size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )

  return (
    <div
      className={`rounded-2xl border p-5 transition hover:shadow-md dark:hover:shadow-zinc-900/50 md:flex md:flex-row md:items-center md:justify-between ${
        isMilestoneDay
          ? 'border-amber-400/60 bg-amber-50/80 dark:border-amber-500/50 dark:bg-amber-950/20'
          : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'
      }`}
    >
      {/* 手机端：左侧内容 + 右侧「已过去 X 天」不换行 + 菜单 */}
      <div className="flex items-start justify-between gap-3 md:contents">
        <div className="min-w-0 flex-1 md:min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {moment.name}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {formatDisplayDate(moment.date)}
          </p>
          {moment.description && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {moment.description}
            </p>
          )}
          {moment.category && (
            <span className="mt-1 inline-block rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-600 dark:text-zinc-300">
              {moment.category}
            </span>
          )}
        </div>
        {/* 手机端：右侧天数不换行 + 菜单；桌面端由下方 sm: 布局展示 */}
        <div className="flex shrink-0 flex-col items-end gap-2 md:hidden">
          <div className="flex items-center gap-2 whitespace-nowrap text-right">
            <span
              className={`text-xl font-bold ${
                isMilestoneDay
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {daysText}
            </span>
            {milestone && (
              <span className="rounded-lg bg-amber-200/80 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-400/30 dark:text-amber-200">
                {milestone}
              </span>
            )}
          </div>
          {actionsMenu}
        </div>
      </div>

      {/* 桌面端：右侧天数 + 操作图标 */}
      <div className="mt-2 hidden shrink-0 items-center gap-4 md:mt-0 md:flex md:flex-col md:items-end">
        <div className="text-right">
          <span
            className={`inline-block text-2xl font-bold sm:text-3xl ${
              isMilestoneDay
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {daysText}
          </span>
          {milestone && (
            <span className="ml-2 inline-block rounded-lg bg-amber-200/80 px-2 py-0.5 text-sm font-medium text-amber-800 dark:bg-amber-400/30 dark:text-amber-200">
              {milestone}
            </span>
          )}
        </div>
        {actionButtonsDesktop}
      </div>
    </div>
  )
}
