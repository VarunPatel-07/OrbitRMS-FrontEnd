import { AddEditInquiryFormSchemaInterface } from '@/interface/Global.interface';

export const AddEditInquiryFormSchemaInitialForm: AddEditInquiryFormSchemaInterface =
  {
    id: '',
    form_id: '',
    description: '',
    form_name: '',
    status: false,
    source_type: 'default',
    authorized_recipient_emails: [''],
    email_notification: false,
  };

export const AddEditInquiryFormSchemaBreadcrumbs = (organization: string) => [
  { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
  {
    name: 'Config',
    label: 'config-module',
    link: `/${organization}/config/project-status`,
  },
  {
    name: 'Inquiry Forms',
    label: 'inquiry-forms',
    link: `/${organization}/config/inquiry-forms`,
  },
];

export const AddEditInquiryFormFields = (
  organization: string,
  id: string,
  form_name: string
) => [
  { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
  {
    name: 'Config',
    label: 'config-module',
    link: `/${organization}/config/project-status`,
  },
  {
    name: 'Inquiry Forms',
    label: 'inquiry-forms',
    link: `/${organization}/config/inquiry-forms`,
  },
  {
    name: form_name,
    label: '/fields',
    link: `/${organization}/config/inquiry-forms/${id}/fields`,
  },
];
