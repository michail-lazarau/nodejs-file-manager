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
 * Validate command input and return the command if valid
 * @param {string} commandName - Command name
 * @param {string[]} args - Command arguments
 * @returns {Object} - The validated command object
 * @throws {InvalidInputError} - If command or arguments are invalid
 */
export const validateCommand = (commandName, args) => {
    const command = commandRegistry[commandName];
    if (!command) throw new InvalidInputError(`Unknown command: ${commandName}`);
    
    if (args.length < command.args) throw new InvalidInputError(`Insufficient arguments for ${commandName}`);
    
    // Validate options for commands that have them (like 'os')
    if (command.options && !command.options.includes(args[0])) 
      throw new InvalidInputError(`Invalid option for ${commandName}`);
    
    return command;
  };
  
  /**
   * Get the handler function for a command
   * @param {Object} command - Command object from registry
   * @param {string} commandName - Command name
   * @returns {Function} - Handler function for the command
   * @throws {OperationError} - If handler cannot be found
   */
  export const getCommandHandler = (command, commandName) => {
    const handlers = handlerModules[command.category];
    if (!handlers) throw new OperationError(`No handlers for ${command.category}`);
    
    const handler = handlers[commandName];
    if (!handler) throw new OperationError(`No handler for ${commandName}`);
    
    return handler;
  };
  
  /**
   * Execute a command with the given arguments
   * @param {Object} command - Command object from registry
   * @param {string} commandName - Command name
   * @param {string[]} args - Command arguments
   * @param {string} currentDir - Current working directory
   * @returns {Promise<string|null>} - New directory if changed, null otherwise
   */
  export const executeCommand = async (command, commandName, args, currentDir) => {
    const handler = getCommandHandler(command, commandName);
    return await handler(args, currentDir);
  };
  
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
    
    try {
      const command = validateCommand(commandName, args);
      return await executeCommand(command, commandName, args, currentDir);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            console.log('Invalid input');
          } else if (error instanceof OperationError) {
            console.log('Operation failed');
          } else {
            console.error('Unexpected error:', error);
          }
      return null;
    }
  };
