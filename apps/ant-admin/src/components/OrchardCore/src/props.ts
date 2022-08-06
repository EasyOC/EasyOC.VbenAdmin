import type { PropType } from 'vue'

export const basicProps = {
  contentItemId: {
    type: String as PropType<string>,
    require: true,
  },
  /**
   * 类型名称
   */
  typeName: {
    type: String as PropType<string>,
    default: '',
  },
}
