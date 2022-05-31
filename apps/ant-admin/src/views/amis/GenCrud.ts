
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
    const tempGraphqlStr = " { data:contentItems( contentType: " + typeName + " page: ${api.body.page}  pageSize: ${api.body.perPage} orderBy: {field: \"${api.body.orderBy?api.body.orderBy:''}\", direction: ${api.body.orderDir?api.body.orderDir.toUpperCase():'DESC' } } dynamicFilter: ${amisExt.convertCondition(api.body.conditions)} ) {  total items { ... on  " + typeName + buildGraphqlFields(fields as any) + "}}}";

    // const tempGraphqlStr = ` {
    //     items: ${typeName[0].toLowerCase()+ typeName.slice(1)} ${buildGraphqlFields(fields as any)}
    //   }`
    // console.log('tempGraphqlStr: ', tempGraphqlStr);



    const requestAdaptor = "\r\nconsole.log(\"api.发送适配器\",api)\r\n console.log(\"哈哈哈哈\", amisExt.convertCondition(api.body.conditions));\r\nconst filterParams=[`status: ${api.data.status}`]\r\nif(api.data.displayText){\r\n     filterParams.push(`where: {displayText_contains: \"${api.data.displayText}\"}`)\r\n}\r\nif(api.data.orderBy){\r\n    filterParams.push(`orderBy:{${api.body.orderBy}:${api.body.orderDir.toUpperCase()}}`)\r\n}\r\nconsole.log(\"filterParams.join(',')\",filterParams.join(','))\r\nconst  query=`\r\n "
        + tempGraphqlStr + "` \r\napi.data={query}\r\nconsole.log(\"api.发送适配器2\",api)\r\nreturn api"
    // console.log('requestAdaptor: ', requestAdaptor);


    const filterFields: any = []


    crud.body[0].columns = genColumns(fields, filterFields);
    crud.body[0].api.requestAdaptor = requestAdaptor
    //@ts-ignore
    crud.body[0].headerToolbar[1].dialog.body[0].body = genFormItems(fields);

    const condition = crud.body[0].filter.body.find(o => o.name == "conditions") as any
    if (condition) {
        condition.fields = filterFields;
    }

    console.log('crud: ', crud);
    return JSON.stringify(crud, null, 2);
}

const ColExceptFields = ["GeoPointField", "MediaField"];
function genColumns(fields: ContentFieldsMappingDto[], filterFields: any[]) {
    const viewDetailsBodyFields: any = [];
    const editFormBodyColumns: any = [];

    const defaultSchema: any = [
        {
            "type": "operation",
            "label": "操作111",
            "buttons": [
                {
                    "type": "button",
                    "label": "查看",
                    "actionType": "dialog",
                    "level": "link",
                    "dialog": {
                        "title": "查看详情",
                        "body": [
                            {
                                "type": "property",
                                "className": "b-b m-b",
                                "labelStyle": {
                                    "textAlign": "right"
                                },
                                "contentStyle": {
                                    "textAlign": "left"
                                },
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
                                ]
                            },
                            {
                                "type": "property",
                                "labelStyle": {
                                    "textAlign": "right"
                                },
                                "contentStyle": {
                                    "textAlign": "left"
                                },
                                "items": viewDetailsBodyFields
                            }
                        ],
                        "type": "dialog",
                        "closeOnEsc": false,
                        "closeOnOutside": true,
                        "showCloseButton": true,
                        "size": "md",
                        "data": null,
                        "actions": [
                        ]
                    }
                },
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
                                "labelStyle": {
                                    "textAlign": "right"
                                },
                                "contentStyle": {
                                    "textAlign": "left"
                                },
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
                                "body": editFormBodyColumns,
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
                                "actions": [],
                                "debug": false
                            }
                        ],
                        "closeOnEsc": false,
                        "closeOnOutside": false,
                        "showCloseButton": true,
                        "size": "md"
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
            "label": "最新版",
            "name": "latest"
        },
        {
            "type": "status",
            "name": "published",
            "label": "发布状态",
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

        if (!ColExceptFields.includes(o.fieldType || '') && o.isSelf) {
            field.sortable = true;
        }


        const seeField: any = {
            content: "${ " + o.graphqlValuePath + " }",
            label: o.displayName,
            span: 1,
            type: "text",
        }

        setColumnType(o, field)
        setViewDetailsField(o, seeField)
        defaultSchema.push(field)
        viewDetailsBodyFields.push(seeField)


        const editItem: any = {
            name: o.graphqlValuePath,
            label: o.displayName,
            description: o.description,
            type: "input-text",
            required: false,
            disabled: false,
            // value: "${ " + o.graphqlValuePath + " }",
        }
        setEditField(o, editItem)
        editFormBodyColumns.push(editItem)

        const filterField = {
            "label": o.displayName,
            "name": o.graphqlValuePath,
            "type": "text"
        }
        setFilterColumnField(o, filterField, filterFields)
        // filterFields.push(filterField)

    })

    // const formItems = genFormItems(fields);
    // formItems.forEach(o => editFormBodyColumns.push(o));
    console.log('editFormBodyColumns: ', editFormBodyColumns);
    return defaultSchema;
}


function setViewDetailsField(fieldDef: ContentFieldsMappingDto, field: any) {
    field.type = "text";
    switch (fieldDef.fieldType) {
        case FieldType.DateTimeField:
            field.content = "${createdUtc | toDate |date:YYYY-MM-DD HH\\:mm\\:ss }"
            break;
        case FieldType.ContentPickerField:
            field.content = "${ " + fieldDef.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstContentItem.displayText') + " }"
            break;
        case FieldType.MediaField:
            field.content = {
                "type": "image",
                "src": "${ " + fieldDef.graphqlValuePath + ".urls[0] }"
            }
            break;
        default:
            break;
    }
}

function setColumnType(fieldDef: ContentFieldsMappingDto, field: any) {
    field.type = "text";
    switch (fieldDef.fieldType) {
        case FieldType.TextField:
            break;
        case FieldType.DateField:
        case FieldType.DateTimeField:
            field.type = "date";
            field.placeholder = "-"
            break;
        case FieldType.TimeField:
            field.type = "text";
            break;
        case FieldType.NumericField:
            field.type = "text";
            break;
        case FieldType.ContentPickerField:
            field.name = fieldDef.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstContentItem.displayText')
            field.sortable = false
            break;
        case FieldType.UserPickerField:
            field.name = fieldDef.graphqlValuePath?.replace('userIds.firstValue', 'firstUserProfiles.displayText')
            field.sortable = false
            break;
        case FieldType.MediaField:
            field.type = "image";
            field.name = fieldDef.graphqlValuePath + ".urls[0]"
            break;
        default:
            field.type = "text";
            break;
    }
}

function setFilterColumnField(fieldDef: ContentFieldsMappingDto, field: any, filterFields: any[]) {
    switch (fieldDef.fieldType) {
        case FieldType.TextField:
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.BooleanField:
            field.type = "boolean";
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.DateField:
        case FieldType.DateTimeField:
            field.type = "date";
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.TimeField:
            field.type = "time";
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.NumericField:
            field.type = "number";
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.ContentPickerField:
            const pickerTypeConfig = fieldDef.fieldSettings?.ContentPickerFieldSettings?.DisplayedContentTypes
            if (pickerTypeConfig && pickerTypeConfig.length > 0) {
                const pickerType = pickerTypeConfig[0];
                console.log('etFilterColumnType pickerTypeConfig: ', JSON.stringify(pickerTypeConfig), JSON.stringify(pickerTypeConfig[0]), JSON.stringify(pickerType));
                //const multiple = fieldDef.fieldSettings?.ContentPickerFieldSettings?.Multiple ?? false
                //field.multiple = multiple
                //field.extractValue = multiple

                field.source = {
                    method: "post",
                    url: "/api/graphql",
                    dataType: "json",
                    replaceData: false,
                    requestAdaptor:
                        `
                            console.log('genFilterOptions 111111111111111111111111')

                            console.log("genFilterOptions body", api.body);
                            const text_containsName = "";

                            const query=\`
                            {
                                options:${camelCase(pickerType)}
                                (status: PUBLISHED, first: 10, 
                                    where: {displayText_contains: \"\${text_containsName}\"}) 
                                {
                                    label:displayText
                                    value:contentItemId
                                }
                            }\`
                            console.log('genFilterOptions 3',query)

                            api.data={query}

                            console.log('genFilterOptions 2',api)
                            return api`,
                }
            }
            field.name = fieldDef.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstContentItem.displayText')
            field.type = "select"
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.UserPickerField:
            field.name = fieldDef.graphqlValuePath?.replace('userIds.firstValue', 'firstUserProfiles.displayText')
            field.type = "select"
            field.operators = genFilterOptions(fieldDef.fieldType)
            filterFields.push(field)
            break;
        case FieldType.MediaField:
        default:
            break;
    }
}


function setEditField(fieldDef: ContentFieldsMappingDto, field: any) {
    switch (fieldDef.fieldType) {
        case FieldType.TextField:
            field.type = "input-text";
            if (fieldDef.fieldSettings?.ContentPartFieldSettings?.Editor == "PredefinedList") {
                field.type = "select"
                if (fieldDef.fieldSettings?.TextFieldPredefinedListEditorSettings?.Options) {
                    field.options =
                        fieldDef.fieldSettings?.TextFieldPredefinedListEditorSettings?.Options.map(x => {
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
            deepMerge(field, {
                type: "select",
                checkAll: false,
                searchable: true,
                name: fieldDef.graphqlValuePath
            })
            const pickerTypeConfig = fieldDef.fieldSettings?.ContentPickerFieldSettings?.DisplayedContentTypes
            if (pickerTypeConfig && pickerTypeConfig.length > 0) {
                const pickerType = pickerTypeConfig[0];
                const multiple = fieldDef.fieldSettings?.ContentPickerFieldSettings?.Multiple ?? false
                field.multiple = multiple
                field.extractValue = multiple

                if (multiple) {
                    field.name = fieldDef.graphqlValuePath?.replace('firstValue', 'contentItemIds')
                } else {
                    field.name = fieldDef.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstValue')
                }
                field.autoComplete = {
                    method: "post",
                    url: "/api/graphql",
                    dataType: "json",
                    replaceData: false,
                    requestAdaptor:
                        `const query=\`
                        {
                            options:${camelCase(pickerType)}
                            (status: PUBLISHED, first: 10, 
                                where: {displayText_contains: \"\${api.body.term}\"}) 
                            {
                                label:displayText
                                value:contentItemId
                            }
                        }\`
                        api.data={query}
                        return api`,
                }
                // field.value = "${ " + fieldDef.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstContentItem.displayText') + " }"
            }
            break;
        case FieldType.UserPickerField:
            field.name = fieldDef.graphqlValuePath?.replace('userIds.firstValue', 'firstUserProfiles.displayText')
            field.type = "select"
            break;
        case FieldType.DateField:
            field.type = "input-date"
            break;
        case FieldType.DateTimeField:
            field.type = "input-datetime";
            break;
        case FieldType.TimeField:
            field.type = "input-time"
            field.timeFormat = "HH:mm:ss"
            field.inputFormat = "HH:mm:ss"
            break;
        case FieldType.BooleanField:
            field.type = "switch"
            break;
        case FieldType.MediaField:
            // field.type = "input-image"
            field.name = fieldDef.graphqlValuePath + ".urls"
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
                    console.log('genFormItems pickerTypeConfig: ', JSON.stringify(pickerTypeConfig), JSON.stringify(pickerTypeConfig[0]), JSON.stringify(pickerType));
                    const multiple = fieldSettings?.ContentPickerFieldSettings?.Multiple ?? false
                    item.multiple = multiple
                    item.extractValue = multiple

                    if (multiple) {
                        item.name = field.graphqlValuePath?.replace('firstValue', 'contentItemIds')
                    } else {
                        item.name = field.graphqlValuePath?.replace('contentItemIds.firstValue', 'firstValue')
                    }
                    item.autoComplete = {
                        method: "post",
                        url: "/api/graphql",
                        dataType: "json",
                        replaceData: false,
                        requestAdaptor:
                            `const query=\`
                            {
                                options:${camelCase(pickerType)}
                                (status: PUBLISHED, first: 10, 
                                    where: {displayText_contains: \"\${api.body.term}\"}) 
                                {
                                    label:displayText
                                    value:contentItemId
                                }
                            }\`
                            api.data={query}
                            return api`,
                    }
                }
                break;
            case FieldType.DateField:
                item.type = "input-date"
                break;
            case FieldType.DateTimeField:
                item.type = "input-datetime";
                break;
            case FieldType.TimeField:
                item.type = "input-time"
                item.timeFormat = "HH:mm:ss"
                break;
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
            const fieldName = camelCase(field.fieldName) ?? ''
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
                        firstValue: false,
                        firstUserProfiles: { displayText: false },
                    }
                    break
                case FieldType.MediaField:
                    tempPart[fieldName] = {
                        urls: false,
                        paths: false,
                    }
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


function genFilterOptions(fieldType: FieldType) {
    const defaultOptions: any = [
        { label: "等于", value: "EQUALS" },
        { label: "不等于", value: "NOT_EQUAL" },
    ]

    // {label:"模糊匹配",value:"CONTAINS"},
    // {label:"匹配开头",value:"STARTS_WITH"},
    // {label:"匹配结尾",value:"ENDS_WITH"},
    // {label:"不匹配",value:"NOT_CONTAINS"},
    // {label:"不开头",value:"NOT_STARTS_WITH"},
    // {label:"大于等于",value:"GREATER_THAN_OR_EQUAL"},
    // {label:"不结尾",value:"NOT_ENDS_WITH"},
    // {label:"大于",value:"GREATER_THAN"},
    // {label:"小于",value:"LESS_THAN"},
    // {label:"小于等于",value:"LESS_THAN_OR_EQUAL"},
    // {label:"范围",value:"RANGE"},
    // {label:"时间范围",value:"DATE_RANGE"},
    // {label:"包含",value:"ANY"},
    // {label:"不包含",value:"NOT_ANY"},
    // {label:"",value:"CUSTOM"},
    switch (fieldType) {
        case FieldType.TextField:
            defaultOptions.push({ label: "模糊匹配", value: "CONTAINS" });
            defaultOptions.push({ label: "不匹配", value: "NOT_CONTAINS" });
            defaultOptions.push({ label: "匹配开头", value: "STARTS_WITH" });
            defaultOptions.push({ label: "匹配结尾", value: "ENDS_WITH" });
            defaultOptions.push({ label: "不开头", value: "NOT_STARTS_WITH" });
            defaultOptions.push({ label: "不结尾", value: "NOT_ENDS_WITH" });
            break;
        case FieldType.NumericField:
            defaultOptions.push({ label: "大于等于", value: "GREATER_THAN_OR_EQUAL" });
            defaultOptions.push({ label: "小于等于", value: "LESS_THAN_OR_EQUAL" });
            defaultOptions.push({ label: "大于", value: "GREATER_THAN" });
            defaultOptions.push({ label: "小于", value: "LESS_THAN" });
            defaultOptions.push("between");
            break;
        case FieldType.DateField:
        case FieldType.DateTimeField:
            defaultOptions.push({ label: "大于等于", value: "GREATER_THAN_OR_EQUAL" });
            defaultOptions.push({ label: "小于等于", value: "LESS_THAN_OR_EQUAL" });
            defaultOptions.push({ label: "大于", value: "GREATER_THAN" });
            defaultOptions.push({ label: "小于", value: "LESS_THAN" });
            defaultOptions.push("between");
            break;
        case FieldType.UserPickerField:
        case FieldType.ContentPickerField:
            defaultOptions.push("select_any_in");
            defaultOptions.push("select_not_any_in");
            break;

    }

    return defaultOptions;
}

// enum FieldType2121 {
//     CONTAINS,
//     STARTS_WITH,
//     ENDS_WITH,
//     NOT_CONTAINS,
//     NOT_STARTS_WITH,
//     NOT_ENDS_WITH,
//     EQUAL,
//     EQUALS,
//     EQ,
//     NOT_EQUAL,
//     GREATER_THAN,
//     GREATER_THAN_OR_EQUAL,
//     LESS_THAN,
//     LESS_THAN_OR_EQUAL,
//     RANGE,
//     DATE_RANGE,
//     ANY,
//     NOT_ANY,
//     CUSTOM
// }