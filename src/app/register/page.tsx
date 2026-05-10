import React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Traveloop | Create Account",
  description: "Create a Traveloop account to start planning your personalized trips.",
};

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the community of explorers today"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
