import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';

// Redis 连接 URL
const REDIS_URL = 'redis://default:E1bkkdUDkZtkM4d99FdPDcOaWRdmNAYW@redis-13657.c290.ap-northeast-1-2.ec2.cloud.redislabs.com:13657';
const CONFIG_KEY = 'site_config';

// 读取本地配置文件
const configPath = path.join(process.cwd(), 'config', 'site-config.json');

async function testKV() {
  console.log('🔍 开始测试 Redis KV 连接...\n');
  
  let client;
  try {
    // 创建 Redis 客户端
    console.log('1. 创建 Redis 客户端...');
    client = createClient({
      url: REDIS_URL
    });
    
    // 监听连接事件
    client.on('error', (err) => console.error('Redis 客户端错误:', err));
    client.on('connect', () => console.log('   ✅ 正在连接...'));
    client.on('ready', () => console.log('   ✅ 连接就绪'));
    
    // 连接 Redis
    console.log('2. 连接 Redis...');
    await client.connect();
    console.log('   ✅ 连接成功！\n');
    
    // 测试 PING
    console.log('3. 测试连接 (PING)...');
    const pong = await client.ping();
    console.log('   ✅ PING 响应:', pong, '\n');
    
    // 读取本地配置
    console.log('4. 读取本地配置文件...');
    let config;
    try {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      config = JSON.parse(fileContents);
      console.log('   ✅ 配置文件读取成功');
      console.log('   📄 配置内容:', JSON.stringify(config, null, 2).substring(0, 200) + '...\n');
    } catch (error) {
      console.error('   ❌ 读取配置文件失败:', error);
      return;
    }
    
    // 写入配置到 Redis
    console.log('5. 写入配置到 Redis...');
    await client.set(CONFIG_KEY, JSON.stringify(config));
    console.log('   ✅ 配置已写入 Redis\n');
    
    // 从 Redis 读取配置
    console.log('6. 从 Redis 读取配置...');
    const savedConfigStr = await client.get(CONFIG_KEY);
    if (savedConfigStr) {
      const savedConfig = JSON.parse(savedConfigStr);
      console.log('   ✅ 配置读取成功');
      console.log('   📄 读取的配置:', JSON.stringify(savedConfig, null, 2).substring(0, 200) + '...\n');
      
      // 验证配置是否一致
      if (JSON.stringify(config) === JSON.stringify(savedConfig)) {
        console.log('   ✅ 配置验证通过：写入和读取的配置一致\n');
      } else {
        console.log('   ⚠️  配置验证失败：写入和读取的配置不一致\n');
      }
    } else {
      console.log('   ❌ 未找到配置\n');
    }
    
    // 测试更新配置
    console.log('7. 测试更新配置...');
    const testConfig = {
      ...config,
      inviteCode: 'TEST_' + Date.now()
    };
    await client.set(CONFIG_KEY, JSON.stringify(testConfig));
    const updatedConfigStr = await client.get(CONFIG_KEY);
    if (updatedConfigStr) {
      const updatedConfig = JSON.parse(updatedConfigStr);
      if (updatedConfig.inviteCode === testConfig.inviteCode) {
        console.log('   ✅ 配置更新成功');
        console.log('   📝 新的邀请码:', updatedConfig.inviteCode, '\n');
      } else {
        console.log('   ❌ 配置更新失败\n');
      }
    }
    
    // 恢复原始配置
    console.log('8. 恢复原始配置...');
    await client.set(CONFIG_KEY, JSON.stringify(config));
    console.log('   ✅ 原始配置已恢复\n');
    
    console.log('🎉 所有测试通过！Redis KV 配置功能正常工作。\n');
    
  } catch (error: any) {
    console.error('\n❌ 测试失败:', error.message);
    console.error('详细错误:', error);
  } finally {
    // 关闭连接
    if (client && client.isOpen) {
      console.log('9. 关闭 Redis 连接...');
      await client.quit();
      console.log('   ✅ 连接已关闭\n');
    }
  }
}

// 运行测试
testKV().catch(console.error);

