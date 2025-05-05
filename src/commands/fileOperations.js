// src/commands/fileOperations.js
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { stdin as input, stdout as output } from 'node:process';

const noSuchResourceErrorCode = 'ENOENT';
const resourceAlreadyExistsErrorCode = 'EEXIST';
const errorCodes = [noSuchResourceErrorCode, resourceAlreadyExistsErrorCode];

export const fileOperationsHandlers = {
  // Read file and print its content (cat)
  cat: async (args, currentDir) => {
    const filePath = path.resolve(currentDir, args[0]);
    
    try {
      // Use readable stream to read the file
      await pipeline(
        createReadStream(filePath),
        output
      );
      console.log(); // Add newline after file content
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
    
    return null;
  },
  
  // Create empty file (add)
  add: async (args, currentDir) => {
    const filePath = path.resolve(currentDir, args[0]);
    
    try {
      await fs.access(filePath).then(() => {
            const error = new Error('Destination file already exists');
            error.code = resourceAlreadyExistsErrorCode;
            throw error;
        }).catch((error) => {
            return error.code === noSuchResourceErrorCode ? Promise.resolve() : Promise.reject(error);
        });
      
      // Create empty file
      await fs.writeFile(filePath, '');
    } catch (error) {
      throw new Error(`Failed to create file: ${error.message}`);
    }
    
    return null;
  },
  
  // Create new directory (mkdir)
  mkdir: async (args, currentDir) => {
    const dirPath = path.resolve(currentDir, args[0]);
    
    try {
      await fs.mkdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to create directory: ${error.message}`);
    }
    
    return null;
  },
  
  // Rename file (rn)
  rn: async (args, currentDir) => {
    const sourcePath = path.resolve(currentDir, args[0]);
    const targetPath = path.resolve(currentDir, args[1]);
    
    try {
        await fs.access(targetPath).then(() => {
            const error = new Error('Destination file already exists');
            error.code = resourceAlreadyExistsErrorCode;
            throw error;
        }).catch((error) => {
            return error.code === noSuchResourceErrorCode ? Promise.resolve() : Promise.reject(error);
        });
      
      await fs.rename(sourcePath, targetPath);
    } catch (error) {
      throw new Error(`Failed to rename file: ${error.message}`);
    }
    
    return null;
  },
  
  // Copy file (cp)
  cp: async (args, currentDir) => {
    const sourcePath = path.resolve(currentDir, args[0]);
    const targetDir = path.resolve(currentDir, args[1]);
    const fileName = path.basename(sourcePath);
    const targetPath = path.join(targetDir, fileName);
    
    try {
      // Check if source exists and is a file
      const stats = await fs.stat(sourcePath);
      if (!stats.isFile()) {
        throw new Error('Source is not a file');
      }
      
      // Check if target directory exists
      const targetStats = await fs.stat(targetDir);
      if (!targetStats.isDirectory()) {
        throw new Error('Target is not a directory');
      }
      
      // Copy file using streams
      await pipeline(
        createReadStream(sourcePath),
        createWriteStream(targetPath)
      );
    } catch (error) {
      throw new Error(`Failed to copy file: ${error.message}`);
    }
    
    return null;
  },
  
  // Move file (mv)
  mv: async (args, currentDir) => {
    const sourcePath = path.resolve(currentDir, args[0]);
    const targetDir = path.resolve(currentDir, args[1]);
    const fileName = path.basename(sourcePath);
    const targetPath = path.join(targetDir, fileName);
    
    try {
      // Check if source exists and is a file
      const stats = await fs.stat(sourcePath);
      if (!stats.isFile()) {
        throw new Error('Source is not a file');
      }
      
      // Check if target directory exists
      const targetStats = await fs.stat(targetDir);
      if (!targetStats.isDirectory()) {
        throw new Error('Target is not a directory');
      }
      
      // Copy file using streams
      await pipeline(
        createReadStream(sourcePath),
        createWriteStream(targetPath)
      );
      
      // Delete source file after successful copy
      await fs.unlink(sourcePath);
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
    
    return null;
  },
  
  // Delete file (rm)
  rm: async (args, currentDir) => {
    const filePath = path.resolve(currentDir, args[0]);
    
    try {
      // Check if path exists and is a file
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        throw new Error('Path is not a file');
      }
      
      await fs.unlink(filePath);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
    
    return null;
  }
};
