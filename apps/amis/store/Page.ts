import {types, getEnv} from 'mobx-state-tree';
import {apiRequest} from 'service/api';
export const PageStore = types
    .model('Page', {
        id: types.identifier,
        icon: '',
        path: '',
        label: '',
        schema: types.frozen({})
    })
    .views(self => ({}))
    .actions(self => {
        function updatePageInfo(params: any) {
            self.label = params.displayName;
            if (params.schema) {
                self.schema = JSON.parse(params.schema);
            }
        }
        function updateSchema(schema: any) {
            self.schema = schema;
            // await apiRequest({
            //     method: 'post',
            //     url: '/api/ContentManagement/PostContent',
            //     body: {
            //         schema: JSON.stringify(self.schema),
            //         contentItemId: id,
            //         contentType: 'AmisSchema',
            //         latest: true,
            //         published: true
            //     },
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     timeout: 10000
            // });
        }

        return {
            updateSchema,
            updatePageInfo
        };
    });

export type IPageStore = typeof PageStore.Type;
