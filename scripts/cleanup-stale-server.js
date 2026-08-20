import { execSync } from 'child_process';
import os from 'os';
import path from 'path';

// This script safely checks if port 3000 is occupied by a stale FAF Next.js process 
// and terminates it on Windows. It fails gracefully if it's occupied by something else.

const PORT = 3000;
const PROJECT_DIR = process.cwd();
const PROJECT_NAME_IDENTIFIER = path.basename(PROJECT_DIR).toLowerCase();

function cleanupStaleServer() {
  // Only target Windows environments
  if (os.platform() !== 'win32') {
    return;
  }

  try {
    // 1. Find process listening on the port
    const netstatOut = execSync(`netstat -ano | findstr :${PORT}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
    const lines = netstatOut.split('\n').filter(line => line.includes(`:${PORT}`) && line.includes('LISTENING'));
    
    if (lines.length === 0) return; // Port is free

    // Extract unique PIDs
    const pids = [...new Set(lines.map(line => line.trim().split(/\s+/).pop()).filter(Boolean))];

    for (const pid of pids) {
      if (pid === '0') continue;

      // 2. Inspect the process command line
      try {
        const psCommand = `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`;
        const cmdLine = execSync(psCommand, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().toLowerCase();
        
        // 3. Verify it's a Node process running Next.js for THIS project
        const isNode = cmdLine.includes('node.exe') || cmdLine.includes('node ');
        const isNext = cmdLine.includes('next');
        const isThisProject = cmdLine.includes(PROJECT_NAME_IDENTIFIER);

        if (isNode && isNext && isThisProject) {
          console.warn(`[FAF Cleanup] Found stale Next.js server on port ${PORT} (PID: ${pid}). Cleaning up...`);
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
          console.warn(`[FAF Cleanup] Successfully released port ${PORT}.`);
        } else {
          console.warn(`[FAF Cleanup] Warning: Port ${PORT} is occupied by an unrelated process (PID: ${pid}). Safe skip.`);
        }
      } catch {
        console.warn(`[FAF Cleanup] Warning: Could not inspect or kill process on port ${PORT} (PID: ${pid}).`);
      }
    }
  } catch {
    // Graceful failure (e.g., netstat command failed or no listening process found)
  }
}

cleanupStaleServer();
