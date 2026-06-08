/* eslint-disable @typescript-eslint/no-explicit-any */

import { IoClose } from 'react-icons/io5';

import { ClientInquirySidebarModelInterface } from '@/interface/ComponentProps.interface';

import { NotAllowedObjectField } from '@/utils/constants/global.constants';
import { formateDate, verifyURL } from '@/utils/helpers/commonHelpers';

import CommonDrawerContainer from '../common/CommonDrawerContainer';

interface InquiryData {
   [key: string]: any;
}

interface Props {
   data: InquiryData;
}

function ClientInquiryDetailsDrawer({
   clientInquiryData,
   showClientInquiryDetail,
   GlobalStateProvider,
   onClose,
}: ClientInquirySidebarModelInterface) {
   const filteredObjKey = Object.keys(clientInquiryData)
      ?.filter((key) => !NotAllowedObjectField.includes(key))
      .reduce((obj: any, key) => {
         obj[key] = clientInquiryData[key];
         return obj;
      }, {});

   const JsonTable = ({ data }: Props) => {
      const renderPrimitiveValueData = (value: any) => {
         if (value === null || value === undefined) {
            return <span className='text-black/60'>-</span>;
         }

         const stringValue = String(value);

         if (verifyURL(value)) {
            return (
               <a
                  href={stringValue}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 underline break-all'
               >
                  {stringValue}
               </a>
            );
         } else {
            return <span className='text-black/60'>{stringValue}</span>;
         }
      };

      const renderValue = (value: any, key: string) => {
         console.log('key', key);
         if (value === null || value === undefined) {
            return <span className='text-black/60'>-</span>;
         }
         if (key === 'created_at') {
            return (
               <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
                  {formateDate(
                     value,
                     GlobalStateProvider?.organization?.organization_settings
                        ?.default_dateformat
                  )}
               </span>
            );
         }

         if (Array.isArray(value)) {
            if (value.length === 0) {
               return <span className='text-black/60'>No Data</span>;
            }
            const isArrayOfObjects = value.every(
               (item) =>
                  item && typeof item === 'object' && !Array.isArray(item)
            );
            if (isArrayOfObjects) {
               return (
                  <table className='table-auto border border-gray-300 w-full my-2'>
                     <thead>
                        <tr className='bg-gray-100 text-black capitalize'>
                           {Object.keys(value[0] || {}).map((key) => (
                              <th
                                 key={key}
                                 className='border px-2 py-1 text-left'
                              >
                                 {key}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {value.map((item: any, index: number) => (
                           <tr key={index}>
                              {typeof item === 'object' ? (
                                 <>
                                    {Object.values(item).map((val: any, i) => (
                                       <td
                                          key={i}
                                          className='border px-2 py-1 text-black/80'
                                       >
                                          {val.toString()}
                                       </td>
                                    ))}
                                 </>
                              ) : (
                                 <td className='border px-2 py-1 text-black/80'>
                                    {item}
                                 </td>
                              )}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               );
            }

            return (
               <div className='flex flex-col gap-2'>
                  {value.map((item, index) => (
                     <div key={index} className='text-black/80'>
                        {renderValue(item, key)}
                     </div>
                  ))}
               </div>
            );
         } else if (typeof value === 'object' && value !== null) {
            return <JsonTable data={value} />;
         }
         return renderPrimitiveValueData(value);
      };

      return (
         <table className='table-auto border border-gray-300 w-full'>
            <tbody>
               {Object.entries(data).map(([key, value]) => (
                  <tr key={key} className='hover:bg-gray-50'>
                     <td className='border px-4 py-2 bg-gray-50 w-1/3 text-black capitalize font-semibold'>
                        {key?.replace(/_/g, ' ')}
                     </td>
                     <td className='border px-4 py-2'>
                        {renderValue(value, key)}
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      );
   };
   return (
      <CommonDrawerContainer
         show={showClientInquiryDetail}
         onClose={onClose}
         maxWidth='700px'
         minWidth='550px'
         direction='RIGHT'
         closeOnOutsideClick={true}
      >
         <div className='w-full flex items-center justify-between border-b border-b-black/20 p-5'>
            <p className='font-inter text-lg text-black font-medium'>
               Client Inquiry Detail
            </p>
            <button
               className='h-10 w-10 flex items-center justify-center rounded-lg bg-black'
               onClick={() => onClose()}
            >
               <IoClose className='text-2xl text-white' />
            </button>
         </div>
         <div className='w-full py-6 px-5 h-[calc(100%-100px)] overflow-auto text-base'>
            <JsonTable data={filteredObjKey} />
         </div>
      </CommonDrawerContainer>
   );
}

export default ClientInquiryDetailsDrawer;
