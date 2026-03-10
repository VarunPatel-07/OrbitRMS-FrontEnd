import { AddEditSocialMediaPostFormdataInterface } from '@/interface/SocialMedia.interface';

import FaceBookLogo from '@/assets/images/facebook.png';
import InstagramLogo from '@/assets/images/instagram.png';
import LinkedinLogo from '@/assets/images/linkedin.png';
import TwitterLogo from '@/assets/images/twitter.png';

export const GetPlatformLogo = {
  facebook: FaceBookLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  twitter: TwitterLogo,
};

export const AddEditPostFormData: AddEditSocialMediaPostFormdataInterface = {
  new_images: [],
  caption: '',
  existing_images: [],
  platforms: [],
  type: 'default',
  scheduled_on: null,
};
