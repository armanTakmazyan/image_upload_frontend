import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { routeCodes } from 'routes/routeCodes.js';
import { InitialCircularProgress } from 'components/elements/initial-circular-progress';

const ImagesContainer = lazy(() => import('containers/images'));
const ImageLogsContainer = lazy(() => import('containers/image-logs'));

export const Routes = () => (
    <Router>
        <Suspense fallback={<InitialCircularProgress />}>
            <Switch>
                <Route path={routeCodes.ROOT} exact>
                    <ImagesContainer />
                </Route>
                <Route path={`${routeCodes.IMAGES}/:id/logs`} exact>
                    <ImageLogsContainer />
                </Route>
                <Redirect to={routeCodes.ROOT} />
            </Switch>
        </Suspense>
    </Router>
);
