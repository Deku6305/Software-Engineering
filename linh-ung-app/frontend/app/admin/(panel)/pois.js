import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { api } from '../../../src/shared/api';
import { useAuth } from '../../../src/shared/auth';
import { usePoll } from '../../../src/shared/hooks';
import { Btn, Card, Field, H, Screen } from '../../../src/shared/ui';
import { C } from '../../../src/shared/theme';

const EMPTY = { code: '', lat: '', lng: '', radius: '10', viTitle: '', viNar: '', enTitle: '', enNar: '' };

export default function Pois() {
  const { token } = useAuth('admin');
  const [pois, setPois] = useState([]);
  const [form, setForm] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const { reload } = usePoll(async () => setPois(await api('/api/admin/pois', { token })), 20000, [token]);

  const remove = (p) => Alert.alert('Xoá điểm di tích?', `${p.title}\n(Xoá luôn thuyết minh và thống kê lượt nghe của điểm này)`, [
    { text: 'Huỷ', style: 'cancel' },
    { text: 'Xoá', style: 'destructive', onPress: async () => {
      try { await api(`/api/admin/pois/${p.id}`, { method: 'DELETE', token }); reload(); } catch (e) { Alert.alert('Lỗi', e.message); }
    } },
  ]);

  const useHere = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return setErr('Chưa cấp quyền vị trí');
    const p = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setForm((f) => ({ ...f, lat: String(p.coords.latitude.toFixed(6)), lng: String(p.coords.longitude.toFixed(6)) }));
  };

  const save = async () => {
    setBusy(true); setErr(null);
    try {
      const translations = { vi: { title: form.viTitle, narration: form.viNar } };
      if (form.enTitle.trim() && form.enNar.trim()) translations.en = { title: form.enTitle, narration: form.enNar };
      await api('/api/admin/pois', { method: 'POST', token, body: {
        code: form.code || undefined, lat: parseFloat(form.lat), lng: parseFloat(form.lng),
        radius: parseInt(form.radius, 10) || 10, translations } });
      setForm(null); reload();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        <Btn title="＋ Thêm điểm di tích" onPress={() => { setErr(null); setForm({ ...EMPTY }); }} style={{ marginBottom: 12 }} />
        {pois.map((p) => (
          <Card key={p.id}>
            <Text style={{ fontWeight: '800', fontSize: 16, color: C.text }}>{p.title}</Text>
            <Text style={{ color: C.muted, marginTop: 2 }}>{p.code} · bán kính {p.radius} m</Text>
            <Text style={{ color: C.muted }}>{p.lat.toFixed(5)}, {p.lng.toFixed(5)}</Text>
            <Text style={{ color: C.primary, marginTop: 2 }}>🎧 {p.listens} lượt nghe · ngôn ngữ: {(p.langs || []).join(', ')}</Text>
            <Btn small kind="danger" style={{ marginTop: 8, alignSelf: 'flex-start' }} title="🗑 Xoá" onPress={() => remove(p)} />
          </Card>
        ))}
      </ScrollView>

      <Modal visible={!!form} animationType="slide" onRequestClose={() => setForm(null)}>
        {form ? (
          <Screen>
            <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
              <H style={{ marginBottom: 12 }}>Thêm điểm di tích (POI)</H>
              <Field label="Mã POI (tuỳ chọn)" autoCapitalize="characters" value={form.code} onChangeText={set('code')} />
              <Field label="Tiêu đề (Tiếng Việt) *" value={form.viTitle} onChangeText={set('viTitle')} />
              <Field label="Nội dung thuyết minh (Tiếng Việt) *" multiline value={form.viNar} onChangeText={set('viNar')} />
              <Field label="Title (English) – tuỳ chọn" value={form.enTitle} onChangeText={set('enTitle')} />
              <Field label="Narration (English) – tuỳ chọn" multiline value={form.enNar} onChangeText={set('enNar')} />
              <Text style={{ color: C.muted, marginBottom: 10, fontSize: 12 }}>Các ngôn ngữ khác (中文, 한국어…) sẽ được Gemini tự dịch khi có khách nghe.</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}><Field label="Vĩ độ *" keyboardType="numeric" value={form.lat} onChangeText={set('lat')} /></View>
                <View style={{ flex: 1 }}><Field label="Kinh độ *" keyboardType="numeric" value={form.lng} onChangeText={set('lng')} /></View>
              </View>
              <Btn small kind="ghost" title="📍 Lấy vị trí hiện tại" onPress={useHere} style={{ marginBottom: 10 }} />
              <Field label="Bán kính kích hoạt (m)" keyboardType="numeric" value={form.radius} onChangeText={set('radius')} />
              {err ? <Text style={{ color: C.danger, marginBottom: 8 }}>{err}</Text> : null}
              <Btn title="Lưu" loading={busy} onPress={save} />
              <Btn kind="ghost" style={{ marginTop: 10 }} title="Đóng" onPress={() => setForm(null)} />
            </ScrollView>
          </Screen>
        ) : null}
      </Modal>
    </View>
  );
}
