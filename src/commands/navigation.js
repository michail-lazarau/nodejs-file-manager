import fs from 'node:fs/promises';
import path from 'node:path';
import { formatTable } from '../utils/tableFormatter.js';

export const navigationHandlers = {
  /**
   * Go up one directory
   * @param {string} currentDir - Current working directory
   * @returns {string} - New directory
   */
  up: (currentDir) => {
    const parentDir = path.dirname(currentDir);
    
    // Check if trying to go above root directory
    if (parentDir === currentDir) {
      return currentDir; // Already at root, do nothing
    }
    
    return parentDir;
  },

  /**
   * Change to specified directory
   * @param {string[]} args - Command arguments
   * @param {string} currentDir - Current working directory
   * @returns {Promise<string>} - New directory
   */
  cd: async (args, currentDir) => {
    const targetPath = args[0];
    let newPath;
    
    if (path.isAbsolute(targetPath)) {
      newPath = targetPath;
    } else {
      newPath = path.resolve(currentDir, targetPath);
    }
    
    const stats = await fs.stat(newPath);
    if (!stats.isDirectory()) {
      throw new Error('Not a directory');
    }
    
    return newPath;
  },

  /**
   * List directory contents
   * @param {string} currentDir - Current working directory
   * @returns {null} - No directory change
   */
  ls: async (currentDir) => {
    const items = await fs.readdir(currentDir, { withFileTypes: true });
    
    // Sort: directories first, then files, both in alphabetical order
    const sortedItems = items.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    const tableData = sortedItems.map((item, index) => {
      const type = item.isDirectory() ? 'directory' : 'file';
      return { index, name: item.name, type };
    });

    formatTable(tableData);
    
    return null; // No directory change
  }
};