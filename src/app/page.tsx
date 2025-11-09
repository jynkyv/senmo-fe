'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';

export default function Home() {
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

    // 下载卡片悬停效果
    document.querySelectorAll('.download-card').forEach((card) => {
      card.addEventListener('mouseenter', function(this: HTMLElement) {
        this.style.transform = 'translateY(-5px)';
      });

      card.addEventListener('mouseleave', function(this: HTMLElement) {
        this.style.transform = 'translateY(0)';
      });
    });

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
                <div className="download-card">
                  <div className="download-badge">热门</div>
                  <Image 
                    src="/static/picture/5.jpg" 
                    alt="币安(安卓)" 
                    className="download-icon"
                    width={100}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">币安(安卓)</div>
                    <a href="https://www.maxweb.blue/zh-CN/join?ref=BTC1999" className="download-btn">下载</a>
                  </div>
                </div>
                
                <div className="download-card">
                  <div className="download-badge">热门</div>
                  <Image 
                    src="/static/picture/6.jpg" 
                    alt="币安(iOS)" 
                    className="download-icon"
                    width={100}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">币安(iOS)</div>
                    <a href="https://www.maxweb.blue/zh-CN/join?ref=BTC1999" className="download-btn">下载</a>
                  </div>
                </div>
                
                <div className="download-card">
                  <div className="download-badge">推荐</div>
                  <Image 
                    src="/static/picture/2.jpg" 
                    alt="欧易(安卓)" 
                    className="download-icon"
                    width={100}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">欧易(安卓)</div>
                    <a href="https://www.lywebuuz.com/join/BTC1994" className="download-btn">下载</a>
                  </div>
                </div>
                
                <div className="download-card">
                  <div className="download-badge">推荐</div>
        <Image
                    src="/static/picture/3.jpg" 
                    alt="欧易(iOS)" 
                    className="download-icon"
          width={100}
                    height={60}
                    unoptimized
                  />
                  <div className="download-content">
                    <div className="download-title">欧易(iOS)</div>
                    <a href="https://www.lywebuuz.com/join/BTC1994" className="download-btn">下载</a>
                  </div>
                </div>
              </div>
            
              {/* 其他下载链接 */}
              <div className="other-links">
                <div className="section-title">
                  <i className="fas fa-link"></i> 备用下载入口
                </div>

                <div className="link-list">
                  <div className="link-item">
                    <Image 
                      src="/static/picture/7.jpg" 
                      alt="币安备用注册网站" 
                      className="link-icon"
                      width={40}
                      height={40}
                      unoptimized
                    />
                    <div className="link-text">
                      <div className="link-name">币安备用注册网站</div>
                      <div className="link-desc">备用下载渠道</div>
                    </div>
                    <a href="https://www.maxweb.red/join?ref=BTC1999" className="link-btn">访问</a>
                  </div>
                  
                  <div className="link-item">
                    <Image 
                      src="/static/picture/4.jpg" 
                      alt="欧易备用注册网站" 
                      className="link-icon"
                      width={40}
                      height={40}
                      unoptimized
                    />
                    <div className="link-text">
                      <div className="link-name">欧易备用注册网站</div>
                      <div className="link-desc">备用下载渠道</div>
                    </div>
                    <a href="https://www.lywebuuz.com/join/BTC1994" className="link-btn">访问</a>
                  </div>
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
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                  苹果用户下载APP需要登录外网苹果ID<br />
                  账号ezsrh21k@icloud.com<br />
                  密码Qw112211<br />
                  登录会需要填码&nbsp; &nbsp;找客服拿码就可以了
                </div>
                <div style={{ textAlign: 'center' }}>
                  切记，玩币圈一定要填邀请码，<br />
                  &nbsp; 币安只有注册的时候那一次机会!错过了没法重新填!<br />
                  填我的邀请码后续每周一会反还你的交易手续费，<br />
                  和每月币安精品周边赠送，我的推荐码，BTC1999<br />
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
                        <div className="contact-value" id="qqGroup">17314655</div>
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
                        <div className="contact-value" id="wechatId">btc8178</div>
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
                        <div className="contact-value" id="qqGroup1">1053880542</div>
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
                  <p>QQ：17314655 | 客服微信：btc8178</p>
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
