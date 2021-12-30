// eslint-disable
interface ocAutoComplete {
  //C:\EDR\Work\OrchardCore\src\OrchardCore.Modules\OrchardCore.Workflows\Scripting\WorkflowMethodsProvider.cs
  //WorkflowMethodsProvider
  workflow(): object; //workflowContext
  /**
   * @returns 返回工作流Id
   */
  workflowId(): string;

  input(str: string): object;
  property(str: string): object;

  output(name: string, value: string): void;
  setProperty(name: string, value: string): void;
  lastResult(): object;
  correlationId(): string;
}
