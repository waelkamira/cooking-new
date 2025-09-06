import { NextResponse } from 'next/server';

// تخزين طلبات المستخدمين
const requests = new Map();

export function rateLimit(maxRequests = 100, timeWindow = 15 * 60 * 1000) {
  return function rateLimitMiddleware(handler) {
    return async (request) => {
      const ip =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';
      const now = Date.now();
      const windowStart = now - timeWindow;

      // تنظيف الطلبات القديمة
      if (!requests.has(ip)) {
        requests.set(ip, []);
      }

      const userRequests = requests
        .get(ip)
        .filter((time) => time > windowStart);
      userRequests.push(now);
      requests.set(ip, userRequests);

      // التحقق من تجاوز الحد
      if (userRequests.length > maxRequests) {
        return NextResponse.json(
          {
            success: false,
            error: 'تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقاً.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((userRequests[0] + timeWindow - now) / 1000),
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil(
                (userRequests[0] + timeWindow - now) / 1000
              ),
              'X-RateLimit-Limit': maxRequests,
              'X-RateLimit-Remaining': 0,
              'X-RateLimit-Reset': new Date(
                userRequests[0] + timeWindow
              ).toISOString(),
            },
          }
        );
      }

      // إضافة headers للمعلومات
      const response = await handler(request);

      if (response) {
        response.headers.set('X-RateLimit-Limit', maxRequests);
        response.headers.set(
          'X-RateLimit-Remaining',
          maxRequests - userRequests.length
        );
        response.headers.set(
          'X-RateLimit-Reset',
          new Date(userRequests[0] + timeWindow).toISOString()
        );
      }

      return response;
    };
  };
}
