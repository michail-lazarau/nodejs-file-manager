import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

export const hashHandlers = {
  hash: async ({ args, currentDir }) => {
    const filePath = path.resolve(currentDir, args[0]);
    
    try {
      const hash = createHash('sha256');
      
      await pipeline(
        createReadStream(filePath),
        hash
      );
      
      const fileHash = hash.digest('hex');
      console.log(fileHash);
    } catch (error) {
      throw new Error(`Failed to calculate hash: ${error.message}`);
    }
    
    return null;
  }
};
