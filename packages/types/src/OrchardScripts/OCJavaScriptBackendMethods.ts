// eslint-disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface OCJavaScriptBackendMethods {
  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Scripting\WorkflowMethodsProvider.cs
  //WorkflowMethodsProvider
  workflow(): object //workflowContext
  /**
   * @returns 返回工作流Id
   */
  workflowId(): string

  input(str: string): object
  property(str: string): object

  output(name: string, value: string): void
  setProperty(name: string, value: string): void
  lastResult(): object
  correlationId(): string

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Contents\Scripting\ContentMethodsProvider.cs
  //ContentMethodsProvider
  /**
   *
   * @returns IContent
   */
  newContentItem(contentType: string): object //IContent;
  /**
   *
   * @returns IContent
   */
  createContentItem(
    contentType: string,
    publish: boolean,
    properties: object,
  ): object //IContent;
  updateContentItem(contentItem: object, properties: object): void //contentItem: ContentItem
  deleteContentItem(contentItem: object, properties: object): void //contentItem: ContentItem

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Contents\Scripting\UrlMethodsProvider.cs
  //UrlMethodsProvider
  getUrlPrefix(path: string): string

  //OrchardCore\src\OrchardCore\OrchardCore.Infrastructure\Entities\Scripting\IdGeneratorMethod.cs
  //IdGeneratorMethod
  uuid(): string

  //OrchardCore\src\OrchardCore\OrchardCore.Infrastructure\Scripting\CommonGeneratorMethods.cs
  //CommonGeneratorMethods
  base64(encoded: string): string
  html(encoded: string): string
  gzip(encoded: string): string

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Layers\Services\DefaultLayersMethodProvider.cs
  //DefaultLayersMethodProvider
  isHomepage(): boolean
  isAnonymous(): boolean
  isAuthenticated(): boolean
  isInRole(role: string): boolean
  url(url: string): boolean
  culture(culture: string): boolean

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Queries\QueryGlobalMethodProvider.cs
  //QueryGlobalMethodProvider
  executeQuery(name: string, parameters: object): object

  //OrchardCore\src\OrchardCore\OrchardCore.Recipes.Core\ConfigurationMethodProvider.cs
  //ConfigurationMethodProvider
  configuration(key: string, defaultValue: object): object

  //OrchardCore\src\OrchardCore\OrchardCore.Recipes.Core\ParametersMethodProvider.cs
  //ParametersMethodProvider
  parameters(name: string): object

  //OrchardCore\src\OrchardCore\OrchardCore.Recipes.Core\VariablesMethodProvider.cs
  //VariablesMethodProvider
  variables(name: string): object

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Scripting\Providers\LogProvider.cs
  //LogProvider
  log(level: string, text: string, param: object): void

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Http\Scripting\HttpMethodsProvider.cs
  //HttpMethodsProvider
  httpContext(): object //HttpContext
  queryString(name: string): object
  responseWrite(text: string): void
  absoluteUrl(relativePath: string): string
  readBody(): string
  requestForm(field: string): object
  queryStringAsJson(): object //Delegate//serviceProvider: IServiceProvider
  requestFormAsJson(): object //Delegate//serviceProvider: IServiceProvider
  /**
   * 序列化 Body , FormData 或 QueryString 为字典
   * @returns Dictionary<string, object>
   */
  deserializeRequestData(): object //Dictionary<string, object>;

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Http\Scripting\SignalMethodProvider.cs
  //SignalMethodProvider
  signalUrl(signal: string): string
  //TokenMethodProvider
  createWorkflowToken(
    workflowTypeId: string,
    activityId: string,
    days: number,
  ): string

  //OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Scripting\OutcomeMethodProvider.cs
  //OutcomeMethodProvider
  setOutcome(name: string): void
}
