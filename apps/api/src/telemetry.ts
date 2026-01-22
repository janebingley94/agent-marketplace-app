import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

let sdk: NodeSDK | null = null;

export const setupTelemetry = () => {
  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!endpoint) return;

  sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME ?? 'agent-marketplace-api',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
        process.env.NODE_ENV ?? 'development',
    }),
    traceExporter: new OTLPTraceExporter({ url: endpoint }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  const shutdown = () => sdk?.shutdown();
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};
