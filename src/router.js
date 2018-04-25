import React from 'react';
// import { Router, Route, Switch } from 'dva/router';
import { routerRedux, Switch } from 'dva/router';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
	const routerData = getRouterData(app);
  const BasicLayout = routerData['/'].component;
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <AuthorizedRoute
              path="/"
              render={props => <BasicLayout {...props} />}
              authority={['admin', 'user']}
              redirectPath="/"
            />
      </Switch>
    </ConnectedRouter>
  );
}

export default RouterConfig;
