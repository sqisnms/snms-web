'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { sql } from '@vercel/postgres';
import type { User } from '@/types/definitions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

const EmailSchema = z.string().email({ message: 'Invalid email address' });
const PasswordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long.' });
const NameSchema = z.string().min(1, { message: 'Name cannot be empty' });

// eslint-disable-next-line consistent-return
export async function signUp(prevState: string | undefined, formData: FormData) {
  // 각 필드 유효성 검사
  const emailValidation = EmailSchema.safeParse(formData.get('email'));
  const passwordValidation = PasswordSchema.safeParse(formData.get('password'));
  const nameValidation = NameSchema.safeParse(formData.get('name'));

  // 유효성 검사 실패 시 에러 메시지 반환
  if (!emailValidation.success) {
    return emailValidation.error.message;
  }
  if (!passwordValidation.success) {
    return passwordValidation.error.message;
  }
  if (!nameValidation.success) {
    return nameValidation.error.message;
  }

  const email = emailValidation.data;
  const password = passwordValidation.data;
  const name = nameValidation.data;
  const authKey = uuidv4();

  try {
    // 이메일 중복 검사
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.rowCount !== null && existingUser.rowCount > 0) {
      return 'Email already exists.';
    }

    // 비밀번호 해싱 및 사용자 추가
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (name, email, password, auth_key)
      VALUES (${name}, ${email}, ${hashedPassword}, ${authKey})
    `;
  } catch (error) {
    console.error('Database error:', error);
    return 'Failed to create user.';
  }

  revalidatePath('/login');
  redirect(`/login?signup=success&email=${email}`);
}
