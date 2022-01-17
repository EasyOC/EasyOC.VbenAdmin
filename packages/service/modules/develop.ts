import { ContentManagementServiceProxy } from './app-service-proxies'

export async function getAllTypes() {
  const data = await new ContentManagementServiceProxy().getAllTypes()
  console.log(data, 'getAllTypes')
  return data
}
