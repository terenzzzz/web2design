# Web2Figma Capture

一个强大的 Chrome 插件，旨在将网页 DOM 元素一键转换为 Figma 可编辑图层。基于高效的捕获引擎，支持复杂的样式计算、React Fiber 状态提取以及懒加载内容处理。

## 🚀 核心功能

- **一键捕获**：将当前页面或特定元素转换为 Figma JSON 格式并自动复制到剪贴板。
- **视口模拟 (Viewport Emulation)**：支持自定义视口宽度（如 1440px, 375px），通过 Chrome Debugger Protocol (CDP) 精确模拟。
- **自动滚动加载**：自动模拟用户滚动行为，触发页面懒加载内容，确保捕获完整。
- **捕获延迟控制**：可设置自定义延迟，等待动态资源（如图片、动画）渲染完成。
- **React 支持**：尝试识别并提取 React Fiber 节点信息，保持 Figma 中的组件结构。

## 📦 安装指南

1. 下载或克隆本仓库到本地。
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
3. 开启右上角的 **"开发者模式" (Developer mode)**。
4. 点击 **"加载已解压的扩展程序" (Load unpacked)**。
5. 选择本项目所在的文件夹。

## 🛠 使用说明

1. 在目标网页上点击浏览器右上角的插件图标。
2. **Viewport Width (可选)**：输入你想要模拟的宽度（例如 `1440`），留空则使用当前浏览器窗口宽度。
3. **Capture Delay (可选)**：输入延迟时间（毫秒），建议复杂页面设置 `1000-2000`。
4. 点击 **"Capture Page"**。
5. 插件会自动滚动页面、调整视口并进行捕获。
6. 看到 "Copied to clipboard!" 提示后，打开 Figma。
7. 在 Figma 中直接粘贴即可生成图层。

## 📄 文件结构

- `manifest.json`: 插件配置文件（V3 版本）。
- `popup.html/js`: 插件交互界面与逻辑调度。
- `capture.js`: 核心转换引擎，负责 DOM 解析与序列化。

## ⚠️ 注意事项

- 插件需要 `debugger` 权限来精确控制视口大小，使用时浏览器顶部会出现调试提示，这是正常现象。
- 对于极其复杂的 Canvas 或 WebGL 内容，捕获效果可能受限。

---
*Inspired by html.to.design
