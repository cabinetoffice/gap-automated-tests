const fs = require("fs");

function isSandboxEnv() {
  const filenames = fs.readdirSync(__dirname);
  for (let i = 0; i < filenames.length; i++) {
    if (filenames[i] === ".env.qa") return true;
  }
  return false;
}

console.log("Previous environment:", isSandboxEnv() ? "Sandbox" : "QA");

if (isSandboxEnv()) {
  fs.rename(".env", ".env.sandbox", () => {
    fs.rename(".env.qa", ".env", () => {
      console.log("New environment: QA");
    });
  });
} else {
  fs.rename(".env", ".env.qa", () => {
    fs.rename(".env.sandbox", ".env", () => {
      console.log("New environment: Sandbox");
    });
  });
}
