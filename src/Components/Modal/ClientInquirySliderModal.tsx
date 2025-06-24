/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactJson from 'react-json-view';

import { NotAllowedObjectField } from '../../constant/constant';
import { classNames } from '../../Helper/HelperFunctions';
import { ClientInquirySidebarModelInterface } from '../../interface/interface';

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
          'w-full bg-white max-w-[500px] h-full ml-auto transition-all duration-300',
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
          <ReactJson
            src={filteredObjKey}
            theme='rjv-default'
            displayDataTypes={false}
            defaultValue=''
            name='Inquiry Data'
            collapsed={1}
          />
        </div>
      </div>
    </div>
  );
}

export default ClientInquirySliderModal;
