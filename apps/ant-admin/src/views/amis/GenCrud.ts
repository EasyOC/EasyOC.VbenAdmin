
import { ContentFieldsMapping } from '@pkg/apis/eoc/contentApi'
import { camelCase, deepMerge } from '@pkg/utils'
import { FieldType } from '@pkg/apis/eoc/contentApi'
import { ContentFieldsMappingDto, ContentTypeManagementServiceProxy } from '@pkg/apis/eoc/app-service-proxies';
import crud from "./schematpls/crud.json"

export default async function buildCrud(typeName: string) {

    const apiService = new ContentTypeManagementServiceProxy()

    //查询出所有字段
    const fields = await apiService.getFields(typeName);
    console.log('fields: ', fields);
    //根据字段构建查询字段
    const tempGraphqlStr = "{items: " + typeName[0].toLowerCase() + typeName.slice(1) + buildGraphqlFields(fields as any) + "}";

    // const tempGraphqlStr = ` {
    //     items: ${typeName[0].toLowerCase()+ typeName.slice(1)} ${buildGraphqlFields(fields as any)}
    //   }`
    console.log('tempGraphqlStr: ', tempGraphqlStr);



    const requestAdaptor = "\r\nconsole.log(\"api.发送适配器\",api)\r\nconst filterParams=[`status: ${api.data.status}`]\r\nif(api.data.displayText){\r\n     filterParams.push(`where: {displayText_contains: \"${api.data.displayText}\"}`)\r\n}\r\nif(api.data.orderBy){\r\n    filterParams.push(`orderBy:{${api.body.orderBy}:${api.body.orderDir.toUpperCase()}}`)\r\n}\r\nconsole.log(\"filterParams.join(',')\",filterParams.join(','))\r\nconst  query=`\r\n "
        + tempGraphqlStr + "` \r\napi.data={query}\r\nconsole.log(\"api.发送适配器2\",api)\r\nreturn api"
    console.log('requestAdaptor: ', requestAdaptor);



    //    const definitions = {requestAdaptor:requestAdaptor};
    //    crud.definitions = definitions;
    crud.body[0].columns = genColumns(fields);
    crud.body[0].api.requestAdaptor = requestAdaptor
    //@ts-ignore
    crud.body[0].headerToolbar[1].dialog.body[0].body = genFormItems(fields);

    console.log('crud: ', crud);
    return JSON.stringify(crud);
}

function genColumns(fields: ContentFieldsMappingDto[]) {

    const defaultColumns: any = [
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
                                        "content": "${createdUtc | toDate |date:YYYY-MM-DD HH\\:mm\\:ss }",
                                        "span": 1
                                    },
                                    {
                                        "span": 1,
                                        "label": "修改时间",
                                        "content": "${modifiedUtc | toDate |date:YYYY-MM-DD HH\\:mm\\:ss } "
                                    },
                                    {
                                        "span": 1,
                                        "label": "发布时间",
                                        "content": "${publishedUtc | toDate |date:YYYY-MM-DD HH\\:mm\\:ss }"
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
            "type": "text",
            "name": "displayText",
            "label": "显示名称",
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


    fields.filter(x => !x.isBasic).forEach(o => {
        const field: any = {
            name: o.graphqlValuePath,
            label: o.displayName,
        }
        setColumnType(o, field)
        defaultColumns.push(field)
    })
    return defaultColumns;
}

function setColumnType(fieldDef: ContentFieldsMappingDto, field: any) {
    field.type = "text";
    switch (fieldDef.fieldType) {
        case FieldType.TextField:
            break;
        case FieldType.DateField:
        case FieldType.DateTimefield:
        case FieldType.TimeField:
            field.type = "date";
            break;
        case FieldType.NumericField:
            field.type = "text";
            break;
        case FieldType.ContentPickerField:
            field.name = fieldDef.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstContentItem.displayText')
        default:
            field.type = "text";
            break;
    }
}


function genFormItems(fields: ContentFieldsMappingDto[]) {

    const formItems: any[] = []
    fields.filter(x => !x.isBasic).forEach(field => {
        const item: any = {
            name: field.graphqlValuePath,
            label: field.displayName,
            description: field.description,
            type: "input-text",
            required: false,
            disabled: false

        }
        const fieldSettings = field.fieldSettings
        switch (field.fieldType) {
            case FieldType.TextField:
                item.type = "input-text";
                if (fieldSettings?.ContentPartFieldSettings?.Editor == "PredefinedList") {
                    item.type = "select"
                    if (fieldSettings?.TextFieldPredefinedListEditorSettings?.Options) {
                        item.options =
                            fieldSettings?.TextFieldPredefinedListEditorSettings?.Options.map(x => {
                                return {
                                    label: x.name,
                                    value: x.value
                                }
                            })
                    }
                }
                break;
            //下拉菜单数据源
            case FieldType.ContentPickerField:
                deepMerge(item, {
                    type: "select",
                    checkAll: false,
                    searchable: true,
                    name: field.graphqlValuePath
                })
                const pickerTypeConfig = fieldSettings?.ContentPickerFieldSettings?.DisplayedContentTypes
                if (pickerTypeConfig && pickerTypeConfig.length > 0) {
                    const pickerType = pickerTypeConfig[0];
                    const multiple = fieldSettings?.ContentPickerFieldSettings?.Multiple ?? false
                    item.multiple = multiple
                    item.extractValue = multiple

                    if (multiple) {
                        item.name = field.graphqlValuePath?.replace('firstValue', 'contentItemIds')
                    }

                    item.autoComplete = {
                        "method": "post",
                        "url": "/api/graphql",
                        "data": null,
                        "dataType": "json",
                        "requestAdaptor": `
                            const query=\`
                            {
                                options:${camelCase(pickerType)}(status: PUBLISHED, first: 10, where: {displayText_contains: \"\${api.body.term}\"}) 
                                {
                                    label:displayText
                                    value:contentItemId
                                }
                            }\`
                            api.data={query}
                            return api`,
                        "replaceData": false
                    }
                }
                break;
            case FieldType.DateField:
                item.type = "input-date"
            case FieldType.BooleanField:
                item.type = "switch"
                break;

        }
        formItems.push(item)
    });
    return formItems
}

export function buildGraphqlFields(fields: ContentFieldsMappingDto[]) {
    const gfields: { [key: string]: any } = {}
    fields
        // .filter((x) => !GraphQLNotSupportFields.includes(x.fieldType))
        .forEach((field) => {
            // console.log('field: ', field);
            const fieldName = camelCase(field.fieldName)
            // console.log('fieldName: ', fieldName);
            // const formValue = getFieldsValue()
            // const isPart = field.is
            // if (field.partName) {
            //   isPart = ![formValue.TargetContentType, 'TitlePart'].includes(
            //     field.partName,
            //   )
            // }

            let tempPart = gfields
            if (!field.isSelf) {
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
                case FieldType.GeoPointField:
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