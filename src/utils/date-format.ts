import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import local from 'dayjs/locale/pt-br'

dayjs.extend(localizedFormat)
dayjs.locale(local)

export function formatDate(date: string) {
  return dayjs(date).format('LL')
}

export function formatTime(date: string) {
  return dayjs(date).format('HH:mm')
}
