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

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  OpenAI,
  Volcengine,
  Claude,
  Gemini,
  DeepSeek,
  Qwen,
} from '@lobehub/icons';

const { Text } = Typography;

const providerNodes = [
  {
    name: 'OpenAI',
    icon: OpenAI,
    position: 'classic-provider-node-openai',
  },
  {
    name: 'Claude',
    icon: Claude.Color,
    position: 'classic-provider-node-claude',
  },
  {
    name: 'Gemini',
    icon: Gemini.Color,
    position: 'classic-provider-node-gemini',
  },
  {
    name: 'DeepSeek',
    icon: DeepSeek.Color,
    position: 'classic-provider-node-deepseek',
  },
  {
    name: 'Qwen',
    icon: Qwen.Color,
    position: 'classic-provider-node-qwen',
  },
  {
    name: 'Volcengine',
    icon: Volcengine.Color,
    position: 'classic-provider-node-volcengine',
  },
];

const providerMetrics = [
  { value: '30+', label: '模型供应商' },
  { value: '100+', label: '模型计费支持' },
  { value: '1', label: '统一网关' },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='classic-page-fill classic-home-page w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='classic-home-default w-full overflow-x-hidden'>
          {/* Banner 部分 */}
          <div className='classic-home-hero w-full border-b border-semi-color-border relative overflow-x-hidden'>
            {/* 背景模糊晕染球 */}
            <div className='blur-ball blur-ball-indigo' />
            <div className='blur-ball blur-ball-teal' />
            <div className='flex items-center justify-center px-4 pt-24 pb-8'>
              {/* 居中内容区 */}
              <div className='flex flex-col items-center justify-center text-center max-w-4xl mx-auto'>
                <div className='flex flex-col items-center justify-center mb-6 md:mb-8'>
                  <h1
                    className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-semi-color-text-0 leading-tight ${isChinese ? 'tracking-wide md:tracking-wider' : ''}`}
                  >
                    <>
                      {t('统一的')}
                      <br />
                      <span className='shine-text'>{t('大模型接口网关')}</span>
                    </>
                  </h1>
                  <p className='text-base md:text-lg lg:text-xl text-semi-color-text-1 mt-4 md:mt-6 max-w-xl'>
                    {t('多模型统一接入，只需将基址替换为：')}
                  </p>
                  {/* BASE URL 与端点选择 */}
                  <div className='flex flex-col md:flex-row items-center justify-center gap-4 w-full mt-4 md:mt-6 max-w-md'>
                    <Input
                      readonly
                      value={serverAddress}
                      className='flex-1 !rounded-full'
                      size={isMobile ? 'default' : 'large'}
                      suffix={
                        <div className='flex items-center gap-2'>
                          <ScrollList
                            bodyHeight={32}
                            style={{ border: 'unset', boxShadow: 'unset' }}
                          >
                            <ScrollItem
                              mode='wheel'
                              cycled={true}
                              list={endpointItems}
                              selectedIndex={endpointIndex}
                              onSelect={({ index }) => setEndpointIndex(index)}
                            />
                          </ScrollList>
                          <Button
                            type='primary'
                            onClick={handleCopyBaseURL}
                            icon={<IconCopy />}
                            className='!rounded-full'
                          />
                        </div>
                      }
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className='flex flex-row gap-4 justify-center items-center'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='primary'
                      size={isMobile ? 'default' : 'large'}
                      className='!rounded-3xl px-8 py-2'
                      icon={<IconPlay />}
                    >
                      {t('获取密钥')}
                    </Button>
                  </Link>
                  {isDemoSiteMode && statusState?.status?.version ? (
                    <Button
                      size={isMobile ? 'default' : 'large'}
                      className='flex items-center !rounded-3xl px-6 py-2'
                      icon={<IconGithubLogo />}
                      onClick={() =>
                        window.open(
                          'https://github.com/QuantumNous/new-api',
                          '_blank',
                        )
                      }
                    >
                      {statusState.status.version}
                    </Button>
                  ) : (
                    docsLink && (
                      <Button
                        size={isMobile ? 'default' : 'large'}
                        className='flex items-center !rounded-3xl px-6 py-2'
                        icon={<IconFile />}
                        onClick={() => window.open(docsLink, '_blank')}
                      >
                        {t('文档')}
                      </Button>
                    )
                  )}
                </div>

                {/* 模型供应商科技动效 */}
                <div className='classic-provider-network-section mt-12 md:mt-16 lg:mt-20 w-full'>
                  <div className='mb-6 md:mb-8 flex flex-col items-center justify-center gap-2 px-4'>
                    <Text
                      type='tertiary'
                      className='classic-provider-network-kicker'
                    >
                      {t('模型供应商接入网络')}
                    </Text>
                    <Typography.Title
                      heading={3}
                      className='!m-0 !text-xl md:!text-2xl lg:!text-3xl'
                    >
                      {t('一个网关，接入主流大模型生态')}
                    </Typography.Title>
                    <Text
                      type='tertiary'
                      className='max-w-2xl text-sm md:text-base leading-relaxed'
                    >
                      {t(
                        '统一协议转换、智能路由、额度计费与可观测能力，连接 OpenAI、Claude、Gemini、DeepSeek、Qwen 等供应商。',
                      )}
                    </Text>
                  </div>

                  <div className='classic-provider-network-card mx-auto max-w-5xl'>
                    <div className='classic-provider-network-grid' />
                    <div className='classic-provider-network-orbit classic-provider-network-orbit-one' />
                    <div className='classic-provider-network-orbit classic-provider-network-orbit-two' />

                    <svg
                      className='classic-provider-network-lines'
                      viewBox='0 0 920 360'
                      preserveAspectRatio='none'
                      aria-hidden='true'
                    >
                      <path d='M460 180 L155 78' />
                      <path d='M460 180 L460 54' />
                      <path d='M460 180 L765 78' />
                      <path d='M460 180 L160 282' />
                      <path d='M460 180 L460 306' />
                      <path d='M460 180 L760 282' />
                    </svg>

                    <div className='classic-provider-network-core'>
                      <div className='classic-provider-network-core-ring' />
                      <div className='classic-provider-network-core-icon'>
                        API
                      </div>
                      <Text className='classic-provider-network-core-title'>
                        {t('统一网关')}
                      </Text>
                    </div>

                    {providerNodes.map((provider, index) => {
                      const ProviderIcon = provider.icon;
                      return (
                        <div
                          key={provider.name}
                          className={`classic-provider-network-node ${provider.position}`}
                          style={{ animationDelay: `${index * 160}ms` }}
                        >
                          <div className='classic-provider-network-node-inner'>
                            <span className='classic-provider-network-node-icon'>
                              <ProviderIcon size={30} />
                            </span>
                            <span className='classic-provider-network-node-name'>
                              {provider.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className='classic-provider-network-metrics mx-auto max-w-3xl'>
                    {providerMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className='classic-provider-network-metric'
                      >
                        <strong>{metric.value}</strong>
                        <span>{t(metric.label)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='classic-page-fill overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-full border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
