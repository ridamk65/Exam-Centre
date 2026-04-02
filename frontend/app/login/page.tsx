import { redirect } from 'next/navigation';

// /login is deprecated — redirect to the real admin login page
export default function LoginPage() {
    redirect('/admin/login');
}
