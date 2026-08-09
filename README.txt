MOHAMMED CHOP — PRO

1) افتح PowerShell داخل هذا المجلد.

2) ثبت الحزم:
npm.cmd install

3) حط Webhook ديال Discord في متغير مؤقت:
PowerShell:
$env:DISCORD_WEBHOOK_URL="WEBHOOK_DIALK"

مهم: ما تحطش الرابط داخل index.html ولا server.js.

4) شغل:
node server.js

5) افتح:
http://localhost:3000

الموقع فيه:
- Portfolio
- أسعار
- نموذج طلب
- رفع صورة/فيديو حتى 8 MB
- إرسال الطلب والملف مباشرة إلى Discord Webhook

ملاحظة: 8 MB حد عملي لهذه النسخة. للملفات الكبيرة (خصوصا فيديوهات طويلة) الأفضل استعمال تخزين ملفات/رابط رفع منفصل.
