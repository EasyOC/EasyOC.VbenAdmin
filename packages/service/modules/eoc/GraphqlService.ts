import { ContentTypeEnum } from '@admin/tokens'
import { ocApi } from '../../request'
// import { BasicFetchResult } from '../model'

export const GraphqlServiceAPI = '/api/graphql'
export type GraphQLQueryParams = {
  operationName?: string
  query: string
  variables?: LuceneCommonQueryParams
}
export const excuteGraphqlQuery = async (query: GraphQLQueryParams) => {
  return await ocApi.post({ url: GraphqlServiceAPI, data: query })
}

export const excuteGraphqlGetQuery = async (params: { query: string }) => {
  const result = await ocApi.get({
    url: GraphqlServiceAPI,
    params: params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
  return result.data
}

export const loadGraphQLSchema = async () => {
  return excuteGraphqlGetQuery({ query: querySchema })
}

export type SqlCommonQueryParams = {
  fist: string
  skip: string
}

export type LuceneCommonQueryParams = {
  filters?: { method: string; key?: string; value: string }[]
  from: number
  skip: number
}

const querySchema = ` 
query IntrospectionQuery {
  __schema { 
    queryType { name }
    mutationType { name }
    subscriptionType { name }
    types {
      ...FullType
    }
    directives {
      name
      description
      
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type { ...TypeRef }
  defaultValue
  
  
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
`
