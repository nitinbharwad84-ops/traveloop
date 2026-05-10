"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, User, Phone, MapPin, Globe, ArrowRight, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  additionalInfo: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Avatar size must be less than 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    console.log("Attempting registration for:", values.email);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      if (authData.user) {
        let avatarUrl = "";

        // 2. Upload avatar if selected
        if (avatarFile) {
          const fileExt = avatarFile.name.split(".").pop();
          const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(fileName, avatarFile);

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
            avatarUrl = urlData.publicUrl;
          }
        }

        // 3. Update profile details (Supabase trigger might have already created basic profile)
        // We'll upsert to be safe and update additional fields
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone,
          city: values.city,
          country: values.country,
          avatar_url: avatarUrl,
          additional_info: values.additionalInfo,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Profile update error:", profileError);
          // Even if profile update fails, account is created
          toast.warning("Account created, but profile details failed to save. You can update them later.");
        } else {
          toast.success("Welcome to the Traveloop community!");
        }

        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-slate-300" />
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="text-white w-6 h-6" />
            </label>
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={isLoading}
          />
        </div>
        <span className="text-xs text-slate-400 mt-2 font-medium">Upload profile photo (optional)</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ml-1">First Name</label>
          <div className="relative group">
            <input
              {...register("firstName")}
              placeholder="Arjun"
              className={cn(
                "block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all",
                errors.firstName && "border-red-500"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.firstName && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ml-1">Last Name</label>
          <div className="relative group">
            <input
              {...register("lastName")}
              placeholder="Dev"
              className={cn(
                "block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all",
                errors.lastName && "border-red-500"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.lastName && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500">
            <Mail size={16} />
          </div>
          <input
            {...register("email")}
            type="email"
            placeholder="arjun@example.com"
            className={cn(
              "block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all",
              errors.email && "border-red-500"
            )}
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500">
            <Lock size={16} />
          </div>
          <input
            {...register("password")}
            type="password"
            placeholder="Min. 8 characters"
            className={cn(
              "block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all",
              errors.password && "border-red-500"
            )}
            disabled={isLoading}
          />
        </div>
        {errors.password && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ml-1">City</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500">
              <MapPin size={16} />
            </div>
            <input
              {...register("city")}
              placeholder="Bangalore"
              className={cn(
                "block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all",
                errors.city && "border-red-500"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.city && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 ml-1">Country</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-500">
              <Globe size={16} />
            </div>
            <input
              {...register("country")}
              placeholder="India"
              className={cn(
                "block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all",
                errors.country && "border-red-500"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.country && <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.country.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none group"
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            Create Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 underline decoration-purple-200 underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};
