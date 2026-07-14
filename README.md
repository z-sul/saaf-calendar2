# SAAF Calendar

## التشغيل محليًا

```bash
npm install
npm run dev
```

ثم افتح:

- الصفحة الرئيسية: http://localhost:3000
- رابط التقويم: http://localhost:3000/api/calendar

## تعديل الفعاليات

افتح الملف:

`app/api/calendar/route.js`

ثم عدّل قائمة `events`.

## النشر على Vercel

1. ارفع المشروع إلى GitHub.
2. اربط المستودع في Vercel.
3. أضف متغير البيئة التالي:

`NEXT_PUBLIC_CALENDAR_URL=https://YOUR-PROJECT.vercel.app/api/calendar`

4. أعد النشر.
