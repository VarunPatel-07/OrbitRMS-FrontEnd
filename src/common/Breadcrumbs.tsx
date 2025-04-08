import { FaHome } from 'react-icons/fa';
import { GoChevronRight } from 'react-icons/go';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Link, useLocation } from 'react-router-dom';

import { BreadcrumbsProps } from '../interface/propsInterface';

function Breadcrumbs({
  BreadcrumbsNavigationFlow,
}: {
  BreadcrumbsNavigationFlow: Array<BreadcrumbsProps>;
}) {
  const navigation = useLocation();
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full bg-white py-2 px-3 absolute z-10'>
        <div className='w-full flex items-center gap-2'>
          {BreadcrumbsNavigationFlow.map((item, index) => (
            <div
              key={index}
              className='text-base flex items-center justify-start gap-2'
            >
              {item.name.toLocaleLowerCase() == 'home' ? (
                <Link to={item.link} className='text-black'>
                  <FaHome />
                </Link>
              ) : (
                <Link
                  to={item.link}
                  className={`${
                    navigation.pathname === item.link
                      ? 'text-blue-700 font-medium cursor-default'
                      : 'text-black font-medium'
                  } text-sm`}
                >
                  {item.name ? (
                    item?.name
                  ) : (
                    <Skeleton
                      width={100}
                      height={18}
                      className='inline-block'
                    />
                  )}
                </Link>
              )}
              {BreadcrumbsNavigationFlow.length !== index + 1 && (
                <span className='text-black'>
                  <GoChevronRight />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default Breadcrumbs;
