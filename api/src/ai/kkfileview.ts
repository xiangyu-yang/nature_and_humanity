import { exec, execFile } from 'child_process';

const KKFILEVIEW_PORT = 8012;
const KKFILEVIEW_IMAGE = 'keking/kkfileview:4.1.0';

export async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
}

export async function checkKkFileViewRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('docker ps --filter name=kkfileview --format "{{.Names}}"', (error, stdout) => {
      if (error) {
        resolve(false);
      } else {
        resolve(stdout.trim() === 'kkfileview');
      }
    });
  });
}

export async function checkKkFileViewHealth(url: string = 'http://localhost:8012'): Promise<boolean> {
  try {
    const response = await fetch(`${url}/`, { redirect: 'follow' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function startDocker(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('open -a Docker 2>/dev/null || echo "Docker not found"', (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

export async function waitForDockerReady(maxWaitSeconds: number = 120): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitSeconds * 1000) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const result = await new Promise<string>((resolve, reject) => {
        exec('docker info 2>&1 | head -1', (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout.trim());
        });
      });
      
      if (result.startsWith('Client:')) {
        return true;
      }
    } catch {
      continue;
    }
  }
  
  return false;
}

export async function startKkFileView(forceRestart: boolean = false): Promise<{ success: boolean; message: string }> {
  try {
    const isRunning = await checkKkFileViewRunning();
    
    if (isRunning && !forceRestart) {
      const isHealthy = await checkKkFileViewHealth();
      if (isHealthy) {
        return { success: true, message: 'kkFileView 已在运行' };
      }
    }
    
    if (isRunning) {
      await new Promise<void>((resolve) => {
        exec('docker rm -f kkfileview', () => resolve());
      });
    }
    
    await new Promise<void>((resolve, reject) => {
      exec(`docker run -d --name kkfileview -p ${KKFILEVIEW_PORT}:${KKFILEVIEW_PORT} -e TRUST_HOST="*" --add-host=host.docker.internal:host-gateway ${KKFILEVIEW_IMAGE}`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    const startTime = Date.now();
    const maxWaitSeconds = 60;
    
    while (Date.now() - startTime < maxWaitSeconds * 1000) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (await checkKkFileViewHealth()) {
        return { success: true, message: 'kkFileView 启动成功' };
      }
    }
    
    return { success: false, message: 'kkFileView 启动超时' };
  } catch (error: any) {
    return { success: false, message: `启动失败: ${error.message}` };
  }
}

export async function ensureKkFileViewAvailable(): Promise<{ success: boolean; message: string; url: string }> {
  try {
    const isRunning = await checkKkFileViewRunning();
    
    if (isRunning) {
      const isHealthy = await checkKkFileViewHealth();
      if (isHealthy) {
        return { success: true, message: 'kkFileView 服务正常', url: `http://localhost:${KKFILEVIEW_PORT}` };
      }
    }
    
    let dockerReady = false;
    
    try {
      await new Promise<string>((resolve, reject) => {
        exec('docker info 2>&1 | head -1', (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout.trim());
        });
      });
      dockerReady = true;
    } catch {
      dockerReady = false;
    }
    
    if (!dockerReady) {
      console.log('[kkFileView] Docker 未启动，正在启动 Docker...');
      await startDocker();
      
      const ready = await waitForDockerReady();
      if (!ready) {
        return { 
          success: false, 
          message: '无法启动 Docker，请手动打开 Docker Desktop', 
          url: '' 
        };
      }
    }
    
    console.log('[kkFileView] 正在启动 kkFileView 容器...');
    const result = await startKkFileView(!isRunning);
    
    if (result.success) {
      return { 
        success: true, 
        message: result.message, 
        url: `http://localhost:${KKFILEVIEW_PORT}` 
      };
    } else {
      return { success: false, message: result.message, url: '' };
    }
  } catch (error: any) {
    return { success: false, message: `检测失败: ${error.message}`, url: '' };
  }
}