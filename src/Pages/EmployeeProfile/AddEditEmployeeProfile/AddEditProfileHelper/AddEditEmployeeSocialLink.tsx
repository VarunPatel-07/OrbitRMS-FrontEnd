import React, { useState } from 'react';

import { FaCheck } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import Button from '../../../../common/Button';
import IconPicker from '../../../../common/IconPicker';
import Input from '../../../../common/Input';
import { classNames } from '../../../../Helper/HelperFunctions';
import {
  AddEditEmployeeSocialLinksInterface,
  AddEditUserProfileInterFace,
} from '../../../../interface/AddEditUserProfileInterFace';

const AddEditEmployeeSocialLink = React.memo(function AddEditEmployeeSocialLink(
  props: AddEditEmployeeSocialLinksInterface
) {
  const { formData, setFormData, formSubmitLoader, disabled } = props;

  const [isEmptySocialLink, setIsEmptySocialLink] = useState<boolean[]>([]);

  const handleSelectedIcon = (data: string, index: number) => {
    setFormData((prev) => {
      const updatedLinks = prev.social_link.map((link, i) =>
        i === index ? { ...link, icon: data } : link
      );

      return {
        ...prev,
        social_link: updatedLinks,
      } as AddEditUserProfileInterFace;
    });
  };

  const handelSocialLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedLinks = prev.social_link.map((link, i) =>
        i === index ? { ...link, [name]: value } : link
      );

      return {
        ...prev,
        social_link: updatedLinks,
      } as AddEditUserProfileInterFace;
    });
  };
  const handelClickOnTargetBlockButton = (index: number) => {
    setFormData((prev) => {
      const updatedLinks = prev.social_link.map((link, i) =>
        i === index
          ? {
              ...link,
              target_blank: !formData?.social_link[index]?.target_blank,
            }
          : link
      );

      return {
        ...prev,
        social_link: updatedLinks,
      } as AddEditUserProfileInterFace;
    });
  };

  const removeTheSpecificLink = (index: number) => {
    setFormData((perValue) => ({
      ...perValue,
      social_link: perValue?.social_link?.filter((_, i) => i != index),
    }));
  };

  const handelAddNewEmptySocialLink = (index: number) => {
    if (
      formData.social_link.every(
        (link) =>
          link?.icon?.trim() !== '' &&
          link?.link?.trim() !== '' &&
          link?.name?.trim() !== ''
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        social_link: [
          ...prevData.social_link,
          {
            icon: '',
            link: '',
            name: '',
            target_blank: true,
            id: '',
            user_id: '',
          },
        ],
      }));
    } else {
      setIsEmptySocialLink((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    }
  };

  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
        <h2 className='font-inter text-xl text-black font-semibold capitalize'>
          Social Media Links
        </h2>
        <p className='font-inter text-base text-black font-light w-[70%]'>
          Share your social media profiles to enhance your visibility, build
          connections, and allow others to engage with your online presence more
          effectively.
        </p>
      </div>
      <div className='w-full'>
        <div className='p-6 w-full'>
          <div className='w-full'>
            {formData?.social_link?.map((link, index) => (
              <React.Fragment key={index}>
                <div className='flex items-start justify-start gap-3'>
                  <div className='flex flex-col items-start justify-start'>
                    <span
                      className={classNames(
                        'pb-2 font-inter text-black/65 text-sm px-1 inline-block',
                        {
                          'opacity-0': index !== 0,
                        }
                      )}
                    >
                      Icon & Name
                    </span>
                    <div className='flex items-stretch justify-start w-fit gap-2'>
                      <div className='w-fit flex flex-col items-start justify-start'>
                        <IconPicker
                          selectedIcon={link?.icon}
                          position='top'
                          onSelectValBtn={(data) =>
                            handleSelectedIcon(data, index)
                          }
                          showError={isEmptySocialLink[index]}
                          errorMessage={
                            link?.icon ? '' : 'This Is An Required Field'
                          }
                          disabled={disabled ? disabled : formSubmitLoader}
                        />
                      </div>
                      <div className='w-fit flex flex-col items-start justify-start'>
                        <Input
                          type='text'
                          value={link?.name || ''}
                          className='border border-black/45'
                          name='name'
                          onChange={(e) => handelSocialLinkChange(e, index)}
                          showError={isEmptySocialLink[index]}
                          errorMessage={
                            !link?.name ? 'This Is An Required Field' : ''
                          }
                          disabled={disabled ? disabled : formSubmitLoader}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-start flex-grow'>
                    <span
                      className={classNames(
                        'pb-2 font-inter text-black/65 text-sm px-1 inline-block',
                        {
                          'opacity-0': index !== 0,
                        }
                      )}
                    >
                      Link
                    </span>
                    <div className='items-stretch justify-start w-full gap-2'>
                      <Input
                        type='text'
                        value={link?.link || ''}
                        className='border border-black/45'
                        name='link'
                        onChange={(e) => handelSocialLinkChange(e, index)}
                        showError={isEmptySocialLink[index]}
                        errorMessage={
                          !link?.link ? 'This Is An Required Field' : ''
                        }
                        disabled={disabled ? disabled : formSubmitLoader}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-start'>
                    <span className='pb-2 font-inter text-black/65 text-sm px-1 inline-block opacity-0'>
                      Link
                    </span>
                    <div className='flex items-stretch justify-end gap-2'>
                      <Button
                        type='button'
                        className={classNames(
                          'relative inline-block min-w-10 min-h-10 rounded-lg cursor-pointer focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] disabled:cursor-not-allowed',
                          {
                            'border border-black/[.65] bg-white':
                              !formData?.social_link[index]?.target_blank,
                            'border border-[var(--them-pink-color)] bg-[rgba(215,139,159,0.2)]':
                              formData?.social_link[index]?.target_blank,
                          }
                        )}
                        disabled={disabled ? disabled : formSubmitLoader}
                        onClick={() => handelClickOnTargetBlockButton(index)}
                      >
                        {formData?.social_link[index]?.target_blank ? (
                          <span className='flex items-center justify-center w-full h-full text-[var(--them-pink-color)] absolute top-0 left-0 z-10 transition-all'>
                            <FaCheck className='w-5 h-5' />
                          </span>
                        ) : (
                          <></>
                        )}
                      </Button>
                      {index !== 0 && (
                        <Button
                          type='button'
                          className='bg-rose-100 w-10 rounded-lg flex items-center justify-center border border-rose-500 text-black text-xl'
                          onClick={() => removeTheSpecificLink(index)}
                        >
                          <MdDelete />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                {index === formData.social_link.length - 1 ? (
                  <div className='button pt-4' key={index + link?.id}>
                    <Button
                      type='button'
                      disabled={disabled ? disabled : formSubmitLoader}
                      className='font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg'
                      onClick={() => handelAddNewEmptySocialLink(index)}
                    >
                      <span>Add Link</span>
                    </Button>
                  </div>
                ) : (
                  ''
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default AddEditEmployeeSocialLink;
