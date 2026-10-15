import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Namdapha Email Drafter',
  description: 'Clean HTML email design studio for Namdapha House, IIT Madras.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-[#09090B] text-[#FAFAFA]">
      <body className="min-h-full flex flex-col antialiased selection:bg-zinc-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
