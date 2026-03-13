document.addEventListener('DOMContentLoaded', async () => {
  const captureBtn = document.getElementById('capture-btn');
  const statusEl = document.getElementById('status');
  const viewportWidthEl = document.getElementById('viewport-width');
  const captureDelayEl = document.getElementById('capture-delay');

  // Load saved settings
  const settings = await chrome.storage.local.get(['viewportWidth', 'captureDelay']);
  if (settings.viewportWidth) viewportWidthEl.value = settings.viewportWidth;
  if (settings.captureDelay) captureDelayEl.value = settings.captureDelay;

  captureBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const viewportWidth = parseInt(viewportWidthEl.value, 10) || null;
    const captureDelay = parseInt(captureDelayEl.value, 10) || 0;

    // 保存设置
    await chrome.storage.local.set({ 
      viewportWidth: viewportWidthEl.value, 
      captureDelay: captureDelayEl.value 
    });

    // 发送指令给 background.js 处理后台逻辑
    chrome.runtime.sendMessage({
      action: 'startCapture',
      params: {
        tabId: tab.id,
        viewportWidth,
        captureDelay
      }
    });

    // 立即关闭 popup，将焦点还给页面以弹出权限申请
    window.close();
  });
});
