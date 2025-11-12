import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'site-config.json');
const isVercel = process.env.VERCEL === '1';
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

// 获取 Vercel KV 客户端（仅在需要时导入）
async function getKVClient() {
  if (!isVercel) return null;
  
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch (error) {
    console.error('无法初始化 Vercel KV:', error);
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
  // 在 Vercel 环境中，尝试从 KV 读取
  if (isVercel) {
    try {
      const kv = await getKVClient();
      if (kv) {
        const kvConfig = await kv.get<SiteConfig>(CONFIG_KEY);
        if (kvConfig) {
          return kvConfig;
        }
      }
    } catch (error) {
      console.error('从 KV 读取配置失败:', error);
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
  // 在 Vercel 环境中，使用 KV 存储
  if (isVercel) {
    try {
      const kv = await getKVClient();
      if (kv) {
        await kv.set(CONFIG_KEY, config);
        return;
      } else {
        throw new Error('Vercel KV 未配置。请在 Vercel 项目中启用 KV 存储。');
      }
    } catch (error: any) {
      console.error('保存配置到 KV 失败:', error);
      throw new Error(`保存配置失败: ${error?.message || '未知错误'}`);
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

