/* eslint-disable @typescript-eslint/no-explicit-any */

import { PiArrowBendDownRightBold } from 'react-icons/pi';

import { classNames } from '../../../../Helper/HelperFunctions';
import { RolesAndPermissionsModule } from './RolesAndPermission';

function RolesAndPermissionTable({
  data,
}: {
  data: RolesAndPermissionsModule[];
}) {
  const handleRenderTableRows = (
    module: RolesAndPermissionsModule,
    hierarchyLevel: number
  ) => {
    return (
      <tr key={module.module_label} className='group back'>
        <td
          className='bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointe'
          style={{
            paddingLeft:
              hierarchyLevel == 0 ? '20px' : `${hierarchyLevel * 30}px`,
          }}
        >
          <span className='flex items-center justify-start'>
            {hierarchyLevel != 0 && (
              <span className='pr-1.5'>
                <PiArrowBendDownRightBold className='text-black/30 text-lg h-5 w-7' />
              </span>
            )}
            <span className='font-inter text-black font-medium text-sm'>
              {module.module_title}
            </span>
          </span>
        </td>
        <td className='bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointe'>
          {module.is_active ? 'Active' : 'Inactive'}
        </td>
        {module.permissions?.map((item, index) => {
          if (item?.show_input) {
            return (
              <td
                className='bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointe'
                key={index}
              >
                <button className='text-blue-500'>{item?.label}</button>
              </td>
            );
          } else {
            return (
              <td
                className='bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointe'
                key={index}
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
  const handleRecursion = (modules: any[], level = 0): JSX.Element[] => {
    return modules.flatMap((module) => {
      const rows = [handleRenderTableRows(module, level)];
      if (module.sub_modules?.length > 0) {
        rows.push(...handleRecursion(module.sub_modules, level + 1));
      }
      return rows;
    });
  };
  return (
    <div>
      <table className='table-auto border-collapse w-full relative'>
        <thead>
          <tr className={`shadow`}>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-[#eef0f4] text-black ',
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
                'px-6 py-2.5 text-left bg-[#eef0f4] text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  Status
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-[#eef0f4] text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  View
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-[#eef0f4] text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  Edit
                </span>
              </span>
            </th>
            <th
              className={classNames(
                'px-6 py-2.5 text-left bg-[#eef0f4] text-black ',
                {}
              )}
            >
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-[15px] text-black/80 font-medium'>
                  Delete
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>{handleRecursion(data)}</tbody>
      </table>
    </div>
  );
}

export default RolesAndPermissionTable;
