import { SocialMediaModuleModalArrayListInterface } from '@/interface/SocialMedia.interface';
import { GlobalContextStore } from '@/interface/UserProfile.interface';

import { getDataFromSecureCookie } from '@/utils/helpers/commonHelpers';

const META_AUTHENTICATION_BASE_URL = import.meta.env
  .VITE_META_AUTHENTICATION_BASE_URL;
const TWITTER_AUTHENTICATION_BASE_URL = import.meta.env
  .VITE_TWITTER_AUTHENTICATION_BASE_URL;

export const SocialMediaModuleModalArrayList = (
  GlobalStateProvider: GlobalContextStore
): SocialMediaModuleModalArrayListInterface[] => [
  {
    name: 'FaceBook',
    platform: 'facebook',
    onClickFunction: () => {
      {
        const authToken = `Bearer ${getDataFromSecureCookie('authenticationToken')}`;
        window.location.href = `${META_AUTHENTICATION_BASE_URL}?org-id=${GlobalStateProvider?.organization?.id}&token=${encodeURIComponent(authToken)}
  `;
      }
    },
  },
  {
    name: 'Instagram',
    platform: 'instagram',
    onClickFunction: () => {
      {
        const authToken = `Bearer ${getDataFromSecureCookie('authenticationToken')}`;
        window.location.href = `${META_AUTHENTICATION_BASE_URL}?org-id=${GlobalStateProvider?.organization?.id}&token=${encodeURIComponent(authToken)}
  `;
      }
    },
  },
  {
    name: 'Twitter',
    platform: 'twitter',
    onClickFunction: () => {
      {
        const authToken = `Bearer ${getDataFromSecureCookie('authenticationToken')}`;
        window.location.href = `${TWITTER_AUTHENTICATION_BASE_URL}?org-id=${GlobalStateProvider?.organization?.id}&token=${encodeURIComponent(authToken)}`;
      }
    },
  },
  {
    name: 'Linkedin',
    platform: 'linkedin',
    onClickFunction: () => {},
  },
];
