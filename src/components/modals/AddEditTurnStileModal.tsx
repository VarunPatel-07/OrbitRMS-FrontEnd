import { useEffect, useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import {
   AddTurnstileSetupDrawerProps,
   TurnstileModeType,
   TurnstileSetupFormData,
} from '@/interface/ApiManager.interface';

import Button from '@/components/common/Button';
import DialogModalContainer from '@/components/common/DialogModalContainer';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import SearchDrop from '@/components/common/SearchDrop';
import { TURNSTILE_SETUP_INITIAL } from '@/utils/initialData/apiManager.initial';
import { validateTurnStileForm } from '@/utils/validation/addEditTrunstile.validation';

const TURNSTILE_MODE_OPTIONS: TurnstileModeType[] = [
   'non-interactive',
   'invisible',
   'managed',
];

function AddEditTurnStileModal({
   loading,
   showModal,
   setShowModal,
   handelFormSubmitFunction,
   turnstileData,
}: AddTurnstileSetupDrawerProps) {
   const [error, setError] = useState<Record<string, string>>({});
   const [formData, setFormData] = useState<TurnstileSetupFormData>(
      TURNSTILE_SETUP_INITIAL
   );
   const [domainInput, setDomainInput] = useState('');

   const handelSubmitButton = async () => {
      const { isValid, errors } = validateTurnStileForm({ formData });

      if (!isValid) {
         setError(errors);
         return;
      }

      handelFormSubmitFunction(formData, () => handelCancelButton());
   };

   const handelKeyPress = (e: React.KeyboardEvent) => {
      if (!showModal) return;

      if (e.key === 'Enter') {
         e.preventDefault();

         if (domainInput.trim()) {
            handleAddDomain();
            return;
         }

         handelSubmitButton();
      }
   };

   const handelCancelButton = () => {
      setShowModal(false);
      setError({});
      setDomainInput('');
      setFormData(TURNSTILE_SETUP_INITIAL);
   };

   const handleChange = (
      key: keyof TurnstileSetupFormData,
      value: string | string[]
   ) => {
      setFormData((perv) => ({ ...perv, [key]: value }));

      if (error?.[key]) {
         setError((perv) => ({ ...perv, [key]: '' }));
      }
   };

   const handleAddDomain = () => {
      const domain = domainInput.trim().toLowerCase();

      if (!domain) return;

      if (formData.allowed_domains.includes(domain)) {
         setError((perv) => ({
            ...perv,
            allowed_domains: 'This domain is already added',
         }));
         return;
      }

      setFormData((perv) => ({
         ...perv,
         allowed_domains: [...perv.allowed_domains, domain],
      }));

      setDomainInput('');
      setError((perv) => ({ ...perv, allowed_domains: '' }));
   };

   const handleRemoveDomain = (domain: string) => {
      setFormData((perv) => ({
         ...perv,
         allowed_domains: perv.allowed_domains.filter(
            (item) => item !== domain
         ),
      }));
   };

   useEffect(() => {
      if (turnstileData && Object.keys(turnstileData).length > 0) {
         setFormData({
            ...TURNSTILE_SETUP_INITIAL,
            ...turnstileData,
            allowed_domains: turnstileData.allowed_domains || [],
            turnstile_mode: turnstileData.turnstile_mode || 'invisible',
         });
      } else {
         setFormData(TURNSTILE_SETUP_INITIAL);
      }
   }, [turnstileData]);

   return (
      <DialogModalContainer
         show={showModal}
         onClose={handelCancelButton}
         loading={loading}
         maxWidth='600px'
         closeWhenClickOutside={false}
         modalTitle={turnstileData ? 'Edit Turnstile Setup' : 'Setup Turnstile'}
      >
         <div className='w-full'>
            {/* Body */}
            <div
               className='px-5 py-6 flex flex-col gap-5 w-full'
               onKeyDown={handelKeyPress}
            >
               {/* Allowed Domains */}
               <div className='w-full'>
                  <label
                     htmlFor=''
                     className='text-sm font-inter font-normal text-black/65 pb-2 flex items-center justify-start gap-2'
                  >
                     <span className='flex gap-1'>
                        <span>Allowed domain</span>
                        <FaStarOfLife className='w-1.5 text-red-700' />
                     </span>
                  </label>
                  <div className='flex items-start gap-2'>
                     <div className='w-full'>
                        <Input
                           name='allowed_domains'
                           type='text'
                           labelFieldName=''
                           className='border border-black/20 rounded-lg'
                           value={domainInput}
                           onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setDomainInput(e.target.value)
                           }
                           placeHolder='example.com'
                           disabled={loading}
                           showError={!!error?.allowed_domains}
                           errorMessage={error?.allowed_domains}
                        />
                     </div>

                     <Button
                        type='button'
                        className='flex-shrink-0 text-sm font-medium text-white border border-black/20 rounded-lg px-4 py-2.5 bg-black hover:bg-white hover:text-black transition-colors'
                        onClick={handleAddDomain}
                        disabled={loading || !domainInput.trim()}
                     >
                        Add
                     </Button>
                  </div>

                  {formData.allowed_domains.length > 0 && (
                     <div className='flex flex-wrap gap-2 mt-3'>
                        {formData.allowed_domains.map((domain) => (
                           <span
                              key={domain}
                              className='w-fit inline-flex items-center gap-1.5 bg-black/[0.04] border border-black/10 text-black rounded-full px-3 py-1 text-xs font-medium'
                           >
                              {domain}

                              <Button
                                 type='button'
                                 className='text-black/60 hover:text-black'
                                 onClick={() => handleRemoveDomain(domain)}
                                 disabled={loading}
                              >
                                 <FiX className='text-sm' />
                              </Button>
                           </span>
                        ))}
                     </div>
                  )}
               </div>
               <div className='w-full'>
                  <SearchDrop
                     labelFieldName='Turnstile mode'
                     name='turnstile_mode'
                     searchKey=''
                     position='bottom'
                     options={TURNSTILE_MODE_OPTIONS}
                     emptyDataMessage='No Turnstile mode found'
                     isRequiredField={true}
                     selectedValue={formData.turnstile_mode}
                     onSelectValBtn={(data: string | object) =>
                        handleChange(
                           'turnstile_mode',
                           typeof data === 'string' ? data : ''
                        )
                     }
                     showError={!!error?.turnstile_mode}
                     errorMessage={error?.turnstile_mode}
                  />
               </div>
               {/* Manual Setup Fields */}
               <div className='w-full'>
                  <Input
                     name='turnstile_site_key'
                     type='text'
                     labelFieldName='Turnstile site key'
                     className='border border-black/20 rounded-lg'
                     value={formData.turnstile_site_key}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('turnstile_site_key', e.target.value)
                     }
                     isRequiredField={true}
                     disabled={loading}
                     showError={!!error?.turnstile_site_key}
                     errorMessage={error?.turnstile_site_key}
                  />
               </div>

               <div className='w-full'>
                  <Input
                     name='turnstile_secret_key'
                     type='password'
                     labelFieldName='Turnstile secret key'
                     className='border border-black/20 rounded-lg'
                     value={formData.turnstile_secret_key}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('turnstile_secret_key', e.target.value)
                     }
                     isRequiredField={true}
                     disabled={loading}
                     showError={!!error?.turnstile_secret_key}
                     errorMessage={error?.turnstile_secret_key}
                  />
               </div>
            </div>

            {/* Footer */}
            <div className='px-5 pb-5 w-full grid grid-cols-2 gap-2.5'>
               <Button
                  type='button'
                  className='text-black bg-transparent py-2.5 rounded-lg border border-black/20 hover:bg-black/5 transition-colors text-sm font-medium'
                  onClick={() => handelCancelButton()}
                  disabled={loading}
               >
                  Cancel
               </Button>

               <Button
                  type='button'
                  className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                  onClick={handelSubmitButton}
                  disabled={loading}
               >
                  {loading ? (
                     <Loader
                        loaderText={turnstileData ? 'Updating...' : 'Adding...'}
                     />
                  ) : turnstileData ? (
                     <span>Update Turnstile Config</span>
                  ) : (
                     <span>Add Turnstile Config</span>
                  )}
               </Button>
            </div>
         </div>
      </DialogModalContainer>
   );
}

export default AddEditTurnStileModal;
