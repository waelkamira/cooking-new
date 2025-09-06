// API Route (with NodeCache)
import NodeCache from 'node-cache';
import axios from 'axios';
import Papa from 'papaparse';

// Initialize NodeCache
const cache = new NodeCache({ stdTTL: 60 * 10 }); // 10 minutes

function createCacheKey(params) {
  const { page, limit } = params;
  return `meals_page_${page}_limit_${limit}`;
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;

    const cacheKey = createCacheKey({ page, limit });

    // Check if the data is in the cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Serving from cache');
      return new Response(JSON.stringify(cachedData), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If not in cache, fetch and parse the CSV
    const csvUrl =
      'https://raw.githubusercontent.com/waelkamira/cooking_csv/refs/heads/main/ar_recipes.csv';
    const response = await axios.get(csvUrl);
    const csvData = response.data;

    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    let allMeals = parsedData.data;
    allMeals = shuffleArray(allMeals);
    const skip = (page - 1) * limit;
    const meals = allMeals.slice(skip, skip + limit);

    const dataToCache = { page, meals };

    // Store the data in the cache
    cache.set(cacheKey, dataToCache);
    console.log('Serving from network and caching');

    return new Response(JSON.stringify(dataToCache), {
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('data', data);

    const { data: meal, error } = await supabase.from('Meal').insert([data]);

    if (error) {
      throw error;
    }
    //! يجب تعديل جدول Meal حتى يقبل تحميل مصفوفة من الصور
    // تحديث التخزين المؤقت
    invalidateCacheByPrefix('meals_'); // إزالة المفاتيح المتعلقة بالوجبات

    return new Response(JSON.stringify(meal), { status: 201 });
  } catch (error) {
    console.error('Error creating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const id = searchParams.get('id');
    const { actionType, newActionValue, ...data } = await req.json();

    if (actionType && newActionValue !== undefined) {
      // جلب القيمة الحالية من قاعدة البيانات
      const { data: meal, error: fetchError } = await supabase
        .from('Meal')
        .select(actionType)
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentValue = meal[actionType];

      // دالة حساب القيمة الجديدة
      function getUpdatedValue(currentValue, actionValue) {
        const newValue = currentValue + (actionValue === 1 ? 1 : -1);
        return newValue >= 0 ? newValue : currentValue;
      }

      const updateData = {
        [actionType]: getUpdatedValue(currentValue, newActionValue),
      };

      // تحديث القيمة في قاعدة البيانات
      const { error: updateError } = await supabase
        .from('Meal')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // تحديث البيانات الأخرى
      const { error: updateError } = await supabase
        .from('Meal')
        .update(data)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }
    }

    // تحديث التخزين المؤقت
    invalidateCacheByPrefix('meals_'); // إزالة المفاتيح المتعلقة بالوجبات

    return new Response(
      JSON.stringify({ message: 'تم التعديل بنجاح', newActionValue }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const isAdmin = searchParams.get('isAdmin');

    if (isAdmin === 'true') {
      const { data: actionsExist, error: actionsError } = await supabase
        .from('Action')
        .select('*')
        .eq('mealId', id);

      if (actionsError) {
        throw actionsError;
      }

      if (actionsExist?.length > 0) {
        const { error: deleteActionsError } = await supabase
          .from('Action')
          .delete()
          .eq('mealId', id);

        if (deleteActionsError) {
          throw deleteActionsError;
        }
      }

      // Delete the meal
      const { error: deleteMealError } = await supabase
        .from('Meal')
        .delete()
        .eq('id', id);

      if (deleteMealError) {
        throw deleteMealError;
      }

      return new Response(
        JSON.stringify({ message: 'Meal deleted successfully ✔' }),
        { status: 200 }
      );
    }

    // Check if id and email are provided
    if (!id || !email) {
      return new Response(
        JSON.stringify({ error: 'Meal ID and email must be provided' }),
        { status: 400 }
      );
    }

    // Check if the meal exists and is created by the given email
    const { data: mealExists, error: mealError } = await supabase
      .from('Meal')
      .select('*')
      .eq('id', id)
      .eq('createdBy', email);

    if (mealError) {
      throw mealError;
    }

    if (!mealExists?.length) {
      return new Response(
        JSON.stringify({
          error:
            'Meal not found or you do not have permission to delete this meal',
        }),
        { status: 404 }
      );
    }

    // Check if actions exist for this meal
    const { data: actionsExist, error: actionsError } = await supabase
      .from('Action')
      .select('*')
      .eq('mealId', id);

    if (actionsError) {
      throw actionsError;
    }

    if (actionsExist?.length > 0) {
      const { error: deleteActionsError } = await supabase
        .from('Action')
        .delete()
        .eq('mealId', id);

      if (deleteActionsError) {
        throw deleteActionsError;
      }
    }

    // Delete the meal
    const { error: deleteMealError } = await supabase
      .from('Meal')
      .delete()
      .eq('id', id);

    if (deleteMealError) {
      throw deleteMealError;
    }

    // Invalidate cache related to meals
    invalidateCacheByPrefix('meals_');

    return new Response(
      JSON.stringify({ message: 'Meal deleted successfully ✔' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting meal:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
