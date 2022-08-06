# Liquid

## Common

``` Liquid
{{"UserName" | Upper }}  
```
> output : `USERNAME` 


## OrchardCore.Liquid
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Liquid\Startup.cs

`{{"input" | local}}`

`{{"input" | slugify}}`

`{{"input" | liquid}}`

`{{"input" "arguments" "context" | href}}`

`{{"input" "arguments" "context" | absolute_url}}`

`{{"input" | shape_new}}`

`{{"input" | shape_render}}`

`{{"input" | shape_stringify}}`

`{{"input" "arguments" "context" | shortcode}}`

## OrchardCore.Users
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Users\Startup.cs

### users_by_id
 ```Lqiud 
 {% assign userlist = ['userid1','userid2',user.userId] | users_by_id   %}
 ```
`{{"input" | users_by_id}}`

`{{"input" | has_permission}}`

`{{"input" | is_in_role}}`

`{{"input" | user_email}}`

## OrchardCore.ContentLocalization  多语言

### localization_set
根据指定的 语言 比如 zh-CN 获得 该语言下的内容信息

源代码路径：OrchardCore\src\OrchardCore.Modules\OrchardCore.ContentLocalization\Startup.cs

`{{"input" | localization_set}}`  

### switch_culture_url

 `{{"input" "arguments" "context" | switch_culture_url}}`

## OrchardCore.ContentManagement.Display
### console_log
 > OrchardCore\src\OrchardCore\OrchardCore.ContentManagement.Display\ServiceCollectionExtensions.cs 

 ``` {{"test" | console_log}}```

## OrchardCore.Contents
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Contents\Startup.cs
 
`{{"input" "arguments" "context" | display_url}}`

`{{"input" | shape_build_display}}`

`{{"input" | content_item_id}}`

`{{"input" | full_text}}`


## OrchardCore.DisplayManagement
> OrchardCore\src\OrchardCore\OrchardCore.DisplayManagement.Liquid\OrchardCoreBuilderExtensions.cs

`{{"input" | append_version}}`

`{{"input" | resource_url}}`

`{{"input" | sanitize_html}}`


## OrchardCore.Lists
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Lists\Startup.cs
> 
`{{"input" | list_count}}`

`{{"input" | list_items}}`

`{{"input" | container}}`

## OrchardCore.Markdown

> OrchardCore\src\OrchardCore.Modules\OrchardCore.Markdown\Startup.cs

`{{"input" | markdownify}}`

## OrchardCore.Media 
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Media\Startup.cs

`{{"input" "arguments" "context" | asset_url}}`

`{{"input" "arguments" "context" | resize_url}}`


//OrchardCore\src\OrchardCore.Modules\OrchardCore.Queries\Startup.cs
//{{"input" | query}}

## OrchardCore.Taxonomies
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Taxonomies\Startup.cs
> 
`{{"input" | inherited_terms}}`

`{{"input" | taxonomy_terms}}`



## OrchardCore.Workflows
> OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Http\Startup.cs

`{{"input" | signal_url}}`

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

