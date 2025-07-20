import { FaStarOfLife } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import CommonDatePicker from '../../../../common/CommonDatePicker';
import Input from '../../../../common/Input';
import SearchDrop from '../../../../common/SearchDrop';
import {
  employeeTypesArray,
  OrganizationEmployeeStatusArray,
} from '../../../../constant/constant';
import { classNames } from '../../../../Helper/HelperFunctions';
import { EmployeeEmployerInformationPropsInterface } from '../../../../interface/AddEditUserProfileInterFace';
import {
  DepartmentConfig,
  DesignationConfig,
  EmployeeRoleModuleInterface,
  ReportingManagerModuleInterface,
} from '../../../../interface/interface';

function EmployeeInformation(props: EmployeeEmployerInformationPropsInterface) {
  const {
    formData,
    setFormData,
    showEmptyFieldError,
    handelSearchDropSelectValue,
    GlobalStateProvider,
    handleOnChange,
    employeeFormDropdowns,
    fetchingDesignationsDepartments,
    formSubmitLoader,
  } = props;

  const { type: moduleType } = useParams();

  const handelOnClickReportingManager = (
    data: ReportingManagerModuleInterface
  ) => {
    setFormData((perValue) => ({
      ...perValue,
      employee_info: {
        ...perValue.employee_info,
        reporting_to: { id: data.user_id, name: data.full_name },
      },
    }));
  };

  const handelOnClickEmployeeRole = (data: EmployeeRoleModuleInterface) => {
    setFormData((perValue) => ({
      ...perValue,
      employee_info: {
        ...perValue.employee_info,
        employee_role: { role_id: data.id, role_name: data.role_name },
      },
    }));
  };

  const handelJoiningDateOfEmployee = (date: Date | null) => {
    setFormData((pervValue) => ({
      ...pervValue,
      employee_info: {
        ...pervValue.employee_info,
        joining_date: date,
      },
    }));
  };

  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
        <h2 className='font-inter text-xl text-black font-semibold capitalize'>
          Employee Information
        </h2>
        <p className='font-inter text-base text-black font-light w-[70%]'>
          Enter key employment details to help us manage records accurately and
          maintain a complete employee profile.
        </p>
      </div>
      <div className='p-6 w-full'>
        <div className='grid grid-cols-1 gap-6'>
          <div className='w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              <div className='w-full'>
                <SearchDrop
                  options={OrganizationEmployeeStatusArray}
                  searchKey=''
                  position='bottom'
                  emptyDataMessage='No Status Found'
                  showSearchBar={true}
                  labelFieldName='Status'
                  isRequiredField={true}
                  selectedValue={formData?.employee_info?.status}
                  disabled={formSubmitLoader}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(data, 'status', 'employee_info')
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.status
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <Input
                  type='text'
                  name='employee_info.organization_name'
                  labelFieldName='Organization Name'
                  className='border border-black/45'
                  isRequiredField={true}
                  disabled
                  value={formData.employee_info?.organization_name}
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.organization_name
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <SearchDrop
                  options={employeeFormDropdowns.departmentOptions}
                  searchKey='department_name'
                  position='bottom'
                  emptyDataMessage='No Department Found'
                  showSearchBar={true}
                  labelFieldName='Department'
                  isRequiredField={true}
                  selectedValue={formData?.employee_info?.department}
                  loading={fetchingDesignationsDepartments['departments']}
                  disabled={formSubmitLoader}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(
                      (data as DepartmentConfig).department_name,
                      'department',
                      'employee_info'
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.department
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              <div className='w-full'>
                <SearchDrop
                  options={employeeFormDropdowns.designationOptions}
                  searchKey='designations_name'
                  position='bottom'
                  emptyDataMessage='No Designation Found'
                  showSearchBar={true}
                  labelFieldName='Designation'
                  isRequiredField={true}
                  disabled={formSubmitLoader}
                  loading={fetchingDesignationsDepartments['designations']}
                  selectedValue={formData?.employee_info?.designation}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(
                      (data as DesignationConfig).designations_name,
                      'designation',
                      'employee_info'
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.designation
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <SearchDrop
                  options={employeeFormDropdowns.reportingManagerOptions}
                  searchKey='full_name'
                  position='bottom'
                  emptyDataMessage='No Reporting Manager Found'
                  showSearchBar={true}
                  labelFieldName='Reporting To'
                  disabled={formSubmitLoader}
                  isRequiredField={true}
                  loading={fetchingDesignationsDepartments['reporting_to']}
                  selectedValue={formData?.employee_info?.reporting_to?.name}
                  onSelectValBtn={(data: string | object) =>
                    handelOnClickReportingManager(
                      data as ReportingManagerModuleInterface
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.reporting_to?.name
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <SearchDrop
                  options={employeeFormDropdowns.employeeRoleOptions}
                  searchKey='role_name'
                  position='bottom'
                  emptyDataMessage='No Role Found'
                  disabled={formSubmitLoader}
                  showSearchBar={true}
                  labelFieldName='Employee Role'
                  isRequiredField={true}
                  loading={fetchingDesignationsDepartments['employee_role']}
                  selectedValue={
                    formData?.employee_info?.employee_role?.role_name
                  }
                  onSelectValBtn={(data: string | object) =>
                    handelOnClickEmployeeRole(
                      data as EmployeeRoleModuleInterface
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.employee_role?.role_name
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <SearchDrop
                  options={employeeTypesArray}
                  searchKey=''
                  position='bottom'
                  disabled={formSubmitLoader}
                  emptyDataMessage='No Role Found'
                  showSearchBar={true}
                  labelFieldName='Employee Type'
                  isRequiredField={true}
                  loading={fetchingDesignationsDepartments['employee_role']}
                  selectedValue={formData?.employee_info?.employee_type}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(
                      data,
                      'employee_type',
                      'employee_info'
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.employee_type
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <CommonDatePicker
                  onChange={handelJoiningDateOfEmployee}
                  selectedValue={formData?.employee_info?.joining_date as Date}
                  name='joining_date'
                  disabled={formSubmitLoader}
                  labelFieldName='Joining Date'
                  isRequiredField={true}
                  datePickerPosition={'left-start'}
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.employee_info?.joining_date
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='grid grid-cols-2 gap-5'>
              <div className='w-full'>
                <label
                  htmlFor=''
                  className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
                >
                  <span className='flex gap-1'>
                    <span>Employee Code</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </label>
                <div className='relative w-full flex items-stretch justify-start'>
                  <div
                    className={classNames(
                      'flex items-center justify-center border border-[#7fab98] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-3 whitespace-nowrap',
                      { 'border-r-0': formSubmitLoader }
                    )}
                  >
                    {formData?.employee_info?.status.toLocaleLowerCase() ==
                    'intern'
                      ? GlobalStateProvider?.organization?.organization_settings
                          ?.intern_code_prefix
                      : GlobalStateProvider?.organization?.organization_settings
                          ?.employee_code_prefix}{' '}
                    -
                  </div>
                  <Input
                    name='employee_info.employee_code'
                    className='border border-[#7fab98] border-l-0 rounded-l-none text-black w-full'
                    type='number'
                    disabled={formSubmitLoader}
                    value={formData?.employee_info?.employee_code
                      ?.split('-')
                      .pop()}
                    onChange={handleOnChange}
                  />
                </div>
                {showEmptyFieldError &&
                formData?.employee_info?.employee_code?.trim() == '' ? (
                  <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                    This field is required.
                  </span>
                ) : (
                  ''
                )}
              </div>
              <div className='w-full'>
                <label
                  htmlFor=''
                  className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
                >
                  <span className='flex gap-1'>
                    <span>Employee Email</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </label>
                <div className='relative w-full flex items-stretch justify-start'>
                  <Input
                    name='employee_info.employee_email'
                    className='border border-black/[.65] border-r-0 rounded-r-none text-black w-full'
                    type='text'
                    value={formData?.employee_info?.employee_email
                      ?.split('@')[0]
                      .toLocaleLowerCase()}
                    onChange={handleOnChange}
                    disabled={
                      moduleType?.toLocaleLowerCase() === 'edit' ||
                      formSubmitLoader
                    }
                  />
                  <div
                    className={classNames(
                      'flex items-center justify-center border border-[#7fab98] text-black w-fit bg-[#7FAB984D] rounded-r-lg text-[14px] px-3 whitespace-nowrap',
                      {
                        'border-l-0': moduleType?.toLocaleLowerCase() == 'edit',
                      }
                    )}
                  >
                    @
                    {
                      GlobalStateProvider?.organization?.general_info?.primary_email?.split(
                        '@'
                      )[1]
                    }
                  </div>
                </div>
                {showEmptyFieldError &&
                formData?.employee_info?.employee_email?.trim() == '' ? (
                  <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                    This field is required.
                  </span>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeInformation;
