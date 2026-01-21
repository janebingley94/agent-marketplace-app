-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'SUBSCRIPTION', 'PAYG', 'HYBRID');

-- CreateEnum
CREATE TYPE "EntitlementStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'VOID');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('NONE', 'OPENED', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('ISSUED', 'VOID');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUCCEEDED', 'DEFEATED', 'EXECUTED', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "iconUrl" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "status" "AgentStatus" NOT NULL DEFAULT 'DRAFT',
    "totalCalls" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentVersion" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "changelog" TEXT,
    "promptTemplate" TEXT,
    "runtimeConfig" JSONB,
    "toolPolicy" JSONB,
    "providerKey" TEXT,
    "modelName" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(18,6) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "period" TEXT,
    "quota" JSONB,
    "unitPrice" JSONB,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "EntitlementStatus" NOT NULL DEFAULT 'ACTIVE',
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),
    "usedQuota" JSONB,
    "metadata" JSONB,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "agentVersionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT,
    "status" "RunStatus" NOT NULL DEFAULT 'QUEUED',
    "input" JSONB,
    "output" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "trace" JSONB,
    "traceId" TEXT,
    "parentRunId" TEXT,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunStep" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT,
    "input" JSONB,
    "output" JSONB,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "RunStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageMeter" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "tokensIn" INTEGER NOT NULL DEFAULT 0,
    "tokensOut" INTEGER NOT NULL DEFAULT 0,
    "toolCalls" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "costUsd" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageMeter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyerUserId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "raw" JSONB,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "payerUserId" TEXT NOT NULL,
    "payeeUserId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "orderId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "subtotal" DECIMAL(18,6) NOT NULL,
    "taxAmount" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,6) NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "BillStatus" NOT NULL DEFAULT 'PENDING',
    "dispute" "DisputeStatus" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillItem" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "runId" TEXT,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(18,6) NOT NULL,
    "amount" DECIMAL(18,6) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "BillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "billTo" JSONB NOT NULL,
    "items" JSONB NOT NULL,
    "subtotal" DECIMAL(18,6) NOT NULL,
    "taxAmount" DECIMAL(18,6) NOT NULL,
    "total" DECIMAL(18,6) NOT NULL,
    "currency" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'ISSUED',

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueSplit" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "ratioBps" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,

    CONSTRAINT "RevenueSplit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaoSpace" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "governorAddress" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DaoSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "daoSpaceId" TEXT NOT NULL,
    "proposerId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'ACTIVE',
    "onchainTx" TEXT,
    "actions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "voter" TEXT NOT NULL,
    "support" BOOLEAN NOT NULL,
    "weight" DECIMAL(36,18) NOT NULL DEFAULT 0,
    "reason" TEXT,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_chainId_address_key" ON "Wallet"("chainId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_slug_key" ON "Agent"("slug");

-- CreateIndex
CREATE INDEX "Agent_ownerUserId_idx" ON "Agent"("ownerUserId");

-- CreateIndex
CREATE INDEX "Agent_status_idx" ON "Agent"("status");

-- CreateIndex
CREATE INDEX "Agent_category_idx" ON "Agent"("category");

-- CreateIndex
CREATE INDEX "AgentVersion_agentId_idx" ON "AgentVersion"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "AgentVersion_agentId_version_key" ON "AgentVersion"("agentId", "version");

-- CreateIndex
CREATE INDEX "PricingPlan_agentId_idx" ON "PricingPlan"("agentId");

-- CreateIndex
CREATE INDEX "Entitlement_userId_agentId_idx" ON "Entitlement"("userId", "agentId");

-- CreateIndex
CREATE INDEX "Entitlement_status_idx" ON "Entitlement"("status");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Conversation_agentId_idx" ON "Conversation"("agentId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Run_agentId_userId_idx" ON "Run"("agentId", "userId");

-- CreateIndex
CREATE INDEX "Run_conversationId_idx" ON "Run"("conversationId");

-- CreateIndex
CREATE INDEX "Run_parentRunId_idx" ON "Run"("parentRunId");

-- CreateIndex
CREATE INDEX "Run_status_idx" ON "Run"("status");

-- CreateIndex
CREATE INDEX "RunStep_runId_idx" ON "RunStep"("runId");

-- CreateIndex
CREATE UNIQUE INDEX "UsageMeter_runId_key" ON "UsageMeter"("runId");

-- CreateIndex
CREATE INDEX "UsageMeter_userId_agentId_createdAt_idx" ON "UsageMeter"("userId", "agentId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_buyerUserId_createdAt_idx" ON "Order"("buyerUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_txHash_key" ON "Payment"("txHash");

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_orderId_key" ON "Bill"("orderId");

-- CreateIndex
CREATE INDEX "Bill_payerUserId_createdAt_idx" ON "Bill"("payerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Bill_payeeUserId_createdAt_idx" ON "Bill"("payeeUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Bill_agentId_periodStart_idx" ON "Bill"("agentId", "periodStart");

-- CreateIndex
CREATE INDEX "BillItem_billId_idx" ON "BillItem"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_billId_key" ON "Invoice"("billId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");

-- CreateIndex
CREATE INDEX "RevenueSplit_agentId_idx" ON "RevenueSplit"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "DaoSpace_agentId_key" ON "DaoSpace"("agentId");

-- CreateIndex
CREATE INDEX "Proposal_daoSpaceId_startAt_idx" ON "Proposal"("daoSpaceId", "startAt");

-- CreateIndex
CREATE INDEX "Vote_proposalId_idx" ON "Vote"("proposalId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_proposalId_voter_key" ON "Vote"("proposalId", "voter");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentVersion" ADD CONSTRAINT "AgentVersion_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingPlan" ADD CONSTRAINT "PricingPlan_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entitlement" ADD CONSTRAINT "Entitlement_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_agentVersionId_fkey" FOREIGN KEY ("agentVersionId") REFERENCES "AgentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunStep" ADD CONSTRAINT "RunStep_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageMeter" ADD CONSTRAINT "UsageMeter_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_payerUserId_fkey" FOREIGN KEY ("payerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_payeeUserId_fkey" FOREIGN KEY ("payeeUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillItem" ADD CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueSplit" ADD CONSTRAINT "RevenueSplit_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaoSpace" ADD CONSTRAINT "DaoSpace_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_daoSpaceId_fkey" FOREIGN KEY ("daoSpaceId") REFERENCES "DaoSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
