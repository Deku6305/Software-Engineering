import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { api } from '../../../src/shared/api';
import { useAuth } from '../../../src/shared/auth';
import { usePoll } from '../../../src/shared/hooks';
import { Card, H } from '../../../src/shared/ui';
import { C, vnd } from '../../../src/shared/theme';

const Stat = ({ label, value, color = C.text, sub }) => (
  <Card style={{ width: '48%', marginBottom: 10 }}>
    <Text style={{ color: C.muted, fontSize: 12, fontWeight: '600' }}>{label}</Text>
    <Text style={{ fontSize: 24, fontWeight: '800', color, marginTop: 2 }}>{value}</Text>
    {sub ? <Text style={{ color: C.muted, fontSize: 12 }}>{sub}</Text> : null}
  </Card>
);

export default function Overview() {
  const { token } = useAuth('admin');
  const [stats, setStats] = useState(null);
  const [listens, setListens] = useState([]);
  const { err } = usePoll(async () => {
    const [s, l] = await Promise.all([api('/api/admin/stats', { token }), api('/api/admin/listens', { token })]);
    setStats(s); setListens(l);
  }, 10000, [token]);

  const max = Math.max(1, ...listens.map((l) => l.total));
  return (
    <ScrollView contentContainerStyle={{ padding: 14 }} style={{ backgroundColor: C.bg }}>
      {err ? <Text style={{ color: C.danger }}>{err}</Text> : null}
      {stats ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Stat label="🟢 Đang truy cập (2 phút qua)" value={stats.online}
            sub={stats.onlineByLang.map((x) => `${x.lang}:${x.n}`).join('  ')} color={C.ok} />
          <Stat label="Tổng lượt người dùng" value={stats.visitors} sub={`+${stats.newToday} hôm nay`} />
          <Stat label="Tổng lượt nghe" value={stats.listens} color={C.primary} />
          <Stat label="Đơn chờ thanh toán" value={stats.pending} color={C.warn} />
          <Stat label="Doanh thu hôm nay" value={vnd(stats.revenueToday)} color={C.ok} />
          <Stat label="Tổng doanh thu" value={vnd(stats.revenueTotal)} color={C.ok} />
        </View>
      ) : null}

      <H style={{ fontSize: 18, marginVertical: 8 }}>🎧 Lượt nghe từng bản thuyết minh</H>
      {listens.map((l) => (
        <Card key={l.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700', color: C.text, flex: 1 }}>{l.title}</Text>
            <Text style={{ fontWeight: '800', color: C.primary }}>{l.total}</Text>
          </View>
          <View style={{ height: 8, backgroundColor: C.primaryLight, borderRadius: 4, marginVertical: 6 }}>
            <View style={{ height: 8, width: `${(l.total / max) * 100}%`, backgroundColor: C.primary, borderRadius: 4 }} />
          </View>
          <Text style={{ color: C.muted, fontSize: 12 }}>
            {Object.keys(l.byLang).length ? Object.entries(l.byLang).map(([k, v]) => `${k.toUpperCase()}: ${v}`).join('   ') : 'Chưa có lượt nghe'}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}
