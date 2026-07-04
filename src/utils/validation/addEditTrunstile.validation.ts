import { TurnstileSetupFormData } from '@/interface/ApiManager.interface';
import { ValidationResult } from '@/interface/Global.interface';

export const validateTurnStileForm = ({
   formData,
}: {
   formData: TurnstileSetupFormData;
}): ValidationResult => {
   const errors: Record<string, string> = {};

   if (!formData.turnstile_mode) {
      errors.turnstile_mode = 'Widget mode is required';
   }

   if (!formData.allowed_domains.length) {
      errors.allowed_domains = 'At least one allowed domain is required';
   }

   if (!formData.turnstile_site_key.trim()) {
      errors.turnstile_site_key = 'Turnstile site key is required';
   }

   if (!formData.turnstile_secret_key.trim()) {
      errors.turnstile_secret_key = 'Turnstile secret key is required';
   }

   return {
      isValid: Object.keys(errors).length === 0,
      errors,
   };
};
