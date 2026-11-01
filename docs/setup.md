# Setup and operation

## Environment

The author's demonstrated environment used n8n 2.23.2 in Docker Desktop on Windows and PostgreSQL 18 installed on Windows. These are reported versions, not a promise of compatibility with all versions. A fresh installation was not performed during repository packaging.

1. Create a dedicated news database in pgAdmin. Open Query Tool on that database and run `database/schema.sql`. The file creates schema `market_news`, not the database itself. It is not a migration system for older incompatible table definitions.
2. Create a dedicated database login and grant only the schema/table/sequence permissions illustrated at the bottom of the schema file. Store its password in n8n Credentials, never in the repository.
3. Import the main JSON as a new workflow. Keep older copies inactive to avoid multiple schedules.
4. Assign PostgreSQL credentials to every PostgreSQL node. For Docker Desktop n8n connecting to PostgreSQL on Windows, use `host.docker.internal`, your actual port (commonly 5432), database and role. A container's `localhost` is not the Windows host. PostgreSQL must permit the intended connection; do not disable password authentication globally.
5. Assign a Groq API credential to Groq Chat Model. Select a Telegram bot credential for Telegram Publish and ensure the bot can post in the destination.
6. In Config, set `chatId` to your destination. Leave `dryRun: true`, `autoPublish: false` for the first run. All credentials and instance references have been removed from the public exports.
7. Run manually. Inspect Run Summary and database rows with `database/inspect.sql`. Zero previews can be legitimate; inspect scores and quality flags rather than forcing a publication.

## Enable live processing

Set `dryRun: false` and `autoPublish: true`, save, and publish/activate the main workflow. This enables real messages for newly processed eligible items. The schedule is 07:30 Asia/Tehran. Keep the local host awake and all services available. Confirm a scheduled execution in n8n execution history; manually running a schedule node does not prove the schedule is active.

## Publish a reviewed preview

Import `workflows/reviewed-publisher.json` and assign its database and Telegram credentials. Read the stored article's `message` before choosing it. In Config set `articleId`, `chatId`, and explicitly set `confirmSend: true`. Executing this manual workflow sends a real message. It only reserves rows with status `preview`, a nonempty message and no Telegram message ID. It does not release `review` rows. Reset `confirmSend: false` after use.

The public manual publisher replaces the original hard-coded article ID with a parameter. Its original local version was live-tested; the parameterized public version has only offline validation.

## Failure handling

- Feed errors become Run Summary warnings; fewer than `minHealthyFeeds` stops processing.
- Invalid model output becomes `failed`. The queue permits bounded reattempts (attempts < 3), including processing rows older than two hours. Do not overlap very long executions beyond that recovery interval.
- `review` requires inspection; `filtered` is not automatically retried.
- `send_unknown` or a stale `sending` row requires checking Telegram and the relevant execution. Never reset these blindly to ready/queued.
- If saving a Telegram result fails after a successful send, preserve the execution output and reconcile the returned message ID manually.
- Claim Queue filters old thin descriptions without deleting them. Existing URL conflicts do not refresh stored article text.

## Credentials and backups

Use n8n's credential store. Never commit decrypted credential exports, `.env`, database dumps or n8n's user-data directory. Preserve n8n's persistent storage and encryption key in private backups; back up PostgreSQL separately. Persistent volume/restore and long-running availability have not been audited in this package.

The 70-second pause controls pace, not daily quota. Check actual Groq account limits and usage before increasing frequency. Model availability and API limits can change.
