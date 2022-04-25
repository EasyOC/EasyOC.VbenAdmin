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

const schema = {
    type: 'page',
    title: 'Simple Form Page',
    body: [
        {
            type: 'form',
            body: [
                {
                    type: 'input-text',
                    name: 'a',
                    label: 'Text'
                }
            ]
        }
    ]
};

const plugins: PluginClass[] | undefined = []; // 通过plugin注入

@inject('store')
@observer
class AmisEditor extends React.Component {
    state: any = {
        preview: true,
        mobile: false,
        id: '',
        schema: {},
        schemaObject: {schema: '', displayText: '', contentitemId: ''}
    };

    async componentWillMount() {
        console.log('getSchemagetSchemagetSchema');
        const {match} = this.props as RouteComponentProps<{id: string}>;
        console.log('this.props: ', this.props);
        this.state.id = match.params.id;
        const result = await apiRequest({
            method: 'get',
            url: `/api/graphql?query={  
                    contentItem(contentItemId: 
                    \"${this.state.id}\") 
                    {     ... on AmisSchema {
                        createdUtc
                        description
                        displayText
                        name
                        schema
                        contentItemId
                        contentType
                        latest owner published
                        contentItemVersionId     }   } }`
        });
        console.log('result?.data', result?.data);
        this.state.schemaObject = result?.data.contentItem;
        if (this.state.schemaObject.schema) {
            JSON.parse(this.state.schemaObject.schema);
        } 
        this.togglePreview(false);
    }
    get getSchema() {
        console.log('getSchema result?.data', this.state.schemaObject.schema);

        if (this.state.schemaObject.schema) {
            return JSON.parse(this.state.schemaObject.schema);
        } else {
            return {};
        }
    }
    handleChange = (value: any) => {
        this.setState({
            schemaObject: {
                schema: value
            }
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
                schema: JSON.stringify(this.state.schemaObject.schema),
                contentItemId: this.state.id,
                contentType: 'AmisSchema'
            },
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        }).then(() => {
            toast.success('保存成功', '提示');
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
                    value={this.getSchema}
                    onChange={this.handleChange}
                    className="is-fixed"
                    // $schemaUrl={schemaUrl}
                    isMobile={mobile}
                    amisEnv={getEnv(store)}
                />
            </Layout>
        );
    }
}

export default AmisEditor;
