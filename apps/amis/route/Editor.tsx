import {getEnv} from 'mobx-state-tree';
import * as React from 'react';
import {Editor} from 'amis-editor';
import '../renderer/MyRenderer';
import '../editor/MyRenderer';
import {PluginClass} from 'amis-editor/dist/manager';
import {Layout, Switch, toast, classnames as cx} from 'amis';
import {apiRequest} from 'service/api';
import {RouteComponentProps} from 'react-router';
import {inject, observer} from 'mobx-react';
import {IMainStore} from 'store';
import authService from './auth/authService';

const plugins: PluginClass[] | undefined = []; // 通过plugin注入
let host = `${window.location.protocol}//${window.location.host}`;

// 如果在 gh-pages 里面
if (/^\/amis-editor-renderer/.test(window.location.pathname)) {
    host += '/amis-editor-renderer/amis-editor';
}
const schemaUrl = `${host}/schema.json`;
@inject('store')
@observer
class AmisEditor extends React.Component {
    state: any = {
        preview: true,
        mobile: false,
        id: '',
        version: '',
        schema: {
            type: 'page',
            regions: ['body', 'toolbar', 'header']
        },
        schemaObject: {schema: '', displayText: '', contentitemId: ''}
    };
    getGpParams() {
        const {match} = this.props as RouteComponentProps<{id: string; version?: string}>;
        console.log('this.props: ', this.props);
        this.state.id = match.params.id;
        this.state.version = match.params.version;
        let queryparamsStr = `contentItemId:\"${this.state.id}\"`;
        // if (this.state.version) {
        //     queryparamsStr += `,contentItemVersionId:"${this.state.version}"`;
        // }
        return queryparamsStr;
    }
    async componentWillMount() {
        console.log('getSchemagetSchemagetSchema');
    //    await authService.login()
    
        const result = await apiRequest({
            method: 'get',
            url: `/api/graphql?query={  
                contentItem(${this.getGpParams()}) 
                    {     ... on AmisSchema {
                        createdUtc
                        description
                        displayText
                        schema
                        contentItemId
                        contentType
                        latest owner published
                        contentItemVersionId     }   } }`
        });
        console.log('result?.data', result?.data);
        this.state.schemaObject = result?.data.contentItem;
        if (this.state.schemaObject?.schema) {
            this.state.schema = JSON.parse(this.state.schemaObject.schema);
        }
        this.togglePreview(false);
    }

    handleChange = (value: any) => {
        this.setState({
            schema: value
        });
    };
    togglePreview = (value: any) => {
        this.setState({
            preview: value
        });
    };
    handleMobile = (mobileStatus: boolean) => {
        this.setState({
            mobile: mobileStatus
        });
    };
    handleSave(draft = false) {
        apiRequest({
            method: 'post',
            url: `/api/ContentManagement/PostContent?draft=${draft}`,
            data: {
                schema: JSON.stringify(this.state.schema),
                contentItemId: this.state.id,
                contentType: 'AmisSchema'
            },
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        }).then(() => {
            toast.success(draft ? '保存成功' : '发布成功', '提示');
        });
    }

    renderHeader = () => {
        return (
            <div className="clearfix editor-header box-shadow bg-dark">
                <div className="editor-preview">
                    预览 <Switch value={this.state.preview} onChange={this.togglePreview} className="m-l-xs" inline />
                </div>

                <div className="editor-preview">
                    移动端{' '}
                    <Switch
                        value={this.state.mobile}
                        onChange={(value: boolean) => this.handleMobile(value)}
                        className="m-l-xs"
                        inline
                    />
                </div>

                <div className="editor-header-btns">
                    <div className={cx('btn-item')} onClick={() => this.handleSave()}>
                        发布
                    </div>
                </div>
                <div className="editor-header-btns">
                    <div className={cx('btn-item')} onClick={() => this.handleSave(true)}>
                        草稿
                    </div>
                </div>
            </div>
        );
    };
    render() {
        const {preview, mobile} = this.state;
        const {store} = this.props as any;
        return (
            <Layout header={this.renderHeader()} headerFixed={false}>
                <Editor
                    theme={'cxd'}
                    preview={preview}
                    value={this.state.schema}
                    onChange={this.handleChange}
                    className="is-fixed"
                    $schemaUrl={schemaUrl}
                    isMobile={mobile}
                    amisEnv={getEnv(store)}
                />
            </Layout>
        );
    }
}

export default AmisEditor;
