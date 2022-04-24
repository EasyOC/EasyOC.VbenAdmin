import React from 'react';
import {ToastComponent, AlertComponent, Spinner} from 'amis';
import {Route, Switch, Redirect, HashRouter as Router} from 'react-router-dom';
import {observer} from 'mobx-react';
import {IMainStore} from '../store';

const Preview = React.lazy(() => import('./Preview'));
const Editor = React.lazy(() => import('./Editor'));
const OldEditor = React.lazy(() => import('./oldEditor'));
const View = React.lazy(() => import('./View'));

export default observer(function ({store}: {store: IMainStore}) {
    return (
        <Router>
            <div className="routes-wrapper">
                <ToastComponent key="toast" position={'top-right'} />
                <AlertComponent key="alert" />
                <React.Suspense fallback={<Spinner overlay className="m-t-lg" size="lg" />}>
                    <Switch>
                        <Redirect to={`/hello-world`} from={`/`} exact />
                        <Route path="/edit/:id/:version?" component={Editor} />
                        <Route path="/o/:id/:version?" component={OldEditor} />
                        <Route path="/v/:id" component={View} />
                        <Route component={Preview} />
                    </Switch>
                </React.Suspense>
            </div>
        </Router>
    );
});
