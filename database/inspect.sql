-- Read-only diagnostics; run on the news database.
SELECT status, count(*) FROM market_news.articles GROUP BY status ORDER BY status;
SELECT id, source, status, analysis->>'score' AS score,
       analysis->>'confidence' AS confidence, last_error,
       telegram_message_id, sent_at
FROM market_news.articles ORDER BY updated_at DESC LIMIT 20;
SELECT id, title, message FROM market_news.articles
WHERE status='preview' ORDER BY updated_at DESC LIMIT 10;
SELECT execution_id, health, article_count, created_at
FROM market_news.runs ORDER BY created_at DESC LIMIT 5;
