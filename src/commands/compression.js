import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs/promises';

export const compressionHandlers = {
  compress: async (args, currentDir) => {
    const sourcePath = path.resolve(currentDir, args[0]);
    const destinationPath = path.resolve(currentDir, args[1]);
    
    try {
      const stats = await fs.stat(sourcePath);
      if (!stats.isFile()) {
        throw new Error('Source is not a file');
      }
      
      const brotliCompress = createBrotliCompress();
      
      await pipeline(
        createReadStream(sourcePath),
        brotliCompress,
        createWriteStream(destinationPath)
      );
    } catch (error) {
      throw new Error(`Failed to compress file: ${error.message}`);
    }
    
    return null;
  },
  
  decompress: async (args, currentDir) => {
    const sourcePath = path.resolve(currentDir, args[0]);
    const destinationPath = path.resolve(currentDir, args[1]);
    
    try {
      const stats = await fs.stat(sourcePath);
      if (!stats.isFile()) {
        throw new Error('Source is not a file');
      }
      
      const brotliDecompress = createBrotliDecompress();
      
      await pipeline(
        createReadStream(sourcePath),
        brotliDecompress,
        createWriteStream(destinationPath)
      );
    } catch (error) {
      throw new Error(`Failed to decompress file: ${error.message}`);
    }
    
    return null;
  }
};
