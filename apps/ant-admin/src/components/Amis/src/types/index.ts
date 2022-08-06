import { ActionSchema } from "amis/lib/renderers/Action";
import { Api } from "amis/lib/types";

/**
 * 事件跟踪的定义
 */
export interface EventTrack {
  /**
   * 事件类型，目前有以下几种
   *
   * api: 所有 fetcher 前调用
   * url: 打开外部链接，组件有可能是 action 也有可能是 link
   * link: 打开内部链接
   * dialog: action 的弹框
   * drawer: action 的抽出式弹框
   * copy: action 里的复制
   * reload: action 里的 reload
   * email: action 里的 email
   * prev: action 里的 prev
   * next: action 里的 next
   * cancel: action 里的 cancel
   * close: action 里的 close
   * submit: 有可能是 action 里的 submit，也有可能是表单提交
   * confirm: action 里的 confirm
   * add: action 里的 add
   * reset: action 里的 reset
   * reset-and-submit: action 里的 reset-and-submit
   * formItemChange: 表单项内容变化
   * formError: 表单验证失败
   * formSubmit: 表单成功提交，在表单验证成功之后才会触发，这个可能会和 api 重合
   * tabChange: tab 切换
   * netError: api 报错
   */
  eventType: 'api' | 'url' | 'link' | 'dialog' | 'drawer' | 'copy' | 'reload' | 'email' | 'prev' | 'next' | 'cancel' | 'close' | 'submit' | 'confirm' | 'reset' | 'reset-and-submit' | 'formItemChange' | 'tabChange';
  /**
   * 事件数据
   */
  eventData:  { id: string ;[key: string]: any };
}
export type TrackerEventArgs = { tracker: EventTrack; eventProps: { data: any, [key: string]: any } }
