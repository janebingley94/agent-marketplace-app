import React from 'react';
import { AgentForm } from '@/components/studio/AgentForm';

export default function EditAgentPage() {
  return (
    <AgentForm
      mode="edit"
      initialValues={{
        name: 'OracleInsights V4',
        description: 'High-frequency blockchain data aggregator for DeFi protocols.',
        address: '0x71C765...f44E',
        callFee: '2.90',
        marginDeposit: 260,
        collectionAddress: '0x71C765...f44E',
      }}
    />
  );
}
