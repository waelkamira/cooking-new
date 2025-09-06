// 'use client';

// import { useSession } from 'next-auth/react';
// import Image from 'next/image';
// import React, { useState, useEffect, useContext } from 'react'; // تم تحديثها لاستيراد useContext
// import Link from 'next/link';
// import { useRouter, useParams } from 'next/navigation'; // استيراد useRouter
// import { motion, AnimatePresence } from 'framer-motion';
// import { useToast } from '@/hooks/use-toast';
// import { formatDistanceToNow } from 'date-fns'; // تم تحديثها للاستيراد الصحيح
// import { ar } from 'date-fns/locale';

// import Button from '../../../components/Button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Separator } from '@/components/ui/separator';
// import {
//   Menu,
//   ArrowLeft,
//   Edit,
//   Save,
//   ImageIcon,
//   Utensils,
//   ListOrdered,
//   Video,
//   Lightbulb,
//   Loader2,
// } from 'lucide-react';

// // Types
// /**
//  * @typedef {object} Recipe
//  * @property {string} id
//  * @property {string} mealName
//  * @property {string} ingredients
//  * @property {string} theWay
//  * @property {string} [advise]
//  * @property {string} [link]
//  * @property {string} image
//  * @property {string} userImage
//  * @property {string} userName
//  * @property {string} createdAt
//  */

// // ImageUploader component
// /**
//  * @param {{ currentImage: string, onImageChange: (url: string) => void }} props
//  */
// const ImageUploader = (props) => {
//   const { currentImage, onImageChange } = props;
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(currentImage);

//   /** @param {React.ChangeEvent<HTMLInputElement>} e */
//   const handleImageUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     // Create a preview URL
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const result = reader.result;
//       setPreviewUrl(result);

//       // Simulate upload delay
//       setTimeout(() => {
//         onImageChange(result);
//         setIsUploading(false);
//       }, 1500);
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="w-full">
//       <div className="relative w-full h-64 md:h-96 mb-4 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
//         {previewUrl ? (
//           <Image
//             src={previewUrl || '/placeholder.svg'}
//             alt="Recipe preview"
//             fill
//             className="object-cover"
//           />
//         ) : (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//             <ImageIcon className="h-16 w-16 text-gray-400" />
//           </div>
//         )}

//         {isUploading && (
//           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <Loader2 className="h-8 w-8 text-white animate-spin" />
//           </div>
//         )}

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleImageUpload}
//           className="absolute inset-0 opacity-0 cursor-pointer"
//         />
//       </div>
//       <p className="text-sm text-center text-gray-500 mb-4">
//         انقر لتحميل صورة جديدة أو اسحب الصورة وأفلتها هنا
//       </p>
//     </div>
//   );
// };

// // VideoEmbedder component
// /**
//  * @param {{ currentEmbed: string, onEmbedChange: (embedUrl: string) => void }} props
//  */
// const VideoEmbedder = (props) => {
//   const { currentEmbed, onEmbedChange } = props;
//   const [url, setUrl] = useState('');
//   const [embedUrl, setEmbedUrl] = useState(currentEmbed);

//   // Function to extract video ID and platform
//   /** @param {string} url */
//   const getVideoIdAndPlatform = (url) => {
//     let videoId = null;
//     let platform = null;

//     // YouTube
//     const youtubeRegex =
//       /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
//     const youtubeMatch = url.match(youtubeRegex);

//     if (youtubeMatch && youtubeMatch[1]) {
//       videoId = youtubeMatch[1];
//       platform = 'youtube';
//       return { videoId, platform };
//     }

//     // TikTok
//     const tiktokRegex = /tiktok\.com\/.*\/video\/(\d+)/;
//     const tiktokMatch = url.match(tiktokRegex);

//     if (tiktokMatch && tiktokMatch[1]) {
//       videoId = tiktokMatch[1];
//       platform = 'tiktok';
//       return { videoId, platform };
//     }

//     // Facebook
//     const facebookRegex = /facebook\.com\/.*\/videos\/(\d+)/;
//     const facebookMatch = url.match(facebookRegex);

//     if (facebookMatch && facebookMatch[1]) {
//       videoId = facebookMatch[1];
//       platform = 'facebook';
//       return { videoId, platform };
//     }

//     return { videoId, platform };
//   };

//   const handleGenerateEmbed = () => {
//     const { videoId, platform } = getVideoIdAndPlatform(url);

//     if (videoId && platform) {
//       let newEmbedUrl = '';

//       if (platform === 'youtube') {
//         newEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
//       } else if (platform === 'tiktok') {
//         newEmbedUrl = `https://www.tiktok.com/embed/${videoId}`;
//       } else if (platform === 'facebook') {
//         newEmbedUrl = `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${videoId}&show_text=0&width=560`;
//       }

//       setEmbedUrl(newEmbedUrl);
//       onEmbedChange(newEmbedUrl);
//     }
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div className="flex space-x-2 rtl:space-x-reverse">
//         <Input
//           dir="ltr"
//           type="text"
//           placeholder="الصق رابط الفيديو هنا (يوتيوب، تيك توك، فيسبوك)"
//           value={url}
//           onChange={(e) => setUrl(e.target.value)}
//           className="flex-1"
//         />
//         <Button onClick={handleGenerateEmbed} type="button">
//           تضمين
//         </Button>
//       </div>

//       <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
//         {embedUrl ? (
//           <iframe
//             src={embedUrl}
//             title="Video player"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="w-full h-full"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center">
//             <Video className="h-16 w-16 text-gray-400" />
//             <p className="text-gray-500 mt-4">لم يتم تضمين أي فيديو</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // SideBarMenu component
// /**
//  * @param {{ setIsOpen: (open: boolean) => void }} props
//  */
// const SideBarMenu = (props) => {
//   const { setIsOpen } = props;

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: 100 }}
//       animate={{ opacity: 1, x: 0 }}
//       exit={{ opacity: 0, x: 100 }}
//       className="absolute top-0 right-0 bg-white dark:bg-gray-900 shadow-xl p-4 rounded-lg w-64 z-50"
//     >
//       <div className="flex justify-end mb-6">
//         <button
//           onClick={() => setIsOpen(false)}
//           className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           <ArrowLeft className="h-6 w-6" />
//         </button>
//       </div>
//       <nav className="space-y-4">
//         <Link
//           href="/"
//           className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           الصفحة الرئيسية
//         </Link>
//         <Link
//           href="/favorite-recipes"
//           className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           وصفاتي المفضلة
//         </Link>
//         <Link
//           href="/newRecipe"
//           className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           إنشاء وصفة جديدة
//         </Link>
//         <Link
//           href="/the-garden"
//           className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           حديقة الجوائز
//         </Link>
//         <Link
//           href="/profile"
//           className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
//         >
//           الملف الشخصي
//         </Link>
//       </nav>
//     </motion.div>
//   );
// };

// export default function EditRecipe() {
//   const { data: session, status } = useSession();
//   const [isOpen, setIsOpen] = useState(false);
//   /** @type { [Recipe | null, React.Dispatch<Recipe | null>]} */
//   const [recipe, setRecipe] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const { id } = useParams();
//   const { toast } = useToast();
//   const router = useRouter();

//   // Form state
//   const [formData, setFormData] = useState({
//     mealName: '',
//     ingredients: '',
//     theWay: '',
//     advise: '',
//     link: '',
//     image: '',
//   });

//   // Fetch recipe data
//   useEffect(() => {
//     const fetchRecipe = async () => {
//       setIsLoading(true);
//       try {
//         const res = await fetch(`/api/editRecipe?id=${id}`);
//         if (!res.ok) throw new Error('Failed to fetch recipe');

//         const data = await res.json();
//         setRecipe(data);
//         setFormData({
//           mealName: data.mealName || '',
//           ingredients: data.ingredients || '',
//           theWay: data.theWay || '',
//           advise: data.advise || '',
//           link: data.link || '',
//           image: data.image || '',
//         });
//       } catch (error) {
//         console.error('Error fetching recipe:', error);
//         toast({
//           title: 'خطأ',
//           description: 'فشل في تحميل بيانات الوصفة',
//           variant: 'destructive',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (status === 'authenticated') {
//       fetchRecipe();
//     } else if (status === 'unauthenticated') {
//       setIsLoading(false);
//     }
//   }, [id, status, toast]);

//   /** @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   /** @param {string} url */
//   const handleImageChange = (url) => {
//     setFormData((prev) => ({ ...prev, image: url }));
//   };

//   /**  @param {string} embedUrl */
//   const handleEmbedChange = (embedUrl) => {
//     setFormData((prev) => ({ ...prev, link: embedUrl }));
//   };

//   /** @param {React.FormEvent} e */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!session) {
//       toast({
//         title: 'خطأ',
//         description: 'يجب تسجيل الدخول لتعديل الوصفة',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsSaving(true);

//     try {
//       const response = await fetch(`/api/editRecipe?id=${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) throw new Error('Failed to update recipe');

//       toast({
//         title: 'تم بنجاح',
//         description: 'تم تعديل الوصفة بنجاح',
//       });

//       // Redirect to recipe page
//       router.push(`/recipe/${id}`);
//     } catch (error) {
//       console.error('Error updating recipe:', error);
//       toast({
//         title: 'خطأ',
//         description: 'فشل في تحديث الوصفة',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   /** @param {string} dateString */
//   const formatDate = (dateString) => {
//     try {
//       return formatDistanceToNow(new Date(dateString), {
//         addSuffix: true,
//         locale: ar,
//       });
//     } catch (error) {
//       return 'تاريخ غير صالح';
//     }
//   };

//   // If not authenticated
//   if (status === 'unauthenticated') {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
//         <Card className="w-full max-w-md">
//           <CardContent className="pt-6">
//             <div className="flex flex-col items-center text-center space-y-4">
//               <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
//                 <Utensils className="h-8 w-8 text-primary" />
//               </div>
//               <h2 className="text-2xl font-bold">يجب تسجيل الدخول</h2>
//               <p className="text-gray-500 dark:text-gray-400">
//                 يجب عليك تسجيل الدخول أولا لتعديل هذه الوصفة
//               </p>
//               <Link href="/login">
//                 <Button className="w-full">تسجيل الدخول</Button>
//               </Link>
//               <Link href="/">
//                 <Button variant="outline" className="w-full">
//                   العودة للصفحة الرئيسية
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="h-12 w-12 text-primary animate-spin" />
//           <p className="text-lg">جاري تحميل الوصفة...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//       {/* Header */}
//       <div className="relative bg-primary text-white">
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <Link href="/">
//               <Button variant="ghost" className="text-white hover:bg-secondary">
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 العودة
//               </Button>
//             </Link>

//             <Button
//               variant="ghost"
//               className="text-white hover:bg-secondary"
//               onClick={() => setIsOpen(!isOpen)}
//             >
//               <Menu className="h-6 w-6" />
//             </Button>
//           </div>

//           <div className="mt-8 mb-4 text-center">
//             <h1 className="text-3xl font-bold">تعديل الوصفة</h1>
//             <p className="mt-2 opacity-90">قم بتعديل تفاصيل وصفتك</p>
//           </div>
//         </div>

//         {/* Curved bottom edge */}
//         <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-100 dark:bg-gray-900 rounded-t-[50px]"></div>
//       </div>

//       {/* Sidebar menu */}
//       <AnimatePresence>
//         {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
//       </AnimatePresence>

//       {/* Main content */}
//       <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
//         <Card className="border-none shadow-lg">
//           <CardContent className="p-6">
//             {/* Author info */}
//             {recipe && (
//               <div className="flex items-center mb-6">
//                 <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
//                   <Image
//                     src={
//                       recipe.userImage || '/placeholder.svg?height=48&width=48'
//                     }
//                     alt={recipe.userName}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="ml-3 rtl:mr-3 rtl:ml-0">
//                   <p className="font-medium">{recipe.userName}</p>
//                   <p className="text-sm text-gray-500">
//                     {formatDate(recipe.createdAt)}
//                   </p>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               {/* Recipe title */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="mealName"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   اسم الوصفة
//                 </label>
//                 <Input
//                   id="mealName"
//                   name="mealName"
//                   value={formData.mealName}
//                   onChange={handleInputChange}
//                   placeholder="أدخل اسم الوصفة"
//                   className="text-lg font-bold"
//                   required
//                 />
//               </div>

//               <Tabs defaultValue="details" className="w-full">
//                 <TabsList className="grid grid-cols-4 mb-6">
//                   <TabsTrigger value="details">
//                     <ListOrdered className="h-4 w-4 mr-2" />
//                     المكونات والطريقة
//                   </TabsTrigger>
//                   <TabsTrigger value="image">
//                     <ImageIcon className="h-4 w-4 mr-2" />
//                     الصورة
//                   </TabsTrigger>
//                   <TabsTrigger value="video">
//                     <Video className="h-4 w-4 mr-2" />
//                     الفيديو
//                   </TabsTrigger>
//                   <TabsTrigger value="tips">
//                     <Lightbulb className="h-4 w-4 mr-2" />
//                     نصائح
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="details" className="space-y-6">
//                   {/* Ingredients */}
//                   <div>
//                     <div className="flex items-center mb-2">
//                       <h3 className="text-lg font-bold">المكونات</h3>
//                       <Edit className="h-4 w-4 ml-2 text-primary" />
//                     </div>
//                     <Textarea
//                       name="ingredients"
//                       value={formData.ingredients}
//                       onChange={handleInputChange}
//                       placeholder="أدخل مكونات الوصفة"
//                       className="min-h-[150px]"
//                     />
//                   </div>

//                   <Separator />

//                   {/* Instructions */}
//                   <div>
//                     <div className="flex items-center mb-2">
//                       <h3 className="text-lg font-bold">طريقة التحضير</h3>
//                       <Edit className="h-4 w-4 ml-2 text-primary" />
//                     </div>
//                     <Textarea
//                       name="theWay"
//                       value={formData.theWay}
//                       onChange={handleInputChange}
//                       placeholder="أدخل طريقة تحضير الوصفة"
//                       className="min-h-[250px]"
//                     />
//                   </div>
//                 </TabsContent>

//                 <TabsContent value="image">
//                   <ImageUploader
//                     currentImage={formData.image}
//                     onImageChange={handleImageChange}
//                   />
//                 </TabsContent>

//                 <TabsContent value="video">
//                   <VideoEmbedder
//                     currentEmbed={formData.link}
//                     onEmbedChange={handleEmbedChange}
//                   />
//                 </TabsContent>

//                 <TabsContent value="tips">
//                   <div>
//                     <div className="flex items-center mb-2">
//                       <h3 className="text-lg font-bold">نصائح إضافية</h3>
//                       <Edit className="h-4 w-4 ml-2 text-primary" />
//                     </div>
//                     <Textarea
//                       name="advise"
//                       value={formData.advise}
//                       onChange={handleInputChange}
//                       placeholder="أدخل نصائح إضافية للوصفة (اختياري)"
//                       className="min-h-[150px]"
//                     />
//                   </div>
//                 </TabsContent>
//               </Tabs>

//               <div className="mt-8 flex justify-end">
//                 <Button
//                   type="submit"
//                   className="bg-primary hover:bg-secondary"
//                   disabled={isSaving}
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       جاري الحفظ...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="mr-2 h-4 w-4" />
//                       حفظ التعديلات
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
