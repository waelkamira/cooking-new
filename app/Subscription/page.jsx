// 'use client';
// import Image from 'next/image';
// import React, { useContext, useEffect, useState } from 'react';
// import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
// import PaypalButton from '../../components/paypal/paypalButton';
// import SubscribedOrNot from '../../components/paypal/subscribedOrNot';
// import CurrentUser from '../../components/CurrentUser';
// import { FaCheck } from 'react-icons/fa6';
// import { inputsContext } from '../../components/Context';
// import { SiAdguard } from 'react-icons/si';
// import { BsTv } from 'react-icons/bs';

// export const plans = [
//   {
//     price: 1,
//     duration: '/شهر',
//     subscription_period: 30,
//   },
//   {
//     price: 10,
//     duration: '/سنة',
//     subscription_period: 365,
//   },
// ];

// export default function SubscriptionPage() {
//   const [plan, setPlan] = useState(plans[0]);
//   const subscribed = SubscribedOrNot();
//   const user = CurrentUser();
//   const { dispatch } = useContext(inputsContext);

//   useEffect(() => {
//     checkUser();
//   }, []);

//   function checkUser() {
//     dispatch({ type: 'RERENDER' });
//   }

//   return (
//     <div className="fixed inset-0 top-32 flex-col justify-center items-center w-full h-full bg-white text-black overflow-y-auto pb-24 text-center z-[1999]">
//       <div className="absolute border top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full xl:w-1/3 p-4 overflow-y-auto">
//         <div className="flex flex-col text-center w-full mb-12">
//           <p className="font-medium text-primary mb-5">الاشتراك</p>
//           <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
//             مرحباً أصدقاء بهيجة أشرق لبن
//           </h2>
//         </div>
//         <div className="relative flex justify-center h-44 w-full text-center">
//           <Image
//             loading="lazy"
//             src={'/images/bahiga.png' || 'https://i.imgur.com/nfDVITC.png'}
//             fill
//             style={{ objectFit: 'contain' }}
//             alt="photo"
//           />
//         </div>
//         <h1 className="text-center my-8">يجب عليك الاشتراك للمتابعة</h1>
//         <h1>اختر نوع الاشتراك</h1>

//         <div
//           className={
//             (plan?.price === 1 ? 'border-[#8FEA2F]' : 'border-white') +
//             ' flex items-start justify-start gap-2 border rounded-lg p-2 my-2 cursor-pointer'
//           }
//           onClick={() => setPlan(plans[0])}
//         >
//           <TbArrowBigLeftLinesFilled
//             className={
//               plan?.price === 1
//                 ? 'text-secondary animate-pulse'
//                 : 'text-white animate-pulse'
//             }
//           />
//           <input
//             type="checkbox"
//             name="monthly"
//             className="radio"
//             checked={plan?.price === 1}
//             readOnly
//           />
//           <span>اشتراك شهري</span>
//         </div>

//         <div
//           className={
//             (plan?.price === 10 ? 'border-green-400' : 'border-white') +
//             ' flex items-start justify-start gap-2 border rounded-lg p-2 my-2 cursor-pointer'
//           }
//           onClick={() => setPlan(plans[1])}
//         >
//           <TbArrowBigLeftLinesFilled
//             className={
//               plan?.price === 10
//                 ? 'text-secondary animate-pulse'
//                 : 'text-white animate-pulse'
//             }
//           />
//           <input
//             type="checkbox"
//             name="yearly"
//             className="radio"
//             checked={plan.price === 10}
//             readOnly
//           />
//           <div>
//             <span className="w-full mb-4">اشتراك سنوي (خصم 16% 💰)</span>
//           </div>
//         </div>

//         <div className="flex justify-center gap-2 w-full p-2 rounded-lg mb-4">
//           <p className="text-5xl tracking-tight font-extrabold">
//             ${plan.price}
//           </p>
//           <div className="flex flex-col justify-end mb-[4px]">
//             <p className="text-sm tracking-wide text-base-content/80 uppercase font-semibold">
//               {plan.duration}
//             </p>
//           </div>
//         </div>

//         <PaypalButton plan={plan} />

//         <div className="flex text-sm my-4 mt-8 border border-[#8FEA2F] rounded-lg p-2">
//           <div className="flex-col justify-center items-center w-full">
//             <SiAdguard className="text-green-400 text-center w-full text-xl" />
//             <div className="flex items-center justify-center gap-2 my-2">
//               <FaCheck className="text-green-400" />
//               <span>إلغاء في أي وقت</span>
//             </div>
//             <div className="flex items-center justify-center gap-2 my-2">
//               <FaCheck className="text-green-400" />
//               <span>تجربة مجانية</span>
//             </div>
//             <div className="flex items-center justify-center gap-2 my-2">
//               <FaCheck className="text-green-400" />
//               <span>لا يوجد التزام</span>
//             </div>
//             <div className="flex items-center justify-center gap-2 my-2">
//               <BsTv className="text-green-400" />
//               <span>مشاهدة على جميع الشاشات</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import PaypalButton from '../../components/paypal/paypalButton';
import SubscribedOrNot from '../../components/paypal/subscribedOrNot';
import CurrentUser from '../../components/CurrentUser';
import { FaCheck, FaStar } from 'react-icons/fa6';
import { inputsContext } from '../../components/Context';
import { SiAdguard } from 'react-icons/si';
import { BsTv } from 'react-icons/bs';
import { MdHd, MdDownload } from 'react-icons/md';
import Image from 'next/image';
import Stars from '../../components/stars/stars';

export const plans = [
  {
    price: 1,
    duration: '/شهر',
    subscription_period: 30,
    name: 'أوتاكو',
    description: 'مثالي لمحبي الأنمي العاديين',
  },
  {
    price: 10,
    duration: '/سنة',
    subscription_period: 365,
    name: 'ويب بريميوم',
    description: 'أفضل قيمة لعشاق الأنمي الحقيقيين',
  },
];

export default function SubscriptionPage() {
  const [plan, setPlan] = useState(plans[0]);
  const subscribed = SubscribedOrNot();
  const user = CurrentUser();
  const { dispatch } = useContext(inputsContext);
  const [animateStars, setAnimateStars] = useState(false);
  const starsRef = useRef([]);

  // Generate random stars for background effect
  // useEffect(() => {
  //   starsRef.current = Array.from({ length: 50 }, () => ({
  //     top: `${Math.random() * 100}%`,
  //     left: `${Math.random() * 100}%`,
  //     size: `${Math.random() * 2 + 1}px`,
  //     delay: `${Math.random() * 5}s`,
  //     duration: `${Math.random() * 3 + 2}s`,
  //   }));
  //   setAnimateStars(true);
  // }, []);
  useEffect(() => {
    checkUser();
  }, []);

  function checkUser() {
    dispatch({ type: 'RERENDER' });
  }

  return (
    <div className="fixed inset-0 my-20 xl:my-24 top-0 flex-col justify-center items-center w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-y-auto pb-24 text-center z-[1999] dir-rtl">
      {/* Animated stars background */}
      {/* {animateStars &&
        starsRef.current.map((star, index) => (
          <div
            key={index}
            className="hidden xl:block absolute rounded-full bg-white animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--twinkle-delay': star.delay,
              '--twinkle-duration': star.duration,
            }}
          />
        ))} */}
      <Stars />
      <div className="absolute my-64 xl:my-32 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-auto p-2 xl:p-6 overflow-y-auto">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-2 xl:p-8 shadow-2xl my-32 xl:my-24">
          <div className="flex flex-col text-center w-full mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <FaStar className="text-yellow-400 text-xl" />
              <p className="font-semibold text-purple-400 text-sm uppercase tracking-wider">
                وصول مميز
              </p>
              <FaStar className="text-yellow-400 text-xl" />
            </div>
            <h2 className="font-bold text-3xl lg:text-4xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              مرحباً أصدقاء بهيجة أشرق لبن{' '}
            </h2>
            <p className="text-slate-300 text-sm">
              انضم لملايين محبي الأنمي حول العالم
            </p>
          </div>

          <div className="relative flex justify-center h-44 w-full text-center">
            <Image
              loading="lazy"
              src={'/images/bahiga.png' || 'https:i.imgur.com/nfDVITC.png'}
              fill
              style={{ objectFit: 'contain' }}
              alt="photo"
            />
          </div>

          <h1 className="text-center mb-6 text-lg font-medium">
            اختر مغامرتك في عالم الأنمي
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            اختر خطة للمتابعة في المشاهدة
          </p>

          <div className="space-y-4 mb-8">
            {plans.map((planOption, index) => (
              <div
                key={index}
                className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  plan?.price === planOption.price
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : 'border-slate-600 bg-slate-700/50 hover:border-purple-400'
                }`}
                onClick={() => setPlan(planOption)}
              >
                {planOption.price === 89.99 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      أفضل قيمة
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        plan?.price === planOption.price
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-slate-400'
                      }`}
                    >
                      {plan?.price === planOption.price && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">
                        {planOption.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {planOption.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${planOption.price}</p>
                    <p className="text-slate-400 text-sm">
                      {planOption.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <PaypalButton plan={plan} />

          <div className="mt-8 border border-purple-500/30 rounded-xl p-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
            <div className="flex flex-col items-center w-full">
              <SiAdguard className="text-purple-400 text-2xl mb-4" />
              <div className="grid grid-cols-1 gap-3 w-full">
                <div className="flex items-center gap-3">
                  <FaCheck className="text-green-400 flex-shrink-0" />
                  <span className="text-sm">إلغاء في أي وقت، بدون التزام</span>
                </div>
                <div className="flex items-center gap-3">
                  <MdHd className="text-purple-400 flex-shrink-0" />
                  <span className="text-sm">جودة بث عالية الدقة و 4K</span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <MdDownload className="text-blue-400 flex-shrink-0" />
                  <span className="text-sm">تحميل للمشاهدة بدون إنترنت</span>
                </div> */}
                <div className="flex items-center gap-3">
                  <BsTv className="text-pink-400 flex-shrink-0" />
                  <span className="text-sm">شاهد على جميع أجهزتك</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaStar className="text-yellow-400 flex-shrink-0" />
                  <span className="text-sm">وصول لمحتوى أنمي حصري</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
