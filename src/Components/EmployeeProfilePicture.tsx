import defaultProfilePicture from '../assets/SVG-Images/default-profile-image.svg';
import { EmployeeProfilePictureInterface } from '../interface/interface';

function EmployeeProfilePicture(props: EmployeeProfilePictureInterface) {
  const { width, height } = props;
  return (
    <div className='w-full flex items-center justify-center'>
      <div
        className='w-full h-full rounded-full bg-black/50'
        style={{
          minWidth: `${width}px`,
          minHeight: `${height}px`,
          maxHeight: `${width}px`,
          maxWidth: `${height}px`,
        }}
      >
        <img
          src={defaultProfilePicture}
          alt='Default Employee Profile Picture'
          width={width}
          height={height}
          loading='lazy'
        />
      </div>
    </div>
  );
}

export default EmployeeProfilePicture;
