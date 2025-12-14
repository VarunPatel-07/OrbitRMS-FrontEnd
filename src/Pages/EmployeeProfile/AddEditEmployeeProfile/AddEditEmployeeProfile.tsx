import { useContext, useEffect, useRef, useState } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumbs from '../../../common/Breadcrumbs';
import AccessDeniedRedirect from '../../../Components/AccessDeniedRedirect';
import {
  AddEditEmployeeFormInitialState,
  BreadcrumbsObjects,
  initialCountryInfo,
} from '../../../constant/AddEditEmployeeForm';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import { responseToStateDataFeeder } from '../../../Helper/AddEditProfileHelper';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
  multiplePutApi,
} from '../../../Helper/api/multipleAPI';
import {
  countryObject,
  fetchFormattedCountryData,
} from '../../../Helper/countryDataHelper';
import {
  compareTwoNestedObject,
  getDataFromLocalStorage,
} from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import {
  AddEditUserProfileInterFace,
  UserProfileInformationInterface,
} from '../../../interface/AddEditUserProfileInterFace';
import { CountryDataInterface } from '../../../interface/interface';
import AddEditEmployeeProfileFooter from './AddEditEmployeeProfileFooterbar';
import AddEditEmployeeProfileSkeletonLoader from './AddEditEmployeeProfileSkeletonLoader';
import AddEditComponentListing from './AddEditProfileHelper/AddEditComponentListing';
import { EmployeeFormValidator } from './AddEditProfileHelper/userProfileValidation';

function AddEditEmployeeProfile() {
  const { type: moduleType, id: employee_id } = useParams();

  const navigate = useNavigate();

  const { GlobalStateProvider, setGlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { organization } = useParams();

  //
  //? This is An Line Of Code That Is Used For The Roles And Permission Related Things
  //
  const segments = location.pathname.split('/').filter(Boolean);
  const parentSection = segments[1];
  const childSection = segments[2];

  const permissionData = GlobalStateProvider?.roles_permissions?.permissions
    ?.find((item) => item.module_label == parentSection)
    ?.sub_modules?.find(
      (item) =>
        item?.module_label == (childSection == 'manage' && 'employee_profile')
    );

  const hasPermissionForTheEmpListing =
    GlobalStateProvider.roles_permissions.permissions
      .find((item) => item.module_label == parentSection)
      ?.sub_modules?.find((item) => item?.module_label == 'employee_listing');

  const subModulePermissionData = permissionData?.sub_modules?.find(
    (item) => item.module_label == 'employee_details'
  );

  const hasNoPermissionToViewProfile =
    !permissionData ||
    !permissionData?.is_active ||
    !permissionData?.permissions?.some(
      (item) => item?.label == 'view' && item?.is_allowed
    ) ||
    !subModulePermissionData ||
    !subModulePermissionData?.is_active ||
    !subModulePermissionData?.permissions?.some(
      (item) => item?.label == 'view' && item?.is_allowed
    );

  //
  //
  //

  const fetchCountryReference = useRef(false);
  const employeeInfoFetchRef = useRef(false);

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization_slug =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const [formData, setFormData] = useState<AddEditUserProfileInterFace>(
    AddEditEmployeeFormInitialState
  );

  const [showEmptyFieldError, setShowEmptyFieldError] =
    useState<boolean>(false);

  const [dummyFormData, setDummyFormData] =
    useState<AddEditUserProfileInterFace>(AddEditEmployeeFormInitialState);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);
  const [isFetchingCountryData, setIsFetchingCountryData] =
    useState<boolean>(false);
  const [countryData, setCountryData] = useState<CountryDataInterface[]>([]);
  const [countryOptionsDataArray, setCountryOptionsDataArray] = useState<
    Array<countryObject>
  >([]);
  const [fetchingTheEmployeeData, setFetchingTheEmployeeData] =
    useState<boolean>(false);

  const [
    selectedCountryInfoForCurrentAddress,
    setSelectedCountryInfoForCurrentAddress,
  ] = useState<CountryDataInterface>(initialCountryInfo);
  const [filteredCountry, setFilteredCountry] = useState<string>('');

  const BreadcrumbsObject = BreadcrumbsObjects(
    organization_slug,
    moduleType,
    employee_id
  );

  const handelEditProfileApiWithDebounce = useDebounce(
    async (data: AddEditUserProfileInterFace, id: string) => {
      const endPoint: endpointObject[] = [
        {
          endPoint: `employee/edit?employee-id=${id}`,
          protected: true,
          data: data,
        },
      ];
      const response = await multiplePutApi(endPoint);

      const res = response[0];
      if (res?.success) {
        setFormSubmitLoader(false);
        handelNotification(res, 'top-right');

        if (employee_id == GlobalStateProvider.user.personal_info.user_id) {
          const endPointArr: endpointObject[] = [
            {
              endPoint: `employee/fetch-profile?employee_id=${id}`,
              protected: true,
            },
          ];

          const response = await multipleFetchApi(endPointArr);
          const _res = response[0];

          setGlobalStateProvider((perValue) => ({
            ...perValue,
            organization: perValue.organization,
            user: _res.data,
          }));
        }
        if (
          !hasPermissionForTheEmpListing ||
          hasPermissionForTheEmpListing.is_active ||
          hasPermissionForTheEmpListing?.permissions?.some(
            (item) => item?.label == 'view' && item?.is_allowed
          )
        ) {
          navigate(`/${organization_slug}/employees/employee-listing`);
        } else {
          navigate(`/${organization_slug}/employees/employee-listing`);
          navigate(
            `/${organization_slug}/employees/employee-profile/${id}/employee-details`
          );
        }
      } else {
        setFormSubmitLoader(false);
        handelNotification(res, 'top-right');
      }
    },
    100
  );
  const handelAddNewEmployeeWithDebounce = useDebounce(
    async (data: AddEditUserProfileInterFace) => {
      const endPoint: endpointObject[] = [
        {
          endPoint: `employee/add?organization-id=${GlobalStateProvider?.organization?.id}`,
          protected: true,
          data: data,
        },
      ];
      const response = await multiplePostApi(endPoint);

      const res = response[0];
      if (res?.success) {
        setFormSubmitLoader(false);
        handelNotification(res, 'top-right');
        setFormData(AddEditEmployeeFormInitialState);
        setDummyFormData(AddEditEmployeeFormInitialState);
        navigate(`/${organization_slug}/employees/employee-listing`);
      } else {
        setFormSubmitLoader(false);
        handelNotification(res, 'top-right');
      }
    },
    100
  );
  // The function to handel the Form Submit
  const handelSubmitAndUpdateButton = () => {
    const invalidModule = EmployeeFormValidator(formData);

    if (!invalidModule.validated && invalidModule.errorModule !== '') {
      setShowEmptyFieldError(true);
    } else {
      if (moduleType?.toLocaleLowerCase() == 'edit') {
        if (employee_id && !compareTwoNestedObject(dummyFormData, formData)) {
          setFormSubmitLoader(true);
          handelEditProfileApiWithDebounce(formData, employee_id);
        }
      } else {
        setFormSubmitLoader(true);
        handelAddNewEmployeeWithDebounce(formData);
      }
    }
  };

  const fetchTheUsersProfileInfoWithDebounce = useDebounce(
    async (id: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `employee/fetch-employee-profile?employee_id=${id}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        const data: UserProfileInformationInterface = res?.data;
        responseToStateDataFeeder(
          data,
          setFormData,
          setDummyFormData,
          filteredCountry
        );

        setFetchingTheEmployeeData(false);
        const endpointArray: Array<endpointObject> = [
          {
            endPoint: `country-info/getFormats?country-code=${data?.current_address?.country_code || 'IN'}`,
            protected: false,
          },
        ];
        const currentAddressResponse = await multipleFetchApi(endpointArray);
        const currentAddressRes = currentAddressResponse[0]?.data;
        if (res?.success) {
          setSelectedCountryInfoForCurrentAddress((perValue) => ({
            ...perValue,
            country_code: data?.current_address?.country_code,
            country_name: data?.current_address?.country,
            postal_code: currentAddressRes?.postal_code_formate,
          }));
        }
      }
    },
    100
  );

  const fetchCountryNumberCode = async () => {
    const response = await fetchFormattedCountryData();

    if (response?.success) {
      setCountryOptionsDataArray(response?.countryOptionsData);

      setFormData((prevData) => {
        const prevContactInfo = prevData.personal_contact_info || {};
        const prevEmergencyContacts = Array.isArray(
          prevContactInfo.emergency_contacts
        )
          ? prevContactInfo.emergency_contacts
          : [];

        const updatedContactInfo = {
          ...prevContactInfo,
          country_info: JSON.stringify(response.filteredCountry),
          emergency_contacts: prevEmergencyContacts.map((contact, index) =>
            index === 0
              ? {
                  ...contact,
                  emergency_contact_country_info: JSON.stringify(
                    response.filteredCountry
                  ),
                }
              : contact
          ),
        };

        return {
          ...prevData,
          personal_contact_info: updatedContactInfo,
        };
      });

      setFilteredCountry(JSON.stringify(response.filteredCountry));
    }
  };

  const fetchCountryDataHelper = async () => {
    if (countryData.length == 0) {
      setIsFetchingCountryData(true);
      const endpointArray: Array<endpointObject> = [
        {
          endPoint: 'country-info/fetchAllCountry',
          protected: false,
        },
      ];

      const response = await multipleFetchApi(endpointArray);
      const res = response[0];

      if (res?.success) {
        setCountryData(res.data);
      }

      setIsFetchingCountryData(false);
    }
  };

  useEffect(() => {
    if (fetchCountryReference.current) return;
    fetchCountryReference.current = true;
    if (organization) {
      setFormData((pervValue) => ({
        ...pervValue,
        employee_info: {
          ...pervValue.employee_info,
          organization_name: organization,
        },
      }));
    }
    fetchCountryNumberCode();
    fetchCountryDataHelper();
  }, []);

  useEffect(() => {
    if (!employeeInfoFetchRef.current) {
      employeeInfoFetchRef.current = true;
      if (
        moduleType &&
        !['edit', 'add'].includes(moduleType?.toLocaleLowerCase())
      ) {
        const data = {
          success: false,
          message: 'Only Add/Edit allowed. Redirecting to Employee Page.',
        };

        handelNotification(data, 'top-right');
        setFetchingTheEmployeeData(true);
        setTimeout(() => {
          navigate(
            `/${GlobalStateProvider.organization?.general_info?.portal_slug}/employees/employee-listing`
          );
        }, 2000);
      }
      if (moduleType?.toLocaleLowerCase() == 'edit') {
        if (employee_id) {
          setFetchingTheEmployeeData(true);
          fetchTheUsersProfileInfoWithDebounce(employee_id);
        } else {
          const data = {
            success: false,
            message: 'The Id Is Required',
          };
          handelNotification(data, 'top-right', 40000);
        }
      }
    }
  }, [
    employee_id,
    fetchTheUsersProfileInfoWithDebounce,
    handelNotification,
    moduleType,
    navigate,
  ]);
  if (moduleType == undefined || !['add', 'edit'].includes(moduleType))
    return (
      <AccessDeniedRedirect
        message='Invalid Manage Type'
        isAccessDenied={false}
      />
    );

  if (hasNoPermissionToViewProfile && childSection == 'manage')
    return (
      <AccessDeniedRedirect
        message="You don't have permission to access the Employee Profile module."
        isAccessDenied={hasNoPermissionToViewProfile}
      />
    );
  const hasNoPermissionToEdit =
    employee_id !== GlobalStateProvider?.user?.personal_info?.user_id &&
    subModulePermissionData?.is_active &&
    !subModulePermissionData?.permissions?.some(
      (item) => item?.label == 'edit' && item?.is_allowed
    );
  if (hasNoPermissionToEdit && childSection == 'manage') {
    return (
      <AccessDeniedRedirect
        message="You don't have permission to edit this profile."
        isAccessDenied={hasNoPermissionToEdit}
      />
    );
  }
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full h-full relative'>
        <div className='w-full h-full'>
          <div className='w-full h-full flex items-stretch justify-between'>
            <div className='w-full h-full xl:w-[70%] flex-grow relative'>
              <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObject} />
              <div className='h-[calc(100vh-120px)] hide-scrollbar overflow-auto px-6 flex flex-col gap-6 pt-16 pb-5'>
                {!fetchingTheEmployeeData && subModulePermissionData ? (
                  <AddEditComponentListing
                    formData={formData}
                    setFormData={setFormData}
                    isEditingCurrentEmployee={
                      moduleType == 'add'
                        ? false
                        : GlobalStateProvider?.user?.personal_info?.user_id ==
                          employee_id
                    }
                    GlobalStateProvider={GlobalStateProvider}
                    showEmptyFieldError={showEmptyFieldError}
                    countryOptionsDataArray={countryOptionsDataArray}
                    filteredCountry={filteredCountry}
                    isFetchingCountryData={isFetchingCountryData}
                    countryData={countryData}
                    selectedCountryInfoForCurrentAddress={
                      selectedCountryInfoForCurrentAddress
                    }
                    setSelectedCountryInfoForCurrentAddress={
                      setSelectedCountryInfoForCurrentAddress
                    }
                    formSubmitLoader={formSubmitLoader}
                    permissionData={subModulePermissionData}
                  />
                ) : (
                  <AddEditEmployeeProfileSkeletonLoader />
                )}
              </div>
              <AddEditEmployeeProfileFooter
                dummyFormData={dummyFormData}
                fetchingTheEmployeeData={fetchingTheEmployeeData}
                formData={formData}
                formSubmitLoader={formSubmitLoader}
                handelSubmitAndUpdateButton={handelSubmitAndUpdateButton}
                moduleType={moduleType == 'add' ? 'add' : 'edit'}
                organization_slug={organization_slug}
              />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default AddEditEmployeeProfile;
