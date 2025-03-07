export const getCroppedImg = (imageSrc, crop) => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const ctx = canvas.getContext('2d');
        canvas.width = crop.width;
        canvas.height = crop.height;
  
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          canvas.width,
          canvas.height
        );
  
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Canvas is empty');
            return reject(new Error('Canvas is empty'));
          }
          resolve(new File([blob], 'croppedImage.jpeg', { type: 'image/jpeg' }));
        }, 'image/jpeg');
      };
      image.src = imageSrc;
    });
  };
  