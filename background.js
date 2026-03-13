// background.js - 处理核心捕获逻辑，避免与 popup 焦点冲突

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startCapture') {
    const { tabId, viewportWidth, captureDelay } = message.params;
    handleCapture(tabId, viewportWidth, captureDelay);
    return true; // 表示异步响应
  }
});

async function handleCapture(tabId, viewportWidth, captureDelay) {
  try {
    // 1. 设置视口 (如果需要)
    if (viewportWidth) {
      await chrome.debugger.attach({ tabId }, '1.3');
      const metrics = await chrome.debugger.sendCommand({ tabId }, 'Page.getLayoutMetrics');
      const layoutViewport = metrics.layoutViewport || metrics.visualViewport;
      const height = layoutViewport ? layoutViewport.clientHeight : 800;
      
      // 获取缩放比例
      const [{ result: deviceScaleFactor }] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => window.devicePixelRatio || 1,
      });

      await chrome.debugger.sendCommand({ tabId }, 'Emulation.setDeviceMetricsOverride', {
        width: viewportWidth,
        height: height,
        deviceScaleFactor: deviceScaleFactor,
        mobile: false,
      });
    }

    // 2. 自动滚动加载内容
    await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const getScrollHeight = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        let scrolled = 0;
        const distance = 400;
        while (scrolled < getScrollHeight()) {
          window.scrollBy(0, distance);
          scrolled += distance;
          await new Promise(r => setTimeout(r, 100));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 500));
      }
    });

    // 3. 延迟等待资源加载
    if (captureDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, captureDelay));
    }

    // 4. 注入捕获引擎
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['capture.js'],
      world: 'MAIN',
    });

    // 5. 执行捕获 (触发页面内的复制弹窗)
    await chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: async () => {
        console.log('Web2Figma: Starting capture...');
        // 确保页面获得焦点，以便弹出权限请求
        window.focus();
        try {
          const result = await window.figma.captureForDesign({ selector: 'body', verbose: true });
          if (result && result.success) {
            console.log('Web2Figma: Capture successful, check clipboard!');
          }
        } catch (e) {
          console.error('Web2Figma: Capture failed', e);
        }
      },
    });

  } catch (err) {
    console.error('Web2Figma Background Error:', err);
  } finally {
    // 释放调试器
    if (viewportWidth) {
      chrome.debugger.detach({ tabId }).catch(() => {});
    }
  }
}
