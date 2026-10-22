-- A fresh real-account deployment needs an applied policy without seeding demo identities.
INSERT OR IGNORE INTO "policies" ("id", "maxDurationHours", "version") VALUES ('sharing', 168, 1);
