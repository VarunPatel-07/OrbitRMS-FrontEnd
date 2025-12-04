export const ImageDownscaler = (
  file: File,
  maxSizeMb: number = 2
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const imageReader = new FileReader();

    imageReader.onload = (event) => {
      const newImage = new Image();

      newImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;

        let width = newImage.width;
        let height = newImage.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(newImage, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject('Failed to compress image');

            if (blob.size > maxSizeMb * 1024 * 1024) {
              let quality = 0.9;

              const compress = () => {
                canvas.toBlob(
                  (compressedBlob) => {
                    if (!compressedBlob)
                      return reject('Failed to compress image');

                    if (
                      compressedBlob.size <= maxSizeMb * 1024 * 1024 ||
                      quality < 0.2
                    ) {
                      resolve(
                        new File([compressedBlob], file.name, {
                          type: compressedBlob.type,
                        })
                      );
                    } else {
                      quality -= 0.1;
                      compress();
                    }
                  },
                  'image/jpeg',
                  quality
                );
              };
              compress();
            } else {
              resolve(new File([blob], file.name, { type: blob.type }));
            }
          },
          'image/jpeg',
          0.9
        );
      };
      newImage.src = event.target?.result as string;
    };
    imageReader.onerror = (err) => reject(err);
    imageReader.readAsDataURL(file);
  });
};
