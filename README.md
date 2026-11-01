# Financial News Automation

An n8n workflow that collects financial news from eight RSS feeds, produces Persian summaries with Groq, and publishes qualifying items to Telegram with a PostgreSQL audit trail.

Built by [Amin Sharifi](https://github.com/UniqueyII). **Portfolio MVP demonstrated locally; not a claim of production availability or verified investment analysis.**

## What it demonstrates

- Multi-source ingestion, text cleanup and URL deduplication.
- PostgreSQL queue ownership and row locking with `FOR UPDATE SKIP LOCKED`.
- Structured LLM output, evidence-quote matching and conservative numeric checks.
- Separate filtered, review, preview and publication outcomes.
- Conditional delivery reservation and recording of Telegram message IDs.
- Explicit `send_unknown` handling instead of blind Telegram retries.

## Observed demo

The author's local execution **289** processed **15** articles: **1 sent, 13 filtered, 1 review**, with no feed warnings. n8n displayed **27,201 tokens** and approximately **18 minutes** elapsed. These are one-run observations, not benchmarks or accuracy measurements. The manual publisher was also rerun after a successful send without sending the same article again.

No demo video is included yet. See the [recording guide](docs/demo-and-resume.md).

## Quick start

1. Apply [database/schema.sql](database/schema.sql) to a dedicated PostgreSQL database.
2. Import [workflows/financial-news.json](workflows/financial-news.json) into n8n.
3. Assign PostgreSQL, Groq and Telegram credentials in n8n. None are included here.
4. Keep `dryRun: true` and `autoPublish: false`, then execute manually.
5. Inspect the stored preview before enabling publication.

Detailed [setup](docs/setup.md) · [architecture](docs/architecture.md) · [testing](docs/testing.md) · [Persian guide](docs/README.fa.md)

## Defaults

| Setting | Value |
|---|---|
| Model | `openai/gpt-oss-20b` through Groq |
| Batch size | Up to 15 eligible articles |
| Per-source ingestion cap | 20 accepted articles |
| Lookback | 36 hours |
| Minimum score / confidence | 4 of 5 / 0.75 |
| Inter-article pause | 70 seconds |
| Schedule | 07:30 Asia/Tehran, once published/activated |
| Public export | Inactive; preview mode; placeholder chat ID |

Fetching 20 items per feed does not mean 20 model calls per feed. Claim Queue controls the total inference batch. Preview mode still consumes model tokens.

## Limitations

The model reads the title and RSS excerpt, not the full article. Confidence is model-reported, not a calibrated probability. String and number checks do not establish truth or validate every inference. Keyword and minimum-length filters can exclude relevant news. URL deduplication is not semantic event deduplication.

There is no exactly-once delivery guarantee across PostgreSQL and Telegram: a crash after sending but before recording needs reconciliation. Local scheduling requires the computer, n8n, PostgreSQL and network to remain available. Existing preview/review rows are not automatically released by switching to live mode.

## Repository contents

- `workflows/`: importable, sanitized main and manual publisher workflows.
- `database/`: schema and read-only inspection queries.
- `tests/`: offline checks; no external calls or secrets required.
- `docs/`: setup, operational behavior, demo and resume material.

Run offline checks with Node.js: `node tests/check-workflows.js`.

Third-party services and news content remain subject to their respective terms. No license grant is added in this package; choose a repository license explicitly before inviting reuse.
