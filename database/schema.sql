-- Run once using a database administrator. Never use n8n's internal tables.
BEGIN;
CREATE SCHEMA IF NOT EXISTS market_news;
CREATE TABLE IF NOT EXISTS market_news.articles (
 id bigserial PRIMARY KEY,
 url text NOT NULL UNIQUE,
 title text NOT NULL,
 description text NOT NULL,
 published_at timestamptz NOT NULL,
 source text NOT NULL,
 category text NOT NULL,
 status text NOT NULL DEFAULT 'queued' CHECK(status IN
 ('queued','processing','failed','filtered','review','preview','ready','approved','sending','send_unknown','sent','rejected')),
 attempts integer NOT NULL DEFAULT 0 CHECK(attempts>=0),
 owner text,
 analysis jsonb,
 message text,
 model text,
 prompt_version text,
 last_error text,
 telegram_message_id text,
 approved_by text,
 approved_at timestamptz,
 sent_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS articles_queue_idx ON market_news.articles(status,published_at DESC);
CREATE TABLE IF NOT EXISTS market_news.runs (
 execution_id text PRIMARY KEY,
 health jsonb NOT NULL,
 article_count integer NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS market_news.analysis_attempts (
 id bigserial PRIMARY KEY,
 article_id bigint NOT NULL REFERENCES market_news.articles(id),
 execution_id text NOT NULL,
 model text NOT NULL,
 prompt_version text NOT NULL,
 result jsonb,
 error text,
 usage jsonb NOT NULL DEFAULT '{}',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS market_news.approval_log (
 id bigserial PRIMARY KEY,
 article_id bigint NOT NULL REFERENCES market_news.articles(id),
 approved_by text NOT NULL,
 message_snapshot text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
-- Create a dedicated login outside this file, with a strong password.
-- Replace news_runtime with your existing dedicated database role:
-- GRANT USAGE ON SCHEMA market_news TO news_runtime;
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA market_news TO news_runtime;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA market_news TO news_runtime;
-- Do not grant superuser, CREATE ROLE, or access to n8n internal tables.
