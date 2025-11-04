import { Area } from 'react-easy-crop';

import {
  createImageUtilFunction,
  getBoundingBox,
  getRadianAngle,
} from './HelperFunctions';

export const getCroppedImageBlob = async (
  imageFile: File,
  croppedArea: Area,
  rotation: number
): Promise<Blob> => {
  const imageUrl = URL.createObjectURL(imageFile);
  const imageObject = await createImageUtilFunction(imageUrl);
  URL.revokeObjectURL(imageUrl);

  const canvasElement = document.createElement('canvas');
  const canvasContext = canvasElement.getContext('2d');

  if (!canvasContext) throw new Error('Canvas context not available');

  const rotationRadian = getRadianAngle(rotation);
  const { width: imgWidth, height: imgHeight } = imageObject;

  // Compute the bounding box for rotated image
  const { width: boundingBoxWidth, height: boundingBoxHeight } = getBoundingBox(
    imgWidth,
    imgHeight,
    rotationRadian
  );

  // Set canvas dimensions
  canvasElement.width = boundingBoxWidth;
  canvasElement.height = boundingBoxHeight;

  // Move to center → rotate → move back
  canvasContext.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
  canvasContext.rotate(rotationRadian);
  canvasContext.translate(-imgWidth / 2, -imgHeight / 2);

  // Draw the rotated image
  canvasContext.drawImage(imageObject, 0, 0);

  // Prepare crop canvas
  const croppedCanvas = document.createElement('canvas');
  const croppedContext = croppedCanvas.getContext('2d');
  if (!croppedContext) throw new Error('Crop canvas context not available');

  croppedCanvas.width = croppedArea.width;
  croppedCanvas.height = croppedArea.height;

  // Draw cropped region from rotated image
  croppedContext.drawImage(
    canvasElement,
    croppedArea.x,
    croppedArea.y,
    croppedArea.width,
    croppedArea.height,
    0,
    0,
    croppedArea.width,
    croppedArea.height
  );

  // ✅ Convert the cropped area to Blob (which can be uploaded)
  return new Promise<Blob>((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Failed to create Blob'));
        resolve(blob);
      },
      imageFile.type,
      0.95 // quality
    );
  });
};
