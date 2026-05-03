'use strict';

(function () {
  const root = window.CPChatHarmony = window.CPChatHarmony || {};
  const localeRaw = (window.app && app.user && app.user.settings && app.user.settings.userLang) ||
    (window.config && (config.userLang || config.defaultLang)) ||
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    'zh-CN';
  const code = String(localeRaw).toLowerCase();
  const short = code.split('-')[0];

  const zh = {
    loading: '加载中...', chatTitle: '聊天室', back: '返回', settings: '设置', sendMessage: '发送消息...', chooseLanguage: '选择语言',
    shoot: '拍摄', album: '相册图片/视频', chatSettings: '聊天设置', translateProvider: '🌐 翻译方式', googleTranslate: '谷歌翻译', aiTranslate: 'AI 翻译',
    aiEndpoint: 'AI 接口 URL', apiKey: 'API Key', model: '模型', wingmanSettings: '🧠 僚机设置', targetGender: '对方性别', relationshipStage: '关系阶段', chatStyle: '聊天风格',
    smartReply: '追问气囊', context: '上下文', contextRounds: '历史轮数', chatFeatures: '✨ 聊天功能', autoTranslateLast: '自动翻译最新对方消息', background: '🖼️ 背景',
    backgroundUpload: '设置自定义背景图片', bgOpacity: '白雾遮罩', clearHistory: '清空本地聊天记录', close: '关闭', save: '保存配置', translateSendTitle: '开启后：输入框内容会翻译成对方语言再发送',
    enabledTranslateSend: '译发已开启', disabledTranslateSend: '译发已关闭', saved: '配置已保存', bgUpdated: '背景图已更新', recordingUnsupported: '当前浏览器不支持录音', uploadFailed: '上传失败',
  };

  const en = Object.assign({}, zh, {
    loading: 'Loading...', chatTitle: 'Chat', back: 'Back', settings: 'Settings', sendMessage: 'Send a message...', chooseLanguage: 'Choose language',
    shoot: 'Camera', album: 'Album image/video', chatSettings: 'Chat settings', translateProvider: '🌐 Translation provider', googleTranslate: 'Google Translate', aiTranslate: 'AI Translate',
    aiEndpoint: 'AI endpoint URL', apiKey: 'API key', model: 'Model', wingmanSettings: '🧠 Wingman settings', targetGender: 'Peer gender', relationshipStage: 'Relationship stage', chatStyle: 'Chat style',
    smartReply: 'Smart replies', context: 'Context', contextRounds: 'History rounds', chatFeatures: '✨ Chat features', autoTranslateLast: 'Auto translate latest peer message', background: '🖼️ Background',
    backgroundUpload: 'Set custom background image', bgOpacity: 'White overlay', clearHistory: 'Clear local chat history', close: 'Close', save: 'Save settings', translateSendTitle: 'When enabled, typed text is translated before sending',
    enabledTranslateSend: 'Translate-send enabled', disabledTranslateSend: 'Translate-send disabled', saved: 'Settings saved', bgUpdated: 'Background updated', recordingUnsupported: 'Recording is not supported by this browser', uploadFailed: 'Upload failed',
  });

  const dicts = {
    'zh': zh,
    'zh-cn': zh,
    'en': en,
    'en-gb': en,
    'my': Object.assign({}, en, { chatSettings: 'ချတ် ဆက်တင်များ', sendMessage: 'စာပို့ရန်...', close: 'ပိတ်မည်', save: 'သိမ်းမည်' }),
    'ja': Object.assign({}, en, { chatSettings: 'チャット設定', sendMessage: 'メッセージを送信...', close: '閉じる', save: '保存' }),
    'ko': Object.assign({}, en, { chatSettings: '채팅 설정', sendMessage: '메시지 보내기...', close: '닫기', save: '저장' }),
    'th': Object.assign({}, en, { chatSettings: 'ตั้งค่าแชต', sendMessage: 'ส่งข้อความ...', close: 'ปิด', save: 'บันทึก' }),
    'vi': Object.assign({}, en, { chatSettings: 'Cài đặt trò chuyện', sendMessage: 'Gửi tin nhắn...', close: 'Đóng', save: 'Lưu' }),
    'ru': Object.assign({}, en, { chatSettings: 'Настройки чата', sendMessage: 'Отправить сообщение...', close: 'Закрыть', save: 'Сохранить' }),
  };

  root.i18n = Object.assign({}, en, dicts[code] || dicts[short] || en);
}());

