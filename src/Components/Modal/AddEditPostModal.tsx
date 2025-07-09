import React, { useContext, useRef, useState } from 'react';
import { IoClose, IoCloseCircle } from 'react-icons/io5';

import MultipleDragAndDropFileUploader from '../../common/DragDropUploader/MultipleFileUploader/MultipleDragDropFileUploader';
import Loader from '../../common/Loader';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { multipleFetchApi } from '../../Helper/api/multipleAPI';
import {
  classNames,
  isRichTextEditorIsEmpty,
} from '../../Helper/HelperFunctions';
import { useMentionSearchDebounce } from '../../Hooks/useMentionSearchDebounce';
import {
  AddEditPostModalInterface,
  SelectedFileArrayObjInterface,
} from '../../interface/interface';
import { RichTextEditorApiResponseInterface } from '../../interface/propsInterface';

const AddEditPostModal = React.memo(function AddEditPostModal(
  props: AddEditPostModalInterface
) {
  const {
    showAddEditPostModal,

    GlobalStateProvider,
    handelOnSubmit,
    onEditorReady,
    formData,
    setFormData,
    loading,
    setLoading,
    handelCancelButton,
  } = props as AddEditPostModalInterface;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const modalBoxRef = useRef<HTMLDivElement>(null);

  const [isImageCropperActive, setIsImageCropperActive] =
    useState<boolean>(false);

  const [showError, setShowError] = useState<boolean>(false);

  const handelUploadImage = (data: SelectedFileArrayObjInterface[]) => {
    const totalImages =
      formData.new_images.length +
      formData?.existing_images?.length +
      data.length;

    console.log(totalImages);

    if (totalImages > 5) {
      handelNotification(
        {
          message: 'Too many files! Max 5 images allowed.',
          success: false,
        },
        'top-right'
      );
      return;
    }

    setFormData((pervData) => ({
      ...pervData,
      new_images: [...pervData.new_images, ...data],
    }));
  };

  const handelOnUpdateFunction = (data: string) => {
    setFormData((pervData) => ({ ...pervData, description: data }));
  };

  const handelApiCallingFunction = useMentionSearchDebounce(
    async (query: string) => {
      const response = await multipleFetchApi([
        {
          endPoint: `employee/fetch-employee?query=${query}`,
          protected: true,
        },
      ]);

      if (!response[0]?.success) throw new Error('Failed to fetch');

      const data = await response[0]?.data;

      if (data?.length !== 0) {
        return data.map((item: RichTextEditorApiResponseInterface) => ({
          id: item.id,
          label: `${item?.full_name ? item?.full_name : item?.first_name + ' ' + item?.middle_name + ' ' + item?.last_name}`,
          employeeCode: `(<span className="text-blue-600">${item?.employee_code}</span>)`,
          success: true,
        }));
      } else {
        return [
          {
            id: '',
            label: '',
            employeeCode: '',
            success: false,
            message: 'No matches found.',
          },
        ];
      }
    },
    400
  );

  const handelClickOnTheDeleteBtn = (id: string) => {
    const _filterData = formData?.new_images?.filter((item) => item?.id !== id);

    setFormData((pervValue) => ({ ...pervValue, new_images: _filterData }));
  };

  const handelClickOnTheExistingButtonClick = (id: number) => {
    const _filterData = formData?.existing_images?.filter(
      (_, index) => index !== id
    );

    setFormData((pervValue) => ({
      ...pervValue,
      existing_images: _filterData,
    }));
  };

  const handelClickOnTheSubmitButton = () => {
    if (
      isRichTextEditorIsEmpty(formData?.description) &&
      formData.new_images?.length == 0
    ) {
      setShowError(true);
      return;
    }
    setLoading(true);

    handelOnSubmit();
  };

  const renderMultipleDragDropUploader = () => (
    <MultipleDragAndDropFileUploader
      name='general_info.organization_profile_picture'
      type='file'
      RequiredFileTypeArray={['image/png', 'image/jpeg', 'image/webp']}
      showDropFileScreenInFullScreen={true}
      cropShape='rect'
      maxCropHeight={350}
      maxCropWidth={350}
      isImageCropperActive={isImageCropperActive}
      setIsImageCropperActive={setIsImageCropperActive}
      handelUploadImage={handelUploadImage}
      asPlusIcon={
        formData?.new_images?.length !== 0 ||
        formData?.existing_images?.length !== 0
      }
      disabled={
        formData?.new_images?.length >= 5 ||
        formData?.existing_images?.length >= 5
      }
      remainingImages={
        5 - (formData?.new_images?.length + formData?.existing_images?.length)
      }
    />
  );

  return (
    <div
      className={classNames(
        'bg-black/30 backdrop-blur-[1px] fixed top-0 left-0 h-full w-full z-50 overflow-hidden transition-all duration-300',
        {
          'opacity-0 pointer-events-none invisible': !showAddEditPostModal,
          'opacity-100 visible': showAddEditPostModal,
        }
      )}
    >
      <div
        className={classNames(
          'w-full bg-white max-w-[600px] h-full ml-auto transition-all duration-300',
          {
            'translate-x-full': !showAddEditPostModal,
            'translate-x-0': showAddEditPostModal,
          }
        )}
        ref={modalBoxRef}
      >
        <div className='w-full h-full relative'>
          <div className='w-full px-5 py-4 border-b border-b-black/20 absolute top-0 left-0 z-20 bg-white'>
            <div className='w-full flex items-center justify-between'>
              {' '}
              <h2 className='text-black capitalize font-inter font-bold text-xl'>
                Create Post
              </h2>
              <button
                className='bg-transparent border-0'
                onClick={() => handelCancelButton()}
              >
                <IoClose className='text-black text-3xl' />
              </button>
            </div>
          </div>
          <div className='grid grid-cols-1 px-5 gap-5 pt-[80px] pb-10 max-h-[calc(100%-60px)] overflow-auto hide-scrollbar'>
            <div className='w-full'>
              <label
                htmlFor=''
                className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
              >
                <span className='flex gap-1'>
                  <span className='font-inter'>Images (Max: 2MB)</span>
                </span>
              </label>
              {formData?.new_images?.length !== 0 ||
              formData?.existing_images?.length !== 0 ? (
                <div className='w-full flex items-center justify-start overflow-auto gap-3 p-3 hide-scrollbar'>
                  {formData?.existing_images?.map((img, index) => (
                    <div
                      className='min-w-[80px] max-w-[80px] max-h-[80px] min-h-[80px] rounded-lg border border-black/20 relative'
                      key={index}
                    >
                      <button
                        className='min-w-5 min-h-5 max-w-5 max-h-5 absolute -top-1.5 -left-1.5 text-black rounded-full bg-white'
                        onClick={() =>
                          handelClickOnTheExistingButtonClick(index)
                        }
                      >
                        <IoCloseCircle className='min-w-5 min-h-5 max-w-5 max-h-5' />
                      </button>
                      <img
                        src={img}
                        alt='Drag Drop Preview Url'
                        width={76}
                        height={76}
                        loading='lazy'
                        className='w-full h-full aspect-square p-1 object-cover rounded-lg'
                      />
                    </div>
                  ))}
                  {formData?.new_images?.map((file) => {
                    const previewUrl = file?.croppedImagePreview;

                    return (
                      <div
                        className='min-w-[80px] max-w-[80px] max-h-[80px] min-h-[80px] rounded-lg border border-black/20 relative'
                        key={file?.id}
                      >
                        <button
                          className='min-w-5 min-h-5 max-w-5 max-h-5 absolute -top-1.5 -left-1.5 text-black rounded-full bg-white'
                          onClick={() => handelClickOnTheDeleteBtn(file?.id)}
                        >
                          <IoCloseCircle className='min-w-5 min-h-5 max-w-5 max-h-5' />
                        </button>
                        <img
                          src={previewUrl}
                          alt='Drag Drop Preview Url'
                          width={76}
                          height={76}
                          loading='lazy'
                          className='w-full h-full aspect-square p-1 object-cover rounded-lg'
                        />
                      </div>
                    );
                  })}

                  <div
                    className={`${formData?.new_images?.length >= 5 ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
                  >
                    {renderMultipleDragDropUploader()}
                  </div>
                </div>
              ) : (
                <div className='w-full'>{renderMultipleDragDropUploader()}</div>
              )}
              <span>Max 5 Images Are Allowed</span>
            </div>
            <div className='w-full rich-text-editor-wrapper text-black'>
              <RichTextEditor
                name='text-editor'
                labelFieldName='Description'
                isRequiredField
                handelApiCallingFunction={handelApiCallingFunction}
                GlobalStateProvider={GlobalStateProvider}
                handelOnUpdateFunction={handelOnUpdateFunction}
                showError={showError}
                onEditorReady={onEditorReady}
                errorMessage={
                  showError
                    ? isRichTextEditorIsEmpty(formData?.description)
                      ? 'This Is An Required Field'
                      : ''
                    : ''
                }
                feedContent={formData?.description}
              />
            </div>
            <div className='w-full flex flex-col gap-4'>
              <div className='flex items-center justify-between gap-3'>
                <p className='text-black font-inter font-medium capitalize'>
                  Disable Commenting
                </p>
                <button
                  className={`w-[52px] h-[22px] rounded-full relative transition-all duration-200 ${formData.isCommentDisabled ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={() =>
                    setFormData((pervData) => ({
                      ...pervData,
                      isCommentDisabled: !pervData?.isCommentDisabled,
                    }))
                  }
                >
                  <span
                    className={`w-[18px] h-[18px] bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.isCommentDisabled ? 'left-8' : 'left-[3px]'}`}
                  ></span>
                </button>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <p className='text-black font-inter font-medium capitalize'>
                  Disable Liking
                </p>
                <button
                  className={`w-[52px] h-[22px] rounded-full relative transition-all duration-200 ${formData.isLikeDisabled ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={() =>
                    setFormData((pervData) => ({
                      ...pervData,
                      isLikeDisabled: !pervData?.isLikeDisabled,
                    }))
                  }
                >
                  <span
                    className={`w-[18px] h-[18px] bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.isLikeDisabled ? 'left-8' : 'left-[3px]'}`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
          <div className='py-2 w-full border-t px-5 border-t-black/20 grid grid-cols-2 gap-3 items-center justify-center absolute bottom-0 left-0'>
            <button
              className='bg-white border border-black/20 rounded-md text-black font-inter px-5 py-2'
              onClick={handelCancelButton}
            >
              Cancel
            </button>
            <button
              className='bg-[var(--them-green-color)] rounded-md text-white font-inter px-5 py-2 disabled:opacity-45 disabled:cursor-not-allowed'
              onClick={handelClickOnTheSubmitButton}
              disabled={loading}
            >
              {loading ? (
                <Loader loaderText='Submitting...' />
              ) : (
                <span>Submit</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AddEditPostModal;
