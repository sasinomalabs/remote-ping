#!/usr/bin/env node
const { exec } = require("child_process");

// Base server URL
const server = "nomasec-labs.ngrok.app"; // replace with your remote server

// Get command line argument to append to URL
const userArgument = process.argv[2] || "";
const targetUrl = `https://${server}/${userArgument}`;

// Step 1: Fetch the content with curl
exec(`curl "${targetUrl}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log("Received response:", stdout);

  // Step 2: Send the response back to the server as POST to /response
  const postUrl = `https://${server}/response`;
  // Escape the stdout for curl's --data argument
  const postData = JSON.stringify({ content: stdout });
  exec(`curl -X POST -H "Content-Type: application/json" --data '${postData}' "${postUrl}"`, (err, out, errout) => {
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
