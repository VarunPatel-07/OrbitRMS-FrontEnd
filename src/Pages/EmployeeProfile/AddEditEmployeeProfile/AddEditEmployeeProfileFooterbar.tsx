import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import Loader from '../../../common/Loader';
import { compareTwoNestedObject } from '../../../Helper/HelperFunctions';
import { AddEditEmployeeFooterInterface } from '../../../interface/AddEditUserProfileInterFace';

function AddEditEmployeeProfileFooter(props: AddEditEmployeeFooterInterface) {
  const {
    moduleType,
    fetchingTheEmployeeData,
    dummyFormData,
    formData,
    organization_slug,
    formSubmitLoader,
    handelSubmitAndUpdateButton,
  } = props;
  return (
    <div className='w-full bg-white px-6 py-2 mt-2 flex items-center justify-between gap-2 absolute bottom-0 left-0'>
      <div className='w-full max-w-[60%] '>
        {moduleType == 'edit' ? (
          <p className='font-inter text-lg font-medium capitalize text-black whitespace-nowrap flex items-center justify-start gap-1.5'>
            <span>Editing profile -</span>
            {fetchingTheEmployeeData ? (
              <Skeleton
                width={200}
                height={18}
                borderRadius={4}
                className='inline-block'
              />
            ) : (
              <span className='font-bold text-[var(--them-orange-color)] w-full max-w-[300px] overflow-hidden text-ellipsis inline-block'>
                {formData?.personal_info?.full_name}
              </span>
            )}
          </p>
        ) : (
          <p className='font-inter text-lg font-medium capitalize text-black whitespace-nowrap flex items-center justify-start gap-1.5'>
            <span>Add Employee</span>
          </p>
        )}
      </div>
      <div className='flex items-center gap-4 w-full justify-end'>
        {fetchingTheEmployeeData ? (
          <Skeleton
            width={160}
            height={40}
            borderRadius={8}
            className='inline-block'
          />
        ) : (
          <Link
            to={`/${organization_slug}/employees/employee-listing`}
            className='text-[var(--them-green-color)] py-2.5 px-14 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 transition-all w-fit'
          >
            Cancel
          </Link>
        )}
        {fetchingTheEmployeeData ? (
          <Skeleton
            width={160}
            height={40}
            borderRadius={8}
            className='inline-block'
          />
        ) : (
          <button
            className='text-white bg-[var(--them-green-color)] hover:bg-[var(--them-green-light-color)] w-fit py-2.5 px-14 rounded-lg font-inter text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed'
            onClick={handelSubmitAndUpdateButton}
            disabled={
              formSubmitLoader ||
              compareTwoNestedObject(dummyFormData, formData)
            }
          >
            {formSubmitLoader ? (
              <Loader loaderText='Updating....' />
            ) : moduleType == 'edit' ? (
              <span>Update</span>
            ) : (
              <span>Submit</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default AddEditEmployeeProfileFooter;
