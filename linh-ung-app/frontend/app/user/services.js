import React, { useEffect, useState } from 'react';
import { Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { api } from '../../src/shared/api';
import { useLang } from '../../src/shared/i18n';
import { usePoll } from '../../src/shared/hooks';
import { Badge, Btn, Card, Chip, Field, H, Screen } from '../../src/shared/ui';
import { C, vnd } from '../../src/shared/theme';

const ICON = { LUNCH: '🍱', ECART: '🚐', GUIDE: '🧑‍🏫' };
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

export default function Services() {
  const { t, lang, deviceId } = useLang();
  const [tab, setTab] = useState('book');
  const [data, setData] = useState({ services: [], bankInfo: '' });
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(null);
  const [qrId, setQrId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => { api(`/api/services?lang=${lang}`).then(setData).catch((e) => setErr(e.message)); }, [lang]);
  usePoll(async () => setOrders(await api(`/api/orders?deviceId=${deviceId}&lang=${lang}`)), 8000, [deviceId, lang]);

  const STATUS = {
    pending: { text: t('st_pending'), color: C.warn, bg: C.warnBg },
    paid: { text: t('st_paid'), color: C.ok, bg: C.okBg },
    used: { text: t('st_used'), color: C.info, bg: C.infoBg },
    cancelled: { text: t('st_cancelled'), color: C.danger, bg: C.dangerBg },
  };

  const submit = async () => {
    setBusy(true); setErr(null);
    try {
      const r = await api('/api/orders', { method: 'POST', body: {
        deviceId, lang, serviceCode: form.svc.code, quantity: form.qty, customerName: form.name,
        phone: form.phone, visitDate: form.date, note: form.note } });
      setOrders((o) => [r.order, ...o]);
      setData((d) => ({ ...d, bankInfo: r.bankInfo }));
      setForm(null); setTab('orders'); setQrId(r.order.id);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const qrOrder = orders.find((o) => o.id === qrId);

  return (
    <Screen>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <H>🎫 {t('tab_services')}</H>
        <View style={{ flexDirection: 'row', marginVertical: 12 }}>
          <Chip label={t('book_title')} active={tab === 'book'} onPress={() => setTab('book')} />
          <Chip label={`${t('orders_mine')} (${orders.length})`} active={tab === 'orders'} onPress={() => setTab('orders')} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
        {err && !form ? <Text style={{ color: C.danger, marginBottom: 8 }}>{err}</Text> : null}

        {tab === 'book' && data.services.map((s) => (
          <Card key={s.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 34, marginRight: 12 }}>{ICON[s.code] || '🎟️'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', fontSize: 16, color: C.text }}>{s.name}</Text>
                <Text style={{ color: C.muted, marginTop: 2 }}>{s.description}</Text>
                <Text style={{ color: C.primary, fontWeight: '800', marginTop: 4 }}>{vnd(s.price)} / {s.unit}</Text>
              </View>
            </View>
            <Btn style={{ marginTop: 10 }} title={t('book_title')}
              onPress={() => { setErr(null); setForm({ svc: s, qty: 1, name: '', phone: '', date: today(), note: '' }); }} />
          </Card>
        ))}

        {tab === 'orders' && (orders.length === 0 ? <Text style={{ color: C.muted }}>{t('no_orders')}</Text> :
          orders.map((o) => {
            const st = STATUS[o.status] || STATUS.pending;
            return (
              <Card key={o.id}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: '800', color: C.text }}>{ICON[o.serviceCode]} {o.serviceName} × {o.quantity}</Text>
                  <Badge text={st.text} color={st.color} bg={st.bg} />
                </View>
                <Text style={{ color: C.muted, marginTop: 4 }}>{o.orderCode} · {o.visitDate}</Text>
                <Text style={{ color: C.text, marginTop: 2, fontWeight: '700' }}>{t('total')}: {vnd(o.total)}</Text>
                <Btn small kind="ghost" style={{ marginTop: 8 }} title={`▦ ${t('show_qr')}`} onPress={() => setQrId(o.id)} />
              </Card>
            );
          }))}
      </ScrollView>

      {/* Form đặt dịch vụ */}
      <Modal visible={!!form} animationType="slide" onRequestClose={() => setForm(null)}>
        {form ? (
          <Screen>
            <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
              <H>{ICON[form.svc.code]} {form.svc.name}</H>
              <Text style={{ color: C.primary, fontWeight: '800', marginBottom: 14 }}>{vnd(form.svc.price)} / {form.svc.unit}</Text>
              <Field label={t('name')} value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} />
              <Field label={t('phone')} keyboardType="phone-pad" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
              <Text style={{ fontSize: 13, color: C.muted, fontWeight: '600', marginBottom: 4 }}>{t('qty')}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Btn small title="−" onPress={() => setForm({ ...form, qty: Math.max(1, form.qty - 1) })} />
                <Text style={{ marginHorizontal: 20, fontSize: 20, fontWeight: '800' }}>{form.qty}</Text>
                <Btn small title="+" onPress={() => setForm({ ...form, qty: Math.min(50, form.qty + 1) })} />
              </View>
              <Field label={t('visit_date')} value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} />
              <Field label={t('note')} multiline value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} />
              <Text style={{ fontSize: 18, fontWeight: '800', marginVertical: 8 }}>{t('total')}: {vnd(form.svc.price * form.qty)}</Text>
              {err ? <Text style={{ color: C.danger, marginBottom: 8 }}>{err}</Text> : null}
              <Btn title={t('submit')} loading={busy} onPress={submit} />
              <Btn kind="ghost" style={{ marginTop: 10 }} title={t('close')} onPress={() => setForm(null)} />
            </ScrollView>
          </Screen>
        ) : null}
      </Modal>

      {/* Mã QR của đơn */}
      <Modal visible={!!qrOrder} transparent animationType="fade" onRequestClose={() => setQrId(null)}>
        {qrOrder ? (
          <Pressable onPress={() => setQrId(null)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
            <Pressable style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, alignItems: 'center' }}>
              <Text style={{ fontWeight: '800', fontSize: 17 }}>{qrOrder.serviceName} × {qrOrder.quantity}</Text>
              <Text style={{ color: C.muted, marginBottom: 12 }}>{qrOrder.orderCode}</Text>
              <View style={{ opacity: qrOrder.status === 'pending' || qrOrder.status === 'cancelled' ? 0.35 : 1 }}>
                <QRCode value={`LU:${qrOrder.qrToken}`} size={200} />
              </View>
              <View style={{ marginTop: 12 }}>
                <Badge text={(STATUS[qrOrder.status] || STATUS.pending).text} color={(STATUS[qrOrder.status] || STATUS.pending).color} bg={(STATUS[qrOrder.status] || STATUS.pending).bg} />
              </View>
              {qrOrder.status === 'pending' ? (
                <View style={{ marginTop: 12, alignItems: 'center' }}>
                  <Text style={{ textAlign: 'center', color: C.text }}>{t('pay_info')}</Text>
                  <Text style={{ fontWeight: '800', marginTop: 6 }}>{data.bankInfo}</Text>
                  <Text style={{ marginTop: 4 }}>{t('total')}: <Text style={{ fontWeight: '800' }}>{vnd(qrOrder.total)}</Text></Text>
                  <Text style={{ marginTop: 2 }}>{t('transfer')}: <Text style={{ fontWeight: '800' }}>{qrOrder.orderCode}</Text></Text>
                </View>
              ) : qrOrder.status === 'paid' ? <Text style={{ marginTop: 12, textAlign: 'center' }}>{t('qr_hint')}</Text> : null}
              <Btn small kind="ghost" style={{ marginTop: 14 }} title={t('close')} onPress={() => setQrId(null)} />
            </Pressable>
          </Pressable>
        ) : null}
      </Modal>
    </Screen>
  );
}
