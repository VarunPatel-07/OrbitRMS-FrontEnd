import { LuUser } from 'react-icons/lu';
import { MdOutlineEmail } from 'react-icons/md';

import EmployeeProfilePicture from '../../Components/EmployeeProfilePicture';
import { AlignableForChildInfo } from '../../constant/constant';
import { formateDate } from '../../Helper/HelperFunctions';
import {
  AddressModuleInterface,
  UserProfileInformationInterface,
} from '../../interface/AddEditUserProfileInterFace';
import { InterFaceModuleData } from '../../interface/interface';

interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  renderDate?: boolean;
}
const InfoField = ({ label, value, renderDate = false }: InfoFieldProps) => (
  <div className='w-full'>
    {label?.trim() !== '' && (
      <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
        {label}
      </span>
    )}

    {renderDate ? (
      <p className='text-base text-black font-inter font-medium'>
        {value ? formateDate(value as string, false) : '-'}
      </p>
    ) : (
      <p className='text-base text-black font-inter font-medium'>
        {value || '-'}
      </p>
    )}
  </div>
);

function EmployeeDetails(props: { data: UserProfileInformationInterface }) {
  const { data } = props;
  // This are The Bunch Of Function That Help To Render The components
  // * ------ Start Of The Function That Help In The Rendering -----
  //
  const employee_general_info = () => {
    return (
      <div className='bg-white rounded-xl'>
        <div className='w-full'>
          <div className='w-full grid grid-cols-3'>
            <div className='w-full border-r border-r-black/40'>
              <div className='w-full h-full flex flex-col items-start justify-end p-6'>
                <div className='w-full'>
                  <div className='p-2 border border-black/25 rounded-md w-fit mb-3'>
                    <MdOutlineEmail className='text-black w-6 h-6' />
                  </div>
                  <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                    Email Address
                  </span>
                  <p className='text-base text-black font-inter font-medium'>
                    {data?.employee_info?.employee_email || '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className='w-full border-r border-r-black/40'>
              <div className='w-full h-full flex flex-col items-start justify-end p-6'>
                <div className='w-full'>
                  <div className='p-2 border border-black/25 rounded-md w-fit mb-3'>
                    <LuUser className='text-black w-6 h-6' />
                  </div>
                  <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                    Employee Code
                  </span>
                  <p className='text-base text-black font-inter font-medium'>
                    {data?.employee_info?.employee_code || '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full h-full flex flex-col items-start justify-end p-6'>
                <div className='w-full'>
                  <div className='w-fit mb-3'>
                    <EmployeeProfilePicture width={40} height={40} />
                  </div>
                  <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                    Reporting Manager
                  </span>
                  {data?.employee_info?.reporting_manager?.first_name ? (
                    <p className='text-base text-black font-inter font-medium'>
                      {data?.employee_info?.reporting_manager?.full_name
                        ? data?.employee_info?.reporting_manager?.full_name
                        : data?.employee_info?.reporting_manager?.first_name +
                          ' ' +
                          data?.employee_info?.reporting_manager?.middle_name +
                          ' ' +
                          data?.employee_info?.reporting_manager?.last_name}
                    </p>
                  ) : (
                    <p className='text-base text-black font-inter font-medium'>
                      -
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const personal_information = () => {
    return (
      <div className='bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Personal Information
          </span>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='First Name'
                    value={data.personal_info.first_name}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Middle Name'
                    value={data.personal_info.middle_name}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Last Name'
                    value={data.personal_info.last_name}
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField label='Gender' value={data.personal_info.gender} />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Date Of Birth'
                    value={data.personal_info.date_of_birth}
                    renderDate
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Blood Group'
                    value={data.personal_info.blood_group}
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <InfoField label='About Info' value={data.personal_info.about} />
            </div>
          </div>
        </div>
      </div>
    );
  };
  const employee_information = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Employee Information
          </span>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <div className='w-full'>
                    <span className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                      Status
                    </span>

                    <p className='text-base text-black font-inter font-medium'>
                      {data.employee_info?.status || '-'}
                    </p>
                  </div>
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Organization Name'
                    value={data.employee_info?.organization_name}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Department'
                    value={data.employee_info?.department}
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Designation'
                    value={data.employee_info?.designation}
                  />
                </div>

                <div className='w-full'>
                  <InfoField
                    label='Employee Role'
                    value={data.employee_info?.employee_role?.role_name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const personal_contact_information = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Personal contact information
          </span>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-2 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Personal Email'
                    value={data.personal_contact_info.personal_email}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Contact Number'
                    value={data.personal_contact_info.mobile_number}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='flex w-full gap-2 items-center pb-2 pt-6'>
              <div className='grid grid-cols-2 w-full gap-2.5'>
                <p className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Emergency Contact Name
                </p>
                <p className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                  Emergency Contact Number
                </p>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              {data?.personal_contact_info?.emergency_contacts?.map(
                (eachContact, index) => (
                  <div
                    className='w-full flex items-stretch justify-start gap-5'
                    key={index}
                  >
                    <div className='w-full grid grid-cols-2 gap-5'>
                      <div className='w-full'>
                        <InfoField
                          label=''
                          value={eachContact?.emergency_contact_name}
                        />
                      </div>
                      <div className='w-full'>
                        <InfoField
                          label=''
                          value={eachContact?.emergency_contact_number}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const family_info = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Family information
          </span>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-2 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Father Name'
                    value={data.family_info?.father_name}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Mother Name'
                    value={data.family_info?.mother_name}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Marital Status'
                    value={data.family_info?.marital_status}
                  />
                </div>
              </div>
            </div>
          </div>
          {AlignableForChildInfo.includes(
            data?.family_info?.marital_status
          ) && (
            <div className='w-full'>
              <div className='flex w-full gap-2 items-center pb-2 pt-6'>
                <div className='grid grid-cols-2 w-full gap-2.5'>
                  <p className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                    Children Name
                  </p>
                  <p className='text-sm font-inter font-normal text-black/60 pb-0.5 inline-block'>
                    Children Date Of Birth
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-6'>
                {data?.family_info?.children?.map((child, index) => (
                  <div
                    className='w-full flex items-stretch justify-start gap-5'
                    key={index}
                  >
                    <div className='w-full grid grid-cols-2 gap-5'>
                      <div className='w-full'>
                        <InfoField label='' value={child?.child_name} />
                      </div>
                      <div className='w-full'>
                        <InfoField
                          label=''
                          value={child?.child_date_of_birth}
                          renderDate
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  const RenderTheAddressFieldDynamically = (module: AddressModuleInterface) => {
    return (
      <div className='w-full min-w-full grid grid-cols-1 gap-6'>
        <div className='w-full'>
          <InfoField label='Address' value={module?.address} />
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div className='w-full'>
            <InfoField label='Country' value={module?.country} />
          </div>
          <div className='w-full'>
            <InfoField label='State' value={module?.state} />
          </div>
          <div className='w-full'>
            <InfoField label='City' value={module?.city} />
          </div>
          <div className='w-full h-full'>
            <InfoField label='Zip Code' value={module?.zip_code} />
          </div>
        </div>
      </div>
    );
  };

  const RenderAddressComponent = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Current Information
          </span>
        </div>
        <div className='w-full'>
          <div className='p-6 w-full'>
            {RenderTheAddressFieldDynamically(data.current_address)}
          </div>
          <div className='py-3 px-6 w-full bg-gray-50 border-t border-t-black/10  rounded-b-xl'>
            <div className='w-full flex items-center justify-start gap-1.5'>
              <p className='text-black capitalize font-inter text-sm'>
                permanent address
              </p>
              <p className='text-black capitalize font-inter text-sm'>-</p>
              <p className='text-indigo-600 capitalize font-inter text-sm'>
                same as current address
              </p>
            </div>

            {!data?.same_as_current_address ? (
              <div className='pb-3 mt-6 transition-all'>
                {RenderTheAddressFieldDynamically(data.permanent_address)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const UserInformationDataModules: InterFaceModuleData[] = [
    {
      id: 1,
      label: 'employee_general_info',
      module: employee_general_info(),
      title: 'Personal Info',
    },
    {
      id: 2,
      label: 'personal_information',
      module: personal_information(),
      title: 'Personal Info',
    },
    {
      id: 3,
      label: 'employee_information',
      module: employee_information(),
      title: 'Employee Info',
    },
    {
      id: 4,
      label: 'personal_contact_information',
      module: personal_contact_information(),
      title: 'Personal Contact Information',
    },
    {
      id: 5,
      label: 'family_info',
      module: family_info(),
      title: 'Family information',
    },
    {
      id: 6,
      label: 'address',
      module: RenderAddressComponent(),
      title: 'Address',
    },
  ];
  //
  // * ------ End Of The Function That Help In The Rendering -----
  //
  return (
    <div className='w-full flex flex-col gap-6 pb-5'>
      {UserInformationDataModules?.map((section) => (
        <div className='w-full' key={section?.id}>
          {section?.module}
        </div>
      ))}
    </div>
  );
}

export default EmployeeDetails;
