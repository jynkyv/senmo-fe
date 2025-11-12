import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'site-config.json');
const isVercel = process.env.VERCEL === '1';

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

// 读取配置
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

// 保存配置
export function saveConfig(config: SiteConfig): void {
  // 在 Vercel 环境中，文件系统是只读的
  if (isVercel) {
    const error = new Error('Vercel 环境中无法直接写入文件系统。请通过 Vercel 环境变量 SITE_CONFIG 来更新配置。');
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

