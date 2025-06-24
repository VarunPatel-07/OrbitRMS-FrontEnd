import { useEffect, useRef, useState } from 'react';

import EmployeeProfilePicture from '../../../../Components/EmployeeProfilePicture';
import {
  endpointObject,
  multipleFetchApi,
} from '../../../../Helper/api/multipleAPI';
import { InfoField } from '../../../../Helper/Helper';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { InterFaceModuleData } from '../../../../interface/interface';
import { OrganizationSettingsInterface } from '../../../../interface/OrganizationSettings';

const initialData: OrganizationSettingsInterface = {
  id: '',
  status: false,
  updated_at: '',
  created_at: '',
  organization_created: false,
  general_info: {
    country_info: {
      country_code: '',
      country_flag: '',
      country_name: '',
      country_number_code: '',
    },
    email_verified: false,
    id: '',
    is_meta_verified: false,
    meta_key: '',
    meta_value: '',
    organization_id: '',
    organization_name: '',
    organization_profile_picture: '',
    portal_slug: '',
    portal_url: '',
    primary_email: '',
    primary_number: '',
    terms_accepted: true,
    website_url: '',
  },
  address: {
    address: '',
    city: '',
    country: '',
    country_code: '',
    id: '',
    organization_id: '',
    state: '',
    zip_code: '',
  },
  contact_info: [
    {
      company_email: '',
      country_info: '',
      id: '',
      organization_id: '',
      phone_number: '',
    },
  ],
  organization_settings: {
    default_dateformat: '',
    default_timezone: '',
    email_domain_slug: '',
    employee_code_prefix: '',
    id: '',
    intern_code_prefix: '',
    organization_id: '',
  },
  about_info: {
    about: '',
    established_science: '',
    id: '',
    organization_id: '',
    registration_number: '',
  },
};

function GeneralInfo() {
  const useEffectRef = useRef(false);

  const [data, setData] = useState<OrganizationSettingsInterface>(initialData);
  const fetchOrganizationInfoWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: 'organization/fetch-info',
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      setData(res?.data);
    }
  }, 100);

  const organizationGeneralInfo = () => {
    return (
      <div className='bg-white rounded-xl border border-black/15'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            General Information
          </span>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-fit'>
              <EmployeeProfilePicture
                width={120}
                height={120}
                profilePicture={
                  data?.general_info?.organization_profile_picture
                }
              />
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Organization Name'
                    value={data?.general_info.organization_name}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Portal Slug'
                    value={data?.general_info?.portal_slug}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Portal Url'
                    value={data?.general_info?.portal_url}
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Country Name'
                    value={`${data?.general_info?.country_info?.country_name} (${data?.general_info?.country_info?.country_code})`}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Primary Email'
                    value={data?.general_info?.primary_email}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Primary Number'
                    value={`${data?.general_info?.country_info?.country_number_code} - ${data?.general_info?.primary_number}`}
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <div className='w-full flex flex-col items-start justify-start gap-1'>
                    <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
                      Email Verified
                    </span>
                    {data?.general_info?.email_verified ? (
                      <span className='text-green-700 bg-green-100 border border-green-500 rounded px-3 py-1 text-xs font-inter flex'>
                        Verified
                      </span>
                    ) : (
                      <span className='text-yellow-700 bg-yellow-100 border border-yellow-500 rounded px-3 py-1 text-xs font-inter flex'>
                        Verification Required
                      </span>
                    )}
                  </div>
                </div>
                <div className='w-full'>
                  <div className='w-full flex flex-col items-start justify-start gap-1'>
                    <span className='text-sm lg:text-base font-inter font-medium text-black pb-1 inline-block'>
                      Meta Tag Verified
                    </span>
                    {data?.general_info?.is_meta_verified ? (
                      <span className='text-green-700 bg-green-100 border border-green-500 rounded px-3 py-1 text-xs font-inter flex'>
                        Verified
                      </span>
                    ) : (
                      <span className='text-yellow-700 bg-yellow-100 border border-yellow-500 rounded px-3 py-1 text-xs font-inter flex'>
                        Verification Required
                      </span>
                    )}
                  </div>
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Website Url'
                    value={data?.general_info?.website_url}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const organizationAddress = () => {
    return (
      <div className='w-full bg-white rounded-xl border border-black/15'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Address
          </span>
        </div>
        <div className='w-full'>
          <div className='p-6 w-full'>
            <div className='w-full min-w-full grid grid-cols-1 gap-6'>
              <div className='w-full'>
                <InfoField label='Address' value={data?.address?.address} />
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='w-full'>
                  <InfoField label='Country' value={data?.address?.country} />
                </div>
                <div className='w-full'>
                  <InfoField label='State' value={data?.address?.state} />
                </div>
                <div className='w-full'>
                  <InfoField label='City' value={data?.address?.city} />
                </div>
                <div className='w-full h-full'>
                  <InfoField label='Zip Code' value={data?.address?.zip_code} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const organizationAboutInfo = () => {
    return (
      <div className='w-full bg-white rounded-xl border border-black/15'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            About Info
          </span>
        </div>
        <div className='w-full'>
          <div className='p-6 w-full'>
            <div className='w-full min-w-full grid grid-cols-1 gap-6'>
              <div className='w-full'>
                <InfoField label='about' value={data?.about_info?.about} />
              </div>

              <div className='grid grid-cols-2 gap-6'>
                <div className='w-full'>
                  <InfoField
                    label='Established Science'
                    value={data?.about_info?.established_science}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Registration Number'
                    value={data?.about_info?.registration_number}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const organizationContactInfo = () => {
    return (
      <div className='w-full bg-white rounded-xl border border-black/15'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Organization Contact Info
          </span>
        </div>
        <div className='w-full'>
          <div className='p-6 w-full'>
            <div className='w-full'>
              <div className='flex w-full gap-2 items-center pb-2'>
                <div className='grid grid-cols-2 w-full gap-5'>
                  <p className='text-base font-inter font-medium text-black pb-1 inline-block'>
                    Company Email
                  </p>
                  <p className='text-base font-inter font-medium text-black pb-1 inline-block'>
                    Phone Number
                  </p>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-6'>
                {data?.contact_info?.map((eachContact, index) => (
                  <div
                    className='w-full flex items-stretch justify-start gap-5'
                    key={index}
                  >
                    <div className='w-full grid grid-cols-2 gap-5'>
                      <div className='w-full'>
                        <InfoField
                          label=''
                          value={eachContact?.company_email}
                        />
                      </div>
                      <div className='w-full'>
                        <InfoField
                          label=''
                          value={`${eachContact.country_info ? JSON.parse(eachContact.country_info)?.country_number_code : ''} - ${eachContact?.phone_number}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const organizationSettings = () => {
    return (
      <div className='bg-white rounded-xl border border-black/15'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <span className='font-inter text-lg text-black font-semibold capitalize'>
            Organization Settings
          </span>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Default DateFormat'
                    value={data?.organization_settings?.default_dateformat}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Default Timezone'
                    value={data?.organization_settings?.default_timezone}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Email Domain Slug'
                    value={data?.organization_settings?.email_domain_slug}
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <InfoField
                    label='Employee Code Prefix'
                    value={data?.organization_settings?.employee_code_prefix}
                  />
                </div>
                <div className='w-full'>
                  <InfoField
                    label='Intern Code Prefix'
                    value={data?.organization_settings?.intern_code_prefix}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UserInformationDataModules: InterFaceModuleData[] = [
    {
      id: 1,
      label: 'organization_general_info',
      module: organizationGeneralInfo(),
      title: 'General Info',
    },
    {
      id: 2,
      label: 'organization_about_info',
      module: organizationAboutInfo(),
      title: 'Organization About Info',
    },
    {
      id: 3,
      label: 'organization_address',
      module: organizationAddress(),
      title: 'Organization Address',
    },
    {
      id: 4,
      label: 'organization_contact_info',
      module: organizationContactInfo(),
      title: 'Organization Contact Info',
    },
    {
      id: 5,
      label: 'organization_organization_settings',
      module: organizationSettings(),
      title: 'Organization Organization Settings',
    },
  ];

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchOrganizationInfoWithDebounce();
  }, [fetchOrganizationInfoWithDebounce]);

  return (
    <div className='w-full h-[calc(100vh-60px)] overflow-auto hide-scrollbar pt-5 px-5'>
      <div className='w-full flex flex-col gap-6 pb-5'>
        {UserInformationDataModules?.map((section) => (
          <div className='w-full' key={section?.id}>
            {section?.module}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GeneralInfo;
