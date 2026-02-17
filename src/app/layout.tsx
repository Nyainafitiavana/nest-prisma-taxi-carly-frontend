"use client";

import React, {useState} from "react";
import "./globals.css";
import {Button, Layout, Menu, theme} from "antd";

const {Header, Sider, Content} = Layout;

import {
  BankOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function RootLayout({
                                    children,
                                  }: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get("authorization");
  //Set token provided by param to localStorage
  if (typeof window !== "undefined" && tokenFromQuery) {
    localStorage.setItem("token", tokenFromQuery);
  }

  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const menuItems = [
    {
      key: "/partenaires",
      icon: <BankOutlined />,
      label: "Partenaires",
    },
  ];

  return (
    <html lang="en">
    <body>
      <Layout className="min-h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="h-8 m-4 bg-white/20 rounded"/>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
          />
        </Sider>

        <Layout>
          <Header style={{padding: 0, background: colorBgContainer}}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 16,
                width: 64,
                height: 64,
              }}
            />
          </Header>
          {/* 👇 PAGE CONTENT GOES HERE */}
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 880,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </body>
    </html>
  );
}
