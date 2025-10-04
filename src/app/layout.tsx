import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from './client-layout';

// 服务器端导出metadata
export const metadata: Metadata = {
  title: 'React Admin',
  description: '基于Next.js + React + Antd + TypeScript的管理系统',
};

const inter = Inter({ subsets: ['latin'] });

// 根布局组件 - 纯服务器组件
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} min-h-screen`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
