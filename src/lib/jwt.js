import { SignJWT, jwtVerify } from 'jose';

// Helper to retrieve and encode the session secret key (Edge and Node.js compatible)
function getEncodedKey() {
  const SECRET_KEY = process.env.SESSION_SECRET;
  
  if (!SECRET_KEY && process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY ERROR: SESSION_SECRET is not configured in production environment!');
  }
  
  const finalKey = SECRET_KEY || 'kunci_rahasia_session_32_karakter_!!';
  return new TextEncoder().encode(finalKey);
}

// Fungsi untuk mengenkripsi payload menjadi JWT (Kompatibel dengan Node.js dan Edge)
export async function encrypt(payload) {
  const encodedKey = getEncodedKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Masa berlaku 1 hari
    .sign(encodedKey);
}

// Fungsi untuk mendekripsi JWT (Kompatibel dengan Node.js dan Edge)
export async function decrypt(sessionToken) {
  if (!sessionToken) return null;
  try {
    const encodedKey = getEncodedKey();
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // Gagal verifikasi jika token dimanipulasi atau expired
    return null;
  }
}
