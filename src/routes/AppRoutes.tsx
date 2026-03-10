import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { APPS_ROUTES_MODULE_ARRAY } from '../constant/AppRouteModuleArray';
import { HandelPathFunction } from '../Helper/Helper';
import ProtectedRoute from '../Helper/ProtectedRoute';
import { appRouterArraysInterface } from '../interface/interface';
import { GlobalContextStore } from '../interface/UserProfileInterface';

function AppRoutes({
  GlobalStateProvider,
}: {
  GlobalStateProvider: GlobalContextStore;
}) {
  const recursiveRoutRender = (
    routes: appRouterArraysInterface[],
    parent_module_id: string
  ) => {
    return routes.map((route, index) => {
      if (!GlobalStateProvider?.roles_permissions?.permissions) return [];
      const permissions =
        parent_module_id !== ''
          ? GlobalStateProvider?.roles_permissions?.permissions
              ?.find((data) => data?.module_label == parent_module_id)
              ?.sub_modules?.find((item) => item?.module_label == route?.label)
          : GlobalStateProvider?.roles_permissions?.permissions?.find(
              (data) => data?.module_label == route?.label
            );

      const hasSubModule =
        Array.isArray(route?.subModule) && route?.subModule.length > 0;

      const currentModule =
        route?.module !== null ? (
          <Route
            key={route?.path}
            path={route?.path}
            element={<ProtectedRoute element={route.module} />}
          />
        ) : null;

      const nestedRoutes = hasSubModule
        ? recursiveRoutRender(route.subModule, route?.label)
        : null;

      if (
        permissions?.is_active &&
        permissions?.permissions.some(
          (perm) => perm.label === 'view' && perm.is_allowed
        )
      ) {
        return (
          <React.Fragment key={index}>
            {currentModule}
            {nestedRoutes}
          </React.Fragment>
        );
      }
      return null;
    });
  };
  return (
    <Routes>
      {recursiveRoutRender(APPS_ROUTES_MODULE_ARRAY, '')}
      <Route path='*' element={<HandelPathFunction />} />
    </Routes>
  );
}

export default AppRoutes;
