/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { SetStateAction, useState } from 'react';

import { LuLoaderCircle, LuSquareChevronDown } from 'react-icons/lu';
import { PiArrowBendDownRightBold } from 'react-icons/pi';

import { classNames } from '../../../../Helper/HelperFunctions';
import {
  PermissionModule,
  RolesAndPermissionsModule,
} from '../../../../interface/interface';

function RolesAndPermissionTable({
  data,
  StatusTogglerFunc,
  updatingModuleLoaderId,
  setUpdatingModuleLoaderId,
  PermissionTogglerFunc,
  disabled,
}: {
  data: RolesAndPermissionsModule[];
  StatusTogglerFunc: (id: string) => void;
  PermissionTogglerFunc: (id: string) => void;
  updatingModuleLoaderId: string;
  setUpdatingModuleLoaderId: React.Dispatch<SetStateAction<string>>;
  disabled: boolean;
}) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const toggleExpandButton = (moduleId: string) => {
    setExpandedModules((perv) => {
      const newSet = new Set(perv);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const handelStatusToggler = (info: RolesAndPermissionsModule) => {
    setUpdatingModuleLoaderId(info?.id);
    StatusTogglerFunc(info?.id);
  };
  const handelPermissionToggler = (permissionInfo: PermissionModule) => {
    setUpdatingModuleLoaderId(permissionInfo?.id);
    PermissionTogglerFunc(permissionInfo?.id);
  };

  const handleRenderTableRows = (
    module: RolesAndPermissionsModule,
    hierarchyLevel: number,
    isSubModule: boolean,
    isParentModuleActive: boolean
  ) => {
    const isExpanded = expandedModules.has(module.id);
    return (
      <tr key={module.id} className='group back transition-all'>
        <td
          className={classNames(
            `px-6 py-3 text-black cursor-pointe min-w-[300px]  border-b border-b-black/15 text-center`,
            {
              'bg-gray-300/25': hierarchyLevel == 0,
              'bg-white group-hover:bg-gray-50': hierarchyLevel != 0,
            }
          )}
          style={{
            paddingLeft:
              hierarchyLevel == 0 ? '20px' : `${hierarchyLevel * 30}px`,
          }}
        >
          <span className='flex items-center justify-start'>
            {!isSubModule && <span className='pl-[24px]'></span>}
            {isSubModule && (
              <span
                className={classNames(' transition-all', {
                  'rotate-180': isExpanded,
                })}
                onClick={() => toggleExpandButton(module?.id)}
              >
                <LuSquareChevronDown className='text-black text-lg h-5 w-7' />
              </span>
            )}
            {hierarchyLevel != 0 && (
              <span className='pr-1.5'>
                <PiArrowBendDownRightBold className='text-black/30 text-lg h-5 w-7' />
              </span>
            )}
            <span className='font-inter text-black font-medium text-sm text-nowrap w-fit'>
              {module.module_title}
            </span>
          </span>
        </td>
        <td
          className={classNames(
            'px-6 py-3 text-black cursor-pointe border-l border-l-black/15 border-b border-b-black/15 text-center',
            {
              'bg-gray-300/25': hierarchyLevel == 0,
              'bg-white group-hover:bg-gray-50': hierarchyLevel != 0,
            }
          )}
        >
          <div className='w-full h-full flex items-center justify-center'>
            {updatingModuleLoaderId == module?.id ? (
              <LuLoaderCircle className='animate-spin' />
            ) : (
              <button
                className={`w-10 h-[18px] rounded-full relative transition-all duration-200 border border-transparent disabled:opacity-75 disabled:cursor-not-allowed ${disabled ? '' : 'disabled:bg-gray-300 disabled:border-black/20'}  ${module.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                onClick={() => handelStatusToggler(module)}
                disabled={
                  disabled || (!isParentModuleActive && hierarchyLevel > 0)
                }
              >
                <span
                  className={`w-3.5 h-3.5 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${module.is_active ? 'left-[22px]' : 'left-0.5'}`}
                ></span>
              </button>
            )}
          </div>
        </td>
        {['view', 'edit', 'delete'].map((permLabel, index) => {
          const permission = module.permissions?.find(
            (p) => p.label === permLabel
          );

          if (permission && permission.show_input) {
            return (
              <td
                key={index}
                className={classNames(
                  'bg-white px-6 py-3 text-black cursor-pointer border-l border-l-black/15 border-b border-b-black/15 text-center',
                  {
                    'bg-gray-300/25': hierarchyLevel == 0,
                    'bg-white group-hover:bg-gray-50': hierarchyLevel != 0,
                  }
                )}
              >
                {updatingModuleLoaderId == permission?.id ? (
                  <span className='w-full h-6 flex items-center justify-center'>
                    <LuLoaderCircle className='animate-spin' />
                  </span>
                ) : (
                  <div className='flex items-center justify-center'>
                    <button
                      className='w-6 h-6 border border-black/30 disabled:border-black/15 rounded-full relative disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-200'
                      disabled={
                        disabled || !module.is_active || !isParentModuleActive
                      }
                      onClick={() => handelPermissionToggler(permission)}
                    >
                      <span
                        className={`inline-block w-3 h-3 bg-blue-700 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ${
                          permission.is_allowed ? 'scale-100' : 'scale-0'
                        }`}
                      ></span>
                    </button>
                  </div>
                )}
              </td>
            );
          } else {
            return (
              <td
                key={index}
                className={classNames(
                  'bg-white px-6 py-3 text-black cursor-pointer border-l border-l-black/15 border-b border-b-black/15 text-center',
                  {
                    'bg-gray-300/25': hierarchyLevel == 0,
                    'bg-white group-hover:bg-gray-50': hierarchyLevel != 0,
                  }
                )}
              >
                <span className='font-inter text-black font-medium text-base'>
                  -
                </span>
              </td>
            );
          }
        })}
      </tr>
    );
  };
  const handleRecursion = (
    modules: any[],
    level = 0,
    is_active: boolean = false
  ): JSX.Element[] => {
    return modules.flatMap((module) => {
      const rows = [
        handleRenderTableRows(
          module,
          level,
          module.sub_modules?.length > 0 ? true : false,
          module?.is_active ? module?.is_active : is_active
        ),
      ];
      if (module.sub_modules?.length > 0 && expandedModules.has(module.id)) {
        rows.push(
          ...handleRecursion(module.sub_modules, level + 1, module.is_active)
        );
      }
      return rows;
    });
  };
  return (
    <div className='overflow-auto hide-scrollbar max-h-[calc(100vh-220px)] rounded-b-lg border border-black/20 border-t-0'>
      <table className='table-auto border-collapse w-full relative'>
        <thead>
          <tr className={`shadow`}>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-gray-300 text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  Module Name
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-gray-300 text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-center gap-1'>
                <span className='font-inter text-[15px] text-center text-black/80 font-medium'>
                  Status
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-gray-300 text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-center gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  View
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-gray-300 text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-center gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  Edit
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-gray-300 text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-center gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  Delete
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody className='transition-all'>{handleRecursion(data)}</tbody>
      </table>
    </div>
  );
}

export default RolesAndPermissionTable;
