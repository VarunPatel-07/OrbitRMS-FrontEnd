export interface loginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface signUpForm {
  organizationName: string;
  primaryEmail: string;
  defaultPortalUrlSlug: string;
  websiteUrl: string;
  contactNumber: string;
  portalUrl: string;
  termsAccepted: boolean;
  countryInfo: string;
}

// const initialOrganizationFormInfo = {
//   organizationName: "",
//   primaryEmail: "",
//   defaultPortalUrlSlug: "https://orbitrms.com/",
//   websiteUrl: "",
//   contactNumber: "",
// };
// {
//   "organization_name": "Tech Innovators Inc.",
//   "primary_email": "varunspatelo7@gmail.com",
//   "primary_number": "+1-800-123-4567",
//   "country_info": {
//       "country_name": "United States",
//       "country_flag": "🇺🇸",
//       "country_number_code": "+1"
//   },
//   "portal_url": "https://portal.techinnovators.com",
//   "website_url": "https://techinnovators.com",
//   "is_meta_verified": false,
//   "meta_key": "example_meta_key",
//   "meta_value": "example_meta_value",
//   "terms_accepted": true,
//   "email_verified": false,
//   "organization_profile_picture": "https://techinnovators.com/profile_picture.jpg"
// }
