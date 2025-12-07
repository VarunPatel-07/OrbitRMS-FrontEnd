/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

// import ReactJson from 'react-json-view';

import { NotAllowedObjectField } from '../../constant/constant';
import { classNames } from '../../Helper/HelperFunctions';
import { ClientInquirySidebarModelInterface } from '../../interface/interface';

interface InquiryData {
  [key: string]: any;
}

interface Props {
  data: InquiryData;
}

function ClientInquirySliderModal(props: ClientInquirySidebarModelInterface) {
  const {
    clientInquiryData,
    showClientInquiryDetail,
    setShowClientInquiryDetail,
  } = props as ClientInquirySidebarModelInterface;

  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowClientInquiryDetail(false);
      }
    };

    if (showClientInquiryDetail) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowClientInquiryDetail, showClientInquiryDetail]);

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
    <div
      className={classNames(
        'bg-black/30 backdrop-blur-[1px] fixed top-0 left-0 h-full w-full z-50 overflow-hidden transition-all duration-300',
        {
          'opacity-0 pointer-events-none invisible': !showClientInquiryDetail,
          'opacity-100 visible': showClientInquiryDetail,
        }
      )}
    >
      <div
        className={classNames(
          'w-full bg-white max-w-[800px] h-full ml-auto transition-all duration-300',
          {
            'translate-x-full': !showClientInquiryDetail,
            'translate-x-0': showClientInquiryDetail,
          }
        )}
        ref={modalBoxRef}
      >
        <div className='w-full flex items-center justify-between border-b border-b-black/20 p-5'>
          <p className='font-inter text-lg text-black font-medium'>
            Client Inquiry Detail
          </p>
          <button
            className='h-10 w-10 flex items-center justify-center rounded-lg bg-black'
            onClick={() => setShowClientInquiryDetail(false)}
          >
            <IoClose className='text-2xl text-white' />
          </button>
        </div>
        <div className='w-full py-6 px-5 h-[calc(100%-100px)] overflow-auto text-base'>
          <JsonTable data={filteredObjKey} />
        </div>
      </div>
    </div>
  );
}

export default ClientInquirySliderModal;
