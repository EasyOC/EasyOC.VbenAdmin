<script lang="tsx">
import type { PropType, CSSProperties } from 'vue'
import { computed, defineComponent, unref, toRef } from 'vue'
import { BasicMenu } from '@/components/menu'
import { SimpleMenu } from '@/components/simple-menu'
import { AppLogo } from '@/components/application'
import { MenuModeEnum, MenuSplitTyeEnum } from '@pkg/tokens'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'
import { ScrollContainer } from '@/components/container'
import { useGo } from '@/hooks/web/usePage'
import { useSplitMenu } from './useLayoutMenu'
import { isUrl, openWindow } from '@pkg/utils'
import { useRootSetting } from '@/hooks/setting/useRootSetting'
import { useAppInject } from '@/hooks/web/use-app-inject'
import { useDesign } from '@/hooks/web/useDesign'

export default defineComponent({
  name: 'LayoutMenu',
  props: {
    theme: {
      type: String,
      validator: (v: string) => ['dark', 'light'].includes(v),
    },

    splitType: {
      type: Number as PropType<MenuSplitTyeEnum>,
      default: MenuSplitTyeEnum.NONE,
    },

    isHorizontal: { type: Boolean },
    // menu Mode
    menuMode: {
      type: [String] as PropType<Nullable<MenuModeEnum>>,
      default: '',
    },
  },
  setup(props) {
    const go = useGo()

    const {
      getMenuMode,
      getMenuType,
      getMenuTheme,
      getCollapsed,
      getCollapsedShowTitle,
      getAccordion,
      getIsHorizontal,
      getIsSidebarType,
      getSplit,
    } = useMenuSetting()
    const { getShowLogo } = useRootSetting()

    const { prefixCls } = useDesign('layout-menu')

    const { menusRef } = useSplitMenu(toRef(props, 'splitType'))

    const { getIsMobile } = useAppInject()

    const getComputedMenuMode = computed(() =>
      unref(getIsMobile)
        ? MenuModeEnum.INLINE
        : props.menuMode || unref(getMenuMode),
    )

    const getComputedMenuTheme = computed(
      () => props.theme || unref(getMenuTheme),
    )

    const getIsShowLogo = computed(
      () => unref(getShowLogo) && unref(getIsSidebarType),
    )

    const getUseScroll = computed(() => {
      return (
        !unref(getIsHorizontal) &&
        (unref(getIsSidebarType) ||
          props.splitType === MenuSplitTyeEnum.LEFT ||
          props.splitType === MenuSplitTyeEnum.NONE)
      )
    })

    const getWrapperStyle = computed((): CSSProperties => {
      return {
        height: `calc(100% - ${unref(getIsShowLogo) ? '48px' : '0px'})`,
      }
    })

    const getLogoClass = computed(() => {
      return [
        `${prefixCls}-logo`,
        unref(getComputedMenuTheme),
        {
          [`${prefixCls}--mobile`]: unref(getIsMobile),
        },
      ]
    })

    const getCommonProps = computed(() => {
      const menus = unref(menusRef)
      return {
        menus,
        beforeClickFn: beforeMenuClickFn,
        items: menus,
        theme: unref(getComputedMenuTheme),
        accordion: unref(getAccordion),
        collapse: unref(getCollapsed),
        collapsedShowTitle: unref(getCollapsedShowTitle),
        onMenuClick: handleMenuClick,
      }
    })
    /**
     * click menu
     * @param menu
     */

    function handleMenuClick(path: string) {
      go(path)
    }

    /**
     * before click menu
     * @param menu
     */
    async function beforeMenuClickFn(path: string) {
      if (!isUrl(path)) {
        return true
      }
      openWindow(path)
      return false
    }

    function renderHeader() {
      if (!unref(getIsShowLogo) && !unref(getIsMobile)) return null

      return (
        <AppLogo
          showTitle={!unref(getCollapsed)}
          class={unref(getLogoClass)}
          theme={unref(getComputedMenuTheme)}
        />
      )
    }

    function renderMenu() {
      const { menus, ...menuProps } = unref(getCommonProps)
      // console.log(menus);
      if (!menus || !menus.length) return null
      return !props.isHorizontal ? (
        <SimpleMenu
          {...menuProps}
          isSplitMenu={unref(getSplit)}
          items={menus}
        />
      ) : (
        <BasicMenu
          {...(menuProps as any)}
          isHorizontal={props.isHorizontal}
          type={unref(getMenuType)}
          showLogo={unref(getIsShowLogo)}
          mode={unref(getComputedMenuMode as any)}
          items={menus}
        />
      )
    }

    return () => {
      return (
        <>
          {renderHeader()}
          {unref(getUseScroll) ? (
            <ScrollContainer style={unref(getWrapperStyle)}>
              {() => renderMenu()}
            </ScrollContainer>
          ) : (
            renderMenu()
          )}
        </>
      )
    }
  },
})
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-layout-menu';
@logo-prefix-cls: ~'@{namespace}-app-logo';

.@{prefix-cls} {
  &-logo {
    height: @header-height;
    padding: 10px 4px 10px 10px;

    img {
      width: @logo-width;
      height: @logo-width;
    }
  }

  &--mobile {
    .@{logo-prefix-cls} {
      &__title {
        opacity: 100%;
      }
    }
  }
}
</style>
