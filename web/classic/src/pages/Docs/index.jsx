/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import { Button, Card, Tag, Typography } from '@douyinfe/semi-ui';
import {
  IconArrowRight,
  IconCode,
  IconFile,
  IconKey,
  IconSetting,
  IconShield,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

const QUICK_START_STEPS = [
  {
    title: '创建账号',
    description: '注册或登录后进入控制台。',
    icon: <IconArrowRight />,
  },
  {
    title: '生成 API Key',
    description: '在令牌页面创建密钥，并妥善保管。',
    icon: <IconKey />,
  },
  {
    title: '调用兼容端点',
    description: '在你的工具或 SDK 中使用 OpenAI 兼容的基础地址。',
    icon: <IconCode />,
  },
];

const GUIDE_CARDS = [
  {
    title: '身份认证',
    description: '每个 API 请求都通过 Authorization: Bearer 请求头发送你的密钥。',
    icon: <IconShield />,
  },
  {
    title: '模型选择',
    description: '发送请求前，请先从控制台或价格页面选择可用模型。',
    icon: <IconSetting />,
  },
  {
    title: '响应处理',
    description: '在客户端处理普通 JSON 响应和流式 Server-Sent Events。',
    icon: <IconFile />,
  },
];

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/v1/chat/completions',
    description: '用于对话和工具兼容客户端的 Chat Completions API。',
  },
  {
    method: 'POST',
    path: '/v1/embeddings',
    description: '用于向量搜索、检索和语义匹配的嵌入 API。',
  },
  {
    method: 'GET',
    path: '/v1/models',
    description: '列出你的账号和已配置渠道可用的模型。',
  },
];

const CLIENT_CONFIGS = [
  '基础地址：https://your-domain.example.com/v1',
  'API Key：从 控制台 > 令牌 复制令牌',
  '模型：使用模型列表中已启用的模型名称',
];

const requestExample = `curl https://your-domain.example.com/v1/chat/completions \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'`;

const Docs = () => {
  const { t } = useTranslation();

  return (
    <div className='classic-page-fill bg-semi-color-bg-0 pt-[60px]'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12'>
        <Card className='overflow-hidden !rounded-2xl border border-semi-color-border'>
          <div className='flex flex-col gap-5 p-2 md:p-4'>
            <Tag color='blue' prefixIcon={<IconFile />} className='w-fit'>
              {t('文档')}
            </Tag>
            <div className='max-w-3xl'>
              <Title heading={1}>{t('你的网关 API 文档')}</Title>
              <Paragraph className='!text-semi-color-text-1 !text-base md:!text-lg'>
                {t(
                  '将此自托管指南作为账号设置、API Key、兼容端点和客户端配置的起点。',
                )}
              </Paragraph>
            </div>
            <div className='flex flex-wrap gap-3'>
              <Link to='/console/token'>
                <Button theme='solid' type='primary' icon={<IconKey />}>
                  {t('创建 API Key')}
                </Button>
              </Link>
              <Link to='/pricing'>
                <Button theme='borderless'>{t('浏览模型')}</Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {QUICK_START_STEPS.map((step, index) => (
            <Card key={step.title} className='!rounded-xl'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-semi-color-primary'>
                  {step.icon}
                </div>
                <Text type='tertiary'>{String(index + 1).padStart(2, '0')}</Text>
              </div>
              <Title heading={5}>{t(step.title)}</Title>
              <Text type='secondary'>{t(step.description)}</Text>
            </Card>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
          <Card className='!rounded-2xl'>
            <div className='mb-5'>
              <Tag color='green'>{t('请求示例')}</Tag>
              <Title heading={3} className='!mt-3'>
                {t('聊天补全请求')}
              </Title>
              <Text type='secondary'>
                {t('将基础地址、令牌和模型替换为你自己部署中的值。')}
              </Text>
            </div>
            <pre className='overflow-x-auto rounded-xl bg-semi-color-fill-0 p-4 text-sm leading-7 text-semi-color-text-0'>
              <code>{requestExample}</code>
            </pre>
          </Card>

          <div className='flex flex-col gap-6'>
            <Card className='!rounded-2xl'>
              <Title heading={4}>{t('常用端点')}</Title>
              <div className='mt-4 flex flex-col gap-4'>
                {ENDPOINTS.map((endpoint) => (
                  <div key={endpoint.path}>
                    <div className='mb-1 flex flex-wrap items-center gap-2'>
                      <Tag color='blue'>{endpoint.method}</Tag>
                      <code className='text-sm font-medium'>{endpoint.path}</code>
                    </div>
                    <Text type='secondary'>{t(endpoint.description)}</Text>
                  </div>
                ))}
              </div>
            </Card>

            <Card className='!rounded-2xl'>
              <Title heading={4}>{t('客户端配置')}</Title>
              <div className='mt-4 flex flex-col gap-3'>
                {CLIENT_CONFIGS.map((item) => (
                  <div key={item} className='flex gap-2'>
                    <Text type='success'>✓</Text>
                    <Text type='secondary'>{t(item)}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {GUIDE_CARDS.map((card) => (
            <Card key={card.title} className='!rounded-xl'>
              <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-semi-color-primary'>
                {card.icon}
              </div>
              <Title heading={5}>{t(card.title)}</Title>
              <Text type='secondary'>{t(card.description)}</Text>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
