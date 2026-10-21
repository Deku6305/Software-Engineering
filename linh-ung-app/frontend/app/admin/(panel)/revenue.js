import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { api } from '../../../src/shared/api';
import { useAuth } from '../../../src/shared/auth';
import { usePoll } from '../../../src/shared/hooks';
import { Card, Chip, H } from '../../../src/shared/ui';
import { C, vnd } from '../../../src/shared/theme';

const ICON = { LUNCH: '🍱', ECART: '🚐', GUIDE: '🧑‍🏫' };

export default function Revenue() {
  const { token } = useAuth('admin');
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const { err } = usePoll(async () => setData(await api(`/api/admin/revenue?days=${days}`, { token })), 15000, [days, token]);

  const maxDay = Math.max(1, ...(data?.byDay || []).map((d) => d.total));
  const maxSvc = Math.max(1, ...(data?.byService || []).map((s) => s.revenue));
  return (
    <ScrollView contentContainerStyle={{ padding: 14 }} style={{ backgroundColor: C.bg }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {[7, 14, 30].map((d) => <Chip key={d} label={`${d} ngày`} active={days === d} onPress={() => setDays(d)} />)}
      </View>
      {err ? <Text style={{ color: C.danger }}>{err}</Text> : null}
      {data ? (
        <>
          <Card style={{ backgroundColor: C.okBg }}>
            <Text style={{ color: C.muted, fontWeight: '600' }}>Tổng thu {days} ngày qua</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: C.ok }}>{vnd(data.total)}</Text>
          </Card>

          <H style={{ fontSize: 18, marginVertical: 8 }}>Theo dịch vụ</H>
          {data.byService.map((s) => (
            <Card key={s.code}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '700' }}>{ICON[s.code]} {s.name}</Text>
                <Text style={{ fontWeight: '800', color: C.primary }}>{vnd(s.revenue)}</Text>
              </View>
              <View style={{ height: 8, backgroundColor: C.primaryLight, borderRadius: 4, marginVertical: 6 }}>
                <View style={{ height: 8, width: `${(s.revenue / maxSvc) * 100}%`, backgroundColor: C.primary, borderRadius: 4 }} />
              </View>
              <Text style={{ color: C.muted, fontSize: 12 }}>{s.orders} đơn đã thanh toán</Text>
            </Card>
          ))}

          <H style={{ fontSize: 18, marginVertical: 8 }}>Tổng tiền thu theo ngày</H>
          {data.byDay.map((d) => (
            <Card key={d.day}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: '700' }}>{d.day.split('-').reverse().join('/')}</Text>
                <Text style={{ fontWeight: '800', color: C.ok }}>{vnd(d.total)}</Text>
              </View>
              <View style={{ height: 8, backgroundColor: C.okBg, borderRadius: 4, marginVertical: 6 }}>
                <View style={{ height: 8, width: `${(d.total / maxDay) * 100}%`, backgroundColor: C.ok, borderRadius: 4 }} />
              </View>
              <Text style={{ color: C.muted, fontSize: 12 }}>
                {data.byService.map((s) => `${ICON[s.code]} ${vnd(d.services[s.code] || 0)}`).join('   ')}
              </Text>
            </Card>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}
