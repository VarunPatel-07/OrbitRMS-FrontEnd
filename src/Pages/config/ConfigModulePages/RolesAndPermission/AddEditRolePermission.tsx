/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import Button from '../../../../common/Button';
import Input from '../../../../common/Input';
import Loader from '../../../../common/Loader';
import SearchDrop from '../../../../common/SearchDrop';
import TextArea from '../../../../common/TextArea';
import {
  classNames,
  compareTwoNestedObject,
} from '../../../../Helper/HelperFunctions';
import {
  AddRolesAndPermissionInterFace,
  RolesPermissionInterface,
} from '../../../../interface/propsInterface';

interface AddEditRolePermissionProps {
  modalTitle: string;
  loading: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  handelFormSubmitFunction: (value: AddRolesAndPermissionInterFace) => void;
  value: AddRolesAndPermissionInterFace;
  setValue: React.Dispatch<SetStateAction<AddRolesAndPermissionInterFace>>;
  modalType: 'add' | 'edit';
  ActiveRolesPermissionArray: RolesPermissionInterface[];
  dummyValue: AddRolesAndPermissionInterFace;
}

const initialState = {
  role_name: '',
  description: '',
  status: true,
  clone_role_info: {
    clone_role_name: '',
    clone_role_id: '',
    config_module_id: '',
  },
};

function AddEditRolePermission(props: AddEditRolePermissionProps) {
  const {
    modalTitle,
    loading,
    showModal,
    setShowModal,
    handelFormSubmitFunction,
    value,
    setValue,
    modalType,
    ActiveRolesPermissionArray,
    dummyValue,
  } = props;

  const modalBoxRef = useRef<HTMLDivElement>(null);

  const [showError, setShowError] = useState<boolean>(false);

  const handelSubmitButton = async () => {
    if (
      value?.role_name?.trim() == '' ||
      value?.description?.trim() == '' ||
      (value?.clone_role_info?.clone_role_name == '' && modalType == 'add') ||
      (value?.clone_role_info?.clone_role_name == '' && modalType == 'add') ||
      (value?.clone_role_info?.clone_role_name == '' && modalType == 'add')
    ) {
      setShowError(true);
      return;
    }
    handelFormSubmitFunction(value);
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
    setValue(initialState);
  };

  const handelOnChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: _value } = e.target;
    setValue((pervVal) => ({
      ...pervVal,
      [name]: _value,
    }));
  };

  const handleClickOnActiveRoleValue = (data: any) => {
    setValue((pervVal) => ({
      ...pervVal,
      clone_role_info: {
        ...pervVal.clone_role_info,
        clone_role_id: data?.clone_role_id,
        clone_role_name: data?.clone_role_name,
        config_module_id: data?.config_module_id,
      },
    }));
  };

  const handelRoleTogglerFun = () => {
    setValue((pervVal) => ({
      ...pervVal,
      status: value?.status ? false : true,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
        setShowError(false);
      }
    };

    if (showModal && !loading) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loading, setShowModal, showModal]);
  return (
    <div
      className={classNames(
        'w-full h-screen bg-black/30 fixed z-50 top-0 left-0 overflow-hidden transition-all duration-100',
        {
          'opacity-0 invisible': !showModal,
          'opacity-100 visible': showModal,
        }
      )}
    >
      <div className='w-full h-full p-4 flex items-center justify-center overflow-hidden'>
        <div
          className={classNames(
            'bg-white w-full h-fit max-w-[600px] rounded-lg transition-all',
            {
              'opacity-0 scale-50': !showModal,
              'opacity-100 scale-100': showModal,
            }
          )}
          ref={modalBoxRef}
        >
          <div className='w-full'>
            <div className='w-full flex px-5 py-6 border-b border-b-black/20 items-center justify-between'>
              <span className='text-xl text-black font-inter font-semibold'>
                {modalTitle}
              </span>
              <Button
                type='button'
                className=''
                onClick={handelCancelButton}
                disabled={loading}
              >
                <IoCloseOutline className='text-2xl text-black' />
              </Button>
            </div>
            <div
              className='px-5 py-6 mx-auto flex flex-col items-start justify-start w-full gap-4'
              onKeyDown={handelKeyPress}
            >
              <div className='relative w-full'>
                <Input
                  name='role_name'
                  type='text'
                  labelFieldName='Role Name'
                  className='border border-black/45'
                  isRequiredField={true}
                  value={value.role_name}
                  onChange={handelOnChangeFunction}
                  showError={showError}
                  disabled={loading}
                  errorMessage={
                    showError && value?.role_name.trim().length == 0
                      ? 'this is a required field'
                      : ''
                  }
                />
              </div>
              <div className='relative w-full'>
                <TextArea
                  name='description'
                  rows={4}
                  value={value?.description}
                  onChange={handelOnChangeFunction}
                  isRequiredField={true}
                  labelFieldName='Description'
                  showError={showError}
                  errorMessage={
                    showError && value?.description.trim().length == 0
                      ? 'this is a required field'
                      : ''
                  }
                  disabled={loading}
                />
              </div>
              {modalType == 'add' && (
                <div className='w-full'>
                  <SearchDrop
                    options={ActiveRolesPermissionArray.filter(
                      (role) => role.status
                    ).flatMap((role) => [
                      {
                        clone_role_name: role.role_name,
                        clone_role_id: role.id,
                        config_module_id: role.config_module_id,
                      },
                    ])}
                    searchKey='clone_role_name'
                    isRequiredField={true}
                    labelFieldName='Clone Role Name'
                    selectedValue={value?.clone_role_info?.clone_role_name}
                    onSelectValBtn={handleClickOnActiveRoleValue}
                    position='top'
                    emptyDataMessage={'No Option'}
                    showError={showError}
                    errorMessage={
                      showError &&
                      value?.clone_role_info.clone_role_name.trim().length ==
                        0 &&
                      value?.clone_role_info.clone_role_id.trim().length == 0 &&
                      value?.clone_role_info.config_module_id.trim().length == 0
                        ? 'this is a required field'
                        : ''
                    }
                    disabled={loading}
                  />
                </div>
              )}
              <div className='w-full pt-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-black text-base font-normal'>
                    Role Is:
                    <span
                      className={`font-bold transition-all duration-100 ${value.status ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {value.status ? ' Active' : ' Inactive'}
                    </span>
                  </p>
                  <button
                    className={`w-10 h-[18px] rounded-full relative transition-all duration-200 disabled:cursor-not-allowed ${value.status ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={handelRoleTogglerFun}
                    disabled={loading}
                  >
                    <span
                      className={`w-3 h-3 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${value.status ? 'left-6' : 'left-1'}`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
            <div className='px-5 pb-6 w-full grid grid-cols-2 gap-2.5'>
              <Button
                type='button'
                className='text-black bg-transparent py-2 rounded-lg border border-black/45'
                onClick={handelCancelButton}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type='button'
                className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                disabled={loading || compareTwoNestedObject(value, dummyValue)}
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
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditRolePermission;
