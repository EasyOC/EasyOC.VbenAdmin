import { createClient } from '@urql/vue'
import { context } from '../_bridge'
export const client = createClient({
  url: context.apiUrl + '/api/graphql',
  fetchOptions: () => {
    const token = context.getTokenFunction?.()
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    }
  },
})
