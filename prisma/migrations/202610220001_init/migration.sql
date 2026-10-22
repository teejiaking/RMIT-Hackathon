-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organisation" TEXT,
    "demo" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "storageId" TEXT NOT NULL,
    "attributes" JSONB NOT NULL,
    "attributeSource" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "documents_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "share_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "fields" JSONB NOT NULL,
    "documentKind" TEXT NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" DATETIME,
    CONSTRAINT "share_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "share_requests_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "share_grants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "approvedFields" JSONB NOT NULL,
    "consentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "revokedAt" DATETIME,
    "policyVersion" INTEGER NOT NULL,
    CONSTRAINT "share_grants_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "share_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "share_grants_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "share_grants_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "share_grants_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "access_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "ownerId" TEXT,
    "action" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "targetId" TEXT,
    "detail" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "access_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin_change_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposerId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "proposedMaxHours" INTEGER NOT NULL,
    "previousMaxHours" INTEGER NOT NULL,
    "baseVersion" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "proposalHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" DATETIME,
    "appliedAt" DATETIME,
    CONSTRAINT "admin_change_requests_proposerId_fkey" FOREIGN KEY ("proposerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "admin_change_requests_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'sharing',
    "maxDurationHours" INTEGER NOT NULL DEFAULT 168,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "users_subject_key" ON "users"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storageId_key" ON "documents"("storageId");

-- CreateIndex
CREATE INDEX "documents_ownerId_idx" ON "documents"("ownerId");

-- CreateIndex
CREATE INDEX "share_requests_studentId_status_idx" ON "share_requests"("studentId", "status");

-- CreateIndex
CREATE INDEX "share_grants_recipientId_idx" ON "share_grants"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "share_grants_requestId_documentId_key" ON "share_grants"("requestId", "documentId");

-- CreateIndex
CREATE INDEX "access_events_ownerId_createdAt_idx" ON "access_events"("ownerId", "createdAt");
