import { AddEditSocialMediaPostFormdataInterface } from '../../../interface/SocialMediaModule';

export const GenerateFormDataForSocialMedia = (
  formData: AddEditSocialMediaPostFormdataInterface
): FormData => {
  const multipartFormData = new FormData();
  multipartFormData.append('caption', formData.caption);
  multipartFormData.append('type', formData.type);

  if (formData.scheduled_on) {
    multipartFormData.append(
      'scheduled_on',
      formData.scheduled_on.toISOString()
    );
  } else {
    multipartFormData.append('scheduled_on', '');
  }

  formData?.platforms?.map((item) => {
    multipartFormData.append('platforms', item);
  });
  formData?.new_images?.map((item) => {
    multipartFormData.append('new_images', item?.file);
  });
  formData.existing_images?.map((item) => {
    multipartFormData.append('existing_images', item);
  });

  return multipartFormData;
};
