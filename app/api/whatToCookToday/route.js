import axios from 'axios';
import Papa from 'papaparse';

export async function GET(req) {
  try {
    // إعداد الرابط للملف CSV
    const csvUrl =
      'https://raw.githubusercontent.com/waelkamira/cooking_csv/refs/heads/main/ar_recipes.csv';

    // تحليل المعاملات الواردة من الطلب
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 3; // عدد الوصفات المطلوبة
    const random = searchParams.get('random') === 'true'; // جلب قيمة random

    // جلب البيانات من الرابط
    const response = await axios.get(csvUrl);
    const csvData = response.data;

    // تحليل البيانات باستخدام PapaParse
    const parsedData = Papa.parse(csvData, {
      header: true, // تحليل الرؤوس كأسماء أعمدة
      skipEmptyLines: true, // تخطي الصفوف الفارغة
    });

    // البيانات المحللة
    const allMeals = parsedData.data;

    // جلب وصفات عشوائية
    let meals;
    if (random) {
      // اختيار عناصر عشوائية باستخدام مؤشرات فريدة
      meals = getRandomElements(allMeals, limit);
    } else {
      // تقسيم البيانات للصفحة المطلوبة
      meals = allMeals.slice((page - 1) * limit, page * limit);
    }

    return new Response(JSON.stringify(meals), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // console.error('Error fetching meals:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// دالة لاختيار عناصر عشوائية من المصفوفة
function getRandomElements(array, count) {
  const result = [];
  const usedIndexes = new Set();

  while (result.length < count && result.length < array.length) {
    const randomIndex = Math.floor(Math.random() * array.length);
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      result.push(array[randomIndex]);
    }
  }

  return result;
}
