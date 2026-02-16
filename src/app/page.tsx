// src/app/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('fibidy_auth');

  // Server-side redirect based on cookie presence
  if (token) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}