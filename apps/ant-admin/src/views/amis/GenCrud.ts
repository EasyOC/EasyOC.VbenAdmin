import { ContentFieldsMapping } from '@pkg/apis/eoc/contentApi'
import { camelCase } from '@pkg/utils'
import { FieldType, getValuePath } from '@pkg/apis/eoc/contentApi'
import { ContentTypeManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies';
import crud from "./schematpls/crud.json"

export default async function buildCrud(typeName: string) {

  const apiService = new ContentTypeManagementServiceProxy()

  //查询出所有字段
  const fields = await apiService.getFields(typeName);
  console.log('fields: ', fields);
  //根据字段构建查询字段
  const tempGraphqlStr = ` {
    items: ${typeName[0].toLowerCase()+ typeName.slice(1)} ${buildGraphqlFields(fields as any)}
   }`

  

   const requestAdaptor = {requestAdaptor: "\r\nconsole.log(\"api.发送适配器\",api)\r\nconst filterParams=[`status: ${api.data.status}`]\r\nif(api.data.displayText){\r\n     filterParams.push(`where: {displayText_contains: \"${api.data.displayText}\"}`)\r\n}\r\nif(api.data.orderBy){\r\n    filterParams.push(`orderBy:{${api.body.orderBy}:${api.body.orderDir.toUpperCase()}}`)\r\n}\r\nconsole.log(\"filterParams.join(',')\",filterParams.join(','))\r\nconst  query=`\r\n "+
   +tempGraphqlStr + " \r\napi.data={query}\r\nconsole.log(\"api.发送适配器2\",api)\r\nreturn api"}
   console.log('requestAdaptor: ', requestAdaptor);



   const definitions = {requestAdaptor:requestAdaptor};
   crud.definitions = definitions;
   crud.body[0].columns = genColumns(fields);

   return JSON.stringify(crud);
}

function genColumns(fields: any[]) {

  const defaultColumns = [
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
                    "type": "dialog",
                    "title": "编辑",
                    "body": [
                        {
                            "type": "property",
                            "id": "u:1577f3084cdd",
                            "title": "",
                            "items": [
                                {
                                    "label": "编号",
                                    "content": "${contentItemId}",
                                    "span": 1
                                },
                                {
                                    "label": "版本号",
                                    "content": "${contentItemVersionId}",
                                    "span": 1
                                },
                                {
                                    "label": "创建人",
                                    "content": "${author}",
                                    "span": 1
                                },
                                {
                                    "label": "创建时间",
                                    "content": "${createdUtc}",
                                    "span": 1
                                },
                                {
                                    "span": 1,
                                    "label": "修改时间",
                                    "content": "${modifiedUtc}"
                                },
                                {
                                    "span": 1,
                                    "label": "发布时间",
                                    "content": "${publishedUtc}"
                                },
                                {
                                    "span": 1,
                                    "label": "最新版本",
                                    "content": "${latest?\"是\":\"否\"}"
                                }
                            ],
                            "column": 3,
                            "mode": "table",
                            "closeOnEsc": false,
                            "closeOnOutside": false,
                            "showCloseButton": true,
                            "className": "m-b-md"
                        },
                        {
                            "type": "form",
                            "api": {
                                "method": "post",
                                "url": "/api/ContentManagement/PostContent?draft=${isDraft}",
                                "dataType": "json"
                            },
                            "body": [
                                {
                                    "name": "contentType",
                                    "label": "ContentType",
                                    "type": "hidden",
                                    "value": "AmisSchema"
                                },
                                {
                                    "type": "hidden",
                                    "label": "isDraft",
                                    "name": "isDraft"
                                },
                                {
                                    "type": "hidden",
                                    "label": "contentItemId",
                                    "name": "contentItemId"
                                },
                                {
                                    "type": "input-text",
                                    "label": "显示名称",
                                    "name": "displayText",
                                    "required": true
                                },
                                {
                                    "type": "input-text",
                                    "label": "页面名称",
                                    "name": "name",
                                    "id": "u:344a4699b814",
                                    "required": true
                                },
                                {
                                    "type": "switch",
                                    "label": "发布状态",
                                    "name": "published",
                                    "option": "",
                                    "id": "u:079f8569c6bd",
                                    "optionAtLeft": false,
                                    "trueValue": true,
                                    "falseValue": false,
                                    "onText": "已发布",
                                    "offText": "未发布",
                                    "readOnly": true,
                                    "disabled": true
                                },
                                {
                                    "type": "textarea",
                                    "label": "描述",
                                    "name": "description"
                                },
                                {
                                    "type": "textarea",
                                    "label": "JSON Schema",
                                    "name": "schema",
                                    "language": "json",
                                    "minRows": 3,
                                    "maxRows": 20,
                                    "minLength": 5,
                                    "maxLength": "",
                                    "showCounter": true,
                                    "mode": "",
                                    "inline": false
                                },
                                {
                                    "type": "container",
                                    "id": "u:4db12b8df64c",
                                    "style": {
                                        "textAlign": "right"
                                    },
                                    "body": [
                                        {
                                            "type": "button-toolbar",
                                            "buttons": [
                                                {
                                                    "type": "submit",
                                                    "label": "发布",
                                                    "actionType": "submit",
                                                    "dialog": {
                                                        "title": "系统提示",
                                                        "body": "对你点击了"
                                                    },
                                                    "onClick": "props.formStore.setValues({ isDraft: false});\r\n",
                                                    "level": "primary"
                                                },
                                                {
                                                    "type": "submit",
                                                    "label": "草稿",
                                                    "actionType": "submit",
                                                    "dialog": {
                                                        "title": "系统提示",
                                                        "body": "对你点击了"
                                                    },
                                                    "onClick": "props.formStore.setValues({ isDraft: true});\r\n"
                                                }
                                            ],
                                            "id": "u:f4244cf1ad06"
                                        }
                                    ]
                                }
                            ],
                            "initApi": {
                                "method": "get",
                                "url": "/api/graphql?query={  contentItem:contentItemByVersion(contentItemVersionId: \"${contentItemVersionId}\") {     ... on AmisSchema {      createdUtc       description       displayText     schema       contentItemId    name   contentType       latest owner published       contentItemVersionId     }   } }",
                                "data": null,
                                "dataType": "json",
                                "replaceData": true,
                                "onPreRequest": "",
                                "responseData": null,
                                "adaptor": "console.log(response,'responseresponseresponse') \n return {data:response.data.contentItem}",
                                "sendOn": "!!this.contentItemId"
                            },
                            "name": "EditForm",
                            "debug": false
                        }
                    ],
                    "closeOnEsc": true,
                    "closeOnOutside": false,
                    "showCloseButton": true,
                    "size": "md",
                    "actions": [],
                    "data": null
                },
                "onClick": "\r\n\r\nconsole.log(props,'Editing')"
            },
            {
                "label": "设计器",
                "type": "button",
                "actionType": "url",
                "level": "link",
                "url": "/index.html#/edit/${contentItemVersionId}",
                "onClick": "//window.open(`/amis-editor-renderer/index.html#/edit/${props.data.contentItemVersionId}`)",
                "disabledOn": "!this.latest",
                "blank": true,
                "id": "btnOpenDesign"
            },
            {
                "type": "button",
                "label": "删除",
                "actionType": "ajax",
                "level": "link",
                "className": "text-danger",
                "confirmText": "确定要删除？",
                "api": {
                    "method": "delete",
                    "url": "/api/content/${contentItemId}"
                },
                "onClick": "console.log(props)",
                "disabledOn": "!this.latest"
            }
        ]
    },
    {
        "name": "displayText",
        "label": "显示名称",
        "placeholder": "-",
        "sortable": true,
        "popOver": false,
        "quickEdit": false,
        "inline": true,
        "type": "operation",
        "copyable": false,
        "buttons": [
            {
                "type": "button",
                "label": "${displayText}",
                "actionType": "url",
                "id": "u:ae7c76370ed4",
                "placeholder": "-",
                "level": "link",
                "url": "/pages/preview/${contentItemId}",
                "blank": false
            }
        ]
    },
    {
        "type": "text",
        "label": "页面名称",
        "name": "name"
    },
    {
        "type": "status",
        "label": "latest",
        "name": "latest"
    },
    {
        "type": "status",
        "name": "published",
        "label": "published",
        "placeholder": "-"
    },
    {
        "type": "date",
        "label": "发布时间",
        "name": "publishedUtc",
        "placeholder": "-",
        "sortable": true
    },
    {
        "type": "date",
        "label": "修改时间",
        "name": "modifiedUtc",
        "placeholder": "-",
        "sortable": true
    },
    {
        "name": "createdUtc",
        "label": "创建时间",
        "type": "date",
        "placeholder": "-",
        "sortable": true
    },
    {
        "type": "text",
        "name": "author",
        "label": "创建人",
        "placeholder": "-",
        "sortable": true
    }
  ]


  fields.filter(o=>!defaultColumns.some(d=>d.name&&d.name.toLowerCase().includes(o.fieldNameCamelCase.toLowerCase()))).forEach(o=>{
    const fieldType = o.type;
    const field:any = {
      name: o.fieldNameCamelCase,
      label: o.displayName,
      type: getValuePath(FieldType[fieldType])
    }
    defaultColumns.push(field)
  })
  return defaultColumns;
}


export function buildGraphqlFields(fields: ContentFieldsMapping[]) {
  const gfields: { [key: string]: any } = {}
  fields
    // .filter((x) => !GraphQLNotSupportFields.includes(x.fieldType))
    .forEach((field) => {
      // console.log('field: ', field);
      const fieldName = camelCase(field.fieldName)
      // console.log('fieldName: ', fieldName);
      // const formValue = getFieldsValue()
      const isPart = false
      // if (field.partName) {
      //   isPart = ![formValue.TargetContentType, 'TitlePart'].includes(
      //     field.partName,
      //   )
      // }

      let tempPart = gfields
      if (isPart) {
        if (!gfields[camelCase(field.partName)]) {
          gfields[camelCase(field.partName)] = {}
        }
        tempPart = gfields[camelCase(field.partName)]
      }

      switch (field.fieldType) {
        case FieldType.ContentPickerField:
          tempPart[fieldName] = {
            firstValue: false,
            firstContentItem: {
              displayText: false,
            },
          }
          break
        case FieldType.UserPickerField:
          tempPart[fieldName] = {
            userIds: false,
            firstValue: false,
            userProfiles: { displayText: false },
          }
          break
        case FieldType.HtmlField:
          break
        default:
          tempPart[fieldName] = false
      }
    })
  // console.log('stringify', JSON.stringify(gfields, null, 2))
  // console.log('gfields: ', gfields);
  const tempGraphqlStr = JSON.stringify(gfields, null, 2).replace(
    /false|'|"|:|,/g,
    '',
  )
  return tempGraphqlStr
}