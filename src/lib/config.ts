import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'site-config.json');
const isVercel = process.env.VERCEL === '1';
// 在本地开发时，如果设置了 KV_URL，也可以使用 KV
const hasKVUrl = !!(process.env.KV_URL || process.env.KV_REST_API_URL);
const CONFIG_KEY = 'site_config';

export interface SiteConfig {
  admin?: {
    password: string;
  };
  downloadLinks: {
    binance: {
      android: string;
      ios: string;
      backup: string;
    };
    okx: {
      android: string;
      ios: string;
      backup: string;
    };
  };
  contact: {
    qq: string;
    wechat: string;
    qqGroup: string;
  };
  appleAccount: {
    email: string;
    password: string;
  };
  inviteCode: string;
  description: {
    appleInfo: string;
    inviteInfo: string;
  };
}

// 默认配置
function getDefaultConfig(): SiteConfig {
  return {
    admin: {
      password: 'admin123'
    },
    downloadLinks: {
      binance: {
        android: '',
        ios: '',
        backup: ''
      },
      okx: {
        android: '',
        ios: '',
        backup: ''
      }
    },
    contact: {
      qq: '',
      wechat: '',
      qqGroup: ''
    },
    appleAccount: {
      email: '',
      password: ''
    },
    inviteCode: '',
    description: {
      appleInfo: '',
      inviteInfo: ''
    }
  };
}

// 从环境变量读取配置
function getConfigFromEnv(): SiteConfig | null {
  try {
    const configJson = process.env.SITE_CONFIG;
    if (configJson) {
      return JSON.parse(configJson);
    }
  } catch (error) {
    console.error('从环境变量读取配置失败:', error);
  }
  return null;
}

// 检查 KV 配置状态
export async function checkKVStatus(): Promise<{
  available: boolean;
  hasUrl: boolean;
  error?: string;
}> {
  // 在本地开发时，如果设置了 KV_URL，也可以使用 KV
  if (!isVercel && !hasKVUrl) {
    return { available: false, hasUrl: false, error: '非 Vercel 环境且未设置 KV_URL' };
  }

  const url = process.env.KV_URL || process.env.KV_REST_API_URL;
  if (!url) {
    return {
      available: false,
      hasUrl: false,
      error: 'KV_URL 环境变量未设置。请在 Vercel 控制台中将 KV 数据库连接到项目。'
    };
  }

  try {
    const { createClient } = await import('redis');
    const client = createClient({ url });
    
    if (!client.isOpen) {
      await client.connect();
    }
    
    // 测试连接
    await client.ping();
    
    await client.quit();
    
    return { available: true, hasUrl: true };
  } catch (error: any) {
    return {
      available: false,
      hasUrl: true,
      error: `连接失败: ${error?.message || '未知错误'}`
    };
  }
}

// 获取 Redis 客户端（仅在需要时导入）
async function getRedisClient() {
  // 在 Vercel 环境或本地设置了 KV_URL 时，可以使用 KV
  if (!isVercel && !hasKVUrl) return null;
  
  try {
    const { createClient } = await import('redis');
    
    // Vercel KV 会提供 KV_URL 环境变量
    const url = process.env.KV_URL || process.env.KV_REST_API_URL;
    if (!url) {
      console.warn('KV_URL 环境变量未设置');
      return null;
    }
    
    const client = createClient({
      url: url
    });
    
    // 连接 Redis
    if (!client.isOpen) {
      await client.connect();
    }
    
    return client;
  } catch (error) {
    console.error('无法初始化 Redis 客户端:', error);
    return null;
  }
}

// 读取配置（同步版本，用于向后兼容）
export function getConfig(): SiteConfig {
  // 在 Vercel 环境中，优先从环境变量读取
  if (isVercel) {
    const envConfig = getConfigFromEnv();
    if (envConfig) {
      return envConfig;
    }
  }

  // 尝试从文件读取
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('读取配置文件失败:', error);
    // 返回默认配置
    return getDefaultConfig();
  }
}

// 异步读取配置（支持 KV）
export async function getConfigAsync(): Promise<SiteConfig> {
  // 在 Vercel 环境或本地设置了 KV_URL 时，尝试从 KV 读取
  if (isVercel || hasKVUrl) {
    let redis = null;
    try {
      redis = await getRedisClient();
      if (redis) {
        const configStr = await redis.get(CONFIG_KEY);
        if (configStr) {
          const kvConfig = JSON.parse(configStr) as SiteConfig;
          return kvConfig;
        }
      }
    } catch (error) {
      console.error('从 KV 读取配置失败:', error);
    } finally {
      // 关闭连接
      if (redis && redis.isOpen) {
        try {
          await redis.quit();
        } catch (e) {
          // 忽略关闭错误
        }
      }
    }

    // 如果 KV 不可用，尝试从环境变量读取
    const envConfig = getConfigFromEnv();
    if (envConfig) {
      return envConfig;
    }
  }

  // 尝试从文件读取
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('读取配置文件失败:', error);
    // 返回默认配置
    return getDefaultConfig();
  }
}

// 保存配置（同步版本，用于向后兼容）
export function saveConfig(config: SiteConfig): void {
  // 在 Vercel 环境中，文件系统是只读的
  if (isVercel) {
    const error = new Error('Vercel 环境中无法直接写入文件系统。请使用 saveConfigAsync() 函数。');
    console.error('保存配置文件失败:', error);
    throw error;
  }

  // 在开发环境中，写入文件
  try {
    // 确保目录存在
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('保存配置文件失败:', error);
    throw error;
  }
}

// 异步保存配置（支持 KV）
export async function saveConfigAsync(config: SiteConfig): Promise<void> {
  // 在 Vercel 环境或本地设置了 KV_URL 时，使用 KV 存储
  if (isVercel || hasKVUrl) {
    let redis = null;
    try {
      redis = await getRedisClient();
      if (redis) {
        // 将配置序列化为 JSON 字符串存储
        await redis.set(CONFIG_KEY, JSON.stringify(config));
        return;
      } else {
        throw new Error('Vercel KV 未配置。请在 Vercel 项目中启用 KV 存储，并确保 KV_URL 环境变量已设置。');
      }
    } catch (error: any) {
      console.error('保存配置到 KV 失败:', error);
      throw new Error(`保存配置失败: ${error?.message || '未知错误'}`);
    } finally {
      // 关闭连接（如果需要）
      if (redis && redis.isOpen) {
        try {
          await redis.quit();
        } catch (e) {
          // 忽略关闭错误
        }
      }
    }
  }

  // 在开发环境中，写入文件
  try {
    // 确保目录存在
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('保存配置文件失败:', error);
    throw error;
  }
}

