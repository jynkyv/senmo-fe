'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './admin.css';

interface SiteConfig {
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

export default function AdminPage() {
  const router = useRouter();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      
      if (data.authenticated) {
        setAuthenticated(true);
        loadConfig();
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('加载配置失败:', error);
      showMessage('加载配置失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const result = await response.json();
      
      if (result.success) {
        showMessage('配置保存成功！', 'success');
      } else {
        showMessage('保存失败：' + result.error, 'error');
      }
    } catch (error) {
      showMessage('保存失败：' + (error as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (path: string[], value: any) => {
    if (!config) return;
    
    const newConfig = { ...config };
    let current: any = newConfig;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setConfig(newConfig);
  };

  if (checkingAuth) {
    return (
      <div className="admin-container">
        <div className="admin-loading">验证中...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">加载中...</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="admin-container">
        <div className="admin-loading">加载配置失败</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>网站配置管理</h1>
        <button
          onClick={handleLogout}
          className="admin-btn admin-btn-danger"
        >
          退出登录
        </button>
      </div>

      <div className="admin-content">
        {message && (
          <div className={`admin-message admin-message-${messageType}`}>
            {message}
          </div>
        )}

        {/* 下载链接 */}
        <div className="admin-section">
          <h2>📥 下载链接配置</h2>
          
          <div className="admin-subsection">
            <h3>币安 (Binance)</h3>
            <div className="admin-grid">
              <div className="admin-form-group">
                <label>安卓下载链接</label>
                <input
                  type="text"
                  value={config.downloadLinks.binance.android}
                  onChange={(e) => updateConfig(['downloadLinks', 'binance', 'android'], e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-form-group">
                <label>iOS下载链接</label>
                <input
                  type="text"
                  value={config.downloadLinks.binance.ios}
                  onChange={(e) => updateConfig(['downloadLinks', 'binance', 'ios'], e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-form-group">
                <label>备用下载链接</label>
                <input
                  type="text"
                  value={config.downloadLinks.binance.backup}
                  onChange={(e) => updateConfig(['downloadLinks', 'binance', 'backup'], e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="admin-subsection" style={{ marginTop: '1.5rem' }}>
            <h3>欧易 (OKX)</h3>
            <div className="admin-grid">
              <div className="admin-form-group">
                <label>安卓下载链接</label>
                <input
                  type="text"
                  value={config.downloadLinks.okx.android}
                  onChange={(e) => updateConfig(['downloadLinks', 'okx', 'android'], e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-form-group">
                <label>iOS下载链接</label>
                <input
                  type="text"
                  value={config.downloadLinks.okx.ios}
                  onChange={(e) => updateConfig(['downloadLinks', 'okx', 'ios'], e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-form-group">
                <label>备用下载链接</label>
                <input
                  type="text"
                  value={config.downloadLinks.okx.backup}
                  onChange={(e) => updateConfig(['downloadLinks', 'okx', 'backup'], e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="admin-section">
          <h2>📞 联系方式配置</h2>
          <div className="admin-grid">
            <div className="admin-form-group">
              <label>QQ客服</label>
              <input
                type="text"
                value={config.contact.qq}
                onChange={(e) => updateConfig(['contact', 'qq'], e.target.value)}
                placeholder="QQ号码"
              />
            </div>
            <div className="admin-form-group">
              <label>微信客服</label>
              <input
                type="text"
                value={config.contact.wechat}
                onChange={(e) => updateConfig(['contact', 'wechat'], e.target.value)}
                placeholder="微信号"
              />
            </div>
            <div className="admin-form-group">
              <label>QQ交流群</label>
              <input
                type="text"
                value={config.contact.qqGroup}
                onChange={(e) => updateConfig(['contact', 'qqGroup'], e.target.value)}
                placeholder="QQ群号"
              />
            </div>
          </div>
        </div>

        {/* 苹果账号 */}
        <div className="admin-section">
          <h2>🍎 苹果账号信息</h2>
          <div className="admin-grid">
            <div className="admin-form-group">
              <label>邮箱</label>
              <input
                type="text"
                value={config.appleAccount.email}
                onChange={(e) => updateConfig(['appleAccount', 'email'], e.target.value)}
                placeholder="example@icloud.com"
              />
            </div>
            <div className="admin-form-group">
              <label>密码</label>
              <input
                type="text"
                value={config.appleAccount.password}
                onChange={(e) => updateConfig(['appleAccount', 'password'], e.target.value)}
                placeholder="密码"
              />
            </div>
          </div>
        </div>

        {/* 邀请码 */}
        <div className="admin-section">
          <h2>🎁 邀请码配置</h2>
          <div className="admin-form-group">
            <label>推荐码</label>
            <input
              type="text"
              value={config.inviteCode}
              onChange={(e) => updateConfig(['inviteCode'], e.target.value)}
              placeholder="BTC1999"
            />
          </div>
        </div>

        {/* 描述信息 */}
        <div className="admin-section">
          <h2>📝 描述信息配置</h2>
          <div className="admin-form-group">
            <label>苹果账号说明</label>
            <textarea
              value={config.description.appleInfo}
              onChange={(e) => updateConfig(['description', 'appleInfo'], e.target.value)}
              placeholder="输入苹果账号相关说明..."
              rows={5}
            />
          </div>
          <div className="admin-form-group">
            <label>邀请码说明</label>
            <textarea
              value={config.description.inviteInfo}
              onChange={(e) => updateConfig(['description', 'inviteInfo'], e.target.value)}
              placeholder="输入邀请码相关说明..."
              rows={5}
            />
          </div>
        </div>

        {/* 保存按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ minWidth: '120px' }}
          >
            {saving ? '保存中...' : '💾 保存配置'}
          </button>
        </div>
      </div>
    </div>
  );
}
