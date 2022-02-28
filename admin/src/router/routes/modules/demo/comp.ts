import { getParentLayout, LAYOUT } from '@/router/constant'
import { t } from '@admin/locale'

const comp: RouteRecordItem = {
  path: '/comp',
  name: 'Comp',
  component: LAYOUT,
  redirect: '/comp/basic',
  meta: {
    orderNo: 30,
    icon: 'ion:layers-outline',
    title: t('routes.default.comp.comp'),
  },

  children: [
    {
      path: 'basic',
      name: 'BasicDemo',
      component: () => import('@/views/demo/comp/button/index.vue'),
      meta: {
        title: t('routes.default.comp.basic'),
      },
    },

    {
      path: 'form',
      name: 'FormDemo',
      redirect: '/comp/form/basic',
      component: getParentLayout(),
      meta: {
        // icon: 'mdi:form-select',
        title: t('routes.default.form.form'),
      },
      children: [
        {
          path: 'basic',
          name: 'FormBasicDemo',
          component: () => import('@/views/demo/form/index.vue'),
          meta: {
            title: t('routes.default.form.basic'),
          },
        },
        {
          path: 'useForm',
          name: 'UseFormDemo',
          component: () => import('@/views/demo/form/UseForm.vue'),
          meta: {
            title: t('routes.default.form.useForm'),
          },
        },
        {
          path: 'refForm',
          name: 'RefFormDemo',
          component: () => import('@/views/demo/form/RefForm.vue'),
          meta: {
            title: t('routes.default.form.refForm'),
          },
        },
        {
          path: 'advancedForm',
          name: 'AdvancedFormDemo',
          component: () => import('@/views/demo/form/AdvancedForm.vue'),
          meta: {
            title: t('routes.default.form.advancedForm'),
          },
        },
        {
          path: 'ruleForm',
          name: 'RuleFormDemo',
          component: () => import('@/views/demo/form/RuleForm.vue'),
          meta: {
            title: t('routes.default.form.ruleForm'),
          },
        },
        {
          path: 'dynamicForm',
          name: 'DynamicFormDemo',
          component: () => import('@/views/demo/form/DynamicForm.vue'),
          meta: {
            title: t('routes.default.form.dynamicForm'),
          },
        },
        {
          path: 'customerForm',
          name: 'CustomerFormDemo',
          component: () => import('@/views/demo/form/CustomerForm.vue'),
          meta: {
            title: t('routes.default.form.customerForm'),
          },
        },
        {
          path: 'appendForm',
          name: 'appendFormDemo',
          component: () => import('@/views/demo/form/AppendForm.vue'),
          meta: {
            title: t('routes.default.form.appendForm'),
          },
        },
      ],
    },
    {
      path: 'table',
      name: 'TableDemo',
      redirect: '/comp/table/basic',
      component: getParentLayout(),
      meta: {
        // icon: 'carbon:table-split',
        title: t('routes.default.table.table'),
      },

      children: [
        {
          path: 'basic',
          name: 'TableBasicDemo',
          component: () => import('@/views/demo/table/Basic.vue'),
          meta: {
            title: t('routes.default.table.basic'),
          },
        },
        {
          path: 'treeTable',
          name: 'TreeTableDemo',
          component: () => import('@/views/demo/table/TreeTable.vue'),
          meta: {
            title: t('routes.default.table.treeTable'),
          },
        },
        {
          path: 'fetchTable',
          name: 'FetchTableDemo',
          component: () => import('@/views/demo/table/FetchTable.vue'),
          meta: {
            title: t('routes.default.table.fetchTable'),
          },
        },
        {
          path: 'fixedColumn',
          name: 'FixedColumnDemo',
          component: () => import('@/views/demo/table/FixedColumn.vue'),
          meta: {
            title: t('routes.default.table.fixedColumn'),
          },
        },
        {
          path: 'customerCell',
          name: 'CustomerCellDemo',
          component: () => import('@/views/demo/table/CustomerCell.vue'),
          meta: {
            title: t('routes.default.table.customerCell'),
          },
        },
        {
          path: 'formTable',
          name: 'FormTableDemo',
          component: () => import('@/views/demo/table/FormTable.vue'),
          meta: {
            title: t('routes.default.table.formTable'),
          },
        },
        {
          path: 'useTable',
          name: 'UseTableDemo',
          component: () => import('@/views/demo/table/UseTable.vue'),
          meta: {
            title: t('routes.default.table.useTable'),
          },
        },
        {
          path: 'refTable',
          name: 'RefTableDemo',
          component: () => import('@/views/demo/table/RefTable.vue'),
          meta: {
            title: t('routes.default.table.refTable'),
          },
        },
        {
          path: 'multipleHeader',
          name: 'MultipleHeaderDemo',
          component: () => import('@/views/demo/table/MultipleHeader.vue'),
          meta: {
            title: t('routes.default.table.multipleHeader'),
          },
        },
        {
          path: 'mergeHeader',
          name: 'MergeHeaderDemo',
          component: () => import('@/views/demo/table/MergeHeader.vue'),
          meta: {
            title: t('routes.default.table.mergeHeader'),
          },
        },
        {
          path: 'expandTable',
          name: 'ExpandTableDemo',
          component: () => import('@/views/demo/table/ExpandTable.vue'),
          meta: {
            title: t('routes.default.table.expandTable'),
          },
        },
        {
          path: 'fixedHeight',
          name: 'FixedHeightDemo',
          component: () => import('@/views/demo/table/FixedHeight.vue'),
          meta: {
            title: t('routes.default.table.fixedHeight'),
          },
        },
        {
          path: 'footerTable',
          name: 'FooterTableDemo',
          component: () => import('@/views/demo/table/FooterTable.vue'),
          meta: {
            title: t('routes.default.table.footerTable'),
          },
        },
        {
          path: 'editCellTable',
          name: 'EditCellTableDemo',
          component: () => import('@/views/demo/table/EditCellTable.vue'),
          meta: {
            title: t('routes.default.table.editCellTable'),
          },
        },
        {
          path: 'editRowTable',
          name: 'EditRowTableDemo',
          component: () => import('@/views/demo/table/EditRowTable.vue'),
          meta: {
            title: t('routes.default.table.editRowTable'),
          },
        },
        {
          path: 'authColumn',
          name: 'AuthColumnDemo',
          component: () => import('@/views/demo/table/AuthColumn.vue'),
          meta: {
            title: t('routes.default.table.authColumn'),
          },
        },
        {
          path: 'resizeParentHeightTable',
          name: 'ResizeParentHeightTable',
          component: () =>
            import('@/views/demo/table/ResizeParentHeightTable.vue'),
          meta: {
            title: t('routes.default.table.resizeParentHeightTable'),
          },
        },
      ],
    },

    {
      path: 'cropper',
      name: 'CropperDemo',
      component: () => import('@/views/demo/comp/cropper/index.vue'),
      meta: {
        title: t('routes.default.comp.cropperImage'),
      },
    },

    {
      path: 'timestamp',
      name: 'TimeDemo',
      component: () => import('@/views/demo/comp/time/index.vue'),
      meta: {
        title: t('routes.default.comp.time'),
      },
    },
    {
      path: 'countTo',
      name: 'CountTo',
      component: () => import('@/views/demo/comp/count-to/index.vue'),
      meta: {
        title: t('routes.default.comp.countTo'),
      },
    },
    {
      path: 'tree',
      name: 'TreeDemo',
      redirect: '/comp/tree/basic',
      component: getParentLayout(),
      meta: {
        // icon: 'clarity:tree-view-line',
        title: t('routes.default.comp.tree'),
      },
      children: [
        {
          path: 'basic',
          name: 'BasicTreeDemo',
          component: () => import('@/views/demo/tree/index.vue'),
          meta: {
            title: t('routes.default.comp.treeBasic'),
          },
        },
        {
          path: 'editTree',
          name: 'EditTreeDemo',
          component: () => import('@/views/demo/tree/EditTree.vue'),
          meta: {
            title: t('routes.default.comp.editTree'),
          },
        },
        {
          path: 'actionTree',
          name: 'ActionTreeDemo',
          component: () => import('@/views/demo/tree/ActionTree.vue'),
          meta: {
            title: t('routes.default.comp.actionTree'),
          },
        },
      ],
    },
    {
      path: 'editor',
      name: 'EditorDemo',
      redirect: '/comp/editor/markdown',
      component: getParentLayout(),
      meta: {
        // icon: 'carbon:table-split',
        title: t('routes.default.editor.editor'),
      },
      children: [
        {
          path: 'json',
          component: () => import('@/views/demo/editor/json/index.vue'),
          name: 'JsonEditorDemo',
          meta: {
            title: t('routes.default.editor.jsonEditor'),
          },
        },
        {
          path: 'markdown',
          component: getParentLayout(),
          name: 'MarkdownDemo',
          meta: {
            title: t('routes.default.editor.markdown'),
          },
          redirect: '/comp/editor/markdown/index',
          children: [
            {
              path: 'index',
              name: 'MarkDownBasicDemo',
              component: () => import('@/views/demo/editor/markdown/index.vue'),
              meta: {
                title: t('routes.default.editor.tinymceBasic'),
              },
            },
            {
              path: 'editor',
              name: 'MarkDownFormDemo',
              component: () =>
                import('@/views/demo/editor/markdown/Editor.vue'),
              meta: {
                title: t('routes.default.editor.tinymceForm'),
              },
            },
          ],
        },

        {
          path: 'tinymce',
          component: getParentLayout(),
          name: 'TinymceDemo',
          meta: {
            title: t('routes.default.editor.tinymce'),
          },
          redirect: '/comp/editor/tinymce/index',
          children: [
            {
              path: 'index',
              name: 'TinymceBasicDemo',
              component: () => import('@/views/demo/editor/tinymce/index.vue'),
              meta: {
                title: t('routes.default.editor.tinymceBasic'),
              },
            },
            {
              path: 'editor',
              name: 'TinymceFormDemo',
              component: () => import('@/views/demo/editor/tinymce/Editor.vue'),
              meta: {
                title: t('routes.default.editor.tinymceForm'),
              },
            },
          ],
        },
      ],
    },
    {
      path: 'scroll',
      name: 'ScrollDemo',
      redirect: '/comp/scroll/basic',
      component: getParentLayout(),
      meta: {
        title: t('routes.default.comp.scroll'),
      },
      children: [
        {
          path: 'basic',
          name: 'BasicScrollDemo',
          component: () => import('@/views/demo/comp/scroll/index.vue'),
          meta: {
            title: t('routes.default.comp.scrollBasic'),
          },
        },
        {
          path: 'action',
          name: 'ActionScrollDemo',
          component: () => import('@/views/demo/comp/scroll/Action.vue'),
          meta: {
            title: t('routes.default.comp.scrollAction'),
          },
        },
      ],
    },

    {
      path: 'modal',
      name: 'ModalDemo',
      component: () => import('@/views/demo/comp/modal/index.vue'),
      meta: {
        title: t('routes.default.comp.modal'),
      },
    },
    {
      path: 'drawer',
      name: 'DrawerDemo',
      component: () => import('@/views/demo/comp/drawer/index.vue'),
      meta: {
        title: t('routes.default.comp.drawer'),
      },
    },
    {
      path: 'desc',
      name: 'DescDemo',
      component: () => import('@/views/demo/comp/desc/index.vue'),
      meta: {
        title: t('routes.default.comp.desc'),
      },
    },

    //

    {
      path: 'qrcode',
      name: 'QrCodeDemo',
      component: () => import('@/views/demo/comp/qrcode/index.vue'),
      meta: {
        title: t('routes.default.comp.qrcode'),
      },
    },
    {
      path: 'strength-meter',
      name: 'StrengthMeterDemo',
      component: () => import('@/views/demo/comp/strength-meter/index.vue'),
      meta: {
        title: t('routes.default.comp.strength'),
      },
    },
    {
      path: 'upload',
      name: 'UploadDemo',
      component: () => import('@/views/demo/comp/upload/index.vue'),
      meta: {
        title: t('routes.default.comp.upload'),
      },
    },
    {
      path: 'loading',
      name: 'LoadingDemo',
      component: () => import('@/views/demo/comp/loading/index.vue'),
      meta: {
        title: t('routes.default.comp.loading'),
      },
    },
    {
      path: 'cardList',
      name: 'CardListDemo',
      component: () => import('@/views/demo/comp/card-list/index.vue'),
      meta: {
        title: t('routes.default.comp.cardList'),
      },
    },
  ],
}

export default comp
