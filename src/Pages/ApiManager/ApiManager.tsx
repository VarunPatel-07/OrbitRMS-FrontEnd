import { useContext, useEffect } from 'react';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { MetaTitleDescription } from '../../constant/MetaTitleDescription';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import HelmetSeo from '../../Helper/HelmetSeo';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import ClientInquiryApiManager from './ApiManagerPages/ClientInquiryApiManager';
import ApiManagerSideBar from './ApiManagerSideBar/ApiManagerSideBar';

function ApiManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  useEffect(() => {
    if (location.pathname == `/${organization}/api-manager`) {
      navigate(`/${organization}/api-manager/client-inquiry`);
    }
  }, [location.pathname, navigate, organization]);
  return (
    <>
      <HelmetSeo
        Title={MetaTitleDescription.apiManager.title}
        Content={MetaTitleDescription.apiManager.description}
      />
      <div className='w-full h-full'>
        <div className='w-full h-full flex items-stretch justify-start'>
          <div className='w-[30%] max-w-[300px] border-r border-r-black/15'>
            <ApiManagerSideBar />
          </div>

          <div className='flex-1 overflow-auto'>
            <Routes>
              <Route
                path='/client-inquiry'
                element={
                  <ProtectedRoute element={<ClientInquiryApiManager />} />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApiManager;
