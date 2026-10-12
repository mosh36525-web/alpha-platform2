# منصة Alpha — نسخة جاهزة للنقل إلى Vercel

## محتويات هذه النسخة

هذه النسخة تحتوي على كود الواجهة والخادم ومسارات API وملفات Drizzle وقاعدة البيانات النموذجية وإعدادات Vercel.

تم استبعاد العناصر غير اللازمة للرفع:

- `node_modules`
- `dist`
- ملفات السجلات المحلية
- مجلد Git المحلي
- أي مفاتيح سرية أو ملفات `.env`

## طريقة الرفع من Android إلى GitHub

1. حمّل ملف `Alpha-Learning-Platform-Vercel.zip`.
2. فك الضغط من تطبيق الملفات في الهاتف.
3. افتح مستودع GitHub الخاص بالمنصة.
4. اختر **Add file** ثم **Upload files**.
5. افتح المجلد المفكوك وحدد الملفات والمجلدات الموجودة داخله.
6. يجب أن يظهر في جذر المستودع، وليس داخل مجلد إضافي، ما يشبه الآتي:

```text
api/
client/
drizzle/
server/
shared/
package.json
pnpm-lock.yaml
vercel.json
vite.config.ts
```

7. اضغط **Commit changes**.

## إعداد Vercel

1. افتح مشروع Alpha في Vercel.
2. افتح **Settings → General → Root Directory** وتأكد أن الجذر هو جذر المستودع.
3. افتح **Settings → Environment Variables**.
4. أضف القيم السرية من إعدادات Manus أو من صاحب الحساب. لا تضع القيم السرية داخل ملفات GitHub.

المتغيرات المطلوبة:

```text
DATABASE_URL
MANUS_API_BROWSER_KEY
MANUS_API_KEY
MANUS_API_URL
MANUS_JWT_SECRET
MANUS_OAUTH_API_URL
MANUS_OAUTH_PORTAL_URL
MANUS_PROJECT_ID
OWNER_OPEN_ID
```

5. اترك أمر البناء كما هو في `vercel.json`:

```text
pnpm build:vercel
```

6. أعد النشر من **Deployments → Redeploy**.

## فحص نجاح الخادم

بعد ظهور رابط Vercel افتح:

```text
https://YOUR-DOMAIN.vercel.app/api/health
```

النتيجة الصحيحة:

```json
{"status":"ok"}
```

## قاعدة البيانات

ملفات الهجرة موجودة داخل:

```text
drizzle/
```

يجب أن تكون قاعدة MySQL متاحة في `DATABASE_URL`. لا ترفع ملف `.env` إلى GitHub.

## ملاحظات مهمة

- هذه المنصة تستخدم واجهة React/Vite وخادم Express ومسارات tRPC.
- ملف `api/index.ts` هو مدخل Vercel لمسارات API.
- ملف `vercel.json` يوجه `/api/*` إلى الخادم وبقية المسارات إلى واجهة SPA.
- شعار المنصة وأيقونة المتصفح موجودان ضمن `client/public/brand/`.
- إذا ظهرت صفحة 404 عند تسجيل الدخول، تأكد أولًا من وجود متغيرات Manus OAuth في Vercel ثم نفّذ Redeploy.
- لا ترسل `DATABASE_URL` أو `MANUS_API_KEY` في رسائل أو صور عامة.
