import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'
import { TooltipProps } from 'ant-design-vue/es/tooltip/Tooltip'
import { RoleEnum } from '@pkg/tokens'
export interface ActionItem extends ButtonProps {
  onClick?: AnyFunction<any>
  label?: string
  color?: 'success' | 'error' | 'warning'
  icon?: string
  popConfirm?: PopConfirm
  disabled?: boolean
  divider?: boolean
  // 权限编码控制是否显示
  auth?: RoleEnum | RoleEnum[] | string | string[]
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean)
  tooltip?: string | TooltipProps
}

export interface PopConfirm {
  title: string
  okText?: string
  cancelText?: string
  confirm: AnyFunction<any>
  cancel?: AnyFunction<any>
  icon?: string
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight'
}
