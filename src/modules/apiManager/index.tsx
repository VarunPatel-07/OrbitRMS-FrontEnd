import { useContext, useEffect } from 'react';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import {
   GlobalStateContext,
   GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import ApiManagerSideBar from '@/modules/apiManager/apiManagerSideBar/ApiManagerSideBar';
import ClientInquiryApiManager from '@/modules/apiManager/module/clientInquiry';

import { META_TITLE_DESCRIPTION } from '@/utils/constants/seo.constants';
import { getDataFromLocalStorage } from '@/utils/helpers/commonHelpers';
import HelmetSeo from '@/utils/helpers/HelmetSeo';
import ProtectedRoute from '@/utils/helpers/ProtectedRoute';

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
            Title={META_TITLE_DESCRIPTION.API_MANAGER.title}
            Content={META_TITLE_DESCRIPTION.API_MANAGER.description}
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
                           <ProtectedRoute
                              element={<ClientInquiryApiManager />}
                           />
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
