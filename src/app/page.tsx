'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

interface SiteConfig {
  downloadLinks: {
    binance: { android: string; ios: string; backup: string };
    okx: { android: string; ios: string; backup: string };
  };
  contact: { qq: string; wechat: string; qqGroup: string };
  appleAccount: { email: string; password: string };
  inviteCode: string;
  description: { appleInfo: string; inviteInfo: string };
}

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    // 加载配置
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('加载配置失败:', err));
  }, []);

  useEffect(() => {
    // 复制到剪贴板功能
    (window as any).copyToClipboard = function(elementId: string, message: string) {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const text = element.innerText;
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showNotification(message || '已复制到剪贴板');
        }
      } catch (err) {
        console.error('复制失败:', err);
      }

      document.body.removeChild(textArea);
    };

    // 显示通知
    (window as any).showNotification = function(message: string) {
      const notification = document.getElementById('notification');
      if (!notification) return;
      
      notification.textContent = message;
      notification.classList.add('show');

      setTimeout(() => {
        notification.classList.remove('show');
      }, 2000);
    };


  }, []);

  return (
    <div className="container">
        <div className="first-screen">
          {/* 紧凑头部 */}
          <div className="compact-header">
            <div className="avatar-container">
              <Image 
                src="/static/picture/1.jpg" 
                alt="币圈导航" 
                className="avatar"
                width={80}
                height={80}
                unoptimized
              />
            </div>
            <h1 className="title">认准币圈导航官方正版软件 | 币安下载|欧易下载</h1>
            
            {/* 下载入口 - 首屏核心内容 */}
            <div className="download-section">
              <div className="section-title">
                <i className="fas fa-download"></i>
                立即下载
              </div>

              <div className="download-grid">
                <a 
                  href={config?.downloadLinks.binance.android || 'https://www.maxweb.blue/zh-CN/join?ref=BTC1999'} 
                  className="download-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="download-badge">热门</div>
                  <Image 
                    src="/static/picture/5.jpg" 
                    alt="币安(安卓)" 
                    className="download-icon"
                    width={60}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">币安(安卓)</div>
                  </div>
                </a>
                
                <a 
                  href={config?.downloadLinks.binance.ios || 'https://www.maxweb.blue/zh-CN/join?ref=BTC1999'} 
                  className="download-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="download-badge">热门</div>
                  <Image 
                    src="/static/picture/6.jpg" 
                    alt="币安(iOS)" 
                    className="download-icon"
                    width={60}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">币安(iOS)</div>
                  </div>
                </a>
                
                <a 
                  href={config?.downloadLinks.okx.android || 'https://www.lywebuuz.com/join/BTC1994'} 
                  className="download-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="download-badge">推荐</div>
                  <Image 
                    src="/static/picture/2.jpg" 
                    alt="欧易(安卓)" 
                    className="download-icon"
                    width={60}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">欧易(安卓)</div>
                  </div>
                </a>
                
                <a 
                  href={config?.downloadLinks.okx.ios || 'https://www.lywebuuz.com/join/BTC1994'} 
                  className="download-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="download-badge">推荐</div>
                  <Image 
                    src="/static/picture/3.jpg" 
                    alt="欧易(iOS)" 
                    className="download-icon"
                    width={60}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">欧易(iOS)</div>
                  </div>
                </a>
              </div>
            
              {/* 其他下载链接 */}
              <div className="other-links">
                <div className="section-title">
                  <i className="fas fa-link"></i> 备用下载入口
                </div>

                <div className="link-list">
                  <a 
                    href={config?.downloadLinks.binance.backup || 'https://www.maxweb.red/join?ref=BTC1999'} 
                    className="link-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image 
                      src="/static/picture/7.jpg" 
                      alt="币安备用注册网站" 
                      className="link-icon"
                      width={48}
                      height={48}
                      unoptimized
                    />
                    <div className="link-text">
                      <div className="link-name">币安备用注册网站</div>
                      <div className="link-desc">备用下载渠道</div>
                    </div>
                  </a>
                  
                  <a 
                    href={config?.downloadLinks.okx.backup || 'https://www.lywebuuz.com/join/BTC1994'} 
                    className="link-item"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image 
                      src="/static/picture/4.jpg" 
                      alt="欧易备用注册网站" 
                      className="link-icon"
                      width={48}
                      height={48}
                      unoptimized
                    />
                    <div className="link-text">
                      <div className="link-name">欧易备用注册网站</div>
                      <div className="link-desc">备用下载渠道</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="section-title">
                <i className="fas fa-1x"></i>
                教程专栏
              </div>
              <div className="videos">
                <a href="/jczl/12.html">
                  <div className="imgs">
                  <Image 
                    src="/uploads/image/20250928/133153_647.jpg" 
                    alt="如何使用币安APP交易现货"
                    width={200}
                    height={150}
                    unoptimized
                  />
                  </div>
                  <div className="title">如何使用币安APP交易现货</div>
                </a>
                
                <a href="/jczl/11.html">
                  <div className="imgs">
                  <Image 
                    src="/uploads/image/20250928/133418_539.jpg" 
                    alt="如何使用币安C2C买卖"
                    width={200}
                    height={150}
                    unoptimized
                  />
                  </div>
                  <div className="title">如何使用币安C2C买卖</div>
                </a>
                
                <a href="/jczl/10.html">
                  <div className="imgs">
                  <Image 
                    src="/uploads/image/20250928/133508_939.jpg" 
                    alt="如何使用币安合约"
                    width={200}
                    height={150}
                    unoptimized
                  />
                  </div>
                  <div className="title">如何使用币安合约</div>
                </a>
                
                <a href="/jczl/9.html">
                  <div className="imgs">
                  <Image 
                    src="/uploads/image/20250928/133600_944.jpg" 
                    alt="如何在币安使用加密货币提现"
                    width={200}
                    height={150}
                    unoptimized
                  />
                  </div>
                  <div className="title">如何在币安使用加密货币提现</div>
                </a>
              </div>

              <div className="description" style={{ lineHeight: '1.8' }}>
                <div style={{ textAlign: 'center', marginBottom: '15px', whiteSpace: 'pre-line' }}>
                  {config?.description.appleInfo || '苹果用户下载APP需要登录外网苹果ID\n账号ezsrh21k@icloud.com\n密码Qw112211\n登录会需要填码    找客服拿码就可以了'}
                </div>
                <div style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>
                  {config?.description.inviteInfo || '切记，玩币圈一定要填邀请码，\n 币安只有注册的时候那一次机会!错过了没法重新填!\n填我的邀请码后续每周一会反还你的交易手续费，\n和每月币安精品周边赠送，我的推荐码，BTC1999'}
                </div>
              </div>

              <main>
                <div className="links-container">
                  {/* 联系信息 */}
                  <div className="contact-section">
                    <h3 className="contact-title">
                      <i className="fas fa-headset"></i> 客服支持
                    </h3>

                    <div className="contact-grid">
                      <div className="contact-item">
                        <i className="fab fa-qq contact-icon"></i>
                        <div className="contact-label">QQ客服</div>
                        <div className="contact-value" id="qqGroup">{config?.contact.qq || '17314655'}</div>
                        <button 
                          className="contact-btn" 
                          onClick={() => (window as any).copyToClipboard('qqGroup', 'QQ号已复制')}
                        >
                          复制
                        </button>
                      </div>

                      <div className="contact-item">
                        <i className="fab fa-weixin contact-icon"></i>
                        <div className="contact-label">客服微信</div>
                        <div className="contact-value" id="wechatId">{config?.contact.wechat || 'btc8178'}</div>
                        <button 
                          className="contact-btn" 
                          onClick={() => (window as any).copyToClipboard('wechatId', '微信号已复制')}
                        >
                          复制
                        </button>
                      </div>
                      
                      <div className="contact-item">
                        <i className="fab fa-qq contact-icon"></i>
                        <div className="contact-label">QQ交流群</div>
                        <div className="contact-value" id="qqGroup1">{config?.contact.qqGroup || '1053880542'}</div>
                        <button 
                          className="contact-btn" 
                          onClick={() => (window as any).copyToClipboard('qqGroup1', 'QQ群号已复制')}
                        >
                          复制
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 页脚 */}
                <div className="footer">
                  <p>币安队长咚咚 © 2020-2025</p>
                  <p>提供安全可靠的官方下载渠道</p>
                  <p>QQ：{config?.contact.qq || '17314655'} | 客服微信：{config?.contact.wechat || 'btc8178'}</p>
                </div>
              </main>
            </div>
          </div>

          {/* 浮动联系按钮 */}
          <div className="floating-contact">
            <a 
              href="#qqGroup" 
              className="floating-btn" 
              onClick={(e) => {
                e.preventDefault();
                (window as any).copyToClipboard('qqGroup', 'QQ号已复制');
              }}
            >
              <i className="fab fa-qq"></i>
          </a>
          <a
              href="#wechatId" 
              className="floating-btn" 
              onClick={(e) => {
                e.preventDefault();
                (window as any).copyToClipboard('wechatId', '微信号已复制');
              }}
            >
              <i className="fab fa-weixin"></i>
            </a>
          </div>

          {/* 通知 */}
          <div className="notification" id="notification">内容已复制到剪贴板</div>
        </div>
    </div>
  );
}
