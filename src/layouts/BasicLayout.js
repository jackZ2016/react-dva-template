import React from 'react';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import styles from './Layout.less';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import SiderMenu from '../components/SiderMenu/SiderMenu';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';

const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class BasicLayout extends React.PureComponent {
  getBashRedirect() {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect') || '/dashboard/analysis';
    // Remove the parameters in the url
    urlParams.searchParams.delete('redirect');
    window.history.pushState(null, 'redirect', urlParams.href);
    return redirect;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  changeTheme = () => {
    this.props.dispatch({
      type: 'global/switchTheme',
    });
  };
  render() {
    const {
      currentUser, collapsed, routerData, match, location, darkTheme,
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout className={classNames({ [styles.dark]: darkTheme, [styles.light]: !darkTheme })} style={{ height: '100%'}}>
        <SiderMenu 
          logo={logo}
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          onCollapse={this.handleMenuCollapse}
          changeTheme={this.changeTheme}
          darkTheme={darkTheme}
        />
        <Layout>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser}
            collapsed={collapsed}
            onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
          />
           <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)' }}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item =>
                    (
                      <AuthorizedRoute
                        key={item.key}
                        path={item.path}
                        component={item.component}
                        exact={item.exact}
                        authority={item.authority}
                        redirectPath="/exception/403"
                      />
                    )
                  )
                }
                {/*
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                */}
                <Redirect exact from="/" to={bashRedirect} />
              </Switch>
            </div>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 筑库网
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title='title'>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)} style={{ height: '100%' }}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    )
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  darkTheme: global.darkTheme,
}))(BasicLayout);
