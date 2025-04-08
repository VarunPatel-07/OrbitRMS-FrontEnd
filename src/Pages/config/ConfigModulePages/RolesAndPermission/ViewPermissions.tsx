/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useParams } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import Breadcrumbs from '../../../../common/Breadcrumbs';
import {
  endpointObject,
  multipleFetchApi,
  multiplePutApi,
} from '../../../../Helper/api/multipleAPI';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { ConfigRolesAndPermissionModule } from '../../../../interface/interface';
import RolesAndPermissionLoader from './RolesAndPermissionLoader';
import RolesAndPermissionTable from './RolesAndPermissionTable';

const initialState = {
  id: '',
  role_name: '',
  description: '',
  source_type: '',
  created_by: null,
  created_at: '2025-04-04T17:53:40',
  updated_by: null,
  updated_at: null,
  modules: [],
};

function ViewPermissions() {
  const useEffectRef = useRef(false);
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingModuleLoaderId, setUpdatingModuleLoaderId] =
    useState<string>('');
  const [data, setData] =
    useState<ConfigRolesAndPermissionModule>(initialState);

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: '/home' },
    { name: 'Config', label: 'config-module', link: '/config/project-status' },
    { name: 'Roles', label: 'role-permission', link: '/config/roles-permission' },
    {
      name: data?.role_name,
      label: 'specific-role-permission',
      link: `/config/roles-permission/${data?.id}`,
    },
  ];

  const fetchingSpecificRoleWithDebounce = useDebounce(async (_id: string) => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: `config/roles_permissions/fetch-role?role_id=${_id}`,
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);

    const res = response[0];
    if (res?.success) {
      setData(res?.data);
      setLoading(false);
      setUpdatingModuleLoaderId('');
    }
  }, 50);

  const fetchingSpecificRoleFunction = (_id: string) => {
    setLoading(true);
    fetchingSpecificRoleWithDebounce(_id);
  };

  const StatusTogglerFunction = async (module_id: string) => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: `config/roles_permissions/update?id=${module_id}&type=module`,
        protected: true,
      },
    ];

    const response = await multiplePutApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      fetchingSpecificRoleWithDebounce(id);
    }
  };
  const PermissionTogglerFunction = async (module_id: string) => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: `config/roles_permissions/update?id=${module_id}&type=permission`,
        protected: true,
      },
    ];

    const response = await multiplePutApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      fetchingSpecificRoleWithDebounce(id);
    }
  };

  useEffect(() => {
    if (id != '' && id != undefined) {
      if (useEffectRef.current) return;
      useEffectRef.current = true;
      fetchingSpecificRoleFunction(id);
    }
  }, [id]);

  return (
    <div className='w-full h-full relative'>
      <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
      <div className='w-full pt-10'>
        <div className='w-full p-4 2xl:p-5'>
          {loading ? (
            <RolesAndPermissionLoader />
          ) : (
            <>
              <div className='w-full p-6 bg-white rounded-t-lg'>
                <div className='w-full flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='text-slate-950 font-semibold capitalize text-xl font-inter'>
                      {data?.role_name || 'tesss'}
                    </p>
                  </div>
                  <div className='flex items-center justify-end gap-3'>
                    <span className='text-green-600 capitalize font-semibold text-sm border border-green-600 px-6 py-1.5 rounded-full bg-green-50 font-inter'>
                      active
                    </span>
                  </div>
                </div>
              </div>
              {data?.modules.length > 0 && (
                <RolesAndPermissionTable
                  data={data?.modules}
                  StatusTogglerFunc={StatusTogglerFunction}
                  PermissionTogglerFunc={PermissionTogglerFunction}
                  updatingModuleLoaderId={updatingModuleLoaderId}
                  setUpdatingModuleLoaderId={setUpdatingModuleLoaderId}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewPermissions;
