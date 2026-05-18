import { spawn } from "node:child_process";

const requiredSecrets = [
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
  const missing = requiredSecrets.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error(`Missing local environment values: ${missing.join(", ")}`);
    console.error(
      "Set them in the current shell, then run npm run sync:vercel-secrets."
    );
    process.exitCode = 1;
    return;
  }

  for (const key of requiredSecrets) {
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
