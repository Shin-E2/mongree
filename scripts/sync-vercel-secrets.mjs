import { spawn } from "node:child_process";

const optionalSecrets = [
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
];

const environments = ["production", "preview"];

function runVercelEnvAdd(key, environment, value) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx.cmd", ["vercel", "env", "add", key, environment], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: false,
    });

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(output);
        return;
      }
      reject(
        new Error(
          `vercel env add ${key} ${environment} failed with code ${code}\n${errorOutput || output}`
        )
      );
    });

    child.stdin.write(`${value}\n`);
    child.stdin.end();
  });
}

async function main() {
  const configuredSecrets = optionalSecrets.filter((key) => process.env[key]);

  if (configuredSecrets.length === 0) {
    console.log(
      "No optional Vercel secrets found in the current shell. Nothing to sync."
    );
    return;
  }

  for (const key of configuredSecrets) {
    for (const environment of environments) {
      console.log(`Syncing ${key} to ${environment}`);
      await runVercelEnvAdd(key, environment, process.env[key]);
    }
  }

  console.log("Vercel secrets synced. Redeploy production, then run npm run verify:production.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
