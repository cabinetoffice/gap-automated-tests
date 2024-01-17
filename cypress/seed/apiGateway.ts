import {
  APIGatewayClient,
  GetUsagePlanKeysCommand,
  DeleteApiKeyCommand,
  CreateApiKeyCommand,
  type UsagePlanKey,
  CreateUsagePlanKeyCommand,
} from "@aws-sdk/client-api-gateway";
import { promisify } from "util";

const region = process.env.AWS_API_GATEWAY_REGION;
const usagePlanId = process.env.API_GATEWAY_USAGE_PLAN_ID;
const accessKeyId = process.env.AWS_API_GATEWAY_ACCESS_KEY;
const secretAccessKey = process.env.AWS_API_GATEWAY_SECRET_KEY;

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

    let count = 0;
    const total = keys.length;
    // Delete each API key
    for (const key of keys) {
      console.log(`Deleting API key with id ${key.id}`);

      await deleteApiKey(key);

      count++;

      console.log("Keys left to delete", total - count);
    }

    console.log("All API keys deleted successfully.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export async function createKeyInAwsApiGatewayUsagePlan(apiKeyName: string) {
  try {
    const apiKeyId = await createApiKey(apiKeyName);
    await associateApiKeyToUsagePlan(apiKeyId);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export async function deleteApiKey(key: UsagePlanKey) {
  try {
    const asyncSleep = promisify(setTimeout);
    const deleteApiKeyCommand = new DeleteApiKeyCommand({ apiKey: key.id });

    await apiGatewayClient.send(deleteApiKeyCommand);
    console.log(`API key with id ${key.id} deleted`);

    await asyncSleep(200);
  } catch (error) {
    console.error("Error in deleteApiKey:", error.message);
  }
}

export async function createApiKey(apiKeyName: string) {
  try {
    const params = {
      name: apiKeyName,
      enabled: true,
      value: apiKeyName + apiKeyName,
    };
    const asyncSleep = promisify(setTimeout);

    const createApiKeyCommand = new CreateApiKeyCommand(params);

    const createApiKeyResponse =
      await apiGatewayClient.send(createApiKeyCommand);
    await asyncSleep(200);

    return createApiKeyResponse.id;
  } catch (error) {
    console.error(
      `Error for key ${apiKeyName}in createApiKey: ${error.message}`,
    );
  }
}

export async function associateApiKeyToUsagePlan(apiKeyId: string) {
  try {
    const asyncSleep = promisify(setTimeout);

    const createUsagePlanKeyCommand = new CreateUsagePlanKeyCommand({
      keyId: apiKeyId,
      usagePlanId,
      keyType: "API_KEY",
    });

    await apiGatewayClient.send(createUsagePlanKeyCommand);

    await asyncSleep(200);
  } catch (error) {
    console.error("Error in associateApiKeyToUsagePlan:", error.message);
  }
}

export async function getKeysFromAwsApiGatewayUsagePlan(): Promise<
  UsagePlanKey[]
> {
  const getUsagePlanKeysCommand = new GetUsagePlanKeysCommand({
    usagePlanId,
    limit: 500,
  });
  const { items: keys } = await apiGatewayClient.send(getUsagePlanKeysCommand);
  return keys;
}
