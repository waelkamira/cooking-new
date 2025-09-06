'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react'; // Import useState
import { motion } from 'framer-motion';
import { FaUtensils } from 'react-icons/fa6';
import Loading from '../../components/Loading';
import Link from 'next/link';

export default function LogInPage() {
  const session = useSession();
  const router = useRouter();

  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false); // Initialize to false

  // Zod schema for form validation
  const schema = z.object({
    email: z.string().email({ message: 'يرجى إدخال بريد إلكتروني صحيح' }),
    password: z
      .string()
      .min(5, { message: 'يجب أن تتكون كلمة المرور من 5 أحرف على الأقل' }),
  });

  // React Hook Form setup with Zod resolver
  const {
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  // Redirect if user is already logged in
  useEffect(() => {
    if (session?.data?.user?.email) {
      router.push('/home');
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'CurrentUser',
          JSON.stringify(session?.data?.user)
        );
      }
    }
  }, [router, session?.data?.user?.email]);

  // Form submission handler
  async function onSubmit() {
    // Explicit validation for email and password length
    if (!getValues().email) {
      setError('email', {
        type: 'custom',
        message: 'عنوان البريد الإلكتروني مطلوب',
      });
      return;
    }

    if (getValues().password.length < 5) {
      setError('password', {
        type: 'custom',
        message: 'طول كلمة السر يجب أن يكون 5 أحرف على الأقل',
      });
      return;
    }

    // Set loading to true *before* the signIn call
    setIsLoading(true);

    // Sign in using credentials provider
    const response = await signIn('credentials', {
      ...getValues(),
      redirect: false,
      callbackUrl: '/home',
    });

    // Handle successful login
    if (response?.ok) {
      const values = getValues();
      localStorage.setItem('email', values.email);
      localStorage.setItem('password', values.password);

      // Show success toast
      toast.success('تم تسجيل الدخول بنجاح أهلا بك');

      // Delay the router.push to show the loading state for a brief moment
      setTimeout(() => {
        setIsLoading(false); // Set loading to false *after* the transition
        router.push('/home');
      }, 1500); // Adjust the delay (in milliseconds) as needed
    } else {
      // Handle login error
      setError('email', {
        type: 'custom',
        message: 'عنوان البريد الالكتروني او كلمة السر خاطئة',
      });
      toast.error('حدث خطأ ما حاول مرة أخرى');
      setIsLoading(false); // Set loading to false on error
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-start lg:justify-center bg-gray-400 p-4 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 bg-gradient-to-b from-primary to-secondary mt-16 m-2 rounded-xl shadow-lg min-h-[50vh] text-center">
        <div className="relative size-44 sm:size-64 md:size-72 mb-6">
          <Image
            src="/photo (28).png"
            layout="fill"
            objectFit="contain"
            alt="Login required"
          />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl text-white mb-6">
          يجب تسجيل الدخول أولاً
        </h1>

        <motion.div
          className="flex justify-center items-center border text-white shadow-lg w-full py-3 my-2 sm:text-lg sm:p-2 text-sm p-1 px-2 text-nowrap bg-five select-none rounded-full max-h-12 hover:text-white cursor-pointer"
          onClick={() => signIn('google')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="relative h-8 w-8">
            <Image
              priority
              src={'/google.png'}
              alt="google image"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <h1 className=" text-sm sm:text-lg grow text-center select-none">
            عن طريق جوجل
          </h1>
        </motion.div>
      </div>
    </motion.div>
    // <motion.div
    //   className="flex justify-center items-center w-full h-screen text-white text-lg md:text-xl text-end p-4"
    //   variants={containerVariants}
    //   initial="hidden"
    //   animate="visible"
    // >
    //   {isLoading ? ( // Show loading component while isLoading is true
    //     <Loading />
    //   ) : (
    //     <motion.form
    //       onSubmit={handleSubmit(onSubmit)}
    //       className="w-full lg:w-1/2 bg-four p-8 rounded-xl transition-transform duration-300 ease-in-out shadow-lg border border-one bg-primary "
    //     >
    //       <h1 className="flex justify-center items-center gap-2 w-full my-4 text-2xl sm:text-3xl md:text-4xl font-bold text-center select-none">
    //         تسجيل الدخول <FaUtensils className="text-3xl" />
    //       </h1>

    //       {/* Google Sign In Button */}
    // <motion.div
    //   className="flex justify-center items-center border text-white shadow-lg w-full py-3 my-2 sm:text-lg sm:p-2 text-sm p-1 px-2 text-nowrap bg-five select-none rounded-full max-h-12 hover:text-white cursor-pointer"
    //   onClick={() => signIn('google')}
    //   whileHover={{ scale: 1.03 }}
    //   whileTap={{ scale: 0.97 }}
    // >
    //   <div className="relative h-8 w-8">
    //     <Image
    //       priority
    //       src={'/google.png'}
    //       alt="google image"
    //       layout="fill"
    //       objectFit="contain"
    //     />
    //   </div>
    //   <h1 className="text-sm sm:text-lg grow text-center select-none font-semibold">
    //     عن طريق جوجل
    //   </h1>
    // </motion.div>
    //       {/* Other form elements (email, password fields, etc.) */}
    //     </motion.form>
    //   )}
    // </motion.div>
  );
}
