import { appRouterArraysInterface } from '@/interface/Global.interface';
import CreateResetPassword from '@/modules/auth/pages/CreateResetPassword';
import ForgotPassword from '@/modules/auth/pages/ForgotPassword';
import SignIn from '@/modules/auth/pages/SignIn';
import SignUp from '@/modules/auth/pages/SignUp/page';

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
