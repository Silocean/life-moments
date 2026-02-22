import { addYears, differenceInDays, format, parseISO, startOfDay } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const MILESTONES_UNDER_YEAR: Record<number, string> = {
  100: '100 天',
}

export function getDaysElapsed(dateStr: string): number {
  const target = startOfDay(parseISO(dateStr))
  const today = startOfDay(new Date())
  return differenceInDays(today, target)
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy 年 M 月 d 日', { locale: zhCN })
}

/** 左侧主文案：始终显示精确天数 */
export function formatDaysText(days: number): string {
  if (days < 0) return `还有 ${-days} 天`
  return `已过去 ${days} 天`
}

/** 右侧年数标签：基于真实日期计算，支持任意年数 */
export function getMilestoneLabel(days: number, dateStr: string): string | undefined {
  if (days < 0) return undefined
  if (days < 100) return undefined
  if (days < 365) return MILESTONES_UNDER_YEAR[100] // 100 天

  const start = startOfDay(parseISO(dateStr))
  const today = startOfDay(new Date())
  let years = 0
  let cursor = start
  while (differenceInDays(today, addYears(cursor, 1)) >= 0) {
    years++
    cursor = addYears(cursor, 1)
  }
  return `${years} 年`
}

export function isMilestone(days: number): boolean {
  return days >= 100
}
