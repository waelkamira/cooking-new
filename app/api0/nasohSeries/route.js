import Papa from 'papaparse';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const limit = parseInt(searchParams.get('limit')) || 3; // عدد الحلقات في كل دفعة
    const page = parseInt(searchParams.get('page')) || 1; // رقم الصفحة

    // جلب ملف CSV من GitHub
    const response = await fetch(
      'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv'
    );

    // التحقق من أن الطلب كان ناجحاً
    if (!response.ok) {
      throw new Error('Failed to fetch CSV file');
    }

    const fileContent = await response.text(); // قراءة محتوى الملف كـ نص

    // تحليل محتوى CSV باستخدام PapaParse
    const parsedData = Papa.parse(fileContent, { header: true });

    // تصفية الحلقات حسب المسلسل "عائلة نصوح"
    const allEpisodes = parsedData.data.filter(
      (episode) => episode.seriesName === 'عائلة نصوح'
    );

    // حساب الفهرس لبدء العرض
    const startIndex = (page - 1) * limit;
    const paginatedEpisodes = allEpisodes.slice(startIndex, startIndex + limit);

    // إذا لم يتم العثور على أي حلقات
    if (paginatedEpisodes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No episodes found for عائلة نصوح' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // إرجاع الحلقات المطلوبة
    return new Response(JSON.stringify(paginatedEpisodes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // التعامل مع أي خطأ أثناء جلب البيانات أو تحليلها
    console.error('Error fetching episodes:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// import Papa from 'papaparse';

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const searchParams = url.searchParams;
//     const limit = parseInt(searchParams.get('limit')) || 3; // عدد الحلقات في كل دفعة
//     const page = parseInt(searchParams.get('page')) || 1; // رقم الصفحة

//     // تحميل ملف CSV من URL باستخدام fetch
//     const response = await fetch(
//       'https://raw.githubusercontent.com/waelkamira/csv/refs/heads/main/episodes.csv'
//     );

//     // التأكد من أن الاستجابة كانت ناجحة
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const fileContent = await response.text(); // قراءة المحتوى كنص

//     // تحليل البيانات باستخدام Papa.parse
//     const parsedData = Papa.parse(fileContent, { header: true });

//     // تصفية الحلقات بناءً على اسم المسلسل "عائلة نصوح" فقط
//     const allEpisodes = parsedData.data.filter(
//       (episode) => episode.seriesName === 'عائلة نصوح'
//     );

//     // تطبيق pagination
//     const startIndex = (page - 1) * limit;
//     const paginatedEpisodes = allEpisodes.slice(startIndex, startIndex + limit);

//     // إذا لم يتم العثور على أي حلقة
//     if (paginatedEpisodes.length === 0) {
//       return new Response(
//         JSON.stringify({ error: 'No episodes found for عائلة نصوح' }),
//         {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     return new Response(JSON.stringify(paginatedEpisodes), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     // التعامل مع الأخطاء أثناء جلب البيانات
//     console.error('Error fetching episodes:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }
