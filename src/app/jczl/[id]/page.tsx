'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 页面数据映射
const pageData: Record<string, { title: string; video: string; content: string }> = {
  '12': {
    title: '如何使用币安APP交易现货',
    video: '/uploads/video/20250928/133229_181.mp4',
    content: '怎么提出加密货币 个人一定要看清楚自己选的网络，提错网络可能导致加密货币丢失且无法找回!!!'
  },
  '11': {
    title: '如何使用币安C2C买卖',
    video: '/uploads/video/20250928/133422_244.mp4',
    content: '怎么联系官方人工客服官方客服只存在于APP或官网，其他任何私聊你或自称客服的人都是骗子!!!'
  },
  '10': {
    title: '如何使用币安合约',
    video: '/uploads/video/20250928/133511_979.mp4',
    content: '怎么提出加密货币 个人一定要看清楚自己选的网络，提错网络可能导致加密货币丢失且无法找回!!!'
  },
  '9': {
    title: '如何在币安使用加密货币提现',
    video: '/uploads/video/20250928/133604_511.mp4',
    content: '怎么提出加密货币 个人一定要看清楚自己选的网络，提错网络可能导致加密货币丢失且无法找回!!!'
  }
};

export default function JczlPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState(pageData[id] || null);

  if (!data) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>页面未找到</h1>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh',
      padding: '15px'
    }}>
      <div className="article-container">
        <div className="article-header">
          <h1 className="article-title">{data.title}</h1>
        </div>

        <div className="video-container">
          <div className="video-player">
            <video id="articleVideo" controls style={{ display: 'block', width: '100%', height: 'auto', backgroundColor: '#000' }}>
              <source src={data.video} type="video/mp4" />
              您的浏览器不支持视频播放。
            </video>
          </div>
        </div>

        <div className="article-content">
          <span style={{ whiteSpace: 'normal' }}>{data.content}</span>
        </div>
      </div>
    </div>
  );
}

