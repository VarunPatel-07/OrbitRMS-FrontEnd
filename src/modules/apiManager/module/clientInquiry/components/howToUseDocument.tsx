import { useContext } from 'react';

import { MdContentCopy } from 'react-icons/md';

import {
   NotificationContext,
   NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';

function HowToUseDocument() {
   const { handelNotification } = useContext(
      NotificationContext
   ) as NotificationContextApiProps;

   const BACKEND_API_BASEURL = import.meta.env.VITE_BACKEND_PUBLIC_API_BASEURL;

   const handelClickOnCopyButton = () => {
      const metaUrl = `${BACKEND_API_BASEURL}/public/v1/inquiries/submit?form_id=YOUR_FORM_ID`;
      window.navigator.clipboard
         .writeText(metaUrl)
         .then(() => {
            const data = { success: true, message: 'Url Copied Successfully' };
            handelNotification(data, 'center');
         })
         .catch(() => {
            console.error('Failed to copy');
         });
   };
   return (
      <div className='border border-black/10 rounded-lg w-full'>
         <div className='p-2.5 border-b border-b-black/15 bg-gradient-to-r from-blue-50 to-indigo-50'>
            <p className='font-inter text-black/80 font-medium text-base'>
               How To Use The API
            </p>
         </div>
         <div className='p-2.5 space-y-4'>
            <p className='font-inter text-sm text-black/70'>
               To submit a new client inquiry, make a{' '}
               <span className='font-semibold'>POST</span> request to the
               following endpoint. You must include a valid{' '}
               <code className='bg-slate-950/20 text-black font-semibold font-inter px-1.5 py-0.5 rounded'>
                  X-API-Key
               </code>
               ,{' '}
               <code className='bg-slate-950/20 text-black font-semibold font-inter px-1.5 py-0.5 rounded'>
                  X-API-secret
               </code>
               , and{' '}
               <code className='bg-slate-950/20 text-black font-semibold font-inter px-1.5 py-0.5 rounded'>
                  X-Turnstile-Token
               </code>
               in the request headers. The query string should only include the{' '}
               <code className='bg-blue-950/20 text-blue-900 font-semibold font-inter px-1.5 py-0.5 rounded'>
                  form_id
               </code>{' '}
               for routing.
            </p>
            <div className='bg-gradient-to-r from-slate-900 to-slate-800 p-2 rounded relative group'>
               <div className='w-full max-w-[97%] break-words'>
                  <span className='font-inter text-white/85 font-medium break-words'>
                     {BACKEND_API_BASEURL}
                     /public/v1/inquiries/submit?form_id=
                     <span className='font-semibold text-white'>
                        YOUR_FORM_ID
                     </span>
                  </span>
               </div>
               <button
                  className='absolute top-1/2 -translate-y-1/2 right-2 invisible group-hover:visible'
                  onClick={handelClickOnCopyButton}
               >
                  <MdContentCopy />
               </button>
            </div>

            <div className='bg-slate-50 border border-slate-200 rounded-lg p-3'>
               <p className='font-inter text-sm font-semibold text-black/90 mb-2'>
                  Required Headers:
               </p>

               <div className='space-y-2'>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                     <code className='w-fit bg-slate-900 text-white font-semibold font-inter px-2 py-1 rounded text-xs'>
                        X-API-Key
                     </code>
                     <span className='font-inter text-sm text-black/65'>
                        Your public inquiry API key
                     </span>
                  </div>

                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                     <code className='w-fit bg-slate-900 text-white font-semibold font-inter px-2 py-1 rounded text-xs'>
                        X-API-secret
                     </code>
                     <span className='font-inter text-sm text-black/65'>
                        Your public inquiry API secret
                     </span>
                  </div>

                  <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
                     <code className='w-fit bg-blue-900 text-white font-semibold font-inter px-2 py-1 rounded text-xs'>
                        X-Turnstile-Token
                     </code>
                     <span className='font-inter text-sm text-black/65'>
                        The Cloudflare Turnstile token generated on the client
                     </span>
                  </div>
               </div>
            </div>

            <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
               <p className='font-inter text-sm text-amber-900'>
                  <span className='font-semibold'>📋 About form_id:</span> The{' '}
                  <code className='bg-amber-200/50 px-1.5 py-0.5 rounded font-semibold'>
                     form_id
                  </code>{' '}
                  is the unique identifier of the form to which you are
                  submitting the inquiry. This ensures your submission is routed
                  to the correct form configuration.
               </p>
               <p className='font-inter text-sm text-amber-900 mt-2'>
                  <span className='font-semibold'>How to get the form_id:</span>{' '}
                  Navigate to{' '}
                  <code className='bg-amber-200/50 px-1.5 py-0.5 rounded font-semibold'>
                     Config → Inquiry Forms
                  </code>
                  . You will see all the forms for your organization. You can
                  retrieve the{' '}
                  <code className='bg-amber-200/50 px-1.5 py-0.5 rounded font-semibold'>
                     form_id
                  </code>{' '}
                  from there. Note that you can edit the form details, but the{' '}
                  <span className='font-semibold'>Form ID</span> and{' '}
                  <span className='font-semibold'>Form Name</span> cannot be
                  changed.
               </p>
               <p className='font-inter text-sm text-amber-900 mt-2'>
                  <span className='font-semibold'>
                     Why form_id is important:
                  </span>{' '}
                  The form_id is used to retrieve the complete schema of all
                  fields for that specific form. This schema provides critical
                  information including:
               </p>
               <ul className='font-inter text-sm text-amber-900 mt-1 ml-4 list-disc space-y-1'>
                  <li>Which fields are available in the form</li>
                  <li>Which fields are required vs optional</li>
                  <li>
                     The data type expected for each field (string, number,
                     array, etc.)
                  </li>
                  <li>Validation rules and constraints for each field</li>
                  <li>Field-specific configurations and settings</li>
               </ul>
            </div>

            <div className='grid grid-cols-2 gap-3'>
               <div className='bg-slate-50 p-3 rounded-lg border border-slate-200'>
                  <p className='font-inter text-sm text-black/70'>
                     <span className='font-semibold text-black/90'>
                        Request Method:
                     </span>
                     <br />
                     <code className='text-green-700 font-semibold'>POST</code>
                  </p>
               </div>
               <div className='bg-slate-50 p-3 rounded-lg border border-slate-200'>
                  <p className='font-inter text-sm text-black/70'>
                     <span className='font-semibold text-black/90'>
                        Content-Type:
                     </span>
                     <br />
                     <code className='text-blue-700 font-semibold'>
                        application/json
                     </code>
                  </p>
               </div>
            </div>

            <div className='border-l-4 border-red-500 bg-red-50 p-3 rounded-r-lg'>
               <p className='font-inter text-sm text-red-900'>
                  <span className='font-semibold'>⚠️ Important:</span> The
                  request body must include all the fields that are defined in
                  the <span className='font-semibold'>config module</span>. Any
                  field marked as{' '}
                  <span className='font-semibold'>required</span> cannot be
                  empty or missing. Additionally, the data types of the
                  submitted values must strictly match the types defined in the
                  config module's form field (e.g., string, number, array).
               </p>
            </div>

            <p className='font-inter text-sm text-black/80 font-semibold mt-6'>
               Sample Request Body:
            </p>

            <div className='bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto shadow-lg'>
               <pre className='text-slate-100'>
                  {`{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "message": "I'm interested in your services."
}`}
               </pre>
            </div>

            <p className='font-inter text-sm text-black/80 font-semibold mt-6'>
               Example Request:
            </p>

            <div className='bg-slate-900 p-4 rounded-lg text-sm font-mono overflow-auto shadow-lg'>
               <pre className='text-slate-100'>
                  {`fetch("${BACKEND_API_BASEURL}/public/v1/inquiries/submit?form_id=YOUR_FORM_ID", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_API_KEY",
    "X-API-secret": "YOUR_API_SECRET",
    "X-Turnstile-Token": "YOUR_TURNSTILE_TOKEN"
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91-9876543210",
    message: "I'm interested in your services."
  })
});`}
               </pre>
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
               <p className='font-inter text-sm text-blue-900'>
                  <span className='font-semibold'>🔒 Security Notice:</span>{' '}
                  Ensure that all required fields are provided and that your API
                  key, secret, Turnstile token, and form ID are kept
                  confidential. Authentication values must be sent through
                  headers, and the URL query should only contain the form ID. If
                  your credentials are invalid or missing, the API will respond
                  with an authentication error.
               </p>
            </div>
         </div>
      </div>
   );
}

export default HowToUseDocument;
