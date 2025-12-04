import React, {
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import MaintenanceWorker from '../worker/MaintenanceWorker?worker';
import MainSuspenseLoader from './Components/Loader/MainSuspenseLoader';
import Navbar from './Components/Navbar/Navbar';
import SideBar from './Components/SideBar/SideBar';
import {
  MAINTENANCE_MODE_LOCAL_STORAGE_KEY,
  MaintenanceModeIsActiveStatusCode,
  unauthorizedStatusCodes,
} from './constant/constant';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from './Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from './Context/Notification/NotificationContextApi';
import { verifyUsersLoginStatus } from './Helper/api/api';
import { endpointObject, multiplePostApi } from './Helper/api/multipleAPI';
import HelmetSeo from './Helper/HelmetSeo';
import {
  clearLocalSessionStorage,
  ErrorHandler,
  getDataFromLocalStorage,
  getDataFromTheSessionStorage,
  storeDataInLocalStorage,
} from './Helper/HelperFunctions';
import ProtectedRoute from './Helper/ProtectedRoute';
import { useDebounce } from './Hooks/useDebounce';
import { appRouterArraysInterface } from './interface/interface';
import ApiManager from './Pages/ApiManager/ApiManager';
import ClientInquiry from './Pages/ClientInquiry/ClientInquiry';
import Config from './Pages/config/Config';
import Dashboard from './Pages/Dashboard/Dashboard';
import EmployeeListing from './Pages/Employee/EmployeeListing';
// import AddEditEmployeeProfile from './Pages/EmployeeProfile/AddEditEmployeeProfile-Old';
import AddEditEmployeeProfile from './Pages/EmployeeProfile/AddEditEmployeeProfile/AddEditEmployeeProfile';
import EmployeeProfile from './Pages/EmployeeProfile/EmployeeProfile';
import Leaves from './Pages/Leaves/Leaves';
import OrganizationSettings from './Pages/OrganizationSettings/OrganizationSettings';
import SocialMedia from './Pages/SocialMedia/SocialMedia';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;
const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;
export const HandelPathFunction = () => {
  const _data = getDataFromLocalStorage('organization-info');
  const _isAuthenticated = getDataFromLocalStorage('authenticationToken');
  if (_data && _isAuthenticated) {
    return (
      <Navigate to={`/${JSON.parse(_data)?.portal_slug}/dashboard`} replace />
    );
  } else {
    clearLocalSessionStorage();
    return <Navigate to={`/auth/sign-in`} replace />;
  }
};

function App() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigate = useNavigate();

  const { GlobalStateProvider, setGlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const useEffectRef = useRef(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);

  const handelLogoutButtonWithDebounce = useDebounce(
    async (setLoading: React.Dispatch<SetStateAction<boolean>>) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: 'auth/logout',
          protected: true,
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      setLoading(true);
      handelNotification(res, 'top-right');
      if (res?.success) {
        clearLocalSessionStorage();
        setTimeout(() => {
          navigate('/auth/sign-in');
        }, 100);
      }
    },
    100
  );

  const appRouterArrays: appRouterArraysInterface[] = [
    {
      label: 'dashboard',
      path: '/dashboard',
      module: <Dashboard />,
      subModule: [],
    },
    {
      label: 'dashboard',
      path: '/leaves/*',
      module: <Leaves />,
      subModule: [],
    },
    {
      label: 'employees',
      path: '/employees',
      module: null,
      subModule: [
        {
          label: 'employee_profile',
          path: '/employees/employee-profile/:id/*',
          module: <EmployeeProfile />,
          subModule: [],
        },
        {
          label: 'employee_profile',
          path: '/employees/manage/:type/:id?',
          module: <AddEditEmployeeProfile />,
          subModule: [],
        },
        {
          label: 'employee_listing',
          path: '/employees/employee-listing',
          module: <EmployeeListing />,
          subModule: [],
        },
      ],
    },
    {
      label: 'client_inquiry',
      path: '/client-inquiry',
      module: <ClientInquiry />,
      subModule: [],
    },
    {
      label: 'social_media',
      path: '/social-media',
      module: <SocialMedia />,
      subModule: [],
    },
    {
      label: 'config',
      path: '/config/*',
      module: <Config />,
      subModule: [],
    },
    {
      label: 'api_manager',
      path: '/api-manager/*',
      module: <ApiManager />,
      subModule: [],
    },
    {
      label: 'organization_settings',
      path: '/organization-settings/*',
      module: <OrganizationSettings />,
      subModule: [],
    },
  ];

  // Recursive route renderer function

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

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    (async () => {
      const response = await verifyUsersLoginStatus();
      if (!response) return;
      if (!response?.success) {
        handelNotification(response, 'top-right');
        setShowGlobalLoader(false);
        clearLocalSessionStorage();
        navigate('/auth/sign-in');
      } else {
        setShowGlobalLoader(false);
        const localStorageData = {
          organization_name:
            response?.data?.organization?.general_info?.organization_name,
          organization_profile_picture:
            response?.data?.organization?.general_info
              ?.organization_profile_picture,
          portal_url: response?.data?.organization?.general_info?.portal_url,
          portal_slug: response?.data?.organization?.general_info?.portal_slug,
        };

        storeDataInLocalStorage(
          JSON.stringify(localStorageData),
          'organization-info'
        );
        if (response?.data) setGlobalStateProvider(response?.data);
      }
    })();
  }, []);

  // Now We Will Create An Worker That Will Run After every Time

  useEffect(() => {
    const _localToken = getDataFromLocalStorage('authenticationToken');
    const _sessionToken = getDataFromTheSessionStorage('authenticationToken');
    //   todo we will show the error in the form of the notification

    const authToken = _localToken || _sessionToken;

    if (!authToken) return;

    const worker = new MaintenanceWorker();

    const url = `${BASE_URL}/auth/maintenance/check-maintenance-mode`;

    worker.onmessage = (e) => {
      const { success, error } = e.data;
      if (!success) {
        const status = error?.status;

        const data = ErrorHandler(error);
        if (unauthorizedStatusCodes.includes(status)) {
          window.location.href = '/auth/sign-in';
          return;
        }
        if (MaintenanceModeIsActiveStatusCode.includes(status)) {
          storeDataInLocalStorage(
            data.data,
            MAINTENANCE_MODE_LOCAL_STORAGE_KEY
          );
          window.location.href = '/maintenance-mode';
          return;
        }
      }
    };
    worker.onerror = (err) => {
      console.error('Worker internal error:', err);
    };

    worker.postMessage({ url, token: authToken });

    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (ENVIRONMENT === 'DEVELOPMENT') return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleDragStart = (e: DragEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey &&
          e.shiftKey &&
          ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <HelmetSeo
        Title='OrbitRMS'
        Content='Streamline your business operations with OrbitRMS. Manage clients, content, resources, and more — all in one powerful platform.'
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader &&
        GlobalStateProvider?.roles_permissions?.permissions?.length > 0 && (
          <div className='w-full h-screen bg-white'>
            <div className='w-full flex flex-col h-full'>
              <Navbar handelLogout={handelLogoutButtonWithDebounce} />
              <div className='w-full h-full flex-grow flex justify-stretch'>
                <div className='w-fit'>
                  <SideBar />
                </div>
                <div className='w-[calc(100%-60px)] ml-auto bg-[var(--main-white-color)] overflow-hidden'>
                  <Routes>
                    {recursiveRoutRender(appRouterArrays, '')}
                    <Route path='*' element={<HandelPathFunction />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
}

export default App;
