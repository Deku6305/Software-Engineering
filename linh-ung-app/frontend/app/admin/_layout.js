// ===== TRANG ADMIN (tách riêng, cần đăng nhập) =====
import { Stack } from 'expo-router';
export default function AdminRoot() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
