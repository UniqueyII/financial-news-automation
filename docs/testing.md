# Validation record

## User-observed live evidence

On 2026-10-31, execution 289 of the local main workflow processed 15 articles: sent=1, filtered=13, review=1, warnings=[]. n8n displayed 27,201 tokens and about 18 minutes. The user showed the resulting Telegram message. An earlier reviewed-preview send was recorded as sent in PostgreSQL; repeating that manual flow did not send again.

These observations apply to the author's environment. No sustained uptime, concurrency load, semantic accuracy rate or independent source verification was measured. Screenshots contain personal workspace/channel details and are not included in this public package.

## Offline package checks

Run `node tests/check-workflows.js` with Node.js. Checks cover JSON parsing, connection targets, Code-node compilation, safe export defaults, selected formatter decision branches, delivery response handling and the manual publisher's confirmation guard. They do not import n8n, execute SQL or contact PostgreSQL, Groq or Telegram.

## Remaining integration checks for a fresh installation

1. Apply schema in a new dedicated database and attach credentials.
2. Preview run: stored output, correct routing, no Telegram message.
3. Live send: message ID/time persisted; unknown result never blindly retried.
4. Repeat reviewed send: no new message after the article is sent.
5. Simulate one unavailable feed in a test copy: warning or minimum-health stop.
6. Confirm a real scheduled execution and a backup/restore procedure before relying on unattended operation.

The previously reported 55 assertions belonged to the earlier development pass. This package ships its own reproducible test script; its output is the authoritative offline test count for this export.

Package validation: 96 offline assertions passed; all Code nodes compiled. The public main export explicitly sets `Asia/Tehran` as its workflow timezone. This is not a live API or database integration test.
