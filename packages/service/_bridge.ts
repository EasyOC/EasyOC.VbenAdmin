import type { ErrorMessageMode } from '@admin/types'

export interface ContextOptions {
  orchardNotify: {
    successFunction: AnyFunction<any>
    informationFunction: AnyFunction<any>
    warningFunction: AnyFunction<any>
    errorFunction: AnyFunction<any>
  }
  errorFunction: AnyFunction<any>
  errorModalFunction: AnyFunction<any>
  getTokenFunction: () => unknown
  errorLogFunction: (error: any) => void
  unauthorizedFunction: (msg?: string) => void
  timeoutFunction: () => void
  handleErrorFunction: (message?: string, mode?: ErrorMessageMode) => void
  apiUrl?: string
  uploadUrl?: string
  clientId?: string
  scope?: string
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
  orchardNotify: {
    successFunction: console.log,
    informationFunction: console.log,
    warningFunction: console.log,
    errorFunction: console.log,
  },
  apiUrl: '',
  clientId: '',
  scope: '',
  clientRoot: '',
  stsAuthority: '',
}

export const initServiceModule = async (_context: ContextOptions) => {
  context = _context
}
