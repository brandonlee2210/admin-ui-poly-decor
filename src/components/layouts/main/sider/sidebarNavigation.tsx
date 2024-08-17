import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons';
import { ReactComponent as NftIcon } from '@app/assets/icons/nft-icon.svg';

export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  // {
  //   title: 'common.nft-dashboard',
  //   key: 'nft-dashboard',
  //   // TODO use path variable
  //   url: '/',
  //   icon: <NftIcon />,
  // },
  // {
  //   title: 'common.medical-dashboard',
  //   key: 'medical-dashboard',
  //   url: '/medical-dashboard',
  //   icon: <DashboardOutlined />,
  // },
  {
    title: 'Statistics',
    key: 'charts',
    url: '/charts',
    icon: <LineChartOutlined />,
  },
  {
    title: 'common.apps',
    key: 'apps',
    icon: <HomeOutlined />,
    children: [
      {
        title: 'common.feed',
        key: 'feed',
        url: '/apps/feed',
      },
    ],
  },
  {
    title: 'Users',
    key: 'auth',
    icon: <UserOutlined />,
    children: [
      {
        title: 'common.login',
        key: 'login',
        url: '/auth/login',
      },
      {
        title: 'common.signUp',
        key: 'singUp',
        url: '/auth/sign-up',
      },
      {
        title: 'Users List',
        key: 'usersList',
        url: '/auth/users',
      },
      // {
      //   title: 'common.lock',
      //   key: 'lock',
      //   url: '/auth/lock',
      // },
      // {
      //   title: 'common.forgotPass',
      //   key: 'forgotPass',
      //   url: '/auth/forgot-password',
      // },
      // {
      //   title: 'common.securityCode',
      //   key: 'securityCode',
      //   url: '/auth/security-code',
      // },
      // {
      //   title: 'common.newPassword',
      //   key: 'newPass',
      //   url: '/auth/new-password',
      // },
    ],
  },
  {
    title: 'common.variants',
    key: 'variants',
    url: '/variants',
    icon: <TableOutlined />,
  },
  {
    title: 'common.products',
    key: 'products',
    url: '/products',
    icon: <DashboardOutlined />,
  },
  {
    title: 'common.categories',
    key: 'categories',
    url: '/categories',
    icon: <TableOutlined />,
  },
  {
    title: 'common.orders',
    key: 'orders',
    url: '/orders',
    icon: <CodeSandboxOutlined />,
  },
];
