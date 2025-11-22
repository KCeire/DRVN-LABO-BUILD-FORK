import { redirect } from 'next/navigation';

// Root arcade page - redirects to dashboard
export default function ArcadePage() {
  redirect('/arcade/dashboard');
}