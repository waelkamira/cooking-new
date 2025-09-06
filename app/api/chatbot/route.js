import { InferenceClient } from '@huggingface/inference';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer'; // استيراد Buffer

const Hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

// **دالة التحقق من الوصول إلى النماذج**
async function checkModelAccess(modelId) {
  try {
    const response = await fetch(
      `https://huggingface.co/api/models/${modelId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log(`الوصول إلى ${modelId} متاح. تفاصيل النموذج:`, data);
    } else {
      console.error(
        `فشل الوصول إلى ${modelId}. حالة الاستجابة: ${response.status}`
      );
      const errorData = await response.json();
      console.error('تفاصيل الخطأ:', errorData);
    }
  } catch (error) {
    console.error(`خطأ في التحقق من الوصول إلى ${modelId}:`, error);
  }
}

// **دالة توليد الوصفة باستخدام Flan-T5**
async function generateRecipe(keywords) {
  try {
    const API_URL =
      'https://router.huggingface.co/hf-inference/models/google/flan-t5-small'; // العنوان الجديد
    const headers = {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const payload = {
      inputs: `اكتب وصفة طعام جديدة باستخدام المكونات والكلمات المفتاحية التالية: ${keywords}. قدم الوصفة بطريقة مفصلة وسهلة الفهم.`,
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json(); // تحليل رسالة الخطأ من Hugging Face
      throw new Error(
        `Hugging Face API error: ${response.status} - ${
          response.statusText
        }. Details: ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data[0].generated_text; // Correctly parse based on Hugging Face's expected output.
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error(`Failed to generate recipe: ${error.message}`); // Include original error message
  }
}

export async function POST(req) {
  try {
    // **استدعاء دالة التحقق قبل توليد الوصفة والصورة**
    await checkModelAccess('google/flan-t5-small'); // تحقق من نموذج Flan-T5
    await checkModelAccess('stabilityai/stable-diffusion-xl-base-1.0');

    const { prompt } = await req.json();

    const recipe = await generateRecipe(prompt);
    // console.log('recipe **********************', recipe);
    const imageURL = await generateImage(recipe); // استخدام recipe مباشرةً
    // console.log('imageURL **********************', imageURL);

    return NextResponse.json({
      recipe: recipe,
      imageURL: imageURL,
    });
  } catch (error) {
    console.error('خطأ في معالجة الطلب:', error);
    return NextResponse.json(
      { error: 'فشل في توليد الوصفة والصورة.' },
      { status: 500 }
    );
  }
}

async function generateImage(recipe_description) {
  try {
    const result = await Hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: recipe_description,
    });

    const buffer = await result.arrayBuffer();
    const blob = new Blob([buffer], { type: 'image/png' });

    // تحويل Blob إلى Base64 باستخدام Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString('base64');
    const dataURL = `data:image/png;base64,${base64String}`;

    return dataURL; // إرجاع سلسلة Base64 data URL
  } catch (error) {
    console.error('خطأ في توليد الصورة:', error);
    throw new Error(`فشل في توليد الصورة: ${error.message}`);
  }
}
