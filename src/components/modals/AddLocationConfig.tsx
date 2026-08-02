import React, { useEffect, useState } from 'react';

import { FiAlertTriangle } from 'react-icons/fi';

import { AddLocationConfigInterface } from '@/interface/ComponentProps.interface';
import { OrgLocationConfigDataArrayInterface } from '@/interface/OrganizationSettings.interface';

import { ERROR_MESSAGES } from '@/utils/constants/errorMessages.constants';
import { compareTwoNestedObject } from '@/utils/helpers/commonHelpers';
import { LOCATION_CONFIG_INITIAL } from '@/utils/initialData/orgSettings.initial';
import { OrgLocationConfigValidation } from '@/utils/validation/orgSettings.validation';

import Button from '../common/Button';
import DialogModalContainer from '../common/DialogModalContainer';
import Input from '../common/Input';
import Loader from '../common/Loader';
import SearchDrop from '../common/SearchDrop';

function AddLocationConfig({
   loading,
   showModal,
   setShowModal,
   handelFormSubmitFunction,
   locationData,
}: AddLocationConfigInterface) {
   const [error, setError] = useState<Record<string, string>>({});
   const [formData, setFromData] =
      useState<OrgLocationConfigDataArrayInterface>(LOCATION_CONFIG_INITIAL);
   const [locationPermission, setLocationPermission] = useState<
      'denied' | 'granted' | 'prompt'
   >('denied');
   const [isLocationUpdated, setIsisLocationUpdated] = useState(false);

   const handelSubmitButton = async () => {
      const { isValid, errors } = OrgLocationConfigValidation({
         values: formData,
      });
      if (!isValid) {
         setError(errors);
         return;
      }
      handelFormSubmitFunction(formData, () => handelCancelButton());
   };
   const handelKeyPress = (e: React.KeyboardEvent) => {
      if (!showModal) return;

      if (e.key === 'Enter') {
         handelSubmitButton();
      }
   };

   const handelCancelButton = () => {
      setShowModal(false);
      setError({});
      setFromData(LOCATION_CONFIG_INITIAL);
      setIsisLocationUpdated(false);
   };

   const handleChange = (
      key: 'location_name' | 'allowed_radius_meters',
      value: string | number
   ) => {
      setFromData((perv) => ({ ...perv, [key]: value }));
   };

   const toggleSwitchHandler = () => {
      setFromData((perv) => ({ ...perv, status: !perv?.status }));
   };

   const addMyCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(
         (data) => {
            setFromData((perv) => ({
               ...perv,
               location_coordinates: {
                  accuracy: data?.coords?.accuracy,
                  latitude: data?.coords?.latitude,
                  longitude: data?.coords?.longitude,
               },
            }));
         },
         () => {
            setLocationPermission('denied');
         }
      );
      if (locationData) {
         setIsisLocationUpdated(true);
      }
   };

   useEffect(() => {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
         setLocationPermission(result.state);

         // Optional: listen for changes
         result.onchange = () => {
            setLocationPermission(result.state);
         };
      });
   }, []);

   useEffect(() => {
      if (locationData && Object.keys(locationData).length > 0) {
         setFromData(locationData);
      } else {
         setFromData(LOCATION_CONFIG_INITIAL);
      }
   }, [locationData]);

   return (
      <DialogModalContainer
         show={showModal}
         onClose={handelCancelButton}
         loading={loading}
         maxWidth='600px'
         modalTitle={
            locationData ? 'Edit Location Config' : 'Add Location Config'
         }
      >
         <div className='w-full'>
            {/* Body */}
            <div
               className='px-5 py-6 flex flex-col gap-5 w-full'
               onKeyDown={handelKeyPress}
            >
               {/* Location Name */}
               <div className='w-full'>
                  <Input
                     name='location_name'
                     type='text'
                     labelFieldName='Location name'
                     className='border border-black/20 rounded-lg'
                     value={formData?.location_name}
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange('location_name', e.target.value)
                     }
                     isRequiredField={true}
                     disabled={loading}
                     showError={!!error?.location_name}
                     errorMessage={error?.location_name}
                  />
               </div>

               {/* Allowed Radius */}
               <div className='w-full'>
                  <SearchDrop
                     labelFieldName='Allowed radius (meters)'
                     name='allowed_radius_meters'
                     searchKey=''
                     position='bottom'
                     options={['500', '1000', '1500']}
                     emptyDataMessage='No allowed range found'
                     isRequiredField={true}
                     selectedValue={String(formData?.allowed_radius_meters)}
                     onSelectValBtn={(data: string | object) =>
                        handleChange(
                           'allowed_radius_meters',
                           typeof data === 'string' ? Number(data) : 500
                        )
                     }
                     showError={!!error?.allowed_radius_meters}
                     errorMessage={error?.allowed_radius_meters}
                  />
               </div>

               {/* Status Toggle */}
               <div className='w-full bg-black/[0.03] rounded-lg px-4 py-3 flex items-center justify-between'>
                  <div>
                     <p className='text-sm font-medium text-black'>
                        Location config
                     </p>
                     <p className='text-xs text-black/50 mt-0.5'>
                        Enable or disable this location
                     </p>
                  </div>
                  <Button
                     type='button'
                     className={`w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0 ${formData.status ? 'bg-green-500' : 'bg-red-400'}`}
                     onClick={() => toggleSwitchHandler()}
                     disabled={loading}
                  >
                     <span
                        className={`w-[18px] h-[18px] bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.status ? 'left-[22px]' : 'left-[3px]'}`}
                     />
                  </Button>
               </div>

               {/* Current Location */}
               <div>
                  {' '}
                  {locationPermission === 'denied' ? (
                     <div className='w-full h-16 rounded-lg px-4 py-3 flex items-center justify-between gap-3 bg-yellow-50 border border-yellow-400'>
                        <FiAlertTriangle className='text-yellow-800 text-2xl' />
                        <p className='text-sm font-medium text-yellow-700'>
                           {ERROR_MESSAGES.LOCATION_PERMISSION_DENIED}
                        </p>
                     </div>
                  ) : formData?.location_coordinates ? (
                     <>
                        {locationData && isLocationUpdated ? (
                           <div className='w-full h-14 rounded-lg px-4 py-3 flex items-center justify-between gap-3 bg-green-50 border border-green-800'>
                              <p className='text-sm font-semibold text-green-800'>
                                 {compareTwoNestedObject(
                                    formData?.location_coordinates,
                                    locationData
                                 )
                                    ? 'Location Added Successfully'
                                    : 'Location Updated Successfully'}
                              </p>
                           </div>
                        ) : (
                           <div
                              className={`w-full bg-black/[0.03] h-16 rounded-lg px-4 py-3 flex items-center justify-between gap-3 border ${error?.location_coordinates ? 'border-rose-600' : 'border-gray-200'}`}
                           >
                              <div className='w-fit'>
                                 <p className='text-sm font-medium text-black'>
                                    Update current location
                                 </p>
                                 <p className='text-xs text-black/50 mt-0.5'>
                                    Automatically fill coordinates
                                 </p>
                              </div>
                              <Button
                                 type='button'
                                 className='flex-shrink-0 text-sm font-medium text-white border border-black/20 rounded-lg px-3 py-1.5 bg-black hover:bg-white hover:text-black transition-colors'
                                 onClick={addMyCurrentLocation}
                                 disabled={loading}
                              >
                                 Update location
                              </Button>
                           </div>
                        )}
                     </>
                  ) : (
                     <div
                        className={`w-full bg-black/[0.03] h-16 rounded-lg px-4 py-3 flex items-center justify-between gap-3 border ${error?.location_coordinates ? 'border-rose-600' : 'border-gray-200'}`}
                     >
                        <div className='w-fit'>
                           <p className='text-sm font-medium text-black'>
                              Use my current location
                           </p>
                           <p className='text-xs text-black/50 mt-0.5'>
                              Automatically fill coordinates
                           </p>
                        </div>
                        <Button
                           type='button'
                           className='flex-shrink-0 text-sm font-medium text-white border border-black/20 rounded-lg px-3 py-1.5 bg-black hover:bg-white hover:text-black transition-colors'
                           onClick={addMyCurrentLocation}
                           disabled={loading}
                        >
                           Add location
                        </Button>
                     </div>
                  )}
                  {!formData?.location_coordinates &&
                     error?.location_coordinates && (
                        <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                           {error?.location_coordinates}
                        </span>
                     )}
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
                  disabled={
                     loading ||
                     compareTwoNestedObject(
                        formData,
                        locationData ? locationData : LOCATION_CONFIG_INITIAL
                     )
                  }
               >
                  {loading ? (
                     <Loader
                        loaderText={locationData ? 'Adding...' : 'Updating...'}
                     />
                  ) : locationData ? (
                     <span>Update location</span>
                  ) : (
                     <span>Add location</span>
                  )}
               </Button>
            </div>
         </div>
      </DialogModalContainer>
   );
}

export default AddLocationConfig;
