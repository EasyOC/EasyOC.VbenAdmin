import type { ErrorMessageMode } from '@pkg/types'

export interface ContextOptions {
  errorFunction: AnyFunction<any>
  errorModalFunction: AnyFunction<any>
  getTokenFunction: () => unknown
  orchardNotify: {
    successFunction: AnyFunction<any>
    informationFunction: AnyFunction<any>
    warningFunction: AnyFunction<any>
    errorFunction: AnyFunction<any>
  }
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
  unauthorizedFunction: () => { },
  errorFunction: () => { },
  errorModalFunction: () => { },
  errorLogFunction: () => { },
  orchardNotify: {
    successFunction: console.log,
    informationFunction: console.log,
    warningFunction: console.log,
    errorFunction: console.log,
  },
  handleErrorFunction: () => { },
  timeoutFunction: () => { },
  apiUrl: '',
  clientId: '',
  scope: '',
  clientRoot: '',
  stsAuthority: '',
}

export const initRequest = async (_context: ContextOptions) => {
  context = _context
}
