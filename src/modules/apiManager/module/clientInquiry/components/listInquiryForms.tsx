import { useContext, useEffect, useRef, useState } from 'react';

import {
   NotificationContext,
   NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import {
   ApiManagerInquiryFromInterface,
   TurnstileSetupFormData,
   ViewTurnstileData,
} from '@/interface/ApiManager.interface';
import { InquiryFromColumns } from '@/modules/apiManager/module/clientInquiry/tableColumns/listInquiryForms.columns';

import { useDebounce } from '@/hooks/useDebounce';

import Table from '@/components/common/table/Table';
import TableInfoHeader from '@/components/common/table/TableInfoHeader';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import AddEditTurnStileModal from '@/components/modals/AddEditTurnStileModal';
import TurnstileSecretKeyVerificationModal from '@/components/modals/TurnstileSecretKeyCreatedModal';
import TurnstileVerificationModal from '@/components/modals/TurnstileVerificationModal';
import ViewTurnStileModal from '@/components/modals/ViewTurnStileModal';
import {
   endpointObject,
   multipleFetchApi,
   multiplePostApi,
} from '@/utils/api/multipleAPI';
import { decryptDataService } from '@/utils/helpers/encryption.helper';
import { TURNSTILE_SETUP_INITIAL } from '@/utils/initialData/apiManager.initial';

function ListInquiryForms() {
   const { handelNotification } = useContext(
      NotificationContext
   ) as NotificationContextApiProps;

   const useEffectRef = useRef(false);
   const [inquiryFormsData, setInquiryFormData] = useState<
      ApiManagerInquiryFromInterface[]
   >([]);

   const [showApiKey, setShowApiKey] = useState<boolean>(false);
   const [showModal, setShowModal] = useState<boolean>(false);
   const [verifyingLoader, setVerifyingLoader] = useState<boolean>(false);
   const [inquiryFormId, setInquiryFormId] = useState<string>('');
   const [viewTurnStileDetails, setViewTurnStileDetails] =
      useState<ViewTurnstileData | null>(null);
   const [showTurnStileDetailModal, setShowTurnStileDetailModal] =
      useState<boolean>(false);

   const [showSecretKeyModal, setShowSecretKeyModal] = useState(false);
   const [showTurnstileVerificationModal, setShowTurnstileVerificationModal] =
      useState(false);
   const [verificationFormId, setVerificationFormId] = useState<string>('');
   const [verificationSiteKey, setVerificationSiteKey] = useState<string>('');
   const [editTurnStileDetails, setEditTurnStileDetails] =
      useState<TurnstileSetupFormData>(TURNSTILE_SETUP_INITIAL);

   const fetchInquiryFormsWithDebounce = useDebounce(async () => {
      const response = await multipleFetchApi([
         {
            endPoint: 'api-manager/client-inquiry/forms/fetch',
            protected: true,
         },
      ]);
      const res = response[0];

      if (res?.success) {
         setInquiryFormData(res?.data);
      }
   }, 100);

   const handleClickOnCopyBtn = (text: string, message: string) => {
      navigator.clipboard
         .writeText(text)
         .then(() => {
            const data = { success: true, message: message };
            handelNotification(data, 'center');
         })
         .catch(() => {
            console.error('Failed to copy');
         });
   };

   const handelFormSubmitFunction = (
      data: TurnstileSetupFormData,
      callback: () => void
   ) => {
      setVerifyingLoader(true);
      SetUpTurnStileCreationWithDebounce(data, callback);
   };

   const SetUpTurnStileCreationWithDebounce = useDebounce(
      async (data: TurnstileSetupFormData, callback: () => void) => {
         const endPointArr: endpointObject[] = [
            {
               endPoint: `api-manager/client-inquiry/turnstile/create?id=${inquiryFormId}`,
               protected: true,
               data: {
                  turnstile_mode: data?.turnstile_mode,
                  allowed_domains: data?.allowed_domains,
                  turnstile_secret_key: data?.turnstile_secret_key,
                  turnstile_site_key: data?.turnstile_site_key,
               },
            },
         ];

         const response = await multiplePostApi(endPointArr);
         const res = response[0];

         handelNotification(res, 'top-right');
         setVerifyingLoader(false);

         if (res?.success) {
            setVerificationFormId(inquiryFormId);
            const decryptedData = await decryptDataService(
               res?.data?.turnstile_site_key
            );

            setVerificationSiteKey(decryptedData as string);
            setInquiryFormId('');
            callback();
            setShowSecretKeyModal(true);
         }
      },
      100
   );

   const handleVerifyTurnstileToken = async (token: string) => {
      const response = await multiplePostApi([
         {
            endPoint: `api-manager/client-inquiry/turnstile/verify?id=${verificationFormId}`,
            protected: true,
            data: {
               turnstile_token: token,
            },
         },
      ]);
      const res = response[0];

      if (!res?.success) {
         handelNotification(res, 'top-right');
      }

      return {
         success: !!res?.success,
         message: res?.message,
      };
   };

   const completeVerificationBtn = async (
      data: ApiManagerInquiryFromInterface
   ) => {
      setVerificationFormId(data.id);
      const decryptedData = await decryptDataService(data?.turnstile_site_key);

      setVerificationSiteKey(decryptedData as string);

      setShowSecretKeyModal(true);
   };

   const handleEditTurnstile = async (data: ApiManagerInquiryFromInterface) => {
      setShowModal(true);
      let allowed_domains = [];
      try {
         const domains = JSON.parse(data?.allowed_domains);
         allowed_domains = domains;
      } catch {
         allowed_domains = [];
      }
      const turnstile_secret_key = await decryptDataService(
         data?.turnstile_secret_key
      );
      const turnstile_site_key = await decryptDataService(
         data?.turnstile_site_key
      );
      setEditTurnStileDetails({
         allowed_domains: allowed_domains,
         turnstile_mode: data?.turnstile_mode,
         turnstile_secret_key: turnstile_secret_key as string,
         turnstile_site_key: turnstile_site_key as string,
      });
   };

   const COLUMNS = InquiryFromColumns({
      showApiKey,
      showModal,
      setViewTurnStileDetails,
      setShowTurnStileDetailModal,
      setInquiryFormId,
      setShowModal,
      setShowApiKey,
      handleClickOnCopyBtn,
      completeVerificationBtn,
      handleEditTurnstile,
   });

   useEffect(() => {
      if (useEffectRef.current) return;
      useEffectRef.current = true;
      fetchInquiryFormsWithDebounce();
   }, []);

   return (
      <>
         <div className='w-full'>
            {inquiryFormsData?.length > 0 ? (
               <>
                  <TableInfoHeader
                     badgeValue={`${inquiryFormsData?.length ?? 0} ${
                        (inquiryFormsData?.length ?? 0) === 1
                           ? ' Form'
                           : ' Forms'
                     }`}
                     moduleName='Inquiry API Manager'
                     buttonsArray={[]}
                  />
                  <Table
                     columns={COLUMNS}
                     data={inquiryFormsData}
                     tableWrapperClass={
                        'overflow-auto max-h-[calc(100vh-345px)] h-full bg-white rounded-b-lg'
                     }
                     stickyHeaderClass='sticky top-0'
                  />
               </>
            ) : (
               <TableNoDataFound
                  tableWrapperClass={'h-auto rounded-b-lg !border-0'}
                  notFoundTitle='No Inquiry Form Added'
                  notFoundMessage='No inquiry forms have been added yet. Create a new form to start collecting inquiries.'
                  notFoundOptionsButtonsArray={[]}
               />
            )}
         </div>
         {inquiryFormId && (
            <AddEditTurnStileModal
               loading={verifyingLoader}
               showModal={showModal}
               setShowModal={setShowModal}
               handelFormSubmitFunction={handelFormSubmitFunction}
               turnstileData={editTurnStileDetails}
            />
         )}
         <ViewTurnStileModal
            handleClickOnCopyBtn={handleClickOnCopyBtn}
            setShowModal={setShowTurnStileDetailModal}
            showModal={showTurnStileDetailModal}
            turnstileData={viewTurnStileDetails}
         />
         <TurnstileSecretKeyVerificationModal
            showModal={showSecretKeyModal}
            setShowModal={setShowSecretKeyModal}
            handleClickOnCopyBtn={handleClickOnCopyBtn}
            onCloseModal={() => {
               setVerificationFormId('');
               setVerificationSiteKey('');
            }}
            onVerifySetup={() => {
               setShowSecretKeyModal(false);
               setShowTurnstileVerificationModal(true);
            }}
         />
         <TurnstileVerificationModal
            showModal={showTurnstileVerificationModal}
            setShowModal={setShowTurnstileVerificationModal}
            formId={verificationFormId}
            siteKey={verificationSiteKey}
            handleClickOnCopyBtn={handleClickOnCopyBtn}
            onVerifyToken={handleVerifyTurnstileToken}
            onVerified={() => {
               fetchInquiryFormsWithDebounce();
               handelNotification(
                  {
                     success: true,
                     message: 'Turnstile setup verified successfully',
                  },
                  'top-right'
               );
            }}
         />
      </>
   );
}

export default ListInquiryForms;
