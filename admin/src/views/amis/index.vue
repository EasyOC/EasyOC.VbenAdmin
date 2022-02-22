<template>
  <div>
    <Amis :amisjson="amisjson" @amisMounted="amisMounted" />
    <!-- <Editor theme="antd" :value="editorJson" className="is-fixed" /> -->
    <!-- <CodeEditor @change="editorChange" v-model:value="editorJson" /> -->
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
// import MonacoEditor from '@/components/MonacoEditor/index.vue'
// import { CodeEditor } from '@/components/CodeEditor'
import { Amis, Editor } from '@/components/Amis'
import { parser } from 'xijs'

const editorJson = ref<any>(`
    {
  "type": "crud",
  "api": {
    "method": "post",
    "url": "http://localhost:2919/api/graphql",
    "data": {
      "&": "$$"
    },
    "dataType": "json",
    "replaceData": true,
    "responseData": {
      "&": "$$"
    }
  },
  "bulkActions": [
    {
      "type": "button",
      "level": "danger",
      "label": "批量删除",
      "actionType": "ajax",
      "confirmText": "确定要删除？",
      "api": "/xxx/batch-delete"
    },
    {
      "type": "button",
      "label": "批量编辑",
      "actionType": "dialog",
      "dialog": {
        "title": "批量编辑",
        "size": "md",
        "body": {
          "type": "form",
          "api": "/xxx/bacth-edit",
          "body": [
            {
              "label": "字段1",
              "text": "字段1",
              "type": "input-text"
            }
          ]
        }
      }
    }
  ],
  "itemActions": [
  ],
  "errorMsg": {
    "config": {
      "url": "[object Object]",
      "method": "post",
      "data": "{\"type\":\"crud\",\"api\":{\"method\":\"post\",\"url\":\"http://localhost:2919/api/graphql\",\"data\":{\"\":{\"variables\":{\"from\":0,\"skip\":10},\"query\":\"query MyQuery($params:String) {\\n              crmCustomers(parameters:$params) {\\n                items \\n                 {\\n  contentItemId \\n  contentItemVersionId \\n  contentType \\n  displayText \\n  latest \\n  published \\n  modifiedUtc \\n  publishedUtc \\n  createdUtc \\n  owner \\n  author \\n  name \\n  custNum \\n  marketSegment {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  source {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  industry {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  custClass {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  salesOwner {\\n    userIds \\n    userProfiles {\\n      displayText \\n    }\\n  }\\n  address {\\n    countryName \\n    province \\n    city \\n    postalCode \\n    details \\n    name \\n  }\\n}                \\n                total\\n              }\\n            }\"}},\"dataType\":\"json\",\"replaceData\":false},\"columns\":[{\"name\":\"id\",\"label\":\"ID\",\"type\":\"text\"},{\"name\":\"engine\",\"label\":\"渲染引擎\",\"type\":\"text\"}],\"bulkActions\":[],\"itemActions\":[]}",
      "headers": {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      "transformRequest": [
        undefined
      ],
      "transformResponse": [
        undefined
      ],
      "timeout": 0,
      "withCredentials": true,
      "adapter": undefined,
      "xsrfCookieName": "XSRF-TOKEN",
      "xsrfHeaderName": "X-XSRF-TOKEN",
      "maxContentLength": -1,
      "maxBodyLength": -1,
      "validateStatus": undefined
    },
    "request": {
    },
    "response": {
      "data": "",
      "status": 404,
      "statusText": "Not Found",
      "headers": {
        "access-control-allow-origin": "*",
        "connection": "keep-alive",
        "content-length": "0",
        "date": "Thu, 17 Feb 2022 11:13:26 GMT",
        "keep-alive": "timeout=5"
      },
      "config": {
        "url": "[object Object]",
        "method": "post",
        "data": "{\"type\":\"crud\",\"api\":{\"method\":\"post\",\"url\":\"http://localhost:2919/api/graphql\",\"data\":{\"\":{\"variables\":{\"from\":0,\"skip\":10},\"query\":\"query MyQuery($params:String) {\\n              crmCustomers(parameters:$params) {\\n                items \\n                 {\\n  contentItemId \\n  contentItemVersionId \\n  contentType \\n  displayText \\n  latest \\n  published \\n  modifiedUtc \\n  publishedUtc \\n  createdUtc \\n  owner \\n  author \\n  name \\n  custNum \\n  marketSegment {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  source {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  industry {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  custClass {\\n    contentItems {\\n      contentItemId \\n      displayText \\n    }\\n  }\\n  salesOwner {\\n    userIds \\n    userProfiles {\\n      displayText \\n    }\\n  }\\n  address {\\n    countryName \\n    province \\n    city \\n    postalCode \\n    details \\n    name \\n  }\\n}                \\n                total\\n              }\\n            }\"}},\"dataType\":\"json\",\"replaceData\":false},\"columns\":[{\"name\":\"id\",\"label\":\"ID\",\"type\":\"text\"},{\"name\":\"engine\",\"label\":\"渲染引擎\",\"type\":\"text\"}],\"bulkActions\":[],\"itemActions\":[]}",
        "headers": {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        "transformRequest": [
          undefined
        ],
        "transformResponse": [
          undefined
        ],
        "timeout": 0,
        "withCredentials": true,
        "adapter": undefined,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "validateStatus": undefined
      },
      "request": {
      }
    },
    "isAxiosError": true,
    "toJSON": undefined
  },
  "features": [
    "create",
    "filter",
    "bulkDelete",
    "bulkUpdate",
    "update",
    "view",
    "delete"
  ],
  "headerToolbar": [
    {
      "label": "新增",
      "type": "button",
      "actionType": "dialog",
      "level": "primary",
      "dialog": {
        "title": "新增",
        "body": {
          "type": "form",
          "api": "POST:[object Object]",
          "body": [
            {
              "type": "input-text",
              "name": "contentItemId",
              "label": "ID"
            },
            {
              "type": "input-text",
              "name": "displayText",
              "label": "标题"
            },
            {
              "type": "input-date",
              "name": "createdUtc",
              "label": "创建时间"
            },
            {
              "type": "input-text",
              "name": "industry.contentitems[0].displayText",
              "label": "行业"
            }
          ]
        }
      }
    },
    "bulkActions",
    "pagination"
  ],
  "perPageAvailable": [
    10
  ],
  "messages": {
  },
  "primaryField": "contentItemId",
  "filter": {
    "title": "查询条件",
    "body": [
      {
        "type": "input-text",
        "name": "keywords",
        "label": "关键字"
      }
    ]
  },
  "mode": "table",
  "columns": [
    {
      "name": "contentItemId",
      "label": "ID",
      "type": "text"
    },
    {
      "name": "displayText",
      "label": "标题",
      "type": "text"
    },
    {
      "type": "date",
      "label": "创建时间",
      "buttons": [
        {
          "label": "编辑",
          "type": "button",
          "actionType": "dialog",
          "level": "link",
          "dialog": {
            "title": "编辑",
            "body": {
              "type": "form",
              "api": "xxx/update",
              "body": [
                {
                  "name": "contentItemId",
                  "label": "ID",
                  "type": "input-text"
                },
                {
                  "name": "displayText",
                  "label": "标题",
                  "type": "input-text"
                }
              ]
            }
          }
        },
        {
          "label": "查看",
          "type": "button",
          "actionType": "dialog",
          "level": "link",
          "dialog": {
            "title": "查看详情",
            "body": {
              "type": "form",
              "api": "xxx/update",
              "body": [
                {
                  "name": "contentItemId",
                  "label": "ID",
                  "type": "static"
                },
                {
                  "name": "displayText",
                  "label": "标题",
                  "type": "static"
                }
              ]
            }
          }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "ajax",
          "level": "link",
          "className": "text-danger",
          "confirmText": "确定要删除？",
          "api": "POST:[object Object]"
        }
      ],
      "name": "createdUtc"
    },
    {
      "type": "text",
      "label": "行业",
      "buttons": [
        {
          "label": "编辑",
          "type": "button",
          "actionType": "dialog",
          "level": "link",
          "dialog": {
            "title": "编辑",
            "body": {
              "type": "form",
              "api": "xxx/update",
              "body": [
                {
                  "name": "contentItemId",
                  "label": "ID",
                  "type": "input-text"
                },
                {
                  "name": "displayText",
                  "label": "标题",
                  "type": "input-text"
                },
                {
                  "label": "创建时间",
                  "buttons": [
                    {
                      "label": "编辑",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "编辑",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "input-text"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "input-text"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "label": "查看",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "static"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "static"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "删除",
                      "actionType": "ajax",
                      "level": "link",
                      "className": "text-danger",
                      "confirmText": "确定要删除？",
                      "api": "POST:[object Object]"
                    }
                  ],
                  "name": "createdUtc",
                  "type": "input-date"
                }
              ]
            }
          }
        },
        {
          "label": "查看",
          "type": "button",
          "actionType": "dialog",
          "level": "link",
          "dialog": {
            "title": "查看详情",
            "body": {
              "type": "form",
              "api": "xxx/update",
              "body": [
                {
                  "name": "contentItemId",
                  "label": "ID",
                  "type": "static"
                },
                {
                  "name": "displayText",
                  "label": "标题",
                  "type": "static"
                },
                {
                  "label": "创建时间",
                  "buttons": [
                    {
                      "label": "编辑",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "编辑",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "input-text"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "input-text"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "label": "查看",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "static"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "static"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "删除",
                      "actionType": "ajax",
                      "level": "link",
                      "className": "text-danger",
                      "confirmText": "确定要删除？",
                      "api": "POST:[object Object]"
                    }
                  ],
                  "name": "createdUtc",
                  "type": "static"
                }
              ]
            }
          }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "ajax",
          "level": "link",
          "className": "text-danger",
          "confirmText": "确定要删除？",
          "api": "POST:[object Object]"
        }
      ],
      "name": "industry.contentitems[0].displayText"
    },
    {
      "type": "operation",
      "label": "操作",
      "buttons": [
        {
          "label": "编辑",
          "type": "button",
          "actionType": "dialog",
          "level": "link",
          "dialog": {
            "title": "编辑",
            "body": {
              "type": "form",
              "api": "xxx/update",
              "body": [
                {
                  "name": "contentItemId",
                  "label": "ID",
                  "type": "input-text"
                },
                {
                  "name": "displayText",
                  "label": "标题",
                  "type": "input-text"
                },
                {
                  "label": "创建时间",
                  "buttons": [
                    {
                      "label": "编辑",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "编辑",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "input-text"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "input-text"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "label": "查看",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "static"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "static"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "删除",
                      "actionType": "ajax",
                      "level": "link",
                      "className": "text-danger",
                      "confirmText": "确定要删除？",
                      "api": "POST:[object Object]"
                    }
                  ],
                  "name": "createdUtc",
                  "type": "input-date"
                },
                {
                  "label": "行业",
                  "buttons": [
                    {
                      "label": "编辑",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "编辑",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "input-text"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "input-text"
                            },
                            {
                              "label": "创建时间",
                              "buttons": [
                                {
                                  "label": "编辑",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "编辑",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "input-text"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "input-text"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "label": "查看",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "查看详情",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "static"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "static"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "type": "button",
                                  "label": "删除",
                                  "actionType": "ajax",
                                  "level": "link",
                                  "className": "text-danger",
                                  "confirmText": "确定要删除？",
                                  "api": "POST:[object Object]"
                                }
                              ],
                              "name": "createdUtc",
                              "type": "input-date"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "label": "查看",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "static"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "static"
                            },
                            {
                              "label": "创建时间",
                              "buttons": [
                                {
                                  "label": "编辑",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "编辑",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "input-text"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "input-text"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "label": "查看",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "查看详情",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "static"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "static"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "type": "button",
                                  "label": "删除",
                                  "actionType": "ajax",
                                  "level": "link",
                                  "className": "text-danger",
                                  "confirmText": "确定要删除？",
                                  "api": "POST:[object Object]"
                                }
                              ],
                              "name": "createdUtc",
                              "type": "static"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "删除",
                      "actionType": "ajax",
                      "level": "link",
                      "className": "text-danger",
                      "confirmText": "确定要删除？",
                      "api": "POST:[object Object]"
                    }
                  ],
                  "name": "industry.contentitems[0].displayText",
                  "type": "input-text"
                }
              ]
            }
          }
        },
        {
          "label": "查看",
          "type": "button",
          "actionType": "dialog",
          "level": "link",
          "dialog": {
            "title": "查看详情",
            "body": {
              "type": "form",
              "api": "xxx/update",
              "body": [
                {
                  "name": "contentItemId",
                  "label": "ID",
                  "type": "static"
                },
                {
                  "name": "displayText",
                  "label": "标题",
                  "type": "static"
                },
                {
                  "label": "创建时间",
                  "buttons": [
                    {
                      "label": "编辑",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "编辑",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "input-text"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "input-text"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "label": "查看",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "static"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "static"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "删除",
                      "actionType": "ajax",
                      "level": "link",
                      "className": "text-danger",
                      "confirmText": "确定要删除？",
                      "api": "POST:[object Object]"
                    }
                  ],
                  "name": "createdUtc",
                  "type": "static"
                },
                {
                  "label": "行业",
                  "buttons": [
                    {
                      "label": "编辑",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "编辑",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "input-text"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "input-text"
                            },
                            {
                              "label": "创建时间",
                              "buttons": [
                                {
                                  "label": "编辑",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "编辑",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "input-text"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "input-text"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "label": "查看",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "查看详情",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "static"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "static"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "type": "button",
                                  "label": "删除",
                                  "actionType": "ajax",
                                  "level": "link",
                                  "className": "text-danger",
                                  "confirmText": "确定要删除？",
                                  "api": "POST:[object Object]"
                                }
                              ],
                              "name": "createdUtc",
                              "type": "input-date"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "label": "查看",
                      "type": "button",
                      "actionType": "dialog",
                      "level": "link",
                      "dialog": {
                        "title": "查看详情",
                        "body": {
                          "type": "form",
                          "api": "xxx/update",
                          "body": [
                            {
                              "name": "contentItemId",
                              "label": "ID",
                              "type": "static"
                            },
                            {
                              "name": "displayText",
                              "label": "标题",
                              "type": "static"
                            },
                            {
                              "label": "创建时间",
                              "buttons": [
                                {
                                  "label": "编辑",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "编辑",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "input-text"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "input-text"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "label": "查看",
                                  "type": "button",
                                  "actionType": "dialog",
                                  "level": "link",
                                  "dialog": {
                                    "title": "查看详情",
                                    "body": {
                                      "type": "form",
                                      "api": "xxx/update",
                                      "body": [
                                        {
                                          "name": "contentItemId",
                                          "label": "ID",
                                          "type": "static"
                                        },
                                        {
                                          "name": "displayText",
                                          "label": "标题",
                                          "type": "static"
                                        }
                                      ]
                                    }
                                  }
                                },
                                {
                                  "type": "button",
                                  "label": "删除",
                                  "actionType": "ajax",
                                  "level": "link",
                                  "className": "text-danger",
                                  "confirmText": "确定要删除？",
                                  "api": "POST:[object Object]"
                                }
                              ],
                              "name": "createdUtc",
                              "type": "static"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "删除",
                      "actionType": "ajax",
                      "level": "link",
                      "className": "text-danger",
                      "confirmText": "确定要删除？",
                      "api": "POST:[object Object]"
                    }
                  ],
                  "name": "industry.contentitems[0].displayText",
                  "type": "static"
                }
              ]
            }
          }
        },
        {
          "type": "button",
          "label": "删除",
          "actionType": "ajax",
          "level": "link",
          "className": "text-danger",
          "confirmText": "确定要删除？",
          "api": "POST:[object Object]"
        }
      ]
    }
  ],
  "combineNum": 0
}`)
// const editor = ref<any>(null)
const amisjson = computed(() => {
  return parser.parse(editorJson.value)
})
// function editorDidMount(loadedEditor) {
//   editor.value = loadedEditor
//   // try {
//   //   editor.value.setValue(editorJson.value)
//   // } catch (error) {}
// }
function editorChange() {
  // editorJson.value = value
  amisScoped.value.updateProps(amisjson.value)
}
const amisScoped = ref<any>(null)
function amisMounted(amisScope) {
  amisScoped.value = amisScope
}
</script>
