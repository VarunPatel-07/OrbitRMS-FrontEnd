import AddEditProfileSkeletonLoader from '../../../Components/Loader/AddEditProfileSkeletonLoader';

function AddEditEmployeeProfileSkeletonLoader() {
  return (
    <>
      <AddEditProfileSkeletonLoader
        showProfileLoader
        showAboutFiled
        singleColumnFieldCount={1}
        tripleColumnFieldCount={6}
      />
      <AddEditProfileSkeletonLoader
        tripleColumnFieldCount={6}
        doubleColumnFieldCount={2}
      />
      <AddEditProfileSkeletonLoader
        doubleColumnFieldCount={2}
        childrenEmergencySection
      />
      <AddEditProfileSkeletonLoader doubleColumnFieldCount={3} />
      <AddEditProfileSkeletonLoader
        showAddressField
        doubleColumnFieldCount={4}
      />
      <AddEditProfileSkeletonLoader showSocialLinkField />
    </>
  );
}

export default AddEditEmployeeProfileSkeletonLoader;
