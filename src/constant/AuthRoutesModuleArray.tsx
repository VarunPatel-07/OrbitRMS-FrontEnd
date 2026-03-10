import CreateResetPassword from '../Auth/CreateResetPassword';
import ForgotPassword from '../Auth/ForgotPassword';
import SignIn from '../Auth/SignIn';
import SignUp from '../Auth/SignUp';
import { appRouterArraysInterface } from '../interface/interface';

export const APP_AUTH_ROUTES_MODULE_ARRAY: appRouterArraysInterface[] = [
  {
    label: 'sign-in',
    path: '/sign-in',
    module: <SignIn />,
    subModule: [],
  },
  {
    label: 'sign-up',
    path: '/sign-up',
    module: <SignUp />,
    subModule: [],
  },

  {
    label: 'forgot-password',
    path: '/forgot-password',
    module: <ForgotPassword />,
    subModule: [],
  },
  {
    label: 'create-password',
    path: '/create-password',
    module: <CreateResetPassword />,
    subModule: [],
  },
  {
    label: 'reset-password',
    path: '/create-password',
    module: <CreateResetPassword />,
    subModule: [],
  },
];
