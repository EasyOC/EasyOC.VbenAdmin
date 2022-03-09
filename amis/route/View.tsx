import React from 'react';
import {observer, inject} from 'mobx-react';
import {IMainStore} from '../store';
import {Button, AsideNav, Layout, confirm} from 'amis';
import {RouteComponentProps, matchPath, Switch, Route} from 'react-router';
import {Link} from 'react-router-dom';
import NotFound from './NotFound';
import AMISRenderer from '../component/AMISRenderer';
import AddPageModal from '../component/AddPageModal';

function isActive(link: any, location: any) {
    const ret = matchPath(location.pathname, {
        path: link ? link.replace(/\?.*$/, '') : '',
        exact: true,
        strict: true
    });

    return !!ret;
}

export default inject('store')(
    observer(function ({store, location, history}: {store: IMainStore} & RouteComponentProps) {
        function renderHeader() {
            return (
                <div>
                    <div className={`a-Layout-headerBar`}>
                        <div className="hidden-xs p-t-sm pull-right">
                            <Button size="sm" className="m-r-xs" onClick={() => alert(111)} level="success">
                                全部导出
                            </Button>
                            <Button size="sm" level="info" onClick={() => store.setAddPageIsOpen(true)}>
                                新增页面
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        function renderAside() {
            const navigations = store.pages.map(item => ({
                label: item.label,
                path: `/${item.path}`,
                icon: item.icon
            }));
            const paths = navigations.map(item => item.path);

            return (
                <AsideNav
                    key={store.asideFolded ? 'folded-aside' : 'aside'}
                    navigations={[
                        {
                            label: '导航',
                            children: navigations
                        }
                    ]}
                    renderLink={({link, toggleExpand, classnames: cx, depth}: any) => {
                        if (link.hidden) {
                            return null;
                        }

                        let children = [];

                        if (link.children) {
                            children.push(
                                <span
                                    key="expand-toggle"
                                    className={cx('AsideNav-itemArrow')}
                                    onClick={e => toggleExpand(link, e)}
                                ></span>
                            );
                        }

                        link.badge &&
                            children.push(
                                <b key="badge" className={cx(`AsideNav-itemBadge`, link.badgeClassName || 'bg-info')}>
                                    {link.badge}
                                </b>
                            );

                        if (link.icon) {
                            children.push(<i key="icon" className={cx(`AsideNav-itemIcon`, link.icon)} />);
                        } else if (store.asideFolded && depth === 1) {
                            children.push(
                                <i
                                    key="icon"
                                    className={cx(`AsideNav-itemIcon`, link.children ? 'fa fa-folder' : 'fa fa-info')}
                                />
                            );
                        }

                        link.active ||
                            children.push(
                                <i
                                    key="delete"
                                    data-tooltip="删除"
                                    data-position="bottom"
                                    className={'navbtn fa fa-times'}
                                    onClick={(e: React.MouseEvent) => {
                                        e.preventDefault();
                                        confirm('确认要删除').then(confirmed => {
                                            confirmed && store.removePageAt(paths.indexOf(link.path));
                                        });
                                    }}
                                />
                            );

                        children.push(
                            <i
                                key="edit"
                                data-tooltip="编辑"
                                data-position="bottom"
                                className={'navbtn fa fa-pencil'}
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    history.push(`/edit/${paths.indexOf(link.path)}`);
                                }}
                            />
                        );

                        children.push(
                            <span key="label" className={cx('AsideNav-itemLabel')}>
                                {link.label}
                            </span>
                        );

                        return link.path ? (
                            link.active ? (
                                <a>{children}</a>
                            ) : (
                                <Link to={link.path[0] === '/' ? link.path : `${link.path}`}>{children}</Link>
                            )
                        ) : (
                            <a
                                onClick={
                                    link.onClick ? link.onClick : link.children ? () => toggleExpand(link) : undefined
                                }
                            >
                                {children}
                            </a>
                        );
                    }}
                    isActive={(link: any) =>
                        isActive(link.path && link.path[0] === '/' ? link.path : `${link.path}`, location)
                    }
                />
            );
        }

        function handleConfirm(value: {label: string; icon: string; path: string}) {
            store.addPage({
                ...value,
                schema: {
                    type: 'page',
                    title: value.label,
                    body: '这是你刚刚新增的页面。'
                }
            });
            store.setAddPageIsOpen(false);
        }

        console.log(store, 'storestorestorestorestore');
        function getSchema() {
            return testSchema;
        }
        return (
            <Layout folded={store.asideFolded} offScreen={store.offScreen}>
                <AMISRenderer schema={getSchema()} />
            </Layout>
        );
    })
);
const testSchema = {
    type: 'page',
    title: '动态页管理',
    body: [
        {
            type: 'tpl',
            tpl: '初始页面',
            inline: false
        },
        {
            type: 'crud',
            api: '/api/graphql?query={   items: amisSchema(status: LATEST) {     displayText     createdUtc     id: contentItemId     name     description     published     publishedUtc     modifiedUtc     author   } }',
            columns: [
                {
                    name: 'displayText',
                    label: '显示名称',
                    type: 'text'
                },
                {
                    type: 'text',
                    label: '名称',
                    name: 'name'
                },
                {
                    type: 'text',
                    label: '描述',
                    name: 'description'
                },
                {
                    type: 'status',
                    name: 'published',
                    label: '已发布'
                },
                {
                    type: 'date',
                    label: '发布时间',
                    name: 'publishedUtc'
                },
                {
                    type: 'date',
                    label: '修改时间',
                    name: 'modifiedUtc'
                },
                {
                    name: 'createdUtc',
                    label: '创建时间',
                    type: 'date'
                },
                {
                    type: 'text',
                    name: 'author',
                    label: '创建人'
                },
                {
                    type: 'operation',
                    label: '操作',
                    buttons: [
                        {
                            label: '编辑',
                            type: 'button',
                            actionType: 'dialog',
                            level: 'link',
                            dialog: {
                                type: 'dialog',
                                title: '编辑',
                                body: [
                                    {
                                        type: 'form',
                                        api: {
                                            method: 'post',
                                            url: '/api/content'
                                        },
                                        body: [
                                            {
                                                name: 'ContentType',
                                                label: 'ContentType',
                                                type: 'hidden',
                                                value: 'AmisSchema'
                                            },
                                            {
                                                name: 'DisplayText',
                                                label: '显示名称',
                                                type: 'input-text',
                                                required: true
                                            },
                                            {
                                                type: 'input-text',
                                                label: '名称',
                                                name: 'AmisSchema.Name.Text',
                                                required: true,
                                                description: '代码引用的关键字'
                                            },
                                            {
                                                type: 'textarea',
                                                label: '描述',
                                                name: 'AmisSchema.Description.Text'
                                            },
                                            {
                                                type: 'editor',
                                                label: 'JSON Schema',
                                                name: 'AmisSchema.Schema.Text'
                                            }
                                        ],
                                        initApi: {
                                            method: 'get',
                                            url: '/api/content/${id}',
                                            data: {},
                                            dataType: 'json'
                                        }
                                    }
                                ],
                                closeOnEsc: false,
                                closeOnOutside: false,
                                showCloseButton: true,
                                size: 'xl'
                            },
                            onClick: 'console.log(props)'
                        },
                        {
                            label: '查看',
                            type: 'button',
                            actionType: 'dialog',
                            level: 'link',
                            dialog: {
                                title: '查看详情',
                                body: {
                                    type: 'form',
                                    api: 'xxx/update',
                                    body: [
                                        {
                                            name: 'id',
                                            label: 'ID',
                                            type: 'static'
                                        },
                                        {
                                            name: 'engine',
                                            label: '渲染引擎',
                                            type: 'static'
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            type: 'button',
                            label: '删除',
                            actionType: 'ajax',
                            level: 'link',
                            className: 'text-danger',
                            confirmText: '确定要删除？',
                            api: 'POST:',
                            onClick: 'console.log(props)'
                        }
                    ]
                }
            ],
            bulkActions: [],
            itemActions: [],
            features: ['filter', 'create', 'update', 'view', 'delete'],
            headerToolbar: [
                {
                    label: '新增',
                    type: 'button',
                    actionType: 'dialog',
                    level: 'primary',
                    dialog: {
                        title: '新增',
                        body: [
                            {
                                type: 'form',
                                api: {
                                    method: 'post',
                                    url: '/api/content'
                                },
                                body: [
                                    {
                                        name: 'DisplayText',
                                        label: '显示名称',
                                        type: 'input-text',
                                        required: true
                                    },
                                    {
                                        type: 'input-text',
                                        label: '名称',
                                        name: 'AmisSchema.Name.Text',
                                        required: true,
                                        description: '代码引用的关键字'
                                    },
                                    {
                                        type: 'textarea',
                                        label: '描述',
                                        name: 'AmisSchema.Description.Text'
                                    },
                                    {
                                        type: 'editor',
                                        label: 'JSON Schema',
                                        name: 'AmisSchema.Schema.Text'
                                    }
                                ]
                            }
                        ],
                        type: 'dialog',
                        closeOnEsc: false,
                        closeOnOutside: false,
                        showCloseButton: true,
                        size: 'xl'
                    }
                },
                'bulkActions',
                'pagination'
            ]
        }
    ]
};
