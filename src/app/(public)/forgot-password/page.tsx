'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, AlertCircle, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const { forgotPassword, isSendingReset, forgotPasswordError, forgotPasswordSuccess } = useAuth();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    await forgotPassword(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-muted/60 bg-card">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Plane className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Forgot password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {forgotPasswordSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-green-500/20 p-3 text-green-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                If an account exists for that email, we have sent password reset instructions.
              </p>
            </div>
          ) : (
            <>
              {forgotPasswordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {forgotPasswordError.message || 'Failed to send reset link. Please try again.'}
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" autoComplete="email" disabled={isSendingReset} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSendingReset}>
                    {isSendingReset ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending link...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <Link href="/login" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
