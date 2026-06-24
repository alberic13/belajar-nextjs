import { cookies } from 'next/headers';
import { encrypt, decrypt } from './jwt';

// Fungsi untuk membuat session cookie baru setelah login sukses (Server Component / Action)
export async function createSession(userId, email) {
  const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 hari
  const encryptedSession = await encrypt({ userId, email });
  
  const cookieStore = await cookies();
  cookieStore.set('session', encryptedSession, {
    httpOnly: true, // Mencegah pencurian token lewat JavaScript client (XSS)
    secure: process.env.NODE_ENV === 'production', // Hanya HTTPS di production
    expires: expiresAt,
    sameSite: 'lax', // Proteksi dasar CSRF
    path: '/',
  });
}

// Fungsi untuk membaca session yang aktif (Server Component / Action)
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) return null;
  
  return await decrypt(sessionCookie);
}

// Fungsi untuk menghapus session saat logout (Server Action)
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
