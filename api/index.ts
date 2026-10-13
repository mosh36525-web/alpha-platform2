import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// استيراد السيرفر من مسار المخرجات الصحيح بعد الـ Build
let app;
try {
  const serverModule = await import('../dist/server/app.js');
  app = serverModule.createApp();
} catch (e) {
  // مسار احتياطي في حال اختلاف بنية المجلدات على Vercel
  const serverModule = await import('./server/app.js');
  app = serverModule.createApp();
}

export default app;