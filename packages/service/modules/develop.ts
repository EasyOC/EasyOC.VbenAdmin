import { ContentManagementServiceProxy } from './api/app-service-proxies'

export async function getAllTypes(params: {
  stereotype: string | undefined
  filter: string | undefined
  page: number | undefined
  pageSize: number | undefined
}) {
  const data = await new ContentManagementServiceProxy().getAllTypes(params)
  console.log(data, 'getAllTypes')
  return data
}
