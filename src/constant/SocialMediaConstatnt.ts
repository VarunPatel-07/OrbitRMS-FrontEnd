import FaceBookLogo from '../assets/Images/facebook.png';
import InstagramLogo from '../assets/Images/instagram.png';
import LinkedinLogo from '../assets/Images/linkedin.png';
import TwitterLogo from '../assets/Images/twitter.png';
import { AddEditSocialMediaPostFormdataInterface } from '../interface/SocialMediaModule';

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
