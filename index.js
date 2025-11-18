#!/usr/bin/env node
const { exec } = require("child_process");

// You can customize this URL
const server = "nomasec-labs.ngrok.app"; // replace with your remote server

exec(`ping -c 4 ${server}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
  }
  console.log(stdout);
});
