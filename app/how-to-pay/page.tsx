import { redirect } from 'next/navigation';

export default function HowToPayRedirect() {
  redirect('/payments');
}
