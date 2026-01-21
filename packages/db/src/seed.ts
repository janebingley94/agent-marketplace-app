import { PrismaClient, AgentStatus, BillStatus, ProposalStatus } from '@prisma/client';
import { seedAgents, seedUsers, planTemplates } from './seed-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const users = await Promise.all(
    seedUsers.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          wallets: {
            create: {
              chainId: user.wallet.chainId,
              address: user.wallet.address,
              isPrimary: user.wallet.isPrimary,
            },
          },
        },
      })
    )
  );

  console.log(`Created ${users.length} users`);

  const agents = [];
  for (let i = 0; i < seedAgents.length; i++) {
    const data = seedAgents[i];
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
      data: planTemplates.map((template) => ({
        agentId: agent.id,
        type: template.type,
        name: template.name,
        price: template.price,
        currency: template.currency,
        period: template.period,
        quota: template.quota,
        features: template.features,
      })),
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
  const publishedAgents = agents.filter((agent) =>
    seedAgents.find((data) => data.slug === agent.slug)?.status === AgentStatus.PUBLISHED
  );
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
