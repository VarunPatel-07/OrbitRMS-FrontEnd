import { AddEditSocialMediaPostFormdataInterface } from '@/interface/SocialMedia.interface';

export const GenerateFormDataForSocialMedia = (
  formData: AddEditSocialMediaPostFormdataInterface,
  uploadImages: [{ type: 'image' | 'video'; url: string }]
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
  uploadImages?.map((item) => {
    if (item?.type == 'image') multipartFormData.append('images', item?.url);
    if (item?.type == 'video') multipartFormData.append('videos', item?.url);
  });

  return multipartFormData;
};
