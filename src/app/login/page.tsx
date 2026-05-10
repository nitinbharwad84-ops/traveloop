import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Traveloop",
  description: "Sign in to your Traveloop account to manage your trips.",
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue your travel planning journey"
    >
      <LoginForm />
    </AuthLayout>
  );
}
