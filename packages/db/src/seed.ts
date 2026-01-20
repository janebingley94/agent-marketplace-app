import { PrismaClient, AgentStatus, PlanType, BillStatus, ProposalStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        name: 'Alice Chen',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        wallets: {
          create: {
            chainId: 1,
            address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            isPrimary: true,
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Wilson',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        wallets: {
          create: {
            chainId: 1,
            address: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
            isPrimary: true,
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { email: 'carol@example.com' },
      update: {},
      create: {
        email: 'carol@example.com',
        name: 'Carol Martinez',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
        wallets: {
          create: {
            chainId: 1,
            address: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
            isPrimary: true,
          },
        },
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create demo agents with plans
  const agentsData = [
    {
      name: 'Data Analyst Pro',
      slug: 'data-analyst-pro',
      description: 'AI-powered data analysis agent that transforms raw data into actionable insights. Supports CSV, JSON, and SQL databases.',
      category: 'Analytics',
      tags: ['data', 'analysis', 'visualization', 'charts'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 15420,
      totalRevenue: 5230.50,
    },
    {
      name: 'Code Review Assistant',
      slug: 'code-review-assistant',
      description: 'Automated code review agent that identifies bugs, security vulnerabilities, and suggests improvements.',
      category: 'Coding',
      tags: ['code-review', 'security', 'best-practices'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 28750,
      totalRevenue: 8920.00,
    },
    {
      name: 'Content Writer',
      slug: 'content-writer',
      description: 'Professional content generation agent for blogs, articles, and marketing copy with SEO optimization.',
      category: 'Content',
      tags: ['writing', 'seo', 'marketing', 'blog'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 42100,
      totalRevenue: 12450.75,
    },
    {
      name: 'Customer Support Bot',
      slug: 'customer-support-bot',
      description: 'Intelligent customer support agent that handles inquiries, troubleshooting, and ticket management.',
      category: 'Support',
      tags: ['support', 'customer-service', 'helpdesk'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 95230,
      totalRevenue: 18900.25,
    },
    {
      name: 'Financial Advisor',
      slug: 'financial-advisor',
      description: 'AI financial advisor for portfolio analysis, market trends, and investment recommendations.',
      category: 'Finance',
      tags: ['finance', 'investment', 'portfolio', 'trading'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 8540,
      totalRevenue: 15680.00,
    },
    {
      name: 'Research Assistant',
      slug: 'research-assistant',
      description: 'Academic and market research agent that gathers, synthesizes, and summarizes information from multiple sources.',
      category: 'Research',
      tags: ['research', 'academic', 'synthesis'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 12890,
      totalRevenue: 4560.30,
    },
    {
      name: 'Email Composer',
      slug: 'email-composer',
      description: 'Professional email writing assistant for business communication, follow-ups, and cold outreach.',
      category: 'Communication',
      tags: ['email', 'communication', 'business'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 35620,
      totalRevenue: 7890.45,
    },
    {
      name: 'SQL Query Builder',
      slug: 'sql-query-builder',
      description: 'Natural language to SQL converter with query optimization and explanation capabilities.',
      category: 'Data',
      tags: ['sql', 'database', 'query'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 18930,
      totalRevenue: 6340.80,
    },
    {
      name: 'Marketing Strategist',
      slug: 'marketing-strategist',
      description: 'AI marketing agent for campaign planning, audience analysis, and performance optimization.',
      category: 'Marketing',
      tags: ['marketing', 'strategy', 'campaigns'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 7650,
      totalRevenue: 9870.60,
    },
    {
      name: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      description: 'Design assistant for creating wireframes, UI components, and design system recommendations.',
      category: 'Design',
      tags: ['design', 'ui', 'ux', 'wireframes'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 5420,
      totalRevenue: 3210.90,
    },
    {
      name: 'Legal Document Analyzer',
      slug: 'legal-document-analyzer',
      description: 'Contract review and legal document analysis agent with risk assessment capabilities.',
      category: 'Other',
      tags: ['legal', 'contracts', 'compliance'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 3280,
      totalRevenue: 8540.00,
    },
    {
      name: 'Workflow Automator',
      slug: 'workflow-automator',
      description: 'Process automation agent that creates and manages workflows across multiple tools and platforms.',
      category: 'Automation',
      tags: ['automation', 'workflow', 'integration'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 11450,
      totalRevenue: 5670.35,
    },
    {
      name: 'Sales Coach',
      slug: 'sales-coach',
      description: 'AI sales training agent with objection handling, pitch improvement, and deal analysis.',
      category: 'Sales',
      tags: ['sales', 'coaching', 'deals'],
      status: AgentStatus.DRAFT,
      totalCalls: 0,
      totalRevenue: 0,
    },
    {
      name: 'Security Scanner',
      slug: 'security-scanner',
      description: 'Security vulnerability assessment agent for web applications and infrastructure.',
      category: 'Security',
      tags: ['security', 'vulnerability', 'scanning'],
      status: AgentStatus.PENDING_REVIEW,
      totalCalls: 0,
      totalRevenue: 0,
    },
    {
      name: 'Learning Tutor',
      slug: 'learning-tutor',
      description: 'Personalized education agent for various subjects with adaptive learning paths.',
      category: 'Education',
      tags: ['education', 'tutoring', 'learning'],
      status: AgentStatus.PUBLISHED,
      totalCalls: 22340,
      totalRevenue: 4890.20,
    },
  ];

  const agents = [];
  for (let i = 0; i < agentsData.length; i++) {
    const data = agentsData[i];
    const ownerIndex = i % users.length;

    const agent = await prisma.agent.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ownerUserId: users[ownerIndex].id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        category: data.category,
        tags: data.tags,
        iconUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${data.slug}`,
        status: data.status,
        totalCalls: data.totalCalls,
        totalRevenue: data.totalRevenue,
      },
    });
    agents.push(agent);

    // Create versions
    await prisma.agentVersion.upsert({
      where: { agentId_version: { agentId: agent.id, version: '1.0.0' } },
      update: {},
      create: {
        agentId: agent.id,
        version: '1.0.0',
        changelog: 'Initial release',
        promptTemplate: `You are ${data.name}. ${data.description}`,
        runtimeConfig: { maxTokens: 4096, temperature: 0.7 },
        providerKey: 'openai',
        modelName: 'gpt-4',
        publishedAt: data.status === AgentStatus.PUBLISHED ? new Date() : null,
      },
    });

    // Create pricing plans
    await prisma.pricingPlan.createMany({
      data: [
        {
          agentId: agent.id,
          type: PlanType.FREE,
          name: 'Free',
          price: 0,
          currency: 'USD',
          quota: { calls: 10, tokensPerMonth: 10000 },
          features: ['Basic features', '10 calls/month', 'Community support'],
        },
        {
          agentId: agent.id,
          type: PlanType.SUBSCRIPTION,
          name: 'Pro',
          price: 29,
          currency: 'USD',
          period: 'month',
          quota: { calls: 1000, tokensPerMonth: 500000 },
          features: ['All features', '1000 calls/month', 'Priority support', 'API access'],
        },
        {
          agentId: agent.id,
          type: PlanType.SUBSCRIPTION,
          name: 'Enterprise',
          price: 199,
          currency: 'USD',
          period: 'month',
          quota: { calls: -1, tokensPerMonth: -1 },
          features: ['Unlimited calls', 'Dedicated support', 'Custom integrations', 'SLA'],
        },
      ],
      skipDuplicates: true,
    });

    // Create revenue splits
    await prisma.revenueSplit.createMany({
      data: [
        { agentId: agent.id, recipient: users[ownerIndex].wallets?.[0]?.address ?? '0x0', ratioBps: 7000, kind: 'developer' },
        { agentId: agent.id, recipient: '0x0000000000000000000000000000000000000001', ratioBps: 2000, kind: 'platform' },
        { agentId: agent.id, recipient: '0x0000000000000000000000000000000000000002', ratioBps: 1000, kind: 'dao' },
      ],
      skipDuplicates: true,
    });
  }

  console.log(`Created ${agents.length} agents with plans and versions`);

  // Create sample bills
  const publishedAgents = agents.filter(a => agentsData.find(d => d.slug === a.slug)?.status === AgentStatus.PUBLISHED);
  const bills = [];

  for (let i = 0; i < 10; i++) {
    const agent = publishedAgents[i % publishedAgents.length];
    const payer = users[(i + 1) % users.length];
    const payee = users.find(u => u.id === agent.ownerUserId) ?? users[0];

    const bill = await prisma.bill.create({
      data: {
        payerUserId: payer.id,
        payeeUserId: payee.id,
        agentId: agent.id,
        periodStart: new Date(2026, 0, 1),
        periodEnd: new Date(2026, 0, 31),
        subtotal: (i + 1) * 25.5,
        taxAmount: (i + 1) * 2.55,
        total: (i + 1) * 28.05,
        currency: 'USD',
        status: i < 5 ? BillStatus.PAID : BillStatus.PENDING,
        paidAt: i < 5 ? new Date() : null,
      },
    });
    bills.push(bill);
  }

  console.log(`Created ${bills.length} bills`);

  // Create DAO space and proposals for top agent
  const topAgent = agents[0];
  const daoSpace = await prisma.daoSpace.upsert({
    where: { agentId: topAgent.id },
    update: {},
    create: {
      agentId: topAgent.id,
      name: `${topAgent.name} DAO`,
      chainId: 1,
      governorAddress: '0x1234567890123456789012345678901234567890',
      tokenAddress: '0x0987654321098765432109876543210987654321',
    },
  });

  const proposals = await Promise.all([
    prisma.proposal.create({
      data: {
        daoSpaceId: daoSpace.id,
        proposerId: users[0].id,
        type: 'price_change',
        title: 'Increase Pro plan price to $39',
        body: 'Due to increased operational costs and enhanced features, we propose increasing the Pro plan price from $29 to $39 per month.',
        startAt: new Date(2026, 0, 20),
        endAt: new Date(2026, 0, 27),
        status: ProposalStatus.ACTIVE,
      },
    }),
    prisma.proposal.create({
      data: {
        daoSpaceId: daoSpace.id,
        proposerId: users[1].id,
        type: 'list',
        title: 'Add integration with Slack',
        body: 'Proposal to integrate the agent with Slack for better team collaboration and notifications.',
        startAt: new Date(2026, 0, 15),
        endAt: new Date(2026, 0, 22),
        status: ProposalStatus.SUCCEEDED,
      },
    }),
    prisma.proposal.create({
      data: {
        daoSpaceId: daoSpace.id,
        proposerId: users[2].id,
        type: 'dispute',
        title: 'Resolve billing dispute #1234',
        body: 'User reported incorrect billing for December usage. Proposed resolution: refund 50% of disputed amount.',
        startAt: new Date(2026, 0, 10),
        endAt: new Date(2026, 0, 17),
        status: ProposalStatus.DEFEATED,
      },
    }),
  ]);

  console.log(`Created DAO space with ${proposals.length} proposals`);

  // Create votes for proposals
  for (const proposal of proposals) {
    await prisma.vote.createMany({
      data: users.map((user, idx) => ({
        proposalId: proposal.id,
        voter: `0x${idx.toString().padStart(40, '0')}`,
        support: idx % 2 === 0,
        weight: (idx + 1) * 1000,
        reason: idx % 2 === 0 ? 'I support this proposal' : 'I oppose this proposal',
      })),
      skipDuplicates: true,
    });
  }

  console.log('Created votes for proposals');

  console.log('Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
