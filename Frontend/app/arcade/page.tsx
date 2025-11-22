import { redirect } from 'next/navigation';

// Root arcade page - redirects to dashboard
// Vercel deployment test - arcade feature branch
export default function ArcadePage() {
  redirect('/arcade/dashboard');
}