import {
  getDataFromLocalStorage,
  getDataFromTheSessionStorage,
} from '../../../Helper/HelperFunctions';
import { SocialMediaModuleModalArrayListInterface } from '../../../interface/SocialMediaModule';
import { GlobalContextStore } from '../../../interface/UserProfileInterface';

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
        const _localToken = getDataFromLocalStorage('authenticationToken');
        const _sessionToken = getDataFromTheSessionStorage(
          'authenticationToken'
        );

        const authToken = `Bearer ${_localToken || _sessionToken}`;
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
        const _localToken = getDataFromLocalStorage('authenticationToken');
        const _sessionToken = getDataFromTheSessionStorage(
          'authenticationToken'
        );

        const authToken = `Bearer ${_localToken || _sessionToken}`;
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
        const _localToken = getDataFromLocalStorage('authenticationToken');
        const _sessionToken = getDataFromTheSessionStorage(
          'authenticationToken'
        );

        const authToken = `Bearer ${_localToken || _sessionToken}`;
        window.location.href = `${TWITTER_AUTHENTICATION_BASE_URL}?org-id=${GlobalStateProvider?.organization?.id}&token=${encodeURIComponent(authToken)}
  `;
      }
    },
  },
  {
    name: 'Linkedin',
    platform: 'linkedin',
    onClickFunction: () => {},
  },
];
