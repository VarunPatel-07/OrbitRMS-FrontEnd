/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaStarOfLife } from 'react-icons/fa';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';

import CommonDatePicker from '../../../../common/CommonDatePicker';
import Input from '../../../../common/Input';
import SearchDrop from '../../../../common/SearchDrop';
import {
  AlignableForChildInfo,
  MARITAL_STATUS,
} from '../../../../constant/constant';
import { EmployeeFamilyInfoInterface } from '../../../../interface/AddEditUserProfileInterFace';

function EmployeeFamilyInfo(props: EmployeeFamilyInfoInterface) {
  const {
    formData,
    handleOnChange,
    showEmptyFieldError,
    setFormData,
    handelSearchDropSelectValue,
    formSubmitLoader,
    disabled,
  } = props;

  const handleEmergencyContactField = (
    index: number,
    name: string,
    ParentSectionName: 'personal_contact_info' | 'family_info',
    SubSectionName: 'emergency_contacts' | 'children',
    dateOfBirth?: Date | null,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      name == 'child_date_of_birth' ? dateOfBirth : e?.target?.value;
    if (value == undefined) return;
    setFormData((prevData) => {
      const ParentSection = prevData[ParentSectionName];
      const SubSection = ParentSection[
        SubSectionName as keyof typeof ParentSection
      ] as any;

      if (!Array.isArray(SubSection)) return prevData;

      const UpdatedSubSectionInfo = SubSection.map((data: object, i: number) =>
        i === index ? { ...data, [name]: value } : data
      );

      return {
        ...prevData,
        [ParentSectionName]: {
          ...ParentSection,
          [SubSectionName]: UpdatedSubSectionInfo,
        },
      };
    });
  };

  const handelAddNewChild = () => {
    if (
      formData.family_info.children.every(
        (contacts) =>
          contacts.child_date_of_birth !== null && contacts.child_name !== ''
      )
    ) {
      setFormData((pervData) => ({
        ...pervData,
        family_info: {
          ...pervData.family_info,
          children: [
            ...pervData.family_info.children,
            {
              child_date_of_birth: null,
              child_name: '',
              family_info_id: '',
              id: '',
            },
          ],
        },
      }));
    }
  };

  const removeSpecificChild = (index: number) => {
    setFormData((pervData) => ({
      ...pervData,
      family_info: {
        ...pervData.family_info,
        children: pervData.family_info.children.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
        <h2 className='font-inter text-xl text-black font-semibold capitalize'>
          Family information
        </h2>
        <p className='font-inter text-base text-black font-light w-[70%]'>
          Provide your family information to help us support you better and
          ensure accurate records for benefits and emergency planning.
        </p>
      </div>
      <div className='p-6 w-full'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='w-full'>
            <div className='w-full grid grid-cols-2 gap-5'>
              <div className='w-full'>
                <Input
                  type='text'
                  name='family_info.father_name'
                  labelFieldName='Father Name'
                  className='border border-black/45'
                  isRequiredField={true}
                  value={formData.family_info?.father_name}
                  onChange={handleOnChange}
                  showError={showEmptyFieldError}
                  disabled={disabled ? disabled : formSubmitLoader}
                  errorMessage={
                    formData.family_info?.father_name
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <Input
                  type='text'
                  name='family_info.mother_name'
                  labelFieldName='Mother Name'
                  className='border border-black/45'
                  isRequiredField={true}
                  value={formData.family_info?.mother_name}
                  onChange={handleOnChange}
                  disabled={disabled ? disabled : formSubmitLoader}
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData.family_info?.mother_name
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <SearchDrop
                  options={MARITAL_STATUS}
                  searchKey=''
                  position='bottom'
                  emptyDataMessage=''
                  labelFieldName='Marital Status'
                  isRequiredField
                  showSearchBar={false}
                  disabled={disabled ? disabled : formSubmitLoader}
                  selectedValue={formData?.family_info?.marital_status}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(
                      data,
                      'marital_status',
                      'family_info'
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.family_info?.marital_status
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {AlignableForChildInfo.includes(
          formData?.family_info?.marital_status
        ) && (
          <div className='w-full transition-all'>
            <h2 className='font-inter text-base text-black font-medium pt-7 pb-3 border-b border-b-black/30'>
              Child Information
            </h2>
            <div className='flex w-full gap-2 items-center pb-2 pt-6'>
              <div className='grid grid-cols-2 w-full gap-2.5'>
                <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                  <span className='flex gap-1'>
                    <span>Children Name</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </p>
                <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                  <span className='flex gap-1'>
                    <span>Children Date Of Birth</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </p>
              </div>
              <div className='min-w-[100px]'></div>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              {formData?.family_info.children.map((eachChild, index) => (
                <div
                  className='w-full flex items-stretch justify-start gap-5'
                  key={index}
                >
                  <div className='w-full grid grid-cols-2 gap-5'>
                    <div className='w-full'>
                      <Input
                        type='text'
                        name='child_name'
                        className='border border-black/45'
                        isRequiredField={true}
                        disabled={disabled ? disabled : formSubmitLoader}
                        value={eachChild?.child_name}
                        onChange={(e) =>
                          handleEmergencyContactField(
                            index,
                            'child_name',
                            'family_info',
                            'children',
                            undefined,
                            e
                          )
                        }
                        showError={showEmptyFieldError}
                        errorMessage={
                          AlignableForChildInfo.includes(
                            formData?.family_info?.marital_status
                          )
                            ? eachChild?.child_name
                              ? ''
                              : 'this field is required'
                            : ''
                        }
                      />
                    </div>
                    <div className='w-full'>
                      <CommonDatePicker
                        onChange={(date) =>
                          handleEmergencyContactField(
                            index,
                            'child_date_of_birth',
                            'family_info',
                            'children',
                            date
                          )
                        }
                        disabled={disabled ? disabled : formSubmitLoader}
                        selectedValue={eachChild?.child_date_of_birth as Date}
                        name='child_date_of_birth'
                        datePickerPosition={'left-start'}
                        showError={showEmptyFieldError}
                        errorMessage={
                          AlignableForChildInfo.includes(
                            formData?.family_info?.marital_status
                          )
                            ? eachChild?.child_date_of_birth
                              ? ''
                              : 'this field is required'
                            : ''
                        }
                      />
                    </div>
                  </div>
                  <div className='min-w-[100px] grid grid-cols-2 gap-2.5 max-h-[41px]'>
                    {index == formData.family_info.children.length - 1 && (
                      <button
                        className='bg-green-100 h-full w-full rounded-[4px] flex items-center justify-center border border-green-600 text-black text-xl'
                        onClick={handelAddNewChild}
                      >
                        <MdModeEditOutline />
                      </button>
                    )}
                    {formData.family_info.children.length > 1 && (
                      <button
                        className='bg-rose-100 h-full w-full rounded-[4px] flex items-center justify-center border border-rose-500 text-black text-xl'
                        onClick={() => removeSpecificChild(index)}
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeFamilyInfo;
