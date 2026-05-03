# NodeBB Plugin: CP Chat Harmony

适配目标：NodeBB `4.10.x` + Harmony 主题聊天页。

这个插件把上传的聊天窗口脚本封装成标准 NodeBB 插件，包含：

- Harmony 移动聊天覆盖层
- 原生 NodeBB 聊天 DOM 同步
- 图片压缩、视频检查、语音录制与上传
- 翻译发送、对方消息翻译、AI 追问气囊
- IndexedDB 本地缓存与媒体缓存清理
- WukongIM bridge 兼容路由：`/bridge/token`、`/bridge/get-history`、`/bridge/revoke`
- ACP 后台设置页
- NodeBB `languages` 多语言目录与运行时 UI 字典
- 非聊天页按需加载，减少 bundle 压力

## 安装

### 从 GitHub 安装

```bash
cd /path/to/nodebb
npm install https://github.com/yourname/nodebb-plugin-cp-chat-harmony.git
./nodebb build
./nodebb restart
```

然后到 ACP → Plugins 启用 `CP Chat Harmony`。

### 本地测试

```bash
cd nodebb-plugin-cp-chat-harmony
npm link
cd /path/to/nodebb
npm link nodebb-plugin-cp-chat-harmony
./nodebb build
./nodebb dev
```

## 配置

ACP → Plugins → CP Chat Harmony：

- `聊天页面路径匹配` 默认 `/chats`
- `Bridge 基础 URL` 留空时只使用 NodeBB 原生聊天；如果有 WukongIM bridge，则填入类似 `https://im.example.com/bridge`
- `WukongIM JS SDK URL` 默认使用 jsDelivr，可改为自托管地址提高稳定性
- `Wukong WebSocket 地址` 可填 `wss://example.com/wkws/`
- 默认语言、消息缓存上限、是否默认启用 AI 功能都可在后台配置

## 性能设计

1. `plugin.json` 只把轻量 loader 编译进 NodeBB 主 bundle。
2. 大体积 `engine.js` 只在聊天页动态加载。
3. 引擎内部保留原脚本的增量渲染、消息裁剪、IndexedDB 持久化和媒体缓存清理。
4. 图片上传前压缩，语音低码率录制，视频限制尺寸/时长。
5. 翻译和 AI 结果有前端缓存，减少重复请求。

## 文件结构

```text
library.js
plugin.json
lib/controllers.js
lib/settings.js
public/src/client.js
public/src/i18n.js
public/src/engine.js
public/src/admin.js
scss/client.scss
scss/admin.scss
templates/admin/plugins/cp-chat-harmony.tpl
languages/*/cp-chat-harmony.json
```

## 注意

- 这个包不内置 WukongIM 服务端；如果你已有 `/bridge` 服务，可以在 ACP 里配置 `Bridge 基础 URL` 让插件代理。
- 如果只使用 NodeBB 原生聊天，Bridge 留空即可，插件仍会用原生输入框发送文本/媒体。
- 上线前建议把 WukongIM SDK 自托管，避免外部 CDN 不稳定。
