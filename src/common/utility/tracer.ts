import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Config } from '@gwl/nfrsentry-nj';

// Configure Jaeger Exporter
const jaegerExporter = new JaegerExporter({
  endpoint: Config.AppConfig.get('JAEGER_TRACER_URL'), // Update with Jaeger sidecar or service URL
});

// Configure OpenTelemetry SDK with Auto Instrumentations
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-backend', // Your service name
  }),
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK before your application starts
const startSDK = async () => {
    try {
      await sdk.start();  // Force await with async function
    } catch (error) {
      return error;
    }
  };
  
  startSDK();
// Shutdown the SDK gracefully when the process exits
process.on('SIGTERM', async () => {
  await sdk.shutdown();
  process.exit(0);
});
