import { ContentTypeManagementServiceProxy, Stereotype } from './eoc/app-service-proxies'

export async function getAllTypes(params: {
  stereotype: number | Stereotype
  filter: string | undefined
  page: number | undefined
  pageSize: number | undefined
}) {
  const data = await new ContentTypeManagementServiceProxy().getAllTypes(params)
  console.log(data, 'getAllTypes')
  return data
}
