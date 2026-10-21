import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { api } from '../../src/shared/api';
import { useLang } from '../../src/shared/i18n';
import { Btn, H, Screen } from '../../src/shared/ui';
import { C } from '../../src/shared/theme';

// Chatbot hỏi đáp: backend gọi Gemini, trả lời theo ngôn ngữ người dùng đang chọn
export default function Chat() {
  const { t, lang } = useLang();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const list = useRef(null);

  useEffect(() => { setMsgs([{ role: 'model', text: t('chat_welcome') }]); }, [lang]);
  useEffect(() => { setTimeout(() => list.current?.scrollToEnd({ animated: true }), 50); }, [msgs, busy]);

  const send = async () => {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'user', text: q }];
    setMsgs(next); setText(''); setBusy(true);
    try {
      const r = await api('/api/chat', { method: 'POST', body: { message: q, lang, history: msgs.slice(1) } });
      setMsgs([...next, { role: 'model', text: r.reply }]);
    } catch (e) {
      setMsgs([...next, { role: 'model', text: '⚠️ ' + e.message }]);
    }
    setBusy(false);
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <View style={{ padding: 16, paddingBottom: 4 }}><H>🤖 {t('tab_chat')}</H></View>
        <FlatList ref={list} data={msgs} keyExtractor={(_, i) => String(i)} contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={{ alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', marginBottom: 10,
              backgroundColor: item.role === 'user' ? C.primary : '#fff', borderRadius: 16, padding: 12,
              borderWidth: item.role === 'user' ? 0 : 1, borderColor: C.border }}>
              <Text style={{ color: item.role === 'user' ? '#fff' : C.text, lineHeight: 21 }}>{item.text}</Text>
            </View>
          )}
          ListFooterComponent={busy ? <ActivityIndicator color={C.primary} style={{ alignSelf: 'flex-start', margin: 8 }} /> : null} />
        <View style={{ flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: C.border, backgroundColor: '#fff', alignItems: 'center' }}>
          <TextInput value={text} onChangeText={setText} placeholder={t('chat_ph')} onSubmitEditing={send} returnKeyType="send"
            style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 }} />
          <Btn small title={t('send')} onPress={send} disabled={busy || !text.trim()} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
