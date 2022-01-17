import type { ErrorMessageMode } from '@admin/types'

export interface ContextOptions {
  errorFunction: AnyFunction<any>
  errorModalFunction: AnyFunction<any>
  getTokenFunction: () => unknown
  errorLogFunction: (error: any) => void
  unauthorizedFunction: (msg?: string) => void
  timeoutFunction: () => void
  handleErrorFunction: (message?: string, mode?: ErrorMessageMode) => void
  urlPrefix?: string
  apiUrl?: string
  uploadUrl?: string
  clientId?: string
  scopes?: string
  clientRoot?: string
  stsAuthority?: string
}

export let context: ContextOptions = {
  getTokenFunction: () => undefined,
  unauthorizedFunction: () => {},
  errorFunction: () => {},
  errorModalFunction: () => {},
  errorLogFunction: () => {},
  handleErrorFunction: () => {},
  timeoutFunction: () => {},
  urlPrefix: '',
  apiUrl: '',
  clientId: '',
  scopes: '',
  clientRoot: '',
  stsAuthority: '',
}

export const initServiceModule = async (_context: ContextOptions) => {
  context = _context
}
