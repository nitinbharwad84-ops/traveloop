# Traveloop — Supabase Email Templates

## How to Apply These Templates

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Select the template you want to edit (e.g., **Confirm signup**)
3. Paste the HTML into the **Body** field
4. Update the **Subject** field as shown below
5. Click **Save**

---

## Available Supabase Variables

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | Full URL for verifying signup / email change |
| `{{ .Token }}` | 6-digit OTP code |
| `{{ .TokenHash }}` | Hashed token for custom link building |
| `{{ .SiteURL }}` | Your configured Site URL |
| `{{ .Email }}` | The user's email address |
| `{{ .Data }}` | User metadata from `user_metadata` |

> **Note:** `{{ .Data.first_name }}` can be used if you pass `first_name` in the signup metadata.

---

## 1. Confirm Signup (User's Professional Design)

**Subject:** `Confirm your Traveloop account ✈️`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your Email Address</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9fafb;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
        }
        
        .email-header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .email-header p {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .email-body h2 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1f2937;
        }
        
        .email-body p {
            font-size: 15px;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 20px;
        }
        
        .confirmation-section {
            background-color: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        
        .confirmation-section p {
            margin-bottom: 15px;
            font-size: 14px;
            color: #374151;
        }
        
        .confirmation-section p:last-child {
            margin-bottom: 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0 30px 0;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(102, 126, 234, 0.6);
        }
        
        .alternative-link {
            background-color: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            padding: 12px;
            margin-top: 15px;
            word-break: break-all;
        }
        
        .alternative-link p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .alternative-link a {
            color: #667eea;
            text-decoration: none;
            font-size: 12px;
            word-break: break-word;
        }
        
        .alternative-link a:hover {
            text-decoration: underline;
        }
        
        .security-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #78350f;
        }
        
        .security-notice strong {
            display: block;
            margin-bottom: 5px;
            color: #92400e;
        }
        
        .email-footer {
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
            padding: 25px 30px;
            text-align: center;
            font-size: 13px;
            color: #6b7280;
        }
        
        .email-footer p {
            margin-bottom: 10px;
            font-size: 13px;
        }
        
        .email-footer p:last-child {
            margin-bottom: 0;
        }
        
        .footer-links {
            margin-top: 15px;
        }
        
        .footer-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
            font-size: 12px;
        }
        
        .footer-links a:hover {
            text-decoration: underline;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
        
        .company-info {
            background-color: #f9fafb;
            padding: 15px 30px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
        
        /* Responsive Design */
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .email-header {
                padding: 30px 15px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-body {
                padding: 25px 15px;
            }
            
            .email-footer {
                padding: 20px 15px;
            }
            
            .cta-button {
                width: 100%;
                text-align: center;
                padding: 14px 20px;
            }
            
            .confirmation-section {
                padding: 15px;
                margin: 20px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <h1>🎉 Welcome!</h1>
            <p>Confirm your email address to get started</p>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <h2>Hi {{ .Data.first_name }},</h2>
            
            <p>
                Thank you for signing up for <strong>Traveloop</strong>! We're excited to have you on board.
                To complete your account setup, please confirm your email address by clicking the button below.
            </p>
            
            <!-- Confirmation Section -->
            <div class="confirmation-section">
                <p>
                    <strong>Confirm Your Email Address</strong><br>
                    Click the button below to verify your email and activate your account.
                </p>
                
                <!-- CTA Button -->
                <a href="{{ .ConfirmationURL }}" class="cta-button">
                    ✓ Confirm Email Address
                </a>
                
                <p>
                    <strong>OTP Code:</strong> <span style="font-family: monospace; font-weight: bold; background: #eee; padding: 2px 6px; border-radius: 4px;">{{ .Token }}</span>
                </p>
                
                <p>
                    <strong>This link expires in:</strong> 24 hours
                </p>
                
                <!-- Alternative Link -->
                <div class="alternative-link">
                    <p>Can't click the button? Copy and paste this link in your browser:</p>
                    <a href="{{ .ConfirmationURL }}">{{ .ConfirmationURL }}</a>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <strong>🔒 Security Notice:</strong>
                If you didn't create this account, please ignore this email.
                We will never ask for your password via email.
            </div>
            
            <p>
                Once you confirm your email, you'll be able to:
            </p>
            <p>
                ✓ Access your account<br>
                ✓ Plan amazing trips<br>
                ✓ Use all premium features
            </p>
            
            <p>
                If you have any questions, feel free to reach out to our support team.
            </p>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="divider"></div>
            
            <p>
                <strong>Traveloop</strong><br>
                Your AI-Powered Travel Assistant
            </p>
            
            <div class="footer-links">
                <a href="{{ .SiteURL }}">Website</a> •
                <a href="{{ .SiteURL }}/contact">Contact</a> •
                <a href="{{ .SiteURL }}/privacy">Privacy Policy</a> •
                <a href="{{ .SiteURL }}/terms">Terms of Service</a>
            </div>
            
            <p style="margin-top: 15px;">
                © 2024 Traveloop. All rights reserved.
            </p>
        </div>
        
        <!-- Company Info -->
        <div class="company-info">
            <p>You received this email because you signed up at Traveloop</p>
        </div>
    </div>
</body>
</html>
```

---

## 2. Magic Link / Login

**Subject:** `Your Traveloop login link 🔑`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;background-color:#f0f2f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px;text-align:center;">
              <div style="font-size:36px;margin-bottom:12px;">🔑</div>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Your Login Link</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#4b5563;">
                You requested a magic link to sign in to your Traveloop account. Click the button below to log in instantly:
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      🚀 Sign In to Traveloop
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin:16px 0 8px;font-size:13px;color:#6b7280;">Or enter this code:</p>
              <div style="background-color:#f0f4ff;border:2px dashed #667eea;border-radius:8px;padding:12px 20px;text-align:center;display:inline-block;">
                <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#667eea;font-family:monospace;">{{ .Token }}</span>
              </div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;margin:24px 0;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0;font-size:13px;color:#78350f;">
                      <strong>🔒</strong> If you didn't request this link, you can safely ignore this email. Your account is secure.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                Sent to {{ .Email }} &bull; <a href="{{ .SiteURL }}" style="color:#667eea;text-decoration:none;">Traveloop</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. Password Reset

**Subject:** `Reset your Traveloop password 🔐`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;background-color:#f0f2f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#e74c3c 0%,#c0392b 100%);padding:40px;text-align:center;">
              <div style="font-size:36px;margin-bottom:12px;">🔐</div>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Password Reset</h1>
              <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">Let's get you back in</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#4b5563;">
                We received a request to reset the password for your Traveloop account associated with <strong>{{ .Email }}</strong>.
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#e74c3c 0%,#c0392b 100%);">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      🔑 Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin:16px 0 8px;font-size:13px;color:#6b7280;">Or enter this code:</p>
              <div style="background-color:#fef2f2;border:2px dashed #e74c3c;border-radius:8px;padding:12px 20px;text-align:center;display:inline-block;">
                <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#e74c3c;font-family:monospace;">{{ .Token }}</span>
              </div>
              
              <div style="background-color:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:12px;margin-top:20px;">
                <p style="margin:0 0 4px;font-size:11px;color:#9ca3af;">Can't click the button? Copy this link:</p>
                <a href="{{ .ConfirmationURL }}" style="font-size:11px;color:#e74c3c;word-break:break-all;text-decoration:none;">{{ .ConfirmationURL }}</a>
              </div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;margin:24px 0;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0;font-size:13px;color:#78350f;">
                      <strong>⚠️ Didn't request this?</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                Sent to {{ .Email }} &bull; <a href="{{ .SiteURL }}" style="color:#667eea;text-decoration:none;">Traveloop</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. Email Change Confirmation

**Subject:** `Confirm your new email address ✉️`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;background-color:#f0f2f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <tr>
            <td style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);padding:40px;text-align:center;">
              <div style="font-size:36px;margin-bottom:12px;">✉️</div>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">Confirm New Email</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#4b5563;">
                You've requested to change your email address to <strong>{{ .Email }}</strong>. Please confirm this change:
              </p>
              
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      ✓ Confirm New Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin:16px 0 8px;font-size:13px;color:#6b7280;">Verification code:</p>
              <div style="background-color:#ecfdf5;border:2px dashed #10b981;border-radius:8px;padding:12px 20px;text-align:center;display:inline-block;">
                <span style="font-size:28px;font-weight:700;letter-spacing:6px;color:#10b981;font-family:monospace;">{{ .Token }}</span>
              </div>
              
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef3c7;border-left:4px solid #f59e0b;border-radius:8px;margin:24px 0;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0;font-size:13px;color:#78350f;">
                      <strong>🔒</strong> If you didn't request this change, please contact support immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                <a href="{{ .SiteURL }}" style="color:#667eea;text-decoration:none;">Traveloop</a> &bull; AI-Powered Travel Planning
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```
