import { useEffect, useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';

import {
   SignUpFormStepOneProps,
   SignUpFormStepTwoProps,
} from '@/interface/Global.interface';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import SearchDrop from '@/components/common/SearchDrop';
import {
   EMPLOYEE_COUNTS_ARRAY,
   INDUSTRY_WE_SERVE_ARRAY,
} from '@/utils/constants/global.constants';
import { formateAndVerifyPhoneNumber } from '@/utils/helpers/commonHelpers';
import {
   ValidateStepOneOfSignUpForm,
   ValidateStepTwoOfSignUpForm,
} from '@/utils/validation/auth.validation';

export function SignUpFormStepOne({
   formData,
   loading,
   countryOptionsDataArray,
   setFormData,
   setCurrentPage,
}: SignUpFormStepOneProps) {
   const [errors, setErrors] = useState<Record<string, string> | null>(null);

   const handelInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleMoveToNextPage = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { isValid, errors } = ValidateStepOneOfSignUpForm({
         value: formData,
      });

      if (!isValid) {
         setErrors(errors);
         return;
      } else {
         setErrors(null);
      }

      setCurrentPage(2);
   };

   useEffect(() => {
      setFormData((prev) => ({
         ...prev,
         portalUrl: formData.organizationName
            ?.toLocaleLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-'),
      }));
   }, [formData.organizationName]);
   return (
      <form
         onSubmit={handleMoveToNextPage}
         className='w-full flex items-center justify-center'
      >
         <div className='grid grid-cols-1 gap-y-5  w-full min-w-full px-5 transition-all duration-100 min-h-[340px]'>
            <div className='w-full'>
               <Input
                  name='organizationName'
                  className='border border-black/[.65] text-black'
                  labelFieldName='Organization Name'
                  isRequiredField={true}
                  type='text'
                  value={formData?.organizationName}
                  onChange={(e) => handelInputFieldChange(e)}
                  disabled={loading}
                  showError={!!errors?.organizationName}
                  errorMessage={errors?.organizationName}
               />
            </div>
            <div className='w-full'>
               <Input
                  name='primaryEmail'
                  className='border border-black/[.65] text-black'
                  labelFieldName='Primary Email'
                  isRequiredField={true}
                  value={formData.primaryEmail}
                  type='email'
                  onChange={(e) => handelInputFieldChange(e)}
                  disabled={loading}
                  showError={!!errors?.primaryEmail}
                  errorMessage={errors?.primaryEmail}
               />
            </div>
            <div className='w-full'>
               <label
                  htmlFor=''
                  className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
               >
                  <span className='flex gap-1'>
                     <span>Portal Url</span>
                     <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
               </label>
               <div className='relative w-full flex items-stretch justify-start'>
                  <div className='flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-5'>
                     <span className='block text-nowrap text-ellipsis overflow-hidden max-w-[180px]'>
                        {formData.defaultPortalUrlSlug}
                     </span>
                  </div>
                  <Input
                     name='portalUrl'
                     className='border border-black/[.65] border-l-0 rounded-l-none text-black w-full'
                     type='text'
                     value={formData?.portalUrl?.toLocaleLowerCase()}
                     onChange={(e) => handelInputFieldChange(e)}
                     disabled={loading}
                  />
               </div>
               {!!errors?.portalUrl && formData?.portalUrl.trim() === '' && (
                  <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                     This field is required.
                  </span>
               )}
            </div>
            <div className='w-full'>
               <Input
                  type='number'
                  name='contactNumber'
                  className='border border-black/[.65] text-black rounded-lg rounded-l-none'
                  labelFieldName='Contact Number'
                  isRequiredField={true}
                  value={formateAndVerifyPhoneNumber(
                     formData?.contactNumber,
                     formData?.countryInfo
                        ? JSON.parse(formData?.countryInfo as string)
                             ?.country_code
                        : 'IN'
                  )}
                  onChange={(e) => handelInputFieldChange(e)}
                  countryDropDownPosition='bottom'
                  dropDownSelectedValue={
                     formData?.countryInfo
                        ? JSON.parse(formData?.countryInfo as string)
                             ?.country_number_code
                        : '+91'
                  }
                  setDropDownSelectedValue={(value: string | number) => {
                     setFormData((prev) => ({
                        ...prev,
                        countryInfo: JSON.stringify(value),
                     }));
                  }}
                  countryOptionsData={countryOptionsDataArray}
                  disabled={loading}
                  showError={!!errors?.contactNumber}
                  errorMessage={errors?.contactNumber}
               />
            </div>
            <div className='w-full'>
               <Button
                  type='submit'
                  className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all'
                  disabled={loading}
               >
                  <span>Next</span>
               </Button>
            </div>
         </div>
      </form>
   );
}

export function SignUpFormStepTwo({
   formData,
   loading,
   setFormData,
   handelSignUpSubmitForm,
}: SignUpFormStepTwoProps) {
   const [errors, setErrors] = useState<Record<string, string> | null>(null);

   const handelInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handelClickOnSearchDrop = (
      data: string | object,
      key: 'industry' | 'employeeCount'
   ) => {
      setFormData((prevData) => ({
         ...prevData,
         [key]: data,
      }));
   };

   const handelClickOnTermsAccepted = () => {
      setFormData((prevData) => ({
         ...prevData,
         termsAccepted: !prevData.termsAccepted,
      }));
   };

   const handelFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { isValid, errors } = await ValidateStepTwoOfSignUpForm({
         value: formData,
      });

      console.log(
         '🚀 ~ file: utils.tsx:174 ~ handelFormSubmit ~ errors:',
         errors,
         isValid
      );

      if (!isValid) {
         setErrors(errors);
         return;
      } else {
         setErrors(null);
      }

      handelSignUpSubmitForm(e);
   };

   return (
      <form
         onSubmit={handelFormSubmit}
         className='w-full flex items-center justify-center'
      >
         <div className='flex flex-col gap-y-5 justify-between w-full min-w-full px-5 transition-all duration-100 min-h-[340px]'>
            <div className='w-full'>
               <Input
                  name='websiteUrl'
                  className='border border-black/[.65] text-black'
                  labelFieldName='Website URL'
                  type='text'
                  value={formData?.websiteUrl}
                  onChange={(e) => handelInputFieldChange(e)}
                  showError={!!errors?.websiteUrl}
                  errorMessage={errors?.websiteUrl}
                  disabled={loading}
               />
            </div>
            <div className='w-full'>
               <SearchDrop
                  options={INDUSTRY_WE_SERVE_ARRAY}
                  searchKey='value'
                  isRequiredField={true}
                  labelFieldName='Organization Type'
                  selectedValue={formData.industry.value}
                  onSelectValBtn={(data) =>
                     handelClickOnSearchDrop(data, 'industry')
                  }
                  position='bottom'
                  emptyDataMessage={'No Option'}
                  showError={!!errors?.industry}
                  errorMessage={errors?.industry}
                  disabled={loading}
               />
            </div>
            <div className='w-full'>
               <SearchDrop
                  options={EMPLOYEE_COUNTS_ARRAY}
                  searchKey=''
                  isRequiredField={true}
                  labelFieldName='Employee Strength'
                  selectedValue={formData.employeeCount}
                  onSelectValBtn={(data) =>
                     handelClickOnSearchDrop(data, 'employeeCount')
                  }
                  position='bottom'
                  emptyDataMessage={'No Option'}
                  showError={!!errors?.employeeCount}
                  errorMessage={errors?.employeeCount}
                  disabled={loading}
               />
            </div>
            <div className='w-full'>
               <div className='w-full flex items-center justify-start gap-3.5 relative z-[25]'>
                  <Input
                     type='checkbox'
                     name='termsAccepted'
                     value={formData.termsAccepted}
                     onClick={handelClickOnTermsAccepted}
                     checkboxLabel={
                        <div className='flex flex-col items-start justify-start gap-0.5 ml-3'>
                           <p className='font-inter font-semibold text-sm text-black'>
                              I agree to the terms and conditions
                           </p>
                           <p className='font-inter font-normal text-xs text-black'>
                              Please read the Terms and Conditions before
                              proceeding.
                           </p>
                        </div>
                     }
                  />
               </div>
               {!!errors?.employeeCount && formData?.termsAccepted && (
                  <span className='text-rose-600  text-xs  mt-1.5 block px-1.5 font-inter'>
                     This field is required.
                  </span>
               )}
            </div>
            <div className='w-full'>
               <Button
                  type='submit'
                  className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed'
                  disabled={loading}
               >
                  {loading ? (
                     <Loader loaderText='Submitting...' />
                  ) : (
                     <span>Submit</span>
                  )}
               </Button>
            </div>
         </div>
      </form>
   );
}
