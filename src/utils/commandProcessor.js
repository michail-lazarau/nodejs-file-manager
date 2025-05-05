import { commandRegistry } from './commandRegistry.js';
import { navigationHandlers } from '../commands/navigation.js';
import { fileOperationsHandlers } from '../commands/fileOperations.js';
import { osInfoHandlers } from '../commands/osInfo.js';
import { hashHandlers } from '../commands/hash.js';
import { compressionHandlers } from '../commands/compression.js';

const handlerModules = {
  navigation: navigationHandlers,
  fileOps: fileOperationsHandlers,
  osInfo: osInfoHandlers,
  hash: hashHandlers,
  compression: compressionHandlers
};

/**
 * Validate a command and its arguments
 * @param {string} commandName - Command name
 * @param {string[]} args - Command arguments
 * @returns {boolean} - Whether the command is valid
 */
export const validateCommand = (commandName, args) => {
  const command = commandRegistry[commandName];
  if (!command) return false;
  
  if (args.length < command.args) return false;
  
  if (command.options && !command.options.includes(args[0])) return false;
  
  return true;
}

/**
 * Execute a command
 * @param {string} commandName - Command name
 * @param {string[]} args - Command arguments
 * @param {string} currentDir - Current working directory
 * @returns {Promise<string|null>} - New directory if changed, null otherwise
 */
export const executeCommand = async (commandName, args, currentDir) => {
  const command = commandRegistry[commandName];
  if (!command) throw new Error('Unknown command');
  
  const handlers = handlerModules[command.category];
  if (!handlers) throw new Error(`No handlers for ${command.category}`);
  
  const handler = handlers[commandName];
  if (!handler) throw new Error(`No handler for ${commandName}`);
  
  return await handler(args, currentDir);
}

/**
 * Parse and process a command
 * @param {string} input - User input string
 * @param {string} currentDir - Current working directory
 * @returns {Promise<string|null>} - New directory if changed, null otherwise
 */
export const processCommand = async (input, currentDir) => {
  const parts = input.trim().split(' ');
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  if (!validateCommand(commandName, args)) {
    console.log('Invalid input');
    return null;
  }
  
  try {
    return await executeCommand(commandName, args, currentDir);
  } catch (error) {
    console.log('Operation failed');
    return null;
  }
}
