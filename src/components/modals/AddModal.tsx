import React, { useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';

import { CommanAddModalPropsInterface } from '@/interface/ComponentProps.interface';

import Button from '@/components/common/Button';
import ColorPicker from '@/components/common/ColorPicker';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import SearchDrop from '@/components/common/SearchDrop';
import { formFieldAllowedFieldType } from '@/utils/constants/global.constants';
import { hexToRgb } from '@/utils/helpers/commonHelpers';

import DialogModalContainer from '../common/DialogModalContainer';

function AddModal({
   modalTitle,
   showColorPicker,
   showPreview,
   labelFieldName,
   loading,
   showModal,
   setShowModal,
   handelFormSubmitFunction,
   value,
   setValue,
   modalType,
   color,
   setColor,
   fieldType,
   setFieldType,
   isRequiredField,
   setIsRequiredField,
   dummyValue,
   dummyColor,
   dummyFieldType,
}: CommanAddModalPropsInterface) {
   const [showError, setShowError] = useState<boolean>(false);

   const handelSubmitButton = async () => {
      if (
         loading || showColorPicker
            ? Boolean(value == dummyValue && color == dummyColor)
            : fieldType !== undefined && setFieldType
              ? Boolean(fieldType == dummyFieldType && value == dummyValue)
              : Boolean(value == dummyValue)
      )
         return;
      if (value?.trim() == '') {
         setShowError(true);
         return;
      }
      if (fieldType !== undefined && setFieldType) {
         if (fieldType?.trim() == '') {
            setShowError(true);
            return;
         }
      }
      handelFormSubmitFunction(value, color);
      setShowError(false);
   };

   const handelKeyPress = (e: React.KeyboardEvent) => {
      if (!showModal) return;

      if (e.key === 'Enter') {
         handelSubmitButton();
      }
   };

   const handelCancelButton = () => {
      setShowModal(false);
      setShowError(false);
      setValue('');
      if (
         fieldType !== undefined &&
         setFieldType &&
         typeof setIsRequiredField === 'function'
      ) {
         setFieldType('');
         setIsRequiredField('');
      }
   };

   return (
      <DialogModalContainer
         show={showModal}
         onClose={handelCancelButton}
         loading={loading}
         maxWidth='600px'
         modalTitle={modalTitle}
      >
         <div className='w-full'>
            <div
               className='px-5 py-10 mx-auto flex flex-col items-start justify-start w-full'
               onKeyDown={handelKeyPress}
            >
               <label
                  htmlFor=''
                  className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
               >
                  <span className='flex gap-1'>
                     <span>{labelFieldName}</span>
                     <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
               </label>
               <div className='relative w-full'>
                  <Input
                     name='text'
                     type='text'
                     className='border border-black/45'
                     isRequiredField={true}
                     value={value}
                     setValue={setValue}
                     disabled={loading}
                  />
                  {showColorPicker && color && setColor && (
                     <div className='absolute top-1/2 -translate-y-1/2 right-3.5 mt-[-1.5px]'>
                        <ColorPicker color={color} setColor={setColor} />
                     </div>
                  )}
               </div>
               {showError && value?.trim().length == 0 && (
                  <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                     this is a required field
                  </span>
               )}

               {showPreview && color && (
                  <div
                     className='px-2.5 py-0.5 rounded-full inline-block w-fit mt-2.5'
                     style={{
                        color: color,
                        border: `1px solid ${color}`,
                        backgroundColor: `rgba(${hexToRgb(color)}, 0.15)`,
                     }}
                  >
                     <span className='text-xs'>{value || 'Project'}</span>
                  </div>
               )}
               {fieldType !== undefined &&
                  setFieldType &&
                  typeof setIsRequiredField === 'function' && (
                     <div className='w-full mt-3.5'>
                        <div className='w-full flex flex-col items-start justify-start gap-3.5'>
                           <div className='w-full'>
                              <SearchDrop
                                 options={formFieldAllowedFieldType}
                                 searchKey=''
                                 position='bottom'
                                 emptyDataMessage=''
                                 showSearchBar={false}
                                 labelFieldName='Type'
                                 isRequiredField
                                 selectedValue={fieldType}
                                 setSelectedValue={setFieldType}
                                 showError={showError}
                                 errorMessage={
                                    fieldType ? '' : 'this field is required'
                                 }
                                 disabled={loading}
                              />
                           </div>
                           <div className='flex items-center justify-start gap-1.5'>
                              <Input
                                 type='checkbox'
                                 name='termsAccepted'
                                 value={isRequiredField}
                                 setValue={setIsRequiredField}
                              />
                              <span className='text-black font-light text-sm font-inter'>
                                 Required Field
                              </span>
                           </div>
                        </div>
                     </div>
                  )}
            </div>
            <div className='px-5 pb-6 w-full grid grid-cols-2 gap-2.5'>
               <Button
                  type='button'
                  className='text-black bg-transparent py-2 rounded-lg border border-black/45 hover:bg-gray-800/5'
                  onClick={() => handelCancelButton()}
                  disabled={loading}
               >
                  Cancel
               </Button>
               <button
                  className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                  disabled={
                     loading || showColorPicker
                        ? Boolean(value == dummyValue && color == dummyColor)
                        : fieldType !== undefined && setFieldType
                          ? Boolean(
                               fieldType == dummyFieldType &&
                               value == dummyValue
                            )
                          : Boolean(value == dummyValue)
                  }
                  onClick={handelSubmitButton}
               >
                  {loading ? (
                     <Loader
                        loaderText={
                           modalType == 'add' ? 'Adding...' : 'Updating...'
                        }
                     />
                  ) : modalType == 'add' ? (
                     <span>Add</span>
                  ) : (
                     <span>Update</span>
                  )}
               </button>
            </div>
         </div>
      </DialogModalContainer>
   );
}

export default AddModal;
