import type { ErrorMessageMode } from '@admin/types'

export interface ContextOptions {
  errorFunction: AnyFunction<any>
  errorModalFunction: AnyFunction<any>
  getTokenFunction: () => unknown
  errorLogFunction: (error: any) => void
  unauthorizedFunction: (msg?: string) => void
  timeoutFunction: () => void
  handleErrorFunction: (message?: string, mode?: ErrorMessageMode) => void
  apiUrl?: string
  uploadUrl?: string
}

export let context: ContextOptions = {
  getTokenFunction: () => undefined,
  unauthorizedFunction: () => {},
  errorFunction: () => {},
  errorModalFunction: () => {},
  errorLogFunction: () => {},
  handleErrorFunction: () => {},
  timeoutFunction: () => {},
  apiUrl: '',
}

export const initServiceModule = async (_context: ContextOptions) => {
  context = _context
}
