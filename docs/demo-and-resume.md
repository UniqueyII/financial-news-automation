# Portfolio presentation

## Four-minute recording plan

| Time | Show | Explain |
|---|---|---|
| 0:00–0:30 | Workflow overview | Problem: collecting and preparing Persian financial-news summaries |
| 0:30–1:10 | RSS and normalization | Filter weak input before spending model tokens |
| 1:10–1:50 | PostgreSQL and Claim Queue | URL uniqueness, state tracking and guarded ownership |
| 1:50–2:40 | Model and validation | Structured output; limitations of confidence/evidence checks |
| 2:40–3:30 | Telegram and execution 289 | 15 processed, 1 sent, 13 filtered, 1 review |
| 3:30–4:00 | Summary | Local deployment, unknown-delivery handling, next operational steps |

Use a completed execution; do not wait through an 18-minute run on camera. Zoom into node groups, hide credentials and personal tabs, and show only the final Telegram message. State that replay protection is URL/state based, not semantic deduplication or exactly-once delivery. Never invent accuracy, savings or production users. Add the actual video URL to README after recording.

## Resume entry — English

**Financial News Automation | n8n, PostgreSQL, JavaScript, Groq API, Telegram API**

- Built an eight-feed news pipeline that generates Persian summaries and routes articles through configurable filtering, review and publication states.
- Implemented PostgreSQL queue ownership, URL deduplication, structured-output checks and Telegram delivery tracking with explicit handling of uncertain outcomes.
- Demonstrated a local end-to-end run processing 15 articles, with one published message and persisted delivery results.

## متن رزومه — فارسی

**اتوماسیون اخبار مالی | n8n، PostgreSQL، JavaScript، Groq و Telegram API**

- پیاده‌سازی دریافت خبر از هشت فید، تولید خلاصهٔ فارسی و تعیین مسیر فیلتر، بازبینی و انتشار بر اساس قواعد قابل تنظیم.
- مدیریت صف و وضعیت پردازش در PostgreSQL، جلوگیری از ثبت URL تکراری و ثبت نتیجه و شناسهٔ پیام تلگرام.
- اجرای عملی فرایند از دریافت تا انتشار؛ در یک اجرای نمونه، ۱۵ خبر پردازش و یک پیام منتشر شد.

Use the GitHub repository URL only after publishing it. Do not describe the project as a production trading bot or verified financial forecasting service.
