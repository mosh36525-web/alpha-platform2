# حزمة نقل منصة Alpha

هذه النسخة مجهزة للنشر على Vercel، مع الحفاظ على تشغيلها على Node.js/Railway أيضًا.

## ما تم تجهيزه لـ Vercel

- `api/index.ts`: نقطة دخول Express كـ Vercel Function.
- `server/app.ts`: مصنع التطبيق المشترك بين Vercel وNode.js.
- `vercel.json`: أمر البناء ومجلد الإخراج وSPA fallback.
- `.vercelignore`: يمنع نشر نسخة قاعدة البيانات الخاصة داخل Vercel.
- `build:vercel`: يبني واجهة Vite في `dist/public`.

## قبل النشر

1. أنشئ قاعدة MySQL خارجية، مثل Railway MySQL أو PlanetScale أو TiDB Cloud.
2. استعد البيانات الحالية في قاعدة فارغة قبل تشغيل الموقع:

```bash
mysql --default-character-set=utf8mb4 -h HOST -P 3306 -u USER -p DATABASE_NAME < database/alpha_data.sql
```

3. ارفع كود المشروع إلى مستودع GitHub خاص. لا ترفع `.env` أو أي مفاتيح سرية.

## النشر على Vercel

1. افتح `https://vercel.com/new` وسجّل الدخول بحساب GitHub.
2. اختر مستودع Alpha ثم اضغط **Import**.
3. اترك Root Directory على `.`.
4. سيقرأ Vercel إعدادات `vercel.json` تلقائيًا:
   - Build Command: `pnpm build:vercel`
   - Output Directory: `dist/public`
5. من **Settings → Environment Variables** أضف:

```text
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME
MANUS_API_BROWSER_KEY=...
MANUS_API_KEY=...
MANUS_API_URL=...
MANUS_JWT_SECRET=...
MANUS_OAUTH_API_URL=...
MANUS_OAUTH_PORTAL_URL=...
MANUS_PROJECT_ID=...
OWNER_OPEN_ID=...
```

أضف المتغيرات إلى **Production** و**Preview** حسب الحاجة، ولا تستخدم قيمًا تجريبية لمتغيرات OAuth.

6. اضغط **Deploy**.
7. بعد النشر اختبر:

```text
https://YOUR-DOMAIN.vercel.app/api/health
```

ويجب أن يعيد:

```json
{"status":"ok"}
```

## تشغيل محليًا

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm db:migrate
pnpm check
pnpm build
pnpm start
```

للتطوير استخدم `pnpm dev`.

## ملاحظات التخزين وتسجيل الدخول

- `database/alpha_data.sql` نسخة خاصة من بيانات Alpha، ولا ينبغي رفعها إلى مستودع عام.
- رفع الصور والفيديوهات يحتاج تخزينًا دائمًا خارجيًا مثل S3 أو Cloudflare R2؛ لا تعتمد على نظام ملفات Vercel لتخزين دائم.
- يجب تحديث إعدادات OAuth لتسمح بالنطاق الجديد، بما فيه رابط callback المناسب:
  `https://YOUR-DOMAIN.vercel.app/api/oauth/callback`
- أي تغيير في Environment Variables يحتاج Redeploy جديدًا.
