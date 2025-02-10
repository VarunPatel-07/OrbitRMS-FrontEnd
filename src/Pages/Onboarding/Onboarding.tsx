/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa';

import orbitLogo from '../../assets/Images/OrbitRMS-Final-Logo-transperent.png';
import Input from '../../common/Input';
import TextArea from '../../common/TextArea';
import { classNames } from '../../Helper/HelperFunctions';
import { OnboardingFormInterface } from '../../interface/interface';

const initialState = {
  general_info: {
    organization_name: '',
    primary_email: '',
    primary_number: '',
    country_info: null,
    portal_url: '',
    website_url: '',
    is_meta_verified: false,
    meta_key: '',
    meta_value: '',
    terms_accepted: false,
    email_verified: false,
    organization_profile_picture: '',
  },
  address: {
    address: '',
    city: '',
    state: '',
    zip_code: '',
  },
  contact_info: {
    phone_number: '',
    company_email: '',
  },
  about_info: {
    about: '',
    established_science: '',
    registration_number: '',
  },
  organization_settings: {
    email_domain_slug: '',
    employee_code_prefix: '',
    inter_code_prefix: '',
    default_timezone: '',
  },
};

function Onboarding() {
  const [formData, setFormData] =
    useState<OnboardingFormInterface>(initialState);
  const [currentVisibleSection, setCurrentVisibleSection] = useState<number>(0);

  const generalInfoSectionRef = useRef<HTMLDivElement>(null);
  const addressSectionRef = useRef<HTMLDivElement>(null);
  const contactInfoSectionRef = useRef<HTMLDivElement>(null);
  const aboutInfoSectionRef = useRef<HTMLDivElement>(null);
  const organizationSettingRef = useRef<HTMLDivElement>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    setFormData((previous) => {
      const updatedData = { ...previous };
      let nested: any = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!nested[keys[i]]) {
          nested[keys[i]] = {}; // Ensure the nested object exists
        }
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = value;

      return { ...updatedData };
    });

    console.log(formData);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry?.isIntersecting) {
            setCurrentVisibleSection(Number(entry?.target?.id));
          }
        });
      },
      { threshold: 0.5 }
    );

    const referenceArray = [
      generalInfoSectionRef.current,
      addressSectionRef.current,
      contactInfoSectionRef.current,
      aboutInfoSectionRef.current,
      organizationSettingRef.current,
    ].filter(Boolean);
    referenceArray.forEach((ref) => observer.observe(ref as HTMLDivElement));
    return () => {
      referenceArray.forEach((ref) =>
        observer.unobserve(ref as HTMLDivElement)
      );
    };
  }, []);

  return (
    <div className='h-screen w-full bg-[var(--main-white-color)] overflow-hidden relative'>
      <div className='navbar w-full bg-white px-5 py-2 fixed top-0 left-0 z-20'>
        <img
          src={orbitLogo}
          alt='OrbitRMS Logo'
          className='max-w-[200px] h-fit max-h-[40px]'
        />
      </div>
      <div className='w-full px-5 py-6 pt-[76px] h-full flex items-stretch gap-5'>
        {/* main form */}
        <div className='w-[80%] h-full mx-auto p-6 pb-0 rounded-lg'>
          <div className='w-full h-full flex flex-col gap-10 overflow-auto hide-scrollbar'>
            {/* general Info */}
            <div
              id='1'
              ref={generalInfoSectionRef}
              className='w-full flex items-start justify-start gap-5'
            >
              <div className='w-[20%] flex flex-col items-start justify-start gap-1.5 pt-3'>
                <h3 className='text-xl font-inter font-semibold text-black'>
                  General Info
                </h3>
                <p className='font-inter text-sm text-black/60'>
                  Essential details about the organization for registration.
                </p>
              </div>
              <div className='w-[80%] bg-white rounded-lg p-5 grid grid-cols-1 gap-5'>
                <div className='w-full'>
                  <Input
                    name='general_info.organization_profile_picture'
                    type='file'
                    RequiredFileTypeArray={[
                      'image/png',
                      'image/jpeg',
                      'image/webp',
                    ]}
                    labelFieldName='Organization Profile Picture'
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='general_info.organization_name'
                    labelFieldName='Organization Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.general_info.organization_name}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='general_info.portal_url'
                    labelFieldName='Portal Url'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.general_info.portal_url}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='w-full'>
                    <Input
                      type='text'
                      name='general_info.primary_email'
                      labelFieldName='Primary Email'
                      className='border border-black/45'
                      isRequiredField={true}
                      value={formData.general_info.primary_email}
                      onChange={handleOnChange}
                      disabled={true}
                    />
                  </div>
                  <div className='w-full h-full'>
                    <label
                      htmlFor=''
                      className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
                    >
                      <span className='flex gap-1'>
                        <span>Primary Number</span>
                        <FaStarOfLife className='w-1.5 text-red-700' />
                      </span>
                    </label>

                    <div className='w-full flex items-stretch justify-start h-[42px]'>
                      <div
                        className='rounded-l-lg font-inter overflow-hidden h-full border border-[#7fab98] border-r-0 bg-[#7fab98]/15 flex items-center justify-center px-3.5'
                        aria-disabled='true'
                      >
                        <span className='font-inter text-sm text-black'>
                          +91
                        </span>
                      </div>
                      <input
                        type='text'
                        className='rounded-r-lg w-full relative focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] font-inter overflow-hidden h-full disabled:border disabled:border-[#7fab98] disabled:bg-[#7fab98]/15'
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id='2'
              ref={addressSectionRef}
              className='w-full flex items-start justify-start gap-5'
            >
              <div className='w-[20%] flex flex-col items-start justify-start gap-1.5 pt-3'>
                <h3 className='text-xl font-inter font-semibold text-black'>
                  Address
                </h3>
                <p className='font-inter text-sm text-black/60'>
                  Enter Your Organization Address
                </p>
              </div>
              <div className='w-[80%] bg-white rounded-lg p-5 grid grid-cols-1 gap-5'>
                <div className='w-full'>
                  <TextArea name='address.address' />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='general_info.portal_url'
                    labelFieldName='Portal Url'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.general_info.portal_url}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='w-full'>
                    <Input
                      type='text'
                      name='general_info.primary_email'
                      labelFieldName='Primary Email'
                      className='border border-black/45'
                      isRequiredField={true}
                      value={formData.general_info.primary_email}
                      onChange={handleOnChange}
                      disabled={true}
                    />
                  </div>
                  <div className='w-full h-full'>
                    <div className='flex gap-1'>
                      <span className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'>
                        Primary Number
                      </span>
                      <FaStarOfLife className='w-1.5 text-red-700' />
                    </div>
                    <div className='w-full flex items-stretch justify-start h-[42px]'>
                      <div
                        className='rounded-l-lg font-inter overflow-hidden h-full border border-[#7fab98] border-r-0 bg-[#7fab98]/15 flex items-center justify-center px-3.5'
                        aria-disabled='true'
                      >
                        <span className='font-inter text-sm text-black'>
                          +91
                        </span>
                      </div>
                      <input
                        type='text'
                        className='rounded-r-lg w-full relative focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] font-inter overflow-hidden h-full disabled:border disabled:border-[#7fab98] disabled:bg-[#7fab98]/15'
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id='3'
              ref={contactInfoSectionRef}
              className='w-full flex items-start justify-start gap-5'
            >
              <div className='w-[20%] flex flex-col items-start justify-start gap-1.5 pt-3'>
                <h3 className='text-xl font-inter font-semibold text-black'>
                  General Info
                </h3>
                <p className='font-inter text-sm text-black/60'>
                  Essential details about the organization for registration.
                </p>
              </div>
              <div className='w-[80%] bg-white rounded-lg p-5 grid grid-cols-1 gap-5'>
                <div className='w-full'>
                  <Input
                    name='general_info.organization_profile_picture'
                    type='file'
                    RequiredFileTypeArray={[
                      'image/png',
                      'image/jpeg',
                      'image/webp',
                    ]}
                    labelFieldName='Organization Profile Picture'
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='general_info.organization_name'
                    labelFieldName='Organization Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.general_info.organization_name}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='general_info.portal_url'
                    labelFieldName='Portal Url'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.general_info.portal_url}
                    onChange={handleOnChange}
                    disabled={true}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='w-full'>
                    <Input
                      type='text'
                      name='general_info.primary_email'
                      labelFieldName='Primary Email'
                      className='border border-black/45'
                      isRequiredField={true}
                      value={formData.general_info.primary_email}
                      onChange={handleOnChange}
                      disabled={true}
                    />
                  </div>
                  <div className='w-full h-full'>
                    <div className='flex gap-1'>
                      <span className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'>
                        Primary Number
                      </span>
                      <FaStarOfLife className='w-1.5 text-red-700' />
                    </div>
                    <div className='w-full flex items-stretch justify-start h-[42px]'>
                      <div
                        className='rounded-l-lg font-inter overflow-hidden h-full border border-[#7fab98] border-r-0 bg-[#7fab98]/15 flex items-center justify-center px-3.5'
                        aria-disabled='true'
                      >
                        <span className='font-inter text-sm text-black'>
                          +91
                        </span>
                      </div>
                      <input
                        type='text'
                        className='rounded-r-lg w-full relative focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] font-inter overflow-hidden h-full disabled:border disabled:border-[#7fab98] disabled:bg-[#7fab98]/15'
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* sidebar navigation */}
        <div className='w-[20%] pt-6'>
          <div className='w-full'>
            <div className='flex items-start justify-start gap-2'>
              <div className='w-fit flex items-center flex-col justify-center'>
                <span
                  className={classNames(
                    'w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-all',
                    {
                      'bg-white text-black': currentVisibleSection <= 1,
                      'bg-indigo-500 text-white': currentVisibleSection > 1,
                    }
                  )}
                >
                  1
                </span>
                <div className='h-12 w-1.5 relative overflow-hidden'>
                  <span
                    className={classNames(
                      'inline-block w-1.5 h-full bg-indigo-500 origin-top transition-all duration-300 absolute top-0 left-0',
                      {
                        'scale-y-0': currentVisibleSection <= 1,
                        'scale-y-100': currentVisibleSection > 1,
                      }
                    )}
                  ></span>
                  <span className='w-1.5 h-full bg-indigo-200 inline-block'></span>
                </div>
              </div>
              <span
                className={classNames(
                  'w-full h-8 flex items-center justify-start font-medium',
                  {
                    'text-black': currentVisibleSection <= 1,
                    'text-indigo-700': currentVisibleSection > 1,
                  }
                )}
              >
                General Info{' '}
              </span>
            </div>
            <div className='flex items-start justify-start gap-2'>
              <div className='w-fit flex items-center flex-col justify-center'>
                <span
                  className={classNames(
                    'w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-all',
                    {
                      'bg-white text-black opacity-50':
                        currentVisibleSection < 2,
                      'bg-white text-black': currentVisibleSection == 2,
                      'bg-indigo-500 text-white': currentVisibleSection > 2,
                    }
                  )}
                >
                  2
                </span>
                <div className='h-12 w-1.5 relative overflow-hidden'>
                  <span
                    className={classNames(
                      'inline-block w-1.5 h-full bg-indigo-500 origin-top transition-all duration-300 absolute top-0 left-0',
                      {
                        'scale-y-0': currentVisibleSection <= 2,
                        'scale-y-100': currentVisibleSection > 2,
                      }
                    )}
                  ></span>
                  <span className='w-1.5 h-full bg-indigo-200 inline-block'></span>
                </div>
              </div>
              <span
                className={classNames(
                  'w-full h-8 flex items-center justify-start font-medium',
                  {
                    'text-black opacity-50': currentVisibleSection < 3,
                    'text-black': currentVisibleSection == 3,
                    'text-indigo-700': currentVisibleSection > 3,
                  }
                )}
              >
                Address
              </span>
            </div>
            <div className='flex items-start justify-start gap-2'>
              <div className='w-fit flex items-center flex-col justify-center'>
                <span
                  className={classNames(
                    'w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-all',
                    {
                      'bg-white text-black opacity-50':
                        currentVisibleSection < 3,
                      'bg-white text-black': currentVisibleSection == 3,
                      'bg-indigo-500 text-white': currentVisibleSection > 3,
                    }
                  )}
                >
                  3
                </span>
                <div className='h-12 w-1.5 relative overflow-hidden'>
                  <span
                    className={classNames(
                      'inline-block w-1.5 h-full bg-indigo-500 origin-top transition-all duration-300 absolute top-0 left-0',
                      {
                        'scale-y-0': currentVisibleSection <= 3,
                        'scale-y-100': currentVisibleSection > 3,
                      }
                    )}
                  ></span>
                  <span className='w-1.5 h-full bg-indigo-200 inline-block'></span>
                </div>
              </div>
              <span
                className={classNames(
                  'w-full h-8 flex items-center justify-start font-medium',
                  {
                    'text-black opacity-50': currentVisibleSection < 3,
                    'text-black': currentVisibleSection == 3,
                    'text-indigo-700': currentVisibleSection > 3,
                  }
                )}
              >
                Contact Info
              </span>
            </div>
            <div className='flex items-start justify-start gap-2'>
              <div className='w-fit flex items-center flex-col justify-center'>
                <span
                  className={classNames(
                    'w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-all',
                    {
                      'bg-white text-black opacity-50':
                        currentVisibleSection < 4,
                      'bg-white text-black': currentVisibleSection == 4,
                      'bg-indigo-500 text-white': currentVisibleSection > 4,
                    }
                  )}
                >
                  4
                </span>
                <div className='h-12 w-1.5 relative overflow-hidden'>
                  <span
                    className={classNames(
                      'inline-block w-1.5 h-full bg-indigo-500 origin-top transition-all duration-300 absolute top-0 left-0',
                      {
                        'scale-y-0': currentVisibleSection <= 4,
                        'scale-y-100': currentVisibleSection > 4,
                      }
                    )}
                  ></span>
                  <span className='w-1.5 h-full bg-indigo-200 inline-block'></span>
                </div>
              </div>
              <span
                className={classNames(
                  'w-full h-8 flex items-center justify-start font-medium',
                  {
                    'text-black opacity-50': currentVisibleSection < 4,
                    'text-black': currentVisibleSection == 4,
                    'text-indigo-700': currentVisibleSection > 4,
                  }
                )}
              >
                About Info
              </span>
            </div>
            <div className='flex items-start justify-start gap-2'>
              <div className='w-fit flex items-center flex-col justify-center'>
                <span
                  className={classNames(
                    'w-8 h-8 flex items-center justify-center rounded-full text-base font-bold transition-all',
                    {
                      'bg-white text-black opacity-50':
                        currentVisibleSection < 4,
                      'bg-white text-black': currentVisibleSection == 4,
                      'bg-indigo-500 text-white': currentVisibleSection > 4,
                    }
                  )}
                >
                  5
                </span>
              </div>
              <span
                className={classNames(
                  'w-full h-8 flex items-center justify-start font-medium',
                  {
                    'text-black opacity-50': currentVisibleSection < 4,
                    'text-black': currentVisibleSection == 4,
                    'text-indigo-700': currentVisibleSection > 4,
                  }
                )}
              >
                About Info
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
