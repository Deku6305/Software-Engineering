import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { api } from '../../../src/shared/api';
import { useAuth } from '../../../src/shared/auth';
import { Btn, Field } from '../../../src/shared/ui';
import { C, vnd } from '../../../src/shared/theme';

const MSG = {
  ok: ['✅ CHECK-IN THÀNH CÔNG', C.ok], unpaid: ['⏳ CHƯA THANH TOÁN', C.warn], already_used: ['⛔ MÃ ĐÃ ĐƯỢC SỬ DỤNG', C.danger],
  cancelled: ['⛔ ĐƠN ĐÃ HUỶ', C.danger], not_found: ['❌ KHÔNG TÌM THẤY MÃ', C.danger], error: ['⚠️ LỖI', C.danger],
};

export default function Scan() {
  const { token } = useAuth('staff');
  const [perm, askPerm] = useCameraPermissions();
  const [res, setRes] = useState(null);
  const [manual, setManual] = useState('');
  const lock = useRef(false);

  const check = async (code) => {
    if (lock.current || !code) return;
    lock.current = true;
    try { setRes(await api('/api/staff/checkin', { method: 'POST', token, body: { code } })); }
    catch (e) { setRes({ result: 'error', message: e.message }); }
  };
  const reset = () => { lock.current = false; setRes(null); setManual(''); };

  if (res) {
    const [title, color] = MSG[res.result] || MSG.error;
    const o = res.order;
    return (
      <View style={{ flex: 1, backgroundColor: color, padding: 24, justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center' }}>{title}</Text>
        {res.message ? <Text style={{ color: '#fff', textAlign: 'center', marginTop: 10 }}>{res.message}</Text> : null}
        {res.dateMismatch ? <Text style={{ color: '#FEF08A', textAlign: 'center', marginTop: 8, fontWeight: '700' }}>⚠ Ngày đặt ({o.visitDate}) khác hôm nay</Text> : null}
        {o ? (
          <View style={{ backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 14, padding: 16, marginTop: 20 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{o.serviceName} × {o.quantity}</Text>
            <Text style={{ color: '#fff', marginTop: 6 }}>Mã đơn: {o.orderCode}</Text>
            <Text style={{ color: '#fff' }}>Khách: {o.customerName} · {o.phone}</Text>
            <Text style={{ color: '#fff' }}>Ngày dùng: {o.visitDate}</Text>
            <Text style={{ color: '#fff', fontWeight: '800', marginTop: 4 }}>{vnd(o.total)}</Text>
            {res.result === 'already_used' && o.usedAt ? <Text style={{ color: '#fff' }}>Đã dùng lúc {new Date(o.usedAt).toLocaleString('vi-VN')}</Text> : null}
          </View>
        ) : null}
        <Btn style={{ marginTop: 24, backgroundColor: '#fff' }} kind="ghost" title="Quét mã tiếp" onPress={reset} />
      </View>
    );
  }

  if (!perm) return null;
  if (!perm.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ textAlign: 'center', marginBottom: 12 }}>Cần quyền camera để quét mã QR của khách.</Text>
        <Btn title="Cấp quyền camera" onPress={askPerm} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={({ data }) => check(data)} />
      <View style={{ position: 'absolute', top: '22%', alignSelf: 'center', width: 240, height: 240, borderWidth: 3, borderColor: '#fff', borderRadius: 20 }} />
      <View style={{ padding: 12, backgroundColor: '#fff' }}>
        <Field placeholder="Hoặc nhập mã đơn (VD: LU261021ABCD)" autoCapitalize="characters" value={manual} onChangeText={setManual} />
        <Btn small title="Kiểm tra mã" onPress={() => check(manual.trim())} disabled={!manual.trim()} />
      </View>
    </View>
  );
}
