# Liquid

## Common

``` Liquid
{{"UserName" | Upper }}  
```
> output : `USERNAME` 


## OrchardCore.Liquid
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Liquid\Startup.cs

`{{"input" "arguments" "ctx" | local}}`

`{{"input" "arguments" "ctx" | slugify}}`

`{{"input" "arguments" "ctx" | liquid}}`

`{{"input" "arguments" "context" | href}}`

`{{"input" "arguments" "context" | absolute_url}}`

`{{"input" "arguments" "ctx" | shape_new}}`

`{{"input" "arguments" "ctx" | shape_render}}`

`{{"input" "arguments" "ctx" | shape_stringify}}`

`{{"input" "arguments" "context" | shortcode}}`

## OrchardCore.Users
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Users\Startup.cs

### users_by_id
 ```Lqiud 
 {% assign userlist = ['userid1','userid2',user.userId] | users_by_id   %}
 ```
`{{"input" "arguments" "ctx" | users_by_id}}`

`{{"input" "arguments" "ctx" | has_permission}}`

`{{"input" "arguments" "ctx" | is_in_role}}`

`{{"input" "arguments" "ctx" | user_email}}`

## OrchardCore.ContentLocalization  多语言

### localization_set
根据指定的 语言 比如 zh-CN 获得 该语言下的内容信息

源代码路径：OrchardCore\src\OrchardCore.Modules\OrchardCore.ContentLocalization\Startup.cs

`{{"input" "arguments" "ctx" | localization_set}}`  

### switch_culture_url

 `{{"input" "arguments" "context" | switch_culture_url}}`

## OrchardCore.ContentManagement.Display
### console_log
 > OrchardCore\src\OrchardCore\OrchardCore.ContentManagement.Display\ServiceCollectionExtensions.cs 

 ``` {{"test" | console_log}}```

## OrchardCore.Contents
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Contents\Startup.cs
 
`{{"input" "arguments" "context" | display_url}}`

`{{"input" "arguments" "ctx" | shape_build_display}}`

`{{"input" "arguments" "ctx" | content_item_id}}`

`{{"input" "arguments" "ctx" | full_text}}`


## OrchardCore.DisplayManagement
> OrchardCore\src\OrchardCore\OrchardCore.DisplayManagement.Liquid\OrchardCoreBuilderExtensions.cs

`{{"input" "arguments" "ctx" | append_version}}`

`{{"input" "arguments" "ctx" | resource_url}}`

`{{"input" "arguments" "ctx" | sanitize_html}}`


## OrchardCore.Lists
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Lists\Startup.cs
> 
`{{"input" "arguments" "ctx" | list_count}}`

`{{"input" "arguments" "ctx" | list_items}}`

`{{"input" "arguments" "ctx" | container}}`

## OrchardCore.Markdown

> OrchardCore\src\OrchardCore.Modules\OrchardCore.Markdown\Startup.cs

`{{"input" "arguments" "ctx" | markdownify}}`

## OrchardCore.Media 
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Media\Startup.cs

`{{"input" "arguments" "context" | asset_url}}`

`{{"input" "arguments" "context" | resize_url}}`


//OrchardCore\src\OrchardCore.Modules\OrchardCore.Queries\Startup.cs
//{{"input" "arguments" "ctx" | query}}

## OrchardCore.Taxonomies
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Taxonomies\Startup.cs
> 
`{{"input" "arguments" "ctx" | inherited_terms}}`

`{{"input" "arguments" "ctx" | taxonomy_terms}}`



## OrchardCore.Workflows
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Http\Startup.cs

`{{"input" "arguments" "ctx" | signal_url}}`

``` Liquid
{% var content | 'zh-cn' | localization_set  %}
{{content.ContentItem.UserName.Text  }}
```
> 张三


``` Liquid
{% var enContent | 'en-US' | localization_set  %}
{{enContent.ContentItem.UserName.Text}} 
```
> San Zhang

