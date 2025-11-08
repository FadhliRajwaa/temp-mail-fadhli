# 📧 YANDEX MAIL - SETUP GUIDE
## Free Custom Domain Email (@fadhlirajwaa.my.id)

---

## ✅ MENGAPA YANDEX MAIL?

**Lebih mudah dari Zoho! Tidak ada masalah dengan www!**

```
✅ FREE FOREVER (100% gratis!)
✅ Custom domain: @fadhlirajwaa.my.id
✅ Up to 1000 mailboxes (bukan cuma 5 seperti Zoho!)
✅ 10 GB storage per mailbox (2x lebih besar dari Zoho!)
✅ Webmail interface (seperti Mailo)
✅ IMAP/POP3/SMTP access
✅ Mobile apps (iOS & Android)
✅ Spam filtering included
✅ SSL/TLS encryption
✅ Tidak picky dengan domain format! ✅
✅ Setup LEBIH MUDAH dari Zoho! ✅

Cost: $0/month ✅
Setup time: 30 minutes
Difficulty: ⭐⭐ Easy
```

---

## 📋 STEP-BY-STEP SETUP

### **STEP 1: Sign Up Yandex**

```
1. Go to: https://connect.yandex.com

2. Click: "Create account" (jika belum punya)
   Atau: Login jika sudah punya Yandex account

3. Create Yandex account:
   Email: [your existing email]
   Password: [strong password]
   
4. Verify email

5. Login to Yandex Connect
```

---

### **STEP 2: Add Your Domain**

```
1. Di Yandex Connect dashboard

2. Click: "Connect a domain" atau "Add domain"

3. Enter domain (TANPA www!):
   fadhlirajwaa.my.id
   
4. Click: "Connect domain" atau "Add"

5. Yandex akan show verification steps
```

---

### **STEP 3: Verify Domain Ownership**

**Yandex akan kasih TXT record untuk verify:**

```
Example TXT record dari Yandex:
Type: TXT
Name: @ (or root)
Value: yandex-verification=xxxxxxxxxx

Steps:
1. Copy TXT record value dari Yandex

2. Go to Cloudflare:
   Dashboard → fadhlirajwaa.my.id → DNS → Records

3. Add record:
   Type: TXT
   Name: @
   Content: yandex-verification=xxxxxxxxxx
   TTL: Auto
   → Save

4. Wait 5-10 minutes

5. Back to Yandex → Click "Verify"

6. Success! ✅
```

---

### **STEP 4: Configure MX Records**

**Delete SendGrid MX first:**

```
Cloudflare → DNS

Find and DELETE:
❌ MX @ → mx.sendgrid.net

(This removes temp mail app email receiving)
```

**Add Yandex MX record:**

```
Cloudflare → DNS → Add record

Type: MX
Name: @
Mail server: mx.yandex.net
Priority: 10
Proxy: DNS only ☁️
→ Save

Expected result:
✅ MX @ → mx.yandex.net (10)
```

---

### **STEP 5: Add SPF Record**

```
Cloudflare → DNS → Add record

Type: TXT
Name: @
Content: v=spf1 include:_spf.yandex.net ~all
TTL: Auto
→ Save
```

---

### **STEP 6: Add DKIM Record (Optional but Recommended)**

**Yandex akan kasih DKIM record:**

```
Example dari Yandex:
Type: TXT
Name: mail._domainkey
Value: v=DKIM1; k=rsa; t=s; p=MIGfMA0GCSqGSIb3...

Steps:
Cloudflare → DNS → Add record

Type: TXT
Name: mail._domainkey
Content: [value dari Yandex]
TTL: Auto
→ Save
```

---

### **STEP 7: Wait DNS Propagation**

```
Time: 10-30 minutes

Check MX records:
1. Go to: https://mxtoolbox.com
2. Enter: fadhlirajwaa.my.id
3. Expected:
   ✅ mx.yandex.net (10)
```

---

### **STEP 8: Create Email Accounts**

```
1. Yandex Connect → Users atau Email Accounts

2. Click: "Add user" atau "Create"

3. User details:
   Username: cursor
   Full email: cursor@fadhlirajwaa.my.id
   First name: Cursor
   Last name: Account
   Password: [strong password]

4. Click: "Add" atau "Create"

5. Repeat untuk email lain:
   - me@fadhlirajwaa.my.id
   - fadhli@fadhlirajwaa.my.id
   - admin@fadhlirajwaa.my.id
   (up to 1000 mailboxes!)
```

---

### **STEP 9: Test Email**

```
1. Send test email:
   From: Gmail atau email lain
   To: cursor@fadhlirajwaa.my.id
   Subject: Test Yandex
   Body: Testing email

2. Check inbox:
   Go to: https://mail.yandex.com
   Login: cursor@fadhlirajwaa.my.id
   Password: [your password]
   
3. Email should arrive! ✅
```

---

### **STEP 10: Sign Up Cursor!**

```
1. Go to: https://cursor.sh/sign-up

2. Email: cursor@fadhlirajwaa.my.id

3. Check Yandex inbox for OTP

4. Enter OTP on Cursor

5. SUCCESS! Dashboard unlocked! 🎉
```

---

## 📊 FINAL DNS RECORDS (Cloudflare)

**After Yandex setup:**

```
EMAIL (Yandex Mail):
✅ MX @ → mx.yandex.net (10)
✅ TXT @ → v=spf1 include:_spf.yandex.net ~all
✅ TXT @ → yandex-verification=xxxxxxxxxx
✅ TXT mail._domainkey → v=DKIM1; k=rsa; ... (optional)

WEBSITE (Vercel):
✅ CNAME temp-mail → cname.vercel-dns.com (DNS only)

SENDGRID (Optional, if you keep for sending):
✅ CNAME em1988 → sendgrid...
✅ CNAME s1._domainkey → sendgrid...
✅ CNAME s2._domainkey → sendgrid...
```

---

## 🎯 YANDEX VS ZOHO

```
┌────────────────────┬──────────────┬──────────────┐
│ Feature            │ Yandex Mail  │ Zoho Mail    │
├────────────────────┼──────────────┼──────────────┤
│ Cost               │ FREE ✅      │ FREE ✅      │
│ Mailboxes          │ 1000 ✅      │ 5 ❌         │
│ Storage/mailbox    │ 10 GB ✅     │ 5 GB ❌      │
│ Setup Difficulty   │ ⭐⭐ Easy    │ ⭐⭐⭐ Med   │
│ Domain Format      │ Flexible ✅  │ Strict ❌    │
│ Interface          │ Good ✅      │ Good ✅      │
│ IMAP/POP3          │ YES ✅       │ YES ✅       │
│ Mobile Apps        │ YES ✅       │ YES ✅       │
│ Spam Filter        │ YES ✅       │ YES ✅       │
│ Cursor Works       │ YES ✅       │ YES ✅       │
│ www Issue          │ NO ✅        │ YES ❌       │
└────────────────────┴──────────────┴──────────────┘

Winner: YANDEX MAIL! 🏆
```

---

## ⚡ QUICK START CHECKLIST

```
□ Sign up Yandex Connect (connect.yandex.com)
□ Add domain: fadhlirajwaa.my.id
□ Add TXT record for verification (Cloudflare)
□ Wait 10 min → Verify in Yandex
□ Delete SendGrid MX from Cloudflare
□ Add Yandex MX record (Cloudflare)
□ Add SPF TXT record (Cloudflare)
□ Add DKIM TXT record (optional, Cloudflare)
□ Create email: cursor@fadhlirajwaa.my.id
□ Wait 30 min DNS propagation
□ Test send/receive email
□ Sign up Cursor with cursor@fadhlirajwaa.my.id
□ ✅ SUCCESS!

Total time: 30-45 minutes
Total cost: $0
Result: Professional email on YOUR domain! 🎉
```

---

## 🚨 IMPORTANT NOTES

### **What Happens to Temp Mail App:**

```
After changing MX to Yandex:
❌ Temp mail app will NOT receive emails anymore
✅ But you have PROFESSIONAL email now!

Options:
1. Keep temp mail on subdomain:
   - temp.fadhlirajwaa.my.id → SendGrid MX
   - @fadhlirajwaa.my.id → Yandex MX
   
2. Use Yandex for everything:
   - Professional email for Cursor, accounts
   - No need temp mail anymore
```

### **Temp Mail App Alternative:**

```
If you want to keep temp mail functionality:
1. Use different domain for temp mail
2. Or use subdomain setup (advanced)
3. Or use public temp mail services when needed
```

---

## 💡 TIPS & TRICKS

### **Email Aliases in Yandex:**

```
Yandex supports email aliases!

Example:
Main: me@fadhlirajwaa.my.id
Aliases:
- cursor@fadhlirajwaa.my.id
- github@fadhlirajwaa.my.id
- aws@fadhlirajwaa.my.id

All emails go to one inbox! ✅
Easier to manage!
```

### **Mobile Access:**

```
Download Yandex Mail app:
- iOS: App Store → Yandex Mail
- Android: Play Store → Yandex Mail

Or use any email client:
- Gmail app (add account via IMAP)
- Outlook app
- Apple Mail
- Thunderbird
```

---

## 🆘 TROUBLESHOOTING

### **Domain Verification Fails:**

```
Problem: Yandex can't verify domain
Solution:
1. Check TXT record in Cloudflare (exact value?)
2. Wait 30-60 minutes (DNS propagation)
3. Clear browser cache
4. Try verify again
```

### **Emails Not Arriving:**

```
Problem: Can't receive emails
Solution:
1. Check MX record: mx.yandex.net (priority 10)
2. Wait 30 minutes DNS propagation
3. Check https://mxtoolbox.com
4. Send test from different email
5. Check spam folder in Yandex
```

### **Can't Login to Webmail:**

```
Problem: Login fails
Solution:
1. Use full email: cursor@fadhlirajwaa.my.id
2. Not just: cursor
3. Check password (case-sensitive)
4. Try reset password in Yandex Connect
```

---

## 📞 SUPPORT

**Jika masih ada masalah:**

```
Yandex Support:
- Help: https://yandex.com/support/connect/
- Forum: Yandex Connect community
- Email: support form on Yandex

Tanya saya:
- Screenshot error
- Share step yang gagal
- Saya akan bantu debug! ✅
```

---

## ✅ SUCCESS INDICATORS

**You'll know it's working when:**

```
✅ MXToolbox shows: mx.yandex.net
✅ Test email arrives in Yandex inbox
✅ Can send email from Yandex
✅ Can login to mail.yandex.com
✅ Cursor accepts email for signup
✅ OTP arrives in Yandex inbox
✅ Cursor dashboard unlocked! 🎉
```

---

## 🎉 AFTER SUCCESS

**What you'll have:**

```
✅ Professional email on YOUR domain
✅ cursor@fadhlirajwaa.my.id for Cursor
✅ me@fadhlirajwaa.my.id for personal
✅ Up to 1000 mailboxes available
✅ 10 GB storage per mailbox
✅ Webmail + mobile access
✅ Trusted globally (like Mailo!)
✅ Works with ALL services! ✅

Cost: $0/month
Value: Professional email service! 🏆
```

---

**GOOD LUCK!** 🚀

**Total setup time: 30-45 minutes**  
**Total cost: $0**  
**Success rate: Very high!** ✅

---

**Created by: Jarvis for Tuan Fadhli**  
**Date: 8 November 2025**
