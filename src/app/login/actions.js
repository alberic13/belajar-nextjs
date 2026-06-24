'use server';

import db from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/session';
import { z } from 'zod';

// Skema validasi menggunakan Zod
const AuthSchema = z.object({
  email: z.string()
    .min(1, 'Email wajib diisi.')
    .email('Format alamat email tidak valid.')
    .trim(),
  password: z.string()
    .min(6, 'Kata sandi minimal harus 6 karakter.')
    .max(50, 'Kata sandi maksimal 50 karakter.')
});

export async function loginUser(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // 1. Validasi input dengan Zod
  const validation = AuthSchema.safeParse({ email, password });
  if (!validation.success) {
    // Ambil pesan error pertama
    const errorMessage = validation.error.errors[0].message;
    return { success: false, message: errorMessage };
  }

  const { email: validatedEmail, password: validatedPassword } = validation.data;
  let isLoginSuccessful = false;

  try {
    // 2. Cari user di database menggunakan Drizzle
    const results = await db.select().from(users).where(eq(users.email, validatedEmail));
    
    if (results.length === 0) {
      return { success: false, message: 'Email tidak ditemukan.' };
    }

    const user = results[0];

    // 3. Cek password dengan membandingkan hash
    const isPasswordValid = await bcrypt.compare(validatedPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Password salah.' };
    }

    // 4. Buat secure session cookie
    await createSession(user.id, user.email);

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

  // 1. Validasi input dengan Zod
  const validation = AuthSchema.safeParse({ email, password });
  if (!validation.success) {
    // Ambil pesan error pertama
    const errorMessage = validation.error.errors[0].message;
    return { success: false, message: errorMessage };
  }

  const { email: validatedEmail, password: validatedPassword } = validation.data;

  try {
    // 2. Cek apakah email sudah terdaftar menggunakan Drizzle
    const existing = await db.select().from(users).where(eq(users.email, validatedEmail));
    if (existing.length > 0) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    // 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(validatedPassword, 10);

    // 4. Simpan user baru menggunakan Drizzle
    await db.insert(users).values({
      email: validatedEmail,
      password: hashedPassword,
    });
    
    return { success: true, message: 'Registrasi Berhasil! Silakan masuk.' };
  } catch (error) {
    console.error('Database error during registration:', error);
    return { success: false, message: 'Gagal menyimpan ke database.' };
  }
}

export async function logoutUser() {
  await deleteSession();
  redirect('/login');
}
