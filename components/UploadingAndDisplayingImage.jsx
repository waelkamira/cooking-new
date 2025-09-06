// 'use client';
// import Image from 'next/image';
// import { useContext, useEffect, useState } from 'react';
// import { inputsContext } from './Context';
// import { MdOutlineAddPhotoAlternate } from 'react-icons/md';

// export default function UploadingAndDisplayingImage({ img }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const { dispatch, imageError } = useContext(inputsContext);

//   useEffect(() => {
//     handleUpload();
//   }, [selectedFile]);
//   // Handle file input change
//   const onFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   // Handle image upload
//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('image', selectedFile);

//     try {
//       const response = await fetch('/api/uploadImageToImgur', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       if (data.success) {
//         setUploadedImage(data?.data?.link);
//         dispatch({ type: 'IMAGE', payload: data?.data?.link });
//       } else {
//         console.error('Error uploading image:', data.error);
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//     }
//   };

//   return (
//     <div className="relative flex justify-center items-center w-full h-72 sm:h-96 text-center ">
//       <div className="absolute top-0 left-0 flex flex-col justify-center items-center text-white z-50 w-full">
//         <input type="file" id="file-upload" onChange={onFileChange} />
//         <input
//           type="file"
//           id="file-upload"
//           onChange={onFileChange}
//           className="flex justify-center items-center w-96 h-72 sm:h-96 border-2 text-center border-one rounded-lg placeholder:text-white "
//         />
//         {imageError?.imageError && (
//           <h1 className=" text-one text-2xl text-center my-2 w-full animate-bounce font-bold mt-8">
//             {imageError?.message}
//           </h1>
//         )}
//       </div>
//       <div className="absolute top-0 mx-auto w-full h-72 sm:h-96 border-2 border-one rounded-lg overflow-hidden z-50 ">
//         <div class="absolute top-0 left-0 custom-file-upload w-full h-full">
//           <div className="flex flex-col justify-center items-center size-full ">
//             <label
//               for="file-upload"
//               class="absolute top-0 size-full cursor-pointer"
//             ></label>
//             <MdOutlineAddPhotoAlternate className="text-one text-3xl" />
//             <h1 className="text-white text-sm sm:text-xl"> أضف صورة للطبخة</h1>
//           </div>
//         </div>

//         {img && !uploadedImage && (
//           <div className="w-full h-72 sm:h-96 border rounded-lg border-secondary">
//             <Image
//               priority
//               src={img}
//               alt="Uploaded"
//               layout="fill"
//               objectFit="cover"
//             />
//           </div>
//         )}
//         {uploadedImage && (
//           <div className="relative w-full h-72 sm:h-96">
//             <Image
//               priority
//               src={uploadedImage}
//               alt="Uploaded"
//               layout="fill"
//               objectFit="cover"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import { useContext, useState, useCallback } from 'react';
import Image from 'next/image';
import { MdOutlineAddPhotoAlternate, MdClose } from 'react-icons/md';
import LoadingPhoto from './LoadingPhoto';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { inputsContext } from './Context';

export default function UploadingAndDisplayingImage({ images = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [localImages, setLocalImages] = useState([]); // تخزين الصور محليًا
  const { dispatch } = useContext(inputsContext);

  // دالة للتحقق من وجود الصورة في المصفوفة
  const isImageAlreadyAdded = useCallback(
    (imageLink) => localImages.includes(imageLink),
    [localImages]
  );

  // دالة لرفع الصورة إلى الخدمات بالتناوب
  const uploadImage = useCallback(async (file) => {
    const services = ['Imgur', 'Imgbb', 'ImageKit'];
    let uploadedLink = null;

    for (const service of services) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/uploadImageTo${service}`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          uploadedLink =
            data?.data?.url || data?.image?.url || data?.data?.link;
          console.log(
            `تم الرفع بنجاح إلى: ${service} - الرابط: ${uploadedLink}`
          );
          toast.success('تم رفع الصورة بنجاح');
          break;
        }
      } catch (error) {
        console.error(`فشل الرفع إلى ${service}:`, error);
      }
    }

    if (!uploadedLink) {
      toast.error('تعذر رفع الصورة. حاول مرة أخرى لاحقًا.');
    }

    return uploadedLink;
  }, []);

  // دالة لمعالجة تغيير الملفات
  const handleFileChange = useCallback(
    async (event) => {
      const selectedFiles = event.target.files;

      if (selectedFiles.length > 5) {
        alert('لا يمكن رفع أكثر من 5 صور للبوست الواحد');
        return;
      }

      setIsLoading(true);

      try {
        const uploadPromises = Array.from(selectedFiles).map(async (file) => {
          if (!file.type.startsWith('image/')) {
            toast.error('الملف المحدد ليس صورة.');
            return null;
          }
          if (file.size > 5 * 1024 * 1024) {
            // 5MB
            toast.error('حجم الصورة كبير جدًا. الحد الأقصى هو 5MB.');
            return null;
          }

          const imageLink = await uploadImage(file);
          if (imageLink && !isImageAlreadyAdded(imageLink)) {
            return imageLink;
          } else if (imageLink) {
            toast.error('هذه الصورة موجودة مسبقًا.');
            return null;
          }
          return null;
        });

        const newImages = (await Promise.all(uploadPromises)).filter(Boolean);

        // تحديث الحالة المحلية بالصور الجديدة
        setLocalImages((prevImages) => [...prevImages, ...newImages]);

        // إرسال جميع الصور إلى الـ Context مرة واحدة
        dispatch({
          type: 'IMAGE',
          payload: [...localImages, ...newImages], // إرسال الصور القديمة والجديدة
        });
      } catch (error) {
        console.error('حدث خطأ أثناء رفع الصور:', error);
        toast.error('حدث خطأ أثناء رفع الصور. حاول مرة أخرى.');
      } finally {
        setIsLoading(false);
      }
    },
    [uploadImage, isImageAlreadyAdded, localImages, dispatch]
  );

  // دالة لإزالة صورة معينة
  const handleRemoveImage = useCallback(
    (index) => {
      const updatedImages = localImages.filter((_, i) => i !== index);
      setLocalImages(updatedImages);

      // تحديث الـ Context بالصور المتبقية
      dispatch({
        type: 'IMAGE',
        payload: updatedImages,
      });
    },
    [localImages, dispatch]
  );

  // دمج الصور وتصفية الصور غير الصحيحة
  const allImages = [...(images || []), ...localImages];
  const filteredImages = allImages.filter(Boolean);

  return (
    <div className="flex flex-col justify-center items-center w-full px-2 sm:px-8 h-full my-8">
      {/* الصورة الكبيرة في الأعلى */}
      <div className="relative w-full min-h-72 lg:h-[500px] border border-gray-300 rounded-[5px] mb-4 bg-white">
        {isLoading ? (
          <LoadingPhoto />
        ) : filteredImages[0] ? (
          <>
            <Link href={'#post1'}>
              <Image
                priority
                src={filteredImages[0]}
                alt="الصورة الرئيسية"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-[5px]"
                quality={75}
              />
            </Link>
            <label
              htmlFor="file-upload"
              className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
            >
              <MdOutlineAddPhotoAlternate className="text-xl" />
            </label>
            <button
              onClick={() => handleRemoveImage(0)}
              className="absolute top-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
            >
              <MdClose className="text-xl" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-72 lg:h-96 w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center h-full cursor-pointer bg-white"
            >
              <MdOutlineAddPhotoAlternate className="text-one text-3xl text-primary" />
              <h1 className="text-sm sm:text-lg">أضف صورة رئيسية</h1>
            </label>
          </div>
        )}
      </div>

      {/* الأربع صور الصغيرة في الأسفل */}
      <div className="flex justify-center items-center gap-2 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative size-16 sm:size-32 border border-gray-300 rounded-[5px] flex justify-center items-center bg-white"
          >
            {isLoading ? (
              <LoadingPhoto />
            ) : filteredImages[index + 1] ? (
              <>
                <Image
                  priority
                  src={filteredImages[index + 1]}
                  alt={`الصورة ${index + 2}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-[5px]"
                  quality={75}
                />
                <label
                  htmlFor="file-upload"
                  className="absolute bottom-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
                >
                  <MdOutlineAddPhotoAlternate className="text-one text-3xl text-primary" />
                </label>
                <button
                  onClick={() => handleRemoveImage(index + 1)}
                  className="absolute top-2 right-2 bg-black text-white bg-opacity-50 p-2 rounded-full cursor-pointer"
                >
                  <MdClose className="text-xl" />
                </button>
              </>
            ) : (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <MdOutlineAddPhotoAlternate className="text-one text-xl text-primary" />
                <h1 className="text-[8px] sm:text-sm lg:text-lg">أضف صورة</h1>
              </label>
            )}
          </div>
        ))}
      </div>

      {/* Input لتحميل الصور */}
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        multiple
        accept="image/*"
      />
    </div>
  );
}
