export const commandRegistry = {
    // MARK: - Navigation commands
    up: { 
      category: 'navigation',
      args: 0 
    },
    cd: { 
      category: 'navigation',
      args: 1 
    },
    ls: { 
      category: 'navigation',
      args: 0 
    },
    
    // MARK: - File operations
    cat: { 
      category: 'fileOps',
      args: 1 
    },
    add: { 
      category: 'fileOps',
      args: 1 
    },
    rn: { 
      category: 'fileOps',
      args: 2 
    },
    cp: { 
      category: 'fileOps',
      args: 2 
    },
    mv: { 
      category: 'fileOps',
      args: 2 
    },
    rm: { 
      category: 'fileOps',
      args: 1 
    },
    mkdir: { 
      category: 'fileOps',
      args: 1 
    },
    
    // MARK: - OS info
    os: { 
      category: 'osInfo',
      args: 1,
      options: ['--EOL', '--cpus', '--homedir', '--username', '--architecture']
    },
    
    // MARK: - Hash calculation
    hash: { 
      category: 'hash',
      args: 1 
    },
    
    // MARK: - Compression
    compress: { 
      category: 'compression',
      args: 2 
    },
    decompress: { 
      category: 'compression',
      args: 2 
    }
  };