import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'config', 'site-config.json');

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

// 读取配置
export function getConfig(): SiteConfig {
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('读取配置文件失败:', error);
    // 返回默认配置
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
}

// 保存配置
export function saveConfig(config: SiteConfig): void {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.error('保存配置文件失败:', error);
    throw error;
  }
}

