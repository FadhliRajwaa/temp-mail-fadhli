# 📧 Cloudflare Email Routing Setup Guide

**Complete Step-by-Step Guide untuk Setup Email Forwarding dengan Cloudflare**

> **FREE Forever | Unlimited Forwarding | Trusted by All Services**

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Setup Cloudflare Account](#phase-1-setup-cloudflare-account)
4. [Phase 2: Configure Email Routing](#phase-2-configure-email-routing)
5. [Phase 3: Testing & Verification](#phase-3-testing--verification)
6. [Phase 4: Use with Services (Cursor, etc)](#phase-4-use-with-services)
7. [Advanced Configuration](#advanced-configuration)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## 🎯 Overview

### What is Cloudflare Email Routing?

Cloudflare Email Routing adalah **FREE email forwarding service** yang allows you to:

- ✅ **Receive unlimited emails** di custom domain Anda
- ✅ **Forward ke Gmail** atau email lain
- ✅ **Catch-all support** - ANY address forwards to you
- ✅ **Professional infrastructure** - Trusted by services like Cursor
- ✅ **No cost** - FREE forever!

### Why Use This?

**Problem:**
- Temp mail domains (SendGrid forwarding) = Detected as disposable ❌
- Services like Cursor block disposable emails ❌

**Solution:**
- Cloudflare Email Routing = Professional email infrastructure ✅
- Same domain, different MX records = Trusted by all services ✅

### Architecture

```
Email sent to: anything@fadhlirajwaa.my.id
      ↓
Cloudflare Email Routing (MX records)
      ↓
Forwards to: your-gmail@gmail.com
      ↓
You receive in Gmail inbox ✅
```

---

## 📋 Prerequisites

**Before starting, ensure you have:**

- ✅ Domain name (e.g., `fadhlirajwaa.my.id`)
- ✅ Access to domain registrar (Domainesia)
- ✅ Gmail account (or any email for forwarding destination)
- ✅ 30-60 minutes for DNS propagation

**What You'll Need:**

```
Domain: fadhlirajwaa.my.id
Gmail: your-real-email@gmail.com
Browser: Chrome/Firefox (for Cloudflare dashboard)
```

---

## 🚀 Phase 1: Setup Cloudflare Account

### Step 1.1: Create Cloudflare Account

**A. Sign Up**

1. Open: https://dash.cloudflare.com/sign-up
2. Enter:
   - Email: Your real email (use Gmail)
   - Password: Strong password
3. Click: **"Create Account"**
4. Check email inbox
5. Click verification link from Cloudflare
6. Login: https://dash.cloudflare.com

---

### Step 1.2: Add Your Domain

**A. Add Site**

1. In Cloudflare Dashboard
2. Click: **"Add a Site"** (blue button)
3. Enter domain: `fadhlirajwaa.my.id`
4. Click: **"Add Site"**

**B. Select Plan**

1. Choose: **"Free"** plan
2. Scroll down if needed
3. Click: **"Continue"**

**C. Review DNS Records**

1. Cloudflare will scan existing DNS records
2. Review the list (should show your current records)
3. Click: **"Continue"**

**Screenshot Point:**
```
✅ All existing DNS records should be listed
✅ MX, CNAME, A records from Domainesia
```

---

### Step 1.3: Update Nameservers

**A. Get Cloudflare Nameservers**

Cloudflare will display:

```
Change your nameservers:

Current nameservers:
  ns1.domainesia.com
  ns2.domainesia.com

Replace with Cloudflare nameservers:
  anika.ns.cloudflare.com
  josh.ns.cloudflare.com

⚠️ NOTE: Your nameservers will be DIFFERENT!
Copy the exact ones shown in YOUR dashboard!
```

**B. Update at Domainesia**

1. **Login Domainesia:**
   - URL: https://my.domainesia.com
   - Login with your credentials

2. **Navigate to Domain:**
   - Click: **"Domains"**
   - Select: `fadhlirajwaa.my.id`

3. **Change Nameservers:**
   - Click: **"Nameservers"** or **"DNS Management"**
   - Select: **"Custom Nameservers"**
   - Delete old nameservers:
     ```
     ❌ ns1.domainesia.com
     ❌ ns2.domainesia.com
     ```
   - Add new nameservers (from Cloudflare):
     ```
     ✅ anika.ns.cloudflare.com (example - use yours!)
     ✅ josh.ns.cloudflare.com (example - use yours!)
     ```
   - Click: **"Save"** or **"Update"**

**C. Confirm in Cloudflare**

1. Back to Cloudflare dashboard
2. Click: **"Done, check nameservers"**
3. Wait for verification...

**D. Wait for Activation**

```
Status: "Pending nameserver update"
Time: 5-60 minutes (usually ~10-15 minutes)

Cloudflare will:
- Check nameservers periodically
- Send email when activated
- Update status to "Active" ✅
```

**⏰ While Waiting:**
- Keep browser tab open
- Check email for activation notification
- Proceed to next phase once status = "Active"

---

## 📧 Phase 2: Configure Email Routing

### Step 2.1: Enable Email Routing

**⚠️ IMPORTANT: Wait until domain status = "Active" in Cloudflare!**

**A. Access Email Routing**

1. In Cloudflare Dashboard
2. Select your site: `fadhlirajwaa.my.id`
3. Sidebar → Click: **"Email"** section
4. Click: **"Email Routing"**

**B. Get Started**

1. Click: **"Get started"** button
   or
2. Click: **"Enable Email Routing"**

**C. Automatic Configuration**

Cloudflare will automatically:

```
✅ Add MX records:
   - isaac.mx.cloudflare.net (priority 1)
   - linda.mx.cloudflare.net (priority 2)
   - amir.mx.cloudflare.net (priority 3)

✅ Add SPF record:
   - v=spf1 include:_spf.mx.cloudflare.net ~all

✅ Configure DKIM authentication

✅ Setup email infrastructure
```

**Status:** `Configuring...` → `Ready` ✅

---

### Step 2.2: Add Destination Email

**A. Add Gmail as Destination**

1. Section: **"Destination addresses"**
2. Click: **"Add destination address"**
3. Enter email: `your-real-email@gmail.com`
4. Click: **"Send verification email"**

**B. Verify Destination**

1. **Check Gmail Inbox:**
   - Look for email from: `Cloudflare Email Routing`
   - Subject: `Verify your email address`
   
2. **Open Email:**
   - Click: **"Verify email address"** button
   - Or copy verification link and paste in browser

3. **Confirm in Cloudflare:**
   - Back to Cloudflare dashboard
   - Destination status changes to: **"Verified"** ✅

**Screenshot Point:**
```
Destination addresses:
your-real-email@gmail.com [Verified ✅]
```

---

### Step 2.3: Create Routing Rules

**A. Setup Catch-All Rule (RECOMMENDED)**

1. Section: **"Routing rules"**
2. Click: **"Create address"** or **"Add rule"**

3. **Configure:**
   ```
   Type: "Catch-all"
   Match: *@fadhlirajwaa.my.id
   Action: "Send to an email"
   Destination: your-real-email@gmail.com
   Priority: 1
   ```

4. Click: **"Save"**

**B. Enable Rule**

1. Toggle switch: **ON** (enabled) ✅
2. Status should show: **"Active"**

**Result:**
```
ANY email to @fadhlirajwaa.my.id → Forwards to Gmail ✅

Examples:
- test@fadhlirajwaa.my.id → Gmail ✅
- cursor@fadhlirajwaa.my.id → Gmail ✅
- anything123@fadhlirajwaa.my.id → Gmail ✅
```

---

### Step 2.4: Alternative - Specific Addresses (Optional)

**Instead of catch-all, create specific addresses:**

**Example 1: Single Address**
```
Custom address: me@fadhlirajwaa.my.id
Action: Send to an email
Destination: your-gmail@gmail.com
```

**Example 2: Multiple Addresses**
```
1. cursor@fadhlirajwaa.my.id → your-gmail@gmail.com
2. github@fadhlirajwaa.my.id → your-gmail@gmail.com
3. work@fadhlirajwaa.my.id → your-work@company.com
```

**Benefits:**
- ✅ More control over which addresses work
- ✅ Can route to different destinations
- ✅ Track which services use which email

**Drawback:**
- ❌ Must create each address manually
- ❌ Less flexible than catch-all

---

## 🧪 Phase 3: Testing & Verification

### Step 3.1: Test Email Forwarding

**A. Send Test Email**

1. **From your Gmail:**
   ```
   To: test@fadhlirajwaa.my.id
   Subject: Test Cloudflare Email Routing
   Body: This is a test email!
   
   Send →
   ```

2. **Wait:** 5-30 seconds

3. **Check Gmail Inbox:**
   ```
   Expected:
   From: test@fadhlirajwaa.my.id (via Cloudflare)
   To: your-real-email@gmail.com
   Subject: Test Cloudflare Email Routing
   
   ✅ Email should arrive!
   ```

**B. Try Different Addresses**

```
Test 1: random123@fadhlirajwaa.my.id → Should work ✅
Test 2: anything@fadhlirajwaa.my.id → Should work ✅
Test 3: cursor@fadhlirajwaa.my.id → Should work ✅
```

---

### Step 3.2: Check Delivery Logs

**If email not received:**

1. **Cloudflare Dashboard:**
   - Email Routing → **"Logs"** tab
   
2. **Check Status:**
   ```
   Status: Delivered ✅
   or
   Status: Failed ❌ (see error message)
   ```

3. **Common Issues:**
   ```
   - Destination not verified → Verify Gmail
   - Rule not enabled → Enable routing rule
   - DNS not propagated → Wait longer
   ```

---

### Step 3.3: Verify DNS Records

**A. Check MX Records**

1. Tool: https://mxtoolbox.com
2. Enter: `fadhlirajwaa.my.id`
3. Click: **"MX Lookup"**

**Expected Result:**
```
✅ MX Priority 1: isaac.mx.cloudflare.net
✅ MX Priority 2: linda.mx.cloudflare.net
✅ MX Priority 3: amir.mx.cloudflare.net
```

**B. Check SPF Record**

1. Tool: https://mxtoolbox.com/spf.aspx
2. Enter: `fadhlirajwaa.my.id`

**Expected Result:**
```
✅ v=spf1 include:_spf.mx.cloudflare.net ~all
```

---

## 🎯 Phase 4: Use with Services

### Step 4.1: Register Cursor Account

**A. Clear Browser Data (Optional)**

If you previously tried with temp mail:
```
1. Open Incognito/Private window
   or
2. Clear cookies for cursor.sh domain
```

**B. Cursor Sign Up**

1. **Open:** https://cursor.sh/sign-up
   or
2. **Open Cursor App:** Login screen

3. **Enter Email:**
   ```
   Options:
   - me@fadhlirajwaa.my.id
   - fadhli@fadhlirajwaa.my.id
   - cursor@fadhlirajwaa.my.id
   - yourname@fadhlirajwaa.my.id
   
   Pick any! All forward to Gmail ✅
   ```

4. Click: **"Continue"** or **"Sign up"**

**C. Verify Email**

1. **Cursor sends verification email**
2. **Check Gmail inbox**
3. **Find email:** From Cursor (forwarded by Cloudflare)
4. **Click:** Verification link
5. **Success!** ✅ Cursor account activated

**Result:**
```
✅ Cursor accepts email (Cloudflare = trusted!)
✅ No disposable email detection
✅ Full account access
```

---

### Step 4.2: Use with Other Services

**Same process works for:**

```
✅ GitHub / GitHub Copilot
✅ OpenAI / ChatGPT
✅ Cloud providers (AWS, GCP, Azure)
✅ Any service that blocks disposable emails
```

**Tips:**

1. **Use different addresses:**
   ```
   github@fadhlirajwaa.my.id
   openai@fadhlirajwaa.my.id
   aws@fadhlirajwaa.my.id
   ```

2. **Track which service leaks/sells email:**
   - Each service gets unique address
   - Know source if you get spam
   - Can disable specific addresses

---

## ⚙️ Advanced Configuration

### Multiple Destinations

**Route different addresses to different inboxes:**

```
Routing Rules:
1. work@fadhlirajwaa.my.id → work-email@company.com
2. personal@fadhlirajwaa.my.id → personal-gmail@gmail.com
3. *@fadhlirajwaa.my.id → catch-all-gmail@gmail.com (catch-all)
```

---

### Gmail Filters for Organization

**Auto-organize forwarded emails:**

**A. Create Filter in Gmail:**

1. Gmail → **Settings** → **Filters and Blocked Addresses**
2. Click: **"Create a new filter"**

**B. Filter Criteria:**
```
From: *@fadhlirajwaa.my.id

Actions:
- Apply label: "Forwarded"
- Categorize: "Primary"
- Never send to Spam
```

**C. Advanced Filters:**
```
Filter 1: cursor@fadhlirajwaa.my.id → Label: "Cursor"
Filter 2: github@fadhlirajwaa.my.id → Label: "GitHub"
Filter 3: *@fadhlirajwaa.my.id → Label: "Other"
```

---

### Sending Email (Optional)

**Cloudflare Email Routing = Receive Only!**

**To SEND from @fadhlirajwaa.my.id:**

**Option A: Gmail "Send As"**

1. Gmail → **Settings** → **Accounts and Import**
2. Click: **"Add another email address"**
3. Enter:
   ```
   Name: Your Name
   Email: yourname@fadhlirajwaa.my.id
   ```
4. SMTP Settings:
   ```
   SMTP Server: smtp.gmail.com
   Port: 587
   Username: your-gmail@gmail.com
   Password: Gmail App Password
   ```
5. Verify and use!

**Option B: Keep SendGrid for Sending**

```
Cloudflare: RECEIVING emails (catch-all) ✅
SendGrid: SENDING emails (authenticated) ✅

Separate purposes, both work together!
```

---

### Coexist with Temp Mail App

**Keep your temp mail app running alongside Cloudflare:**

**Architecture:**

```
Scenario 1: Subdomain Separation
- Cloudflare: *@fadhlirajwaa.my.id (professional)
- Temp Mail: *@temp.fadhlirajwaa.my.id (disposable)

Scenario 2: Different Services
- Cloudflare: Cursor, GitHub, etc. (trusted services)
- SendGrid: Testing, disposable use cases
```

**Implementation:**

1. Keep SendGrid Inbound Parse for subdomain
2. Cloudflare handles root domain
3. Update MX records priority if needed

---

## 🔧 Troubleshooting

### Email Not Received

**Issue:** Email sent but not received in Gmail

**Solutions:**

1. **Check Routing Rules:**
   ```
   Cloudflare Dashboard → Email Routing → Rules
   - Is rule enabled? ✅
   - Is catch-all configured correctly?
   - Does address match rule?
   ```

2. **Check Destination:**
   ```
   - Is Gmail address verified? ✅
   - Check spam folder in Gmail
   - Check Gmail filters (not blocking)
   ```

3. **Check Logs:**
   ```
   Email Routing → Logs
   - Find failed delivery
   - Read error message
   - Fix accordingly
   ```

4. **Check DNS:**
   ```
   Tool: mxtoolbox.com
   - MX records pointing to Cloudflare? ✅
   - Wait for DNS propagation (up to 24h)
   ```

---

### Domain Not Active

**Issue:** Domain stuck in "Pending" status

**Solutions:**

1. **Verify Nameservers:**
   ```
   Tool: whatsmydns.net
   Domain: fadhlirajwaa.my.id
   Type: NS
   
   Should show:
   ✅ Cloudflare nameservers globally
   ```

2. **Check Domainesia:**
   ```
   - Nameservers saved correctly?
   - No typos in nameserver names?
   - Wait 5-60 minutes for propagation
   ```

3. **Contact Support:**
   ```
   If still pending after 24 hours:
   - Cloudflare Support: support.cloudflare.com
   - Domainesia Support: (check their contact)
   ```

---

### Cursor Still Blocks Email

**Issue:** Cursor detects email as disposable

**Unlikely, but if happens:**

1. **Wait for Full DNS Propagation:**
   ```
   - 24-48 hours for global propagation
   - Some services cache DNS records
   ```

2. **Check Email Headers:**
   ```
   - Open email in Gmail
   - Show original
   - Check: SPF, DKIM pass ✅
   - Check: No "X-Forwarded" headers indicating temp mail
   ```

3. **Try Different Address:**
   ```
   Instead of: random@domain
   Try: yourname@domain (more professional)
   ```

4. **Last Resort - Gmail Aliasing:**
   ```
   Use: yourname+cursor@gmail.com
   100% works, always accepted
   ```

---

## ❓ FAQ

### Q1: Is Cloudflare Email Routing really free?

**A:** Yes! 100% FREE forever. No hidden costs, no limits on forwarding.

---

### Q2: Can I send emails from @fadhlirajwaa.my.id?

**A:** Cloudflare Email Routing is **receive-only**. To send, use:
- Gmail "Send As" feature (via Gmail SMTP)
- Keep SendGrid for sending
- Use transactional email service

---

### Q3: How many addresses can I forward?

**A:** **Unlimited!** Catch-all means ANY address forwards to your Gmail.

---

### Q4: Will this work with other services besides Cursor?

**A:** **YES!** Works with:
- GitHub, GitLab
- OpenAI, Anthropic
- AWS, GCP, Azure
- Any service that blocks disposable emails

---

### Q5: Can I undo this? Switch back to SendGrid?

**A:** **YES!** Just change MX records back:
1. Cloudflare Dashboard → DNS
2. Delete Cloudflare MX records
3. Add back SendGrid MX records
4. Wait for DNS propagation

---

### Q6: What happens to my existing DNS records?

**A:** All existing records (A, CNAME, TXT) are **preserved**! Only MX records change.

---

### Q7: Can I use multiple domains?

**A:** **YES!** Add multiple domains to Cloudflare account. Each can have Email Routing.

---

### Q8: What if I need a mailbox, not just forwarding?

**A:** Upgrade to:
- **Google Workspace** (~$6/month) - Full Gmail mailbox
- **Zoho Mail** (~$1/month) - Budget option
- **ProtonMail** (~$5/month) - Privacy-focused

---

### Q9: Is my email data private?

**A:** Cloudflare Email Routing:
- ✅ Forwards emails (doesn't store permanently)
- ✅ Encrypted in transit (TLS)
- ✅ Privacy-focused company
- ✅ Read: [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

---

### Q10: Can I forward to multiple destinations?

**A:** **Not directly for same address.** But you can:
- Create multiple routing rules for different addresses
- Use Gmail filters to forward to other addresses
- Setup Gmail "Send a copy" feature

---

## 📚 Resources

### Official Documentation

- **Cloudflare Email Routing Docs:** https://developers.cloudflare.com/email-routing/
- **Setup Guide:** https://developers.cloudflare.com/email-routing/get-started/
- **Troubleshooting:** https://developers.cloudflare.com/email-routing/troubleshooting/

### Tools

- **MX Toolbox:** https://mxtoolbox.com
- **DNS Checker:** https://whatsmydns.net
- **Email Tester:** https://www.mail-tester.com
- **SPF Checker:** https://mxtoolbox.com/spf.aspx

### Support

- **Cloudflare Community:** https://community.cloudflare.com
- **Cloudflare Support:** https://support.cloudflare.com
- **Status Page:** https://www.cloudflarestatus.com

---

## ✅ Final Checklist

**Complete Setup Verification:**

```
□ Cloudflare account created
□ Domain added to Cloudflare
□ Nameservers updated at Domainesia
□ Domain status: "Active" in Cloudflare
□ Email Routing enabled
□ Destination email (Gmail) verified
□ Catch-all routing rule created and enabled
□ Test email sent and received successfully
□ MX records verified (mxtoolbox.com)
□ SPF record verified
□ Cursor account registered successfully
□ Email verification completed
□ Full access to Cursor ✅
```

**If all checked ✅ = Setup Complete! 🎉**

---

## 🎉 Success!

**You now have:**

✅ **Professional email forwarding** via Cloudflare
✅ **Unlimited email addresses** with catch-all
✅ **Trusted by all services** (no more disposable email blocks)
✅ **FREE forever** - no costs
✅ **Easy management** via Cloudflare Dashboard

**Use Cases:**

- ✅ Cursor / IDE subscriptions
- ✅ GitHub / Development tools
- ✅ Cloud platform signups
- ✅ Any service registration
- ✅ Professional communication

**Your Email:**
```
anything@fadhlirajwaa.my.id → your-gmail@gmail.com ✅
```

---

## 📝 Notes

**Created:** 2025-11-08
**Author:** Jarvis (AI Assistant for Tuan Fadhli)
**Domain:** fadhlirajwaa.my.id
**Service:** Cloudflare Email Routing (FREE)
**Purpose:** Bypass disposable email detection for services like Cursor

**Updates:**
- 2025-11-08: Initial documentation created

---

**Happy Coding! 🚀**

**Need help? Review this guide or contact Cloudflare Support!**
