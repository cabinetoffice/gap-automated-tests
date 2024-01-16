import {
  APIGatewayClient,
  GetUsagePlanKeysCommand,
  DeleteApiKeyCommand,
  CreateApiKeyCommand,
  type UsagePlanKey,
} from "@aws-sdk/client-api-gateway";
import { hashApiKey } from "./apply/helper";

const region = "your-region";
const usagePlanId = "your-usage-plan-id";
const accessKeyId = "your-access-key-id";
const secretAccessKey = "your-secret-access-key";

const apiGatewayClient = new APIGatewayClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export async function removeKeysFromAwsApiGatewayUsagePlan() {
  try {
    const keys = await getKeysFromAwsApiGatewayUsagePlan();
    if (keys.length === 0) {
      console.log("No API keys found in the usage plan.");
      return;
    }

    console.log(`Found ${keys.length} API keys in the usage plan`);
    console.log("API key ids:", keys.map((key) => key.id).join(", "));

    // Delete each API key
    for (const key of keys) {
      console.log(`Deleting API key with id ${key.id}`);

      const deleteApiKeyCommand = new DeleteApiKeyCommand({ apiKey: key.id });
      await apiGatewayClient.send(deleteApiKeyCommand);

      console.log(`API key with id ${key.id} deleted`);
    }

    console.log("All API keys deleted successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export async function createKeyInAwsApiGatewayUsagePlan(apiKeyName: string) {
  try {
    const params = {
      name: apiKeyName,
      enabled: true,
      value: hashApiKey(apiKeyName + apiKeyName),
    };

    const createApiKeyCommand = new CreateApiKeyCommand(params);
    const createApiKeyResponse =
      await apiGatewayClient.send(createApiKeyCommand);

    const apiKeyId = createApiKeyResponse.id;
    console.log(`API key created with ID: ${apiKeyId}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export async function getKeysFromAwsApiGatewayUsagePlan(): Promise<
  UsagePlanKey[]
> {
  const getUsagePlanKeysCommand = new GetUsagePlanKeysCommand({
    usagePlanId,
  });
  const { items: keys } = await apiGatewayClient.send(getUsagePlanKeysCommand);
  return keys;
}
