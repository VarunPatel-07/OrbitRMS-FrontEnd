/* eslint-disable @typescript-eslint/no-explicit-any */

import { IoClose } from 'react-icons/io5';

import { ClientInquirySidebarModelInterface } from '@/interface/ComponentProps.interface';

import { NotAllowedObjectField } from '@/utils/constants/global.constants';

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
  onClose,
}: ClientInquirySidebarModelInterface) {
  const filteredObjKey = Object.keys(clientInquiryData)
    ?.filter((key) => !NotAllowedObjectField.includes(key))
    .reduce((obj: any, key) => {
      obj[key] = clientInquiryData[key];
      return obj;
    }, {});

  const JsonTable = ({ data }: Props) => {
    const renderValue = (value: any) => {
      if (Array.isArray(value)) {
        return (
          <table className='table-auto border border-gray-300 w-full my-2'>
            <thead>
              <tr className='bg-gray-100 text-black capitalize'>
                {Object.keys(value[0] || {}).map((key) => (
                  <th key={key} className='border px-2 py-1 text-left'>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.map((item: any, index: number) => (
                <tr key={index}>
                  {Object.values(item).map((val: any, i) => (
                    <td key={i} className='border px-2 py-1 text-black/80'>
                      {val.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      } else if (typeof value === 'object' && value !== null) {
        return <JsonTable data={value} />;
      } else {
        return <span className='text-black/60'>{value.toString()}</span>;
      }
    };

    return (
      <table className='table-auto border border-gray-300 w-full'>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className='hover:bg-gray-50'>
              <td className='border px-4 py-2 bg-gray-50 w-1/3 text-black capitalize font-semibold'>
                {key?.replace(/_/g, ' ')}
              </td>
              <td className='border px-4 py-2'>{renderValue(value)}</td>
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
