/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import type { ConfigType } from 'dayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { isString } from '@vue/shared'
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'
dayjs.extend(utc)
dayjs.extend(timezone)
export const dateUtil = dayjs

export const formatToDateTime = (
  date: ConfigType,
  format = DATE_TIME_FORMAT,
): string => {
  return dateUtil(date).format(format)
}
const UTC_DATE_FORMAT_PREFIX = 'utc|'
export const formatToDate = (
  date: ConfigType,
  format = DATE_FORMAT,
): string => {
  if (isString(format) && format.startsWith(UTC_DATE_FORMAT_PREFIX)) {
    const dateFormat = format.replace(UTC_DATE_FORMAT_PREFIX, '')
    return dateUtil(date).tz("Asia/Shanghai").format(dateFormat)
  }
  return dateUtil(date).format(format)
}
