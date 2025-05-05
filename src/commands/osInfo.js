import os from 'node:os';

const osCommandHandlers = {
  '--EOL': () => {
    console.log('Default system EOL:');
    console.log(JSON.stringify(os.EOL));
  },
  
  '--cpus': () => {
    const cpus = os.cpus();
    console.log(`Overall amount of CPUs: ${cpus.length}`);
    
    cpus.forEach((cpu, index) => {
      const speedGHz = (cpu.speed / 1000).toFixed(2);
      console.log(`CPU ${index + 1}: ${cpu.model} (${speedGHz} GHz)`);
    });
  },
  
  '--homedir': () => {
    console.log(`Home directory: ${os.homedir()}`);
  },
  
  '--username': () => {
    console.log(`System username: ${os.userInfo().username}`);
  },
  
  '--architecture': () => {
    console.log(`CPU architecture: ${os.arch()}`);
  }
};

export const osInfoHandlers = {
  os: ({ args }) => {
    const option = args[0];
    
    if (!osCommandHandlers[option]) {
      throw new Error('Invalid OS command option');
    }
    
    osCommandHandlers[option]();
    
    return null;
  }
};
