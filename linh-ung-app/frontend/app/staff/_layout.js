// ===== TRANG STAFF (tách riêng, cần đăng nhập) =====
import { Stack } from 'expo-router';
export default function StaffRoot() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
