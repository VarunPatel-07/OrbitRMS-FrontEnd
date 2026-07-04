import { useContext, useEffect, useRef, useState } from 'react';

import { SkeletonTheme } from 'react-loading-skeleton';

import {
   GlobalStateContext,
   GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
   NotificationContext,
   NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import { ClientInquiry } from '@/interface/ClientInquiry.interface';
import ApiCredential from '@/modules/apiManager/module/clientInquiry/components/apiCredential';
import {
   ApiManagerFooterBar,
   ApiManagerHeader,
} from '@/modules/apiManager/module/clientInquiry/components/headerFooter';
import HowToUseDocument from '@/modules/apiManager/module/clientInquiry/components/howToUseDocument';
import ListInquiryForms from '@/modules/apiManager/module/clientInquiry/components/listInquiryForms';

import { useDebounce } from '@/hooks/useDebounce';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import {
   endpointObject,
   multipleFetchApi,
   multiplePutApi,
} from '@/utils/api/multipleAPI';
import { META_TITLE_DESCRIPTION } from '@/utils/constants/seo.constants';
import { getDataFromLocalStorage } from '@/utils/helpers/commonHelpers';
import HelmetSeo from '@/utils/helpers/HelmetSeo';

function ClientInquiryApiManager() {
   const { GlobalStateProvider } = useContext(
      GlobalStateContext
   ) as GlobalStateContextApiProps;
   const { handelNotification } = useContext(
      NotificationContext
   ) as NotificationContextApiProps;

   const initialState: ClientInquiry = {
      api_key: '',
      api_secrete: '',
      status: false,
      id: '',
      organization_id: '',
   };
   const useEffectRef = useRef(false);
   const [formData, setFormData] = useState<ClientInquiry>(initialState);
   const [loading, setLoading] = useState<boolean>(true);

   const [buttonLoader, setButtonLoader] = useState<boolean>(false);

   const localStorageData = getDataFromLocalStorage('organization-info');
   const organization =
      GlobalStateProvider?.organization?.general_info?.portal_slug ||
      JSON.parse(localStorageData)?.portal_slug;

   const BreadcrumbsObjects = [
      {
         name: 'Home',
         label: 'home',
         link: `/${organization}/dashboard`,
      },
      {
         name: 'Api Manager',
         label: 'api_manager',
         link: `/${organization}/api-manager`,
      },
      {
         name: 'Client Inquiry',
         label: 'client_inquiry',
         link: `/${organization}/api-manager/client-inquiry`,
      },
   ];

   const fetchApiStatusWithDebounce = useDebounce(async () => {
      const endpointArr: endpointObject[] = [
         {
            endPoint: 'api-manager/client-inquiry/status/fetch',
            protected: true,
         },
      ];
      const response = await multipleFetchApi(endpointArr);
      const res = response[0];
      if (res?.success) {
         setFormData(res?.data);

         setLoading(false);
      } else {
         setLoading(false);
      }
   }, 100);

   const handelEnableDisableWithDebounce = useDebounce(async () => {
      const endpointArr: endpointObject[] = [
         { endPoint: 'api-manager/client-inquiry/enable-api', protected: true },
      ];
      const response = await multiplePutApi(endpointArr);
      const res = response[0];
      handelNotification(res, 'top-right');
      if (res?.success) {
         setLoading(true);
         fetchApiStatusWithDebounce();
      }
      setButtonLoader(false);
   }, 100);
   const handelEnableDisableOnClick = () => {
      setButtonLoader(true);
      handelEnableDisableWithDebounce();
   };

   useEffect(() => {
      if (useEffectRef.current) return;
      useEffectRef.current = true;
      fetchApiStatusWithDebounce();
   }, []);

   return (
      <>
         <HelmetSeo
            Title={META_TITLE_DESCRIPTION.CLIENT_INQUIRY_API_MANAGER.title}
            Content={
               META_TITLE_DESCRIPTION.CLIENT_INQUIRY_API_MANAGER.description
            }
         />
         <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
            <div className='w-full h-full relative'>
               <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
               <div className='pt-9 w-full h-full'>
                  <div className='p-4 2xl:p-5'>
                     {/* Header */}
                     <ApiManagerHeader loading={loading} formData={formData} />
                     {/* Body */}
                     <div className='w-full h-[calc(100vh-250px)] overflow-auto hide-scrollbar bg-white border border-black/15 relative'>
                        <div className='w-full h-full'>
                           <div className='w-full h-full'>
                              <div className='w-full px-5 py-5'>
                                 <div className='flex flex-col items-start justify-start gap-5 w-full'>
                                    <ApiCredential
                                       loading={loading}
                                       formData={formData}
                                       fetchApiStatus={
                                          fetchApiStatusWithDebounce
                                       }
                                    />
                                    <div className='w-full py-5'>
                                       <ListInquiryForms />
                                    </div>
                                    <HowToUseDocument />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* footer */}
                     <ApiManagerFooterBar
                        loading={loading}
                        buttonLoader={buttonLoader}
                        formData={formData}
                        handelEnableDisableOnClick={handelEnableDisableOnClick}
                     />
                  </div>
               </div>
            </div>
         </SkeletonTheme>
      </>
   );
}

export default ClientInquiryApiManager;
