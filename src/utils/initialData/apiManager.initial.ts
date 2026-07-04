import { TurnstileSetupFormData } from '@/interface/ApiManager.interface';

export const TURNSTILE_SETUP_INITIAL: TurnstileSetupFormData = {
   allowed_domains: [],
   turnstile_site_key: '',
   turnstile_secret_key: '',
   turnstile_mode: 'invisible',
};
