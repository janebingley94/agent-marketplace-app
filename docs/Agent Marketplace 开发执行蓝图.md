# Agent Marketplace 开发执行蓝图

> **项目周期**: 2026-01-21 ~ 2026-01-23 (2天)
> **技术栈**: Next.js 14 + NestJS + PostgreSQL + Redis + wagmi/viem

---

## 一、页面/路由清单

### 1.1 路由结构

| 路由 | 页面名称 | 入口 | 鉴权 | 说明 |
|------|---------|------|-----|------|
| `/` | Marketplace | Header导航 | 否 | 首页，Agent列表 |
| `/agent/[slug]` | Agent详情 | 点击AgentCard | 否 | Agent信息、定价、版本 |
| `/studio` | 我的Agents | Header导航 | 是 | 用户创建的Agent列表 |
| `/studio/agents/new` | 创建Agent | Studio页按钮 | 是 | Agent创建表单 |
| `/studio/agents/[id]/edit` | 编辑Agent | Agent卡片操作 | 是 | Agent编辑表单 |
| `/wallet` | 钱包 | Header导航 | 是 | 余额、收益、提现 |
| `/dashboard` | 仪表盘 | Header导航 | 是 | 数据分析、图表 |
| `/bills` | 账单 | Header导航 | 是 | 交易记录、争议 |
| `/dao` | DAO治理 | Header导航 | 是 | 提案、投票 |

### 1.2 状态处理

| 页面 | 空状态 | 错误态 | 加载态 |
|------|--------|--------|--------|
| Marketplace | "暂无Agent" + 创建引导 | Toast提示 + 重试按钮 | AgentCard骨架屏 |
| Agent详情 | 404页面 | 错误边界 + 返回首页 | 详情骨架屏 |
| Studio | "创建您的第一个Agent" | Toast + 重试 | 卡片骨架屏 |
| Wallet | "暂无交易记录" | 错误提示 | 数字闪烁加载 |
| Dashboard | 空图表占位 | 错误边界 | 图表骨架屏 |
| Bills | "暂无账单" | Toast + 重试 | 表格骨架屏 |
| DAO | "暂无提案" | 错误提示 | 卡片骨架屏 |

---

## 二、组件清单

### 2.1 布局组件

| 组件 | 路径 | 复用场景 | Props |
|------|------|---------|-------|
| `RootLayout` | `app/layout.tsx` | 全局 | `children` |
| `Header` | `components/layout/Header.tsx` | 全局 | `user?: User` |
| `Navigation` | `components/layout/Navigation.tsx` | Header内 | `activeRoute: string` |
| `PageContainer` | `components/layout/PageContainer.tsx` | 所有页面 | `children, maxWidth?: string` |
| `Sidebar` | `components/layout/Sidebar.tsx` | Dashboard/Bills | `children` |

### 2.2 通用组件

| 组件 | 路径 | Props | 说明 |
|------|------|-------|------|
| `Button` | `components/ui/button.tsx` | shadcn/ui标准 | 按钮 |
| `Card` | `components/ui/card.tsx` | shadcn/ui标准 | 卡片容器 |
| `Badge` | `components/ui/badge.tsx` | `variant, children` | 状态标签 |
| `Input` | `components/ui/input.tsx` | shadcn/ui标准 | 输入框 |
| `Select` | `components/ui/select.tsx` | shadcn/ui标准 | 下拉选择 |
| `Dialog` | `components/ui/dialog.tsx` | shadcn/ui标准 | 弹窗 |
| `Toast` | `components/ui/toast.tsx` | shadcn/ui标准 | 消息提示 |
| `Skeleton` | `components/ui/skeleton.tsx` | `className` | 骨架屏 |
| `Avatar` | `components/ui/avatar.tsx` | `src, fallback` | 头像 |
| `DataTable` | `components/ui/data-table.tsx` | TanStack Table | 数据表格 |

### 2.3 业务组件

| 组件 | 路径 | Props | 复用场景 |
|------|------|-------|---------|
| `AgentCard` | `components/marketplace/AgentCard.tsx` | `agent: Agent` | Marketplace, Studio |
| `AgentGrid` | `components/marketplace/AgentGrid.tsx` | `agents: Agent[], loading` | Marketplace, Studio |
| `SearchBar` | `components/marketplace/SearchBar.tsx` | `onSearch, placeholder` | Marketplace |
| `FilterBar` | `components/marketplace/FilterBar.tsx` | `filters, onChange` | Marketplace |
| `CategoryTags` | `components/marketplace/CategoryTags.tsx` | `categories, selected, onSelect` | Marketplace |
| `Leaderboard` | `components/marketplace/Leaderboard.tsx` | `agents: Agent[]` | Marketplace侧边栏 |
| `AgentDetail` | `components/agent/AgentDetail.tsx` | `agent: Agent` | Agent详情页 |
| `PricingCard` | `components/agent/PricingCard.tsx` | `plan: PricingPlan` | Agent详情页 |
| `VersionHistory` | `components/agent/VersionHistory.tsx` | `versions: AgentVersion[]` | Agent详情页 |
| `AgentForm` | `components/studio/AgentForm.tsx` | `agent?, onSubmit` | 创建/编辑Agent |
| `WalletButton` | `components/wallet/WalletButton.tsx` | - | Header |
| `BalanceCard` | `components/wallet/BalanceCard.tsx` | `balance: Balance` | Wallet页 |
| `EarningsChart` | `components/dashboard/EarningsChart.tsx` | `data: ChartData[]` | Dashboard |
| `UsageChart` | `components/dashboard/UsageChart.tsx` | `data: ChartData[]` | Dashboard |
| `BillsTable` | `components/bills/BillsTable.tsx` | `bills: Bill[]` | Bills页 |
| `ProposalCard` | `components/dao/ProposalCard.tsx` | `proposal: Proposal` | DAO页 |
| `VotingProgress` | `components/dao/VotingProgress.tsx` | `votes: VoteSummary` | DAO页 |

---

## 三、数据模型

### 3.1 核心实体

```prisma
// ========== 用户与认证 ==========
model User {
  id          String    @id @default(cuid())
  email       String?   @unique
  name        String?
  avatarUrl   String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  wallets     Wallet[]
  agents      Agent[]   @relation("AgentOwner")
  orders      Order[]   @relation("BuyerOrders")
  billsPayer  Bill[]    @relation("PayerBills")
  billsPayee  Bill[]    @relation("PayeeBills")
  entitlements Entitlement[]
  conversations Conversation[]
  runs        Run[]
}

model Wallet {
  id        String   @id @default(cuid())
  userId    String
  chainId   Int
  address   String
  isPrimary Boolean  @default(false)
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([chainId, address])
  @@index([userId])
}

// ========== Agent核心 ==========
enum AgentStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  SUSPENDED
}

model Agent {
  id          String      @id @default(cuid())
  ownerUserId String
  name        String
  slug        String      @unique
  description String?
  category    String?
  tags        String[]    @default([])
  iconUrl     String?
  isPrivate   Boolean     @default(false)
  status      AgentStatus @default(DRAFT)
  totalCalls  Int         @default(0)
  totalRevenue Decimal    @db.Decimal(18, 6) @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  owner       User        @relation("AgentOwner", fields: [ownerUserId], references: [id])
  versions    AgentVersion[]
  plans       PricingPlan[]
  splits      RevenueSplit[]
  daoSpace    DaoSpace?
  entitlements Entitlement[]
  conversations Conversation[]
  runs        Run[]
  orders      Order[]
  bills       Bill[]

  @@index([ownerUserId])
  @@index([status])
  @@index([category])
}

model AgentVersion {
  id              String    @id @default(cuid())
  agentId         String
  version         String    // "1.0.0"
  changelog       String?
  promptTemplate  String?
  runtimeConfig   Json?     // { maxTokens, temperature, tools }
  toolPolicy      Json?     // { allow: [], deny: [] }
  providerKey     String?   // "openai" | "anthropic"
  modelName       String?   // "gpt-4" | "claude-3"
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())

  agent           Agent     @relation(fields: [agentId], references: [id], onDelete: Cascade)
  runs            Run[]

  @@unique([agentId, version])
  @@index([agentId])
}

// ========== 定价与授权 ==========
enum PlanType {
  FREE
  SUBSCRIPTION
  PAYG      // Pay as you go
  HYBRID
}

model PricingPlan {
  id        String   @id @default(cuid())
  agentId   String
  type      PlanType
  name      String   // "Free", "Pro", "Enterprise"
  price     Decimal  @db.Decimal(18, 6)
  currency  String   @default("USD") // "USD" | "USDC" | "ETH"
  period    String?  // "month" | "year"
  quota     Json?    // { calls: 100, tokens: 10000 }
  unitPrice Json?    // { perCall: 0.01, per1kTokens: 0.02 }
  features  String[] @default([])
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  agent        Agent        @relation(fields: [agentId], references: [id], onDelete: Cascade)
  entitlements Entitlement[]
  orders       Order[]

  @@index([agentId])
}

enum EntitlementStatus {
  ACTIVE
  EXPIRED
  CANCELED
  SUSPENDED
}

model Entitlement {
  id        String            @id @default(cuid())
  userId    String
  agentId   String
  planId    String
  status    EntitlementStatus @default(ACTIVE)
  startAt   DateTime          @default(now())
  endAt     DateTime?
  usedQuota Json?             // { calls: 50, tokens: 5000 }
  metadata  Json?

  user      User        @relation(fields: [userId], references: [id])
  agent     Agent       @relation(fields: [agentId], references: [id])
  plan      PricingPlan @relation(fields: [planId], references: [id])

  @@index([userId, agentId])
  @@index([status])
}

// ========== 对话与运行 ==========
model Conversation {
  id        String   @id @default(cuid())
  userId    String
  agentId   String
  title     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
  agent     Agent    @relation(fields: [agentId], references: [id])
  messages  Message[]
  runs      Run[]

  @@index([userId])
  @@index([agentId])
}

model Message {
  id             String   @id @default(cuid())
  conversationId String
  role           String   // "user" | "assistant" | "system" | "tool"
  content        String
  metadata       Json?    // { toolCalls, attachments }
  createdAt      DateTime @default(now())

  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}

enum RunStatus {
  QUEUED
  RUNNING
  SUCCEEDED
  FAILED
  CANCELED
}

model Run {
  id             String    @id @default(cuid())
  agentId        String
  agentVersionId String
  userId         String
  conversationId String?
  status         RunStatus @default(QUEUED)
  input          Json?
  output         Json?
  startedAt      DateTime?
  finishedAt     DateTime?
  errorCode      String?
  errorMessage   String?
  trace          Json?     // TraceSummary
  traceId        String?   // External trace ID
  parentRunId    String?   // For agent-to-agent calls

  agent          Agent         @relation(fields: [agentId], references: [id])
  version        AgentVersion  @relation(fields: [agentVersionId], references: [id])
  user           User          @relation(fields: [userId], references: [id])
  conversation   Conversation? @relation(fields: [conversationId], references: [id])
  steps          RunStep[]
  usage          UsageMeter?

  @@index([agentId, userId])
  @@index([conversationId])
  @@index([parentRunId])
  @@index([status])
}

model RunStep {
  id        String    @id @default(cuid())
  runId     String
  type      String    // "llm_call" | "tool_call" | "agent_call"
  name      String?
  input     Json?
  output    Json?
  startedAt DateTime?
  finishedAt DateTime?
  error     String?

  run       Run       @relation(fields: [runId], references: [id], onDelete: Cascade)

  @@index([runId])
}

model UsageMeter {
  id         String   @id @default(cuid())
  runId      String   @unique
  userId     String
  agentId    String
  tokensIn   Int      @default(0)
  tokensOut  Int      @default(0)
  toolCalls  Int      @default(0)
  durationMs Int      @default(0)
  costUsd    Decimal  @db.Decimal(18, 6) @default(0)
  createdAt  DateTime @default(now())

  run        Run      @relation(fields: [runId], references: [id])

  @@index([userId, agentId, createdAt])
}

// ========== 订单与支付 ==========
enum OrderStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  CANCELED
}

model Order {
  id          String      @id @default(cuid())
  buyerUserId String
  agentId     String
  planId      String
  amount      Decimal     @db.Decimal(18, 6)
  currency    String
  status      OrderStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  paidAt      DateTime?

  buyer       User        @relation("BuyerOrders", fields: [buyerUserId], references: [id])
  agent       Agent       @relation(fields: [agentId], references: [id])
  plan        PricingPlan @relation(fields: [planId], references: [id])
  payments    Payment[]
  bill        Bill?

  @@index([buyerUserId, createdAt])
}

enum PaymentStatus {
  PENDING
  CONFIRMED
  FAILED
}

model Payment {
  id        String        @id @default(cuid())
  orderId   String
  method    String        // "onchain_usdc" | "onchain_eth"
  chainId   Int
  txHash    String        @unique
  amount    Decimal       @db.Decimal(18, 6)
  status    PaymentStatus @default(PENDING)
  paidAt    DateTime?
  raw       Json?

  order     Order         @relation(fields: [orderId], references: [id])

  @@index([orderId])
}

// ========== 账单与发票 ==========
enum BillStatus {
  PENDING
  PAID
  OVERDUE
  VOID
}

enum DisputeStatus {
  NONE
  OPENED
  RESOLVED
  REJECTED
}

model Bill {
  id          String        @id @default(cuid())
  payerUserId String
  payeeUserId String
  agentId     String
  orderId     String?       @unique
  periodStart DateTime
  periodEnd   DateTime
  subtotal    Decimal       @db.Decimal(18, 6)
  taxAmount   Decimal       @db.Decimal(18, 6) @default(0)
  total       Decimal       @db.Decimal(18, 6)
  currency    String
  status      BillStatus    @default(PENDING)
  dispute     DisputeStatus @default(NONE)
  createdAt   DateTime      @default(now())
  paidAt      DateTime?

  payer       User          @relation("PayerBills", fields: [payerUserId], references: [id])
  payee       User          @relation("PayeeBills", fields: [payeeUserId], references: [id])
  agent       Agent         @relation(fields: [agentId], references: [id])
  order       Order?        @relation(fields: [orderId], references: [id])
  items       BillItem[]
  invoice     Invoice?

  @@index([payerUserId, createdAt])
  @@index([payeeUserId, createdAt])
  @@index([agentId, periodStart])
}

model BillItem {
  id          String   @id @default(cuid())
  billId      String
  runId       String?
  description String
  quantity    Int      @default(1)
  unitPrice   Decimal  @db.Decimal(18, 6)
  amount      Decimal  @db.Decimal(18, 6)
  currency    String

  bill        Bill     @relation(fields: [billId], references: [id], onDelete: Cascade)

  @@index([billId])
}

enum InvoiceStatus {
  ISSUED
  VOID
}

model Invoice {
  id         String        @id @default(cuid())
  billId     String        @unique
  invoiceNo  String        @unique
  billTo     Json          // { name, address, taxId }
  items      Json          // Array of line items
  subtotal   Decimal       @db.Decimal(18, 6)
  taxAmount  Decimal       @db.Decimal(18, 6)
  total      Decimal       @db.Decimal(18, 6)
  currency   String
  pdfUrl     String?
  issuedAt   DateTime      @default(now())
  status     InvoiceStatus @default(ISSUED)

  bill       Bill          @relation(fields: [billId], references: [id])
}

// ========== 分账 ==========
model RevenueSplit {
  id        String  @id @default(cuid())
  agentId   String
  recipient String  // Wallet address
  ratioBps  Int     // Basis points (10000 = 100%)
  kind      String  // "developer" | "platform" | "dao"

  agent     Agent   @relation(fields: [agentId], references: [id], onDelete: Cascade)

  @@index([agentId])
}

// ========== DAO治理 ==========
model DaoSpace {
  id              String   @id @default(cuid())
  agentId         String   @unique
  name            String
  chainId         Int
  governorAddress String
  tokenAddress    String?
  createdAt       DateTime @default(now())

  agent           Agent    @relation(fields: [agentId], references: [id])
  proposals       Proposal[]
}

enum ProposalStatus {
  DRAFT
  ACTIVE
  SUCCEEDED
  DEFEATED
  EXECUTED
  CANCELED
}

model Proposal {
  id         String         @id @default(cuid())
  daoSpaceId String
  proposerId String?
  type       String         // "list" | "delist" | "price_change" | "dispute"
  title      String
  body       String
  startAt    DateTime
  endAt      DateTime
  status     ProposalStatus @default(ACTIVE)
  onchainTx  String?
  actions    Json?
  createdAt  DateTime       @default(now())

  daoSpace   DaoSpace       @relation(fields: [daoSpaceId], references: [id])
  votes      Vote[]

  @@index([daoSpaceId, startAt])
}

model Vote {
  id          String   @id @default(cuid())
  proposalId  String
  voter       String   // Wallet address
  support     Boolean
  weight      Decimal  @db.Decimal(36, 18) @default(0)
  reason      String?
  txHash      String?
  createdAt   DateTime @default(now())

  proposal    Proposal @relation(fields: [proposalId], references: [id])

  @@unique([proposalId, voter])
  @@index([proposalId])
}
```

### 3.2 字段约束

| 实体 | 字段 | 约束 |
|-----|------|------|
| User | email | unique, nullable |
| Wallet | chainId+address | unique composite |
| Agent | slug | unique, lowercase, alphanumeric+dash |
| AgentVersion | agentId+version | unique composite |
| Payment | txHash | unique |
| Invoice | invoiceNo | unique, format: YYYYMM-XXXXX |

---

## 四、API契约

### 4.1 认证 API

#### POST /auth/nonce

生成用于钱包签名的nonce

**Request:**

```json
{
  "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "chainId": 1
}
```

**Response (200):**

```json
{
  "nonce": "abc123xyz",
  "expiresAt": "2026-01-21T12:00:00Z"
}
```

**Errors:**

| Code | Message |
|------|---------|
| 400 | Invalid address format |
| 429 | Too many requests |

---

#### POST /auth/verify

验证签名并返回JWT

**Request:**

```json
{
  "message": "Sign in to Agent Marketplace\nNonce: abc123xyz",
  "signature": "0x...",
  "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "chainId": 1
}
```

**Response (200):**

```json
{
  "accessToken": "eyJ...",
  "expiresIn": 86400,
  "user": {
    "id": "user_123",
    "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "name": null,
    "avatarUrl": null
  }
}
```

**Errors:**

| Code | Message |
|------|---------|
| 400 | Invalid signature |
| 401 | Nonce expired |
| 403 | Wallet suspended |

---

#### GET /auth/me

获取当前用户信息

**Headers:** `Authorization: Bearer {token}`

**Response (200):**

```json
{
  "id": "user_123",
  "email": null,
  "name": "Alice",
  "avatarUrl": "https://...",
  "wallets": [
    {
      "id": "wallet_1",
      "chainId": 1,
      "address": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      "isPrimary": true
    }
  ],
  "createdAt": "2026-01-20T10:00:00Z"
}
```

**Errors:**

| Code | Message |
|------|---------|
| 401 | Unauthorized |

---

### 4.2 Agents API

#### GET /agents

获取Agent列表（分页、筛选、搜索）

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| q | string | - | 搜索关键词 |
| category | string | - | 分类筛选 |
| tags | string[] | - | 标签筛选 |
| status | string | PUBLISHED | 状态筛选 |
| sort | string | createdAt | 排序字段 |
| order | string | desc | 排序方向 |
| page | number | 1 | 页码 |
| limit | number | 20 | 每页数量 |

**Response (200):**

```json
{
  "data": [
    {
      "id": "agent_123",
      "name": "Data Analyst",
      "slug": "data-analyst",
      "description": "AI-powered data analysis agent",
      "category": "Analytics",
      "tags": ["data", "analysis", "charts"],
      "iconUrl": "https://...",
      "status": "PUBLISHED",
      "totalCalls": 15000,
      "totalRevenue": "5000.00",
      "owner": {
        "id": "user_1",
        "name": "Alice",
        "avatarUrl": "https://..."
      },
      "plans": [
        {
          "id": "plan_1",
          "type": "FREE",
          "name": "Free",
          "price": "0"
        },
        {
          "id": "plan_2",
          "type": "SUBSCRIPTION",
          "name": "Pro",
          "price": "29.00",
          "period": "month"
        }
      ],
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

#### GET /agents/:slug

获取Agent详情

**Response (200):**

```json
{
  "id": "agent_123",
  "name": "Data Analyst",
  "slug": "data-analyst",
  "description": "AI-powered data analysis agent with advanced capabilities...",
  "category": "Analytics",
  "tags": ["data", "analysis", "charts"],
  "iconUrl": "https://...",
  "isPrivate": false,
  "status": "PUBLISHED",
  "totalCalls": 15000,
  "totalRevenue": "5000.00",
  "owner": {
    "id": "user_1",
    "name": "Alice",
    "avatarUrl": "https://..."
  },
  "currentVersion": {
    "id": "version_1",
    "version": "1.2.0",
    "changelog": "Added chart generation",
    "providerKey": "openai",
    "modelName": "gpt-4",
    "publishedAt": "2026-01-18T10:00:00Z"
  },
  "versions": [
    {
      "id": "version_1",
      "version": "1.2.0",
      "publishedAt": "2026-01-18T10:00:00Z"
    },
    {
      "id": "version_0",
      "version": "1.1.0",
      "publishedAt": "2026-01-10T10:00:00Z"
    }
  ],
  "plans": [
    {
      "id": "plan_1",
      "type": "FREE",
      "name": "Free",
      "price": "0",
      "currency": "USD",
      "quota": { "calls": 10, "tokensPerMonth": 10000 },
      "features": ["Basic analysis", "5 charts/day"]
    },
    {
      "id": "plan_2",
      "type": "SUBSCRIPTION",
      "name": "Pro",
      "price": "29.00",
      "currency": "USD",
      "period": "month",
      "quota": { "calls": 1000, "tokensPerMonth": 500000 },
      "features": ["Advanced analysis", "Unlimited charts", "Priority support"]
    }
  ],
  "splits": [
    { "kind": "developer", "ratioBps": 7000 },
    { "kind": "platform", "ratioBps": 2000 },
    { "kind": "dao", "ratioBps": 1000 }
  ],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-18T10:00:00Z"
}
```

**Errors:**

| Code | Message |
|------|---------|
| 404 | Agent not found |

---

#### POST /agents

创建Agent (需认证)

**Headers:** `Authorization: Bearer {token}`

**Request:**

```json
{
  "name": "My Agent",
  "slug": "my-agent",
  "description": "Description here",
  "category": "Productivity",
  "tags": ["automation", "workflow"],
  "iconUrl": "https://...",
  "isPrivate": false
}
```

**Response (201):**

```json
{
  "id": "agent_new",
  "name": "My Agent",
  "slug": "my-agent",
  "status": "DRAFT",
  "createdAt": "2026-01-21T10:00:00Z"
}
```

**Errors:**

| Code | Message |
|------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 409 | Slug already exists |

---

#### PATCH /agents/:id

更新Agent (需认证、需所有者)

**Headers:** `Authorization: Bearer {token}`

**Request:**

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "tags": ["new", "tags"]
}
```

**Response (200):** 同GET /agents/:slug

**Errors:**

| Code | Message |
|------|---------|
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Not the owner |
| 404 | Agent not found |

---

#### POST /agents/:id/versions

创建新版本 (需认证、需所有者)

**Headers:** `Authorization: Bearer {token}`

**Request:**

```json
{
  "version": "1.3.0",
  "changelog": "New features added",
  "promptTemplate": "You are a helpful assistant...",
  "runtimeConfig": {
    "maxTokens": 4096,
    "temperature": 0.7,
    "tools": ["web_search", "calculator"]
  },
  "toolPolicy": {
    "allow": ["web_search", "calculator"],
    "deny": []
  },
  "providerKey": "openai",
  "modelName": "gpt-4"
}
```

**Response (201):**

```json
{
  "id": "version_new",
  "agentId": "agent_123",
  "version": "1.3.0",
  "publishedAt": null,
  "createdAt": "2026-01-21T10:00:00Z"
}
```

---

#### POST /agents/:id/versions/:version/publish

发布版本 (需认证、需所有者)

**Headers:** `Authorization: Bearer {token}`

**Response (200):**

```json
{
  "id": "version_new",
  "version": "1.3.0",
  "publishedAt": "2026-01-21T10:30:00Z"
}
```

---

#### GET /agents/leaderboard

获取Agent排行榜

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| metric | string | revenue | 排序指标 (revenue/calls) |
| period | string | 7d | 时间范围 (7d/30d/all) |
| limit | number | 10 | 返回数量 |

**Response (200):**

```json
{
  "data": [
    {
      "rank": 1,
      "agent": {
        "id": "agent_1",
        "name": "Top Agent",
        "slug": "top-agent",
        "iconUrl": "https://..."
      },
      "revenue": "12500.00",
      "calls": 50000,
      "change": "+15.2%"
    }
  ],
  "period": "7d",
  "metric": "revenue"
}
```

---

### 4.3 Dashboard API

#### GET /dashboard/overview

获取仪表盘概览

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| range | string | 7d | 时间范围 (7d/30d/90d) |

**Response (200):**

```json
{
  "totalBalance": "15000.00",
  "dailyRevenue": "500.00",
  "activeAgents": 5,
  "stakedAssets": "2000.00",
  "revenueChange": "+12.5%",
  "callsChange": "+8.3%"
}
```

---

#### GET /dashboard/earnings

获取收益趋势

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| range | string | 30d |
| groupBy | string | day |

**Response (200):**

```json
{
  "data": [
    { "date": "2026-01-15", "revenue": "450.00", "calls": 1500 },
    { "date": "2026-01-16", "revenue": "520.00", "calls": 1800 }
  ],
  "summary": {
    "totalRevenue": "15000.00",
    "totalCalls": 50000,
    "avgDailyRevenue": "500.00"
  }
}
```

---

#### GET /dashboard/agents

获取Agent收益分布

**Headers:** `Authorization: Bearer {token}`

**Response (200):**

```json
{
  "data": [
    {
      "agent": {
        "id": "agent_1",
        "name": "Data Analyst",
        "iconUrl": "https://..."
      },
      "revenue": "8000.00",
      "percentage": 53.3,
      "calls": 30000,
      "status": "PUBLISHED"
    }
  ]
}
```

---

### 4.4 Bills API

#### GET /bills

获取账单列表

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| role | string | payer | payer/payee |
| status | string | - | 状态筛选 |
| from | string | - | 开始日期 |
| to | string | - | 结束日期 |
| page | number | 1 | 页码 |
| limit | number | 20 | 每页数量 |

**Response (200):**

```json
{
  "data": [
    {
      "id": "bill_123",
      "agent": {
        "id": "agent_1",
        "name": "Data Analyst"
      },
      "periodStart": "2026-01-01T00:00:00Z",
      "periodEnd": "2026-01-31T23:59:59Z",
      "subtotal": "100.00",
      "taxAmount": "10.00",
      "total": "110.00",
      "currency": "USD",
      "status": "PAID",
      "dispute": "NONE",
      "createdAt": "2026-02-01T00:00:00Z",
      "paidAt": "2026-02-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

---

#### POST /bills/:id/disputes

发起账单争议

**Headers:** `Authorization: Bearer {token}`

**Request:**

```json
{
  "reason": "Incorrect billing amount",
  "evidence": ["https://...screenshot.png"],
  "expectedAmount": "80.00"
}
```

**Response (201):**

```json
{
  "billId": "bill_123",
  "dispute": "OPENED",
  "createdAt": "2026-01-21T10:00:00Z"
}
```

---

### 4.5 DAO API

#### GET /dao/spaces/:agentId

获取DAO空间信息

**Response (200):**

```json
{
  "id": "dao_123",
  "agentId": "agent_123",
  "name": "Data Analyst DAO",
  "chainId": 1,
  "governorAddress": "0x...",
  "tokenAddress": "0x...",
  "stats": {
    "totalProposals": 15,
    "activeVoting": 2,
    "resolved": 10,
    "totalTokenHolders": 500
  }
}
```

---

#### GET /dao/proposals

获取提案列表

**Query Parameters:**

| Param | Type | Default |
|-------|------|---------|
| spaceId | string | - |
| status | string | - |
| page | number | 1 |
| limit | number | 20 |

**Response (200):**

```json
{
  "data": [
    {
      "id": "proposal_123",
      "type": "price_change",
      "title": "Increase Pro plan price to $39",
      "body": "Due to increased costs...",
      "status": "ACTIVE",
      "startAt": "2026-01-20T00:00:00Z",
      "endAt": "2026-01-27T00:00:00Z",
      "votes": {
        "for": "150000.00",
        "against": "50000.00",
        "abstain": "10000.00",
        "quorum": "100000.00",
        "participation": "21%"
      }
    }
  ],
  "pagination": { ... }
}
```

---

#### POST /dao/proposals/:id/vote

投票 (返回链上calldata)

**Headers:** `Authorization: Bearer {token}`

**Request:**

```json
{
  "support": true,
  "reason": "I support this change"
}
```

**Response (200):**

```json
{
  "proposalId": "proposal_123",
  "calldata": "0x...",
  "to": "0x...",
  "chainId": 1
}
```

---

### 4.6 通用错误码

| HTTP Status | Code | Message |
|-------------|------|---------|
| 400 | BAD_REQUEST | Invalid request body |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Permission denied |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | VALIDATION_ERROR | Validation failed |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Internal server error |

---

## 五、状态管理与缓存策略

### 5.1 客户端状态

| 状态类型 | 工具 | 使用场景 |
|---------|------|---------|
| 服务器状态 | TanStack Query | API数据、缓存、同步 |
| 客户端状态 | Jotai | 认证、UI状态、表单 |
| URL状态 | nuqs | 筛选、分页、搜索参数 |

### 5.2 TanStack Query 配置

```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5分钟
      gcTime: 1000 * 60 * 30,       // 30分钟
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Query Keys
export const queryKeys = {
  agents: {
    all: ['agents'] as const,
    list: (filters: AgentFilters) => ['agents', 'list', filters] as const,
    detail: (slug: string) => ['agents', 'detail', slug] as const,
    leaderboard: (params: LeaderboardParams) => ['agents', 'leaderboard', params] as const,
  },
  dashboard: {
    overview: (range: string) => ['dashboard', 'overview', range] as const,
    earnings: (params: EarningsParams) => ['dashboard', 'earnings', params] as const,
  },
  bills: {
    list: (filters: BillFilters) => ['bills', 'list', filters] as const,
  },
  dao: {
    proposals: (spaceId: string) => ['dao', 'proposals', spaceId] as const,
  },
};
```

### 5.3 Jotai Atoms

```typescript
// atoms/auth.ts
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const accessTokenAtom = atomWithStorage<string | null>('accessToken', null);

// atoms/ui.ts
export const sidebarOpenAtom = atom(true);
export const themeAtom = atomWithStorage<'light' | 'dark'>('theme', 'dark');

// atoms/filters.ts
export const agentFiltersAtom = atom<AgentFilters>({
  category: undefined,
  tags: [],
  sort: 'createdAt',
  order: 'desc',
});
```

### 5.4 服务端缓存 (Redis)

| Key Pattern | TTL | 用途 |
|------------|-----|------|
| `nonce:{address}` | 5min | SIWE nonce |
| `agent:{slug}` | 10min | Agent详情缓存 |
| `leaderboard:{metric}:{period}` | 5min | 排行榜缓存 |
| `ratelimit:{userId}:{endpoint}` | 1min | 速率限制 |

---

## 六、权限与风控

### 6.1 认证策略

| 策略 | 实现 | 适用场景 |
|-----|------|---------|
| SIWE | Sign-In with Ethereum | 主认证方式 |
| JWT | Bearer Token | API认证 |
| API Key | Header: X-API-Key | 【Assumption】第三方集成 |

### 6.2 RBAC 权限

| 角色 | 权限 |
|-----|------|
| Guest | 浏览Marketplace, 查看Agent详情 |
| User | Guest + 创建Agent, 购买订阅, 查看账单 |
| AgentOwner | User + 编辑/发布自己的Agent |
| Admin | 全部权限 + 审核Agent + 管理用户 |

### 6.3 敏感操作

| 操作 | 风控措施 |
|-----|---------|
| 钱包绑定 | 签名验证, 防重放 |
| 创建订单 | 速率限制 (10/min) |
| 发起争议 | 需提交证据, 冷却期 |
| 链上支付 | 金额验证, 超时取消 |
| DAO投票 | 持币验证, 一人一票 |
| Agent发布 | 【Assumption】人工审核队列 |

### 6.4 速率限制

| 端点 | 限制 |
|-----|------|
| POST /auth/nonce | 5/min/IP |
| POST /auth/verify | 10/min/IP |
| GET /agents | 60/min/IP |
| POST /agents | 10/min/user |
| POST /orders | 10/min/user |

---

## 七、埋点事件表

| Event Name | 触发时机 | Payload |
|-----------|---------|---------|
| `page_view` | 页面加载 | `{ page, referrer, userId? }` |
| `wallet_connect_click` | 点击连接钱包 | `{ location }` |
| `wallet_connect_success` | 钱包连接成功 | `{ address, chainId }` |
| `wallet_connect_error` | 钱包连接失败 | `{ error }` |
| `auth_login` | 登录成功 | `{ userId, method }` |
| `auth_logout` | 登出 | `{ userId }` |
| `agent_search` | 搜索Agent | `{ query, filters, resultsCount }` |
| `agent_filter` | 应用筛选 | `{ filters }` |
| `agent_card_click` | 点击Agent卡片 | `{ agentId, position }` |
| `agent_detail_view` | 查看Agent详情 | `{ agentId, agentSlug }` |
| `agent_try_click` | 点击试用Agent | `{ agentId, planId }` |
| `agent_create_start` | 开始创建Agent | `{ userId }` |
| `agent_create_submit` | 提交创建Agent | `{ agentId, fields }` |
| `agent_publish` | 发布Agent | `{ agentId, version }` |
| `order_create` | 创建订单 | `{ orderId, agentId, planId, amount }` |
| `payment_start` | 开始支付 | `{ orderId, method }` |
| `payment_success` | 支付成功 | `{ orderId, txHash }` |
| `payment_error` | 支付失败 | `{ orderId, error }` |
| `bill_view` | 查看账单 | `{ billId }` |
| `dispute_create` | 发起争议 | `{ billId, reason }` |
| `proposal_view` | 查看提案 | `{ proposalId }` |
| `vote_cast` | 投票 | `{ proposalId, support }` |

---

## 八、验收标准

### 8.1 功能验收 (对应PRD)

| # | 功能点 | 验收标准 | 优先级 |
|---|-------|---------|--------|
| F1 | 钱包登录 | 用户可通过MetaMask签名登录，获取JWT | P0 |
| F2 | Marketplace浏览 | 显示Agent列表，支持搜索、筛选、分页 | P0 |
| F3 | Agent详情 | 显示Agent信息、定价、版本历史 | P0 |
| F4 | 创建Agent | 表单验证，成功创建后跳转Studio | P0 |
| F5 | 我的Agents | 显示用户创建的Agent列表 | P0 |
| F6 | Wallet页面 | 显示余额、收益、交易记录 | P1 |
| F7 | Dashboard | 显示收益趋势图、Agent分布 | P1 |
| F8 | Bills列表 | 显示账单列表，支持筛选 | P1 |
| F9 | DAO提案 | 显示提案列表、投票进度 | P2 |
| F10 | Agent运行 | 【Deferred】Runtime执行 | P2 |

### 8.2 设计验收 (对应设计稿)

| # | 页面 | 验收标准 |
|---|-----|---------|
| D1 | Marketplace | 布局与设计稿一致，响应式适配 |
| D2 | Agent详情 | 信息展示完整，交互符合设计 |
| D3 | Studio | 表单布局、状态标签样式正确 |
| D4 | Wallet | 余额卡片、图表样式正确 |
| D5 | Dashboard | 图表渲染正确，数据实时更新 |
| D6 | Bills | 表格样式、状态标签正确 |
| D7 | DAO | 投票进度条、卡片样式正确 |

### 8.3 技术验收

| # | 类型 | 验收标准 |
|---|-----|---------|
| T1 | API文档 | Swagger可访问，所有端点已文档化 |
| T2 | 单元测试 | 覆盖率 > 40% (MVP) |
| T3 | E2E测试 | 核心流程测试通过 |
| T4 | 监控 | OpenTelemetry traces可查询 |
| T5 | 日志 | 结构化日志，错误可追踪 |
| T6 | 性能 | 首页LCP < 2.5s |

---

## 九、任务分解树

### Epic 1: 项目初始化 (Day 1 - 2h)

#### Story 1.1: Monorepo搭建

**Task 1.1.1: 初始化pnpm workspace**

- 目标: 创建monorepo基础结构
- 范围: 根目录配置文件
- 实现要点:
  - `pnpm-workspace.yaml` 配置
  - `turbo.json` 构建配置
  - 根 `package.json` scripts
- 风险: turborepo版本兼容性
- DoD: `pnpm install` 成功，`pnpm dev` 启动所有apps

**Task 1.1.2: 创建apps目录结构**

- 目标: 初始化前后端应用
- 范围: `apps/web`, `apps/api`, `apps/jobs`
- 实现要点:
  - Next.js 14 App Router 初始化
  - NestJS 项目初始化
  - 共享TypeScript配置
- 风险: 依赖版本冲突
- DoD: 各app独立启动成功

**Task 1.1.3: 创建packages目录结构**

- 目标: 初始化共享包
- 范围: `packages/shared`, `packages/db`, `packages/contracts-sdk`
- 实现要点:
  - TypeScript配置
  - Package exports配置
  - 包间引用测试
- 风险: 路径别名配置
- DoD: 包可被apps正确引用

---

### Epic 2: 数据库与基础设施 (Day 1 - 4h)

#### Story 2.1: Prisma Schema

**Task 2.1.1: 定义核心数据模型**

- 目标: 创建完整的Prisma schema
- 范围: 用户、Agent、定价、账单等模型
- 实现要点:
  - 枚举类型定义
  - 关系与索引
  - 约束与默认值
- 风险: 关系设计复杂度
- DoD: `prisma migrate dev` 成功

**Task 2.1.2: 创建种子数据脚本**

- 目标: 生成演示数据
- 范围: 用户、Agent、定价计划
- 实现要点:
  - 10-15个示例Agent
  - 多种定价计划
  - 模拟交易数据
- 风险: 数据一致性
- DoD: `pnpm db:seed` 成功，数据可查询

#### Story 2.2: Docker基础设施

**Task 2.2.1: 创建docker-compose配置**

- 目标: 本地开发环境容器化
- 范围: PostgreSQL, Redis
- 实现要点:
  - 数据持久化卷
  - 环境变量配置
  - 健康检查
- 风险: 端口冲突
- DoD: `docker-compose up` 启动服务正常

---

### Epic 3: 后端API开发 (Day 1 - 4h)

#### Story 3.1: 认证模块

**Task 3.1.1: 实现SIWE认证**

- 目标: 钱包签名登录
- 范围: nonce生成、签名验证、JWT发放
- 实现要点:
  - `siwe` 库集成
  - nonce Redis存储
  - JWT签发与验证
- 风险: 签名验证边界情况
- DoD: 通过postman测试完整流程

**Task 3.1.2: 实现JWT守卫**

- 目标: 保护需认证的路由
- 范围: NestJS Guard
- 实现要点:
  - `@nestjs/passport` 集成
  - JWT策略
  - 用户注入装饰器
- 风险: Token过期处理
- DoD: 受保护路由正确拦截未认证请求

#### Story 3.2: Agents模块

**Task 3.2.1: 实现Agents CRUD**

- 目标: Agent的增删改查
- 范围: Controller, Service, DTOs
- 实现要点:
  - Zod验证
  - 分页查询
  - 权限检查
- 风险: 查询性能
- DoD: 所有CRUD操作通过测试

**Task 3.2.2: 实现Agent搜索与筛选**

- 目标: 支持关键词搜索、分类筛选
- 范围: 查询构建器
- 实现要点:
  - 【Assumption】使用Postgres全文搜索
  - 动态条件构建
  - 排序支持
- 风险: 复杂查询性能
- DoD: 搜索返回正确结果

**Task 3.2.3: 实现排行榜API**

- 目标: Agent收入/调用排行
- 范围: 聚合查询
- 实现要点:
  - 缓存策略
  - 周期计算
  - 变化率计算
- 风险: 数据量大时性能
- DoD: 排行榜数据正确显示

#### Story 3.3: Dashboard模块

**Task 3.3.1: 实现概览API**

- 目标: 仪表盘核心指标
- 范围: 余额、收益、Agent数
- 实现要点:
  - 聚合查询优化
  - 缓存策略
  - 变化率计算
- 风险: 计算复杂度
- DoD: 数据准确返回

**Task 3.3.2: 实现收益趋势API**

- 目标: 时间序列数据
- 范围: 按日/周/月聚合
- 实现要点:
  - 时间分组查询
  - 缺失数据填充
  - 汇总计算
- 风险: 时区处理
- DoD: 图表数据正确

#### Story 3.4: API文档

**Task 3.4.1: 配置Swagger**

- 目标: 自动生成API文档
- 范围: 所有端点
- 实现要点:
  - `@nestjs/swagger` 配置
  - DTO装饰器
  - 错误响应文档
- 风险: 无
- DoD: `/api/docs` 可访问，文档完整

---

### Epic 4: 前端开发 (Day 2 - 6h)

#### Story 4.1: 项目配置

**Task 4.1.1: 配置Tailwind与shadcn/ui**

- 目标: UI基础设施
- 范围: 样式系统
- 实现要点:
  - Tailwind配置
  - shadcn/ui组件安装
  - 主题配置（深色模式）
- 风险: 样式冲突
- DoD: 组件样式正确显示

**Task 4.1.2: 配置Providers**

- 目标: 全局状态与数据
- 范围: QueryClient, Wagmi, Jotai
- 实现要点:
  - Provider嵌套顺序
  - SSR兼容性
  - 错误边界
- 风险: Hydration mismatch
- DoD: 页面无水合错误

#### Story 4.2: 认证流程

**Task 4.2.1: 实现钱包连接**

- 目标: 用户连接钱包
- 范围: WalletButton组件
- 实现要点:
  - wagmi hooks
  - 连接状态UI
  - 错误处理
- 风险: 钱包兼容性
- DoD: MetaMask连接成功

**Task 4.2.2: 实现SIWE登录**

- 目标: 签名认证
- 范围: 认证流程
- 实现要点:
  - Nonce获取
  - 签名请求
  - JWT存储
- 风险: 签名格式
- DoD: 登录后获取用户信息

#### Story 4.3: Marketplace页面

**Task 4.3.1: 实现AgentCard组件**

- 目标: Agent展示卡片
- 范围: 单个卡片组件
- 实现要点:
  - 样式匹配设计稿
  - 点击跳转
  - 加载状态
- 风险: 无
- DoD: 视觉与设计稿一致

**Task 4.3.2: 实现Marketplace布局**

- 目标: 首页整体布局
- 范围: 页面结构
- 实现要点:
  - 网格布局
  - 侧边栏
  - 响应式
- 风险: 布局复杂度
- DoD: 桌面/移动端适配

**Task 4.3.3: 实现搜索与筛选**

- 目标: 交互式筛选
- 范围: SearchBar, FilterBar, CategoryTags
- 实现要点:
  - URL状态同步
  - 防抖搜索
  - 多选筛选
- 风险: 状态同步
- DoD: 筛选条件正确应用

**Task 4.3.4: 实现排行榜侧边栏**

- 目标: 展示Top Agents
- 范围: Leaderboard组件
- 实现要点:
  - 数据获取
  - 排名样式
  - 变化指示
- 风险: 无
- DoD: 排行正确显示

#### Story 4.4: Agent详情页

**Task 4.4.1: 实现Agent详情布局**

- 目标: 详情页结构
- 范围: 页面组件
- 实现要点:
  - 信息展示区
  - 定价卡片
  - 版本历史
- 风险: 无
- DoD: 数据完整展示

**Task 4.4.2: 实现定价选择**

- 目标: 计划选择交互
- 范围: PricingCard组件
- 实现要点:
  - 高亮选中
  - 功能对比
  - 购买按钮
- 风险: 无
- DoD: 可选择并触发购买

#### Story 4.5: Studio页面

**Task 4.5.1: 实现我的Agents列表**

- 目标: 用户Agent管理
- 范围: Studio首页
- 实现要点:
  - 认证守卫
  - Agent列表
  - 状态标签
- 风险: 无
- DoD: 显示用户的Agent

**Task 4.5.2: 实现Agent创建表单**

- 目标: 创建新Agent
- 范围: AgentForm组件
- 实现要点:
  - Zod表单验证
  - 字段联动
  - 提交反馈
- 风险: 表单复杂度
- DoD: 成功创建Agent

#### Story 4.6: 其他页面

**Task 4.6.1: 实现Wallet页面**

- 目标: 展示余额与收益
- 范围: 静态展示
- 实现要点:
  - BalanceCard
  - 【Assumption】模拟数据
- 风险: 无
- DoD: 页面可访问

**Task 4.6.2: 实现Dashboard页面**

- 目标: 数据可视化
- 范围: 图表展示
- 实现要点:
  - Recharts图表
  - 数据获取
- 风险: 图表渲染
- DoD: 图表正确显示

**Task 4.6.3: 实现Bills页面**

- 目标: 账单列表
- 范围: 表格展示
- 实现要点:
  - TanStack Table
  - 状态筛选
- 风险: 无
- DoD: 账单列表显示

**Task 4.6.4: 实现DAO页面**

- 目标: 提案展示
- 范围: 提案卡片
- 实现要点:
  - ProposalCard
  - VotingProgress
- 风险: 无
- DoD: 提案列表显示

---

### Epic 5: 测试与文档 (Day 2 - 2h)

#### Story 5.1: 测试

**Task 5.1.1: API E2E测试**

- 目标: 核心流程测试
- 范围: 认证、Agents CRUD
- 实现要点:
  - Jest配置
  - 测试数据库
  - 断言验证
- 风险: 测试隔离
- DoD: 测试通过，覆盖率 > 40%

**Task 5.1.2: 前端组件测试**

- 目标: 关键组件测试
- 范围: AgentCard, AgentForm
- 实现要点:
  - React Testing Library
  - Mock数据
- 风险: 无
- DoD: 组件测试通过

#### Story 5.2: 文档与交付

**Task 5.2.1: 编写README**

- 目标: 项目文档
- 范围: 安装、配置、运行
- 实现要点:
  - 环境配置
  - 启动命令
  - 架构说明
- 风险: 无
- DoD: 新开发者可按文档启动

**Task 5.2.2: 编写CHANGELOG**

- 目标: 版本记录
- 范围: v0.1.0
- 实现要点:
  - 功能列表
  - 已知问题
- 风险: 无
- DoD: CHANGELOG完整

**Task 5.2.3: 配置监控**

- 目标: 可观测性
- 范围: OpenTelemetry
- 实现要点:
  - Trace配置
  - 日志格式
- 风险: 配置复杂度
- DoD: Traces可查询

---

## 十、时间线总结

| 阶段 | 时间 | 任务 |
|-----|------|------|
| Day 1 上午 | 2h | Epic 1: Monorepo搭建 |
| Day 1 上午 | 2h | Epic 2: 数据库Schema + Docker |
| Day 1 下午 | 4h | Epic 3: 后端API (Auth, Agents, Dashboard) |
| Day 2 上午 | 2h | Story 4.1-4.2: 前端配置 + 认证 |
| Day 2 上午 | 2h | Story 4.3: Marketplace页面 |
| Day 2 下午 | 2h | Story 4.4-4.5: Agent详情 + Studio |
| Day 2 下午 | 2h | Story 4.6 + Epic 5: 其他页面 + 测试文档 |

---

## 假设清单 [Assumption]

1. **搜索引擎**: MVP阶段使用PostgreSQL全文搜索，不集成Meilisearch
2. **Agent审核**: 需人工审核，通过后台队列处理
3. **API Key认证**: 第三方集成需API Key认证方式
4. **Wallet页面**: 使用模拟数据，真实链上余额查询延后
5. **Runtime执行**: Agent实际运行功能延后到Phase 2
6. **智能合约**: 链上支付功能延后，MVP使用模拟支付
7. **DAO投票**: 链上投票延后，MVP仅展示UI
8. **发票生成**: PDF生成功能延后
