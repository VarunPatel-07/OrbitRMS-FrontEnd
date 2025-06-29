import React, { useEffect, useRef } from 'react';

import { classNames } from '../../Helper/HelperFunctions';
import { AddEditPostModalInterface } from '../../interface/interface';

const MultipleDragAndDropFileUploader = React.lazy(
  () => import('../../common/DragDropUploader/MultipleDragDropFileUploader')
);

function AddEditPostModal(props: AddEditPostModalInterface) {
  const { showClientInquiryDetail, setShowClientInquiryDetail } =
    props as AddEditPostModalInterface;
  const modalBoxRef = useRef<HTMLDivElement>(null);

  const handelProfileUploadation = (url: string) => {
    console.log(url);
  };

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
        <div className='w-full h-full p-5'>
          <MultipleDragAndDropFileUploader
            name='general_info.organization_profile_picture'
            type='file'
            RequiredFileTypeArray={['image/png', 'image/jpeg', 'image/webp']}
            showDropFileScreenInFullScreen={true}
            cropShape='rect'
            maxCropHeight={350}
            maxCropWidth={350}
            setImageUrl={handelProfileUploadation}
          />
        </div>
      </div>
    </div>
  );
}

export default AddEditPostModal;
