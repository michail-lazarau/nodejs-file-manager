#!/usr/bin/env node
import os from 'node:os';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { parseArgs } from 'node:util';
import { processCommand } from './utils/commandProcessor.js';

const { values } = parseArgs({
  options: {
    username: { type: 'string' }
  },
  strict: false,
  allowPositionals: true
});

const username = values.username || 'Anonymous';
const homeDir = os.homedir();
let currentDir = homeDir;

const readlineInterface = readline.createInterface({ input, output });

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${currentDir}`);

const startCLI = async () => {
  try {
    while (true) {
      const input = await readlineInterface.question('> ');
      const trimmedInput = input.trim();
      
      if (trimmedInput === '.exit') {
        break;
      }
      
      if (trimmedInput) {
        const newDir = await processCommand(trimmedInput, currentDir);
        
        if (newDir) {
          currentDir = newDir;
        }
        
        console.log(`You are currently in ${currentDir}`);
      }
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error.message);
  } finally {
    readlineInterface.close();
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

startCLI();
