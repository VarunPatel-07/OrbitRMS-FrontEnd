import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDropzone } from 'react-dropzone';
import { Area } from 'react-easy-crop';
import { FaCloudUploadAlt } from 'react-icons/fa';

import { DragDropUploaderProps } from '../../interface/propsInterface';
import ImageCropper from './ImageCropper';

function DragAndDropFileUploader(props: DragDropUploaderProps) {
  const { RequiredFileTypeArray, showDropFileScreenInFullScreen } =
    props as DragDropUploaderProps;

  const [selectedFile, setSelectedFile] = useState<File>();

  const uploadingFilesTypeCheckingFunction = useCallback(
    (file: File) => {
      if (RequiredFileTypeArray?.includes(file.type)) {
        return true;
      } else {
        return false;
      }
    },
    [RequiredFileTypeArray]
  );
  const onDrop = useCallback(
    (acceptedFiles: Array<File>) => {
      acceptedFiles.map((eachFile: File) => {
        if (uploadingFilesTypeCheckingFunction(eachFile)) {
          console.log('allowed for', eachFile.name);
          setSelectedFile(eachFile);
        } else {
          console.log('wrong formate for ', eachFile.name);
        }
      });
    },
    [uploadingFilesTypeCheckingFunction]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const onCropDone = (croppedArea: Area) => {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = croppedArea.width;
    canvasElement.height = croppedArea.height;

    const canvasContext = canvasElement.getContext('2d');

    const imageUrl = selectedFile ? URL.createObjectURL(selectedFile) : '';

    const imageObjectOne = new Image();
    imageObjectOne.src = imageUrl;
    imageObjectOne.onload = function () {
      canvasContext?.drawImage(
        imageObjectOne,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );
      const dataUrl = canvasElement.toDataURL('image/jpeg');

      console.log(dataUrl);
    };
  };

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          showDropFileScreenInFullScreen ? (
            <div className='fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-50 flex items-center justify-center'>
              <h6 className='text-5xl font-sans font-semibold'>
                Drop the files here ...
              </h6>
            </div>
          ) : (
            <>
              <div className='py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]'>
                <FaCloudUploadAlt className='w-20 h-20 text-indigo-600' />
                <p className='text-base font-semibold text-indigo-700'>
                  Drop Files to Upload
                </p>
              </div>
            </>
          )
        ) : (
          <>
            <div className='py-6 px-24  z-10 flex flex-col gap-2 items-center justify-center border border-indigo-500 border-dashed rounded-lg bg-[rgba(99,102,241,0.08)]'>
              <FaCloudUploadAlt className='w-20 h-20 text-indigo-600' />
              <p className='text-base text-black'>
                Drag & Drop Files or <span>Browse</span>
              </p>
            </div>
          </>
        )}
      </div>

      {selectedFile &&
        createPortal(
          <ImageCropper file={selectedFile} onCropDone={onCropDone} />,
          document.body
        )}
    </>
  );
}

export default DragAndDropFileUploader;
