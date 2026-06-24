'use server';

import db from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function loginUser(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { success: false, message: 'Email dan password harus diisi.' };
  }

  let isLoginSuccessful = false;

  try {
    // 1. Cari user di database menggunakan Drizzle
    const results = await db.select().from(users).where(eq(users.email, email));
    
    if (results.length === 0) {
      return { success: false, message: 'Email tidak ditemukan.' };
    }

    const user = results[0];

    // 2. Cek password (plaintext untuk belajar)
    if (user.password !== password) {
      return { success: false, message: 'Password salah.' };
    }

    isLoginSuccessful = true;
  } catch (error) {
    console.error('Database error during login:', error);
    return { success: false, message: 'Gagal menghubungkan ke database.' };
  }

  // Panggil redirect di luar try-catch agar tidak tertangkap oleh block catch
  if (isLoginSuccessful) {
    redirect('/admin');
  }
}

export async function registerUser(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { success: false, message: 'Email dan password harus diisi.' };
  }

  try {
    // 1. Cek apakah email sudah terdaftar menggunakan Drizzle
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    // 2. Simpan user baru menggunakan Drizzle
    await db.insert(users).values({
      email,
      password,
    });
    
    return { success: true, message: 'Registrasi Berhasil! Silakan masuk.' };
  } catch (error) {
    console.error('Database error during registration:', error);
    return { success: false, message: 'Gagal menyimpan ke database.' };
  }
}
