import type { FieldMapToTime, FormSchema } from './types/form'
import type { CSSProperties, PropType } from 'vue'
import type { ColEx } from './types'
import type { TableActionType } from '@/components/Table'
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'
import type { RowProps } from 'ant-design-vue/lib/grid/Row'
import { ContentItemUpperCase } from '@service/eoc/contentApi'

export const basicProps = {
  model: {
    type: ContentItemUpperCase as PropType<ContentItemUpperCase>,
    default: {},
  },
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
