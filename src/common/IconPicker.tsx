import React, { ReactElement, useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import {
  FaBehance,
  FaDev,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaReddit,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { HiOutlineUpload } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';

import { classNames } from '../Helper/HelperFunctions';

interface SocialLinksInterFace {
  label: string;
  title: string;
  icon: ReactElement;
}

interface IconPickerInterFace {
  selectedIcon: string;
  onSelectValBtn: (data: string) => void;
  position: 'bottom' | 'top';
}

const socialLinks: SocialLinksInterFace[] = [
  {
    label: 'github',
    title: 'GitHub',
    icon: <FaGithub />,
  },
  {
    label: 'linkedin',
    title: 'LinkedIn',
    icon: <FaLinkedin />,
  },
  {
    label: 'twitter',
    title: 'Twitter (X)',
    icon: <FaTwitter />,
  },
  {
    label: 'facebook',
    title: 'Facebook',
    icon: <FaFacebook />,
  },
  {
    label: 'instagram',
    title: 'Instagram',
    icon: <FaInstagram />,
  },
  {
    label: 'youtube',
    title: 'YouTube',
    icon: <FaYoutube />,
  },
  {
    label: 'dribbble',
    title: 'Dribbble',
    icon: <FaDribbble />,
  },
  {
    label: 'behance',
    title: 'Behance',
    icon: <FaBehance />,
  },
  {
    label: 'medium',
    title: 'Medium',
    icon: <FaMedium />,
  },
  {
    label: 'devto',
    title: 'Dev.to',
    icon: <FaDev />,
  },
  {
    label: 'reddit',
    title: 'Reddit',
    icon: <FaReddit />,
  },
  {
    label: 'email',
    title: 'Email',
    icon: <MdEmail />,
  },
  {
    label: 'website',
    title: 'Website',
    icon: <FaGlobe />,
  },
];

function IconPicker(props: IconPickerInterFace) {
  const { selectedIcon, onSelectValBtn, position = 'top' } = props;
  const boxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchVal, setSearchVal] = useState<string>('');
  const [filteredSocialLink, setFilteredSocialLink] =
    useState<SocialLinksInterFace[]>(socialLinks);

  const handelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchVal(value);
    setFilteredSocialLink(
      socialLinks.filter((item) =>
        item?.label?.toLocaleLowerCase()?.includes(value?.toLocaleLowerCase())
      )
    );
  };

  const handelOnclick = (data: ReactElement) => {
    onSelectValBtn(ReactDOMServer.renderToStaticMarkup(data));
    setIsOpen(false);
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, []);

  return (
    <div className='w-full relative' ref={boxRef}>
      <button className='w-fit' onClick={() => setIsOpen(!isOpen)}>
        <div className='icon p-2 bg-gray-200 rounded-md w-10 h-10 flex items-center justify-center'>
          {selectedIcon ? (
            <span
              className='text-black w-5 h-5 inline-block full-width-svg'
              dangerouslySetInnerHTML={{ __html: selectedIcon }}
            ></span>
          ) : (
            <span className='text-black w-5 h-5 inline-block full-width-svg'>
              <HiOutlineUpload />
            </span>
          )}
        </div>
      </button>
      <div
        className={classNames(
          'absolute w-[260px] bg-gray-100 -left-0 p-3 shadow-lg rounded-lg transition-all',
          {
            'opacity-100 scale-y-100 visible': isOpen,
            'opacity-0 scale-y-50 invisible': !isOpen,
            'bottom-full origin-bottom mb-2': position == 'top',
            'top-full origin-top mt-2': position == 'bottom',
          }
        )}
      >
        <div className='w-full h-auto m-auto'>
          <div className='searchbar pb-3.5'>
            <input
              type='text'
              className='w-full bg-transparent border border-black/20 px-2 py-1 text-sm focus:ring-0 focus:outline focus:outline-4 focus:outline-[rgba(215,139,159,0.2)] font-inter rounded-lg text-black'
              placeholder='Search Icon'
              value={searchVal}
              onChange={handelSearch}
            />
          </div>
          <div className='flex flex-wrap items-stretch justify-start gap-2  max-h-[300px] overflow-auto'>
            {filteredSocialLink?.map((link: SocialLinksInterFace, index) => (
              <button
                className='icon p-2 bg-gray-200 rounded-md w-12 h-12 flex items-center justify-center'
                key={index}
                onClick={() => handelOnclick(link?.icon)}
              >
                <span className='text-black w-7 h-7 inline-block full-width-svg'>
                  {link.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IconPicker;
