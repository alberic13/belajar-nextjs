import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/jwt';

// 1. Definisikan rute yang dilindungi dan rute publik
const protectedRoutes = ['/admin'];
const publicRoutes = ['/login'];

export async function proxy(req) {
  const path = req.nextUrl.pathname;
  
  // Periksa kecocokan rute
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // 2. Ambil token dari cookie 'session' secara langsung
  const sessionToken = req.cookies.get('session')?.value;
  
  // 3. Dekripsi token menggunakan Web Crypto (Edge-compatible)
  const session = await decrypt(sessionToken);

  // 4. Jika rute dilindungi dan user belum login, arahkan ke /login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 5. Jika user sudah login dan mencoba mengakses halaman login/register, arahkan ke /admin
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
}

// 6. Konfigurasi matcher agar proxy hanya memproses rute tertentu demi performa
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
