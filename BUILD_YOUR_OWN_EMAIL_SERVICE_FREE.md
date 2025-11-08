# 🚀 BUILD YOUR OWN EMAIL SERVICE (100% FREE!)
## From Temp Mail to Professional Email Service Like Mailo

**Transform your temp mail app into a full email service!**

---

## 🎯 WHAT WE'LL BUILD

**Current: Temp Mail App (Webhook-based)**
```
Email → SendGrid → Webhook → MongoDB → Display
- Receive only
- 15 min auto-delete
- No mailbox
- Disposable pattern
```

**Target: Professional Email Service (Like Mailo)**
```
Email → Your Server → Real Mailbox → IMAP/Webmail
- Send + Receive
- Permanent storage
- Real mailbox (IMAP/POP3)
- Professional pattern
- Trusted by services
```

---

## 💰 COST BREAKDOWN: 100% FREE!

```
┌─────────────────────┬──────────────┬──────────────────┐
│ Component           │ Paid Option  │ FREE Option      │
├─────────────────────┼──────────────┼──────────────────┤
│ VPS Server          │ $10-50/month │ Oracle Cloud ✅  │
│ Domain              │ $10-20/year  │ You have! ✅     │
│ Email Software      │ $50-200/mo   │ Mail-in-a-Box ✅ │
│ SSL Certificate     │ $50-200/year │ Let's Encrypt ✅ │
│ Spam Filter         │ $10-50/month │ SpamAssassin ✅  │
│ Backup Storage      │ $5-20/month  │ Oracle 200GB ✅  │
│ Monitoring          │ $10-30/month │ DIY Tools ✅     │
│ Database            │ $5-20/month  │ On VPS ✅        │
└─────────────────────┴──────────────┴──────────────────┘

TOTAL: $0/month! 🎉
```

---

## 🏗️ ARCHITECTURE

### **Option A: Full Email Server (Advanced)** ⭐⭐⭐⭐⭐

**Complete email service like Mailo:**

```
┌─────────────────────────────────────────────────┐
│ Oracle Cloud Free VPS (Forever Free!)           │
│ ├── Mail-in-a-Box (All-in-one email suite)      │
│ │   ├── Postfix (SMTP - send mail)              │
│ │   ├── Dovecot (IMAP/POP3 - receive mail)      │
│ │   ├── Roundcube (Webmail interface)           │
│ │   ├── SpamAssassin (Spam filter)              │
│ │   ├── ClamAV (Antivirus - optional)           │
│ │   └── Let's Encrypt (SSL/TLS)                 │
│ └── DNS: fadhlirajwaa.my.id → Oracle VPS IP     │
└─────────────────────────────────────────────────┘

Result: Complete email service! ✅
```

**Pros:**
```
✅ 100% FREE (Oracle Cloud Forever Free)
✅ Full control
✅ Real mailboxes (IMAP/POP3)
✅ Webmail interface (like Mailo)
✅ Professional setup
✅ Trusted by services (after reputation building)
✅ Great learning experience
✅ Portfolio project
```

**Cons:**
```
❌ Requires Linux skills
❌ Time-consuming setup (5-10 hours)
❌ Maintenance required (2-5 hours/month)
❌ Reputation building (3-6 months)
❌ Learning curve (moderate to high)
```

---

### **Option B: Hybrid Approach (Easier)** ⭐⭐⭐

**Professional email + Keep temp mail app:**

```
┌─────────────────────────────────────────────────┐
│ Domain: fadhlirajwaa.my.id                      │
│                                                 │
│ Root Domain (@fadhlirajwaa.my.id):              │
│ └── Zoho/Yandex Mail (FREE)                     │
│     └── cursor@fadhlirajwaa.my.id ✅            │
│         Professional, trusted by Cursor!        │
│                                                 │
│ Subdomain (temp.fadhlirajwaa.my.id):            │
│ └── Your Temp Mail App (SendGrid)               │
│     └── random@temp.fadhlirajwaa.my.id ✅       │
│         Disposable, for testing!                │
└─────────────────────────────────────────────────┘

Result: Best of both worlds! ✅
```

**Pros:**
```
✅ Professional email on root domain
✅ Keep temp mail app functionality
✅ Much easier (30 min setup)
✅ No maintenance
✅ Works immediately
```

**Cons:**
```
⚠️ Not building email server yourself
⚠️ Less learning experience
```

---

## 🚀 OPTION A: BUILD FULL EMAIL SERVER (FREE!)

### **Requirements:**

```
Time Investment:
├── Initial setup: 5-10 hours
├── Learning: 10-20 hours (if new to Linux)
├── Testing: 2-5 hours
└── Total: 20-35 hours

Technical Skills Needed:
├── Linux command line: ⭐⭐⭐ (Medium)
├── SSH access: ⭐⭐ (Basic)
├── DNS configuration: ⭐⭐⭐ (Medium)
├── Email protocols: ⭐⭐ (Basic - will learn!)
└── Troubleshooting: ⭐⭐⭐ (Medium)

Difficulty: ⭐⭐⭐⭐ (Challenging but achievable!)
```

---

## 📋 DETAILED SETUP: ORACLE CLOUD + MAIL-IN-A-BOX

### **PHASE 1: ORACLE CLOUD SETUP (30 minutes)**

#### **Step 1: Create Oracle Cloud Account**

```
1. Go to: https://www.oracle.com/cloud/free/

2. Click: "Start for free"

3. Create account:
   Email: fadhlirajwaarahmana@gmail.com
   Country: Indonesia
   
4. Verify email

5. Provide payment method:
   ⚠️ Credit card REQUIRED for verification
   ⚠️ But will NOT be charged!
   ⚠️ Forever Free tier never expires!

6. Complete signup

7. Access: Oracle Cloud Console
```

---

#### **Step 2: Create Compute Instance (VPS)**

```
1. Oracle Cloud Console → Compute → Instances

2. Click: "Create Instance"

3. Instance Details:
   Name: mail-server
   Placement: Keep default
   
4. Image and Shape:
   Image: Ubuntu 22.04 LTS (Canonical)
   Shape: VM.Standard.E2.1.Micro
   ✅ Always Free-eligible (1 OCPU, 1GB RAM)

5. Networking:
   VCN: Create new VCN
   Subnet: Create new public subnet
   Assign public IP: ✅ YES

6. Add SSH Keys:
   Generate key pair
   Download private key (.key file)
   Save it securely!

7. Boot Volume: Keep default (50GB - FREE)

8. Click: "Create"

9. Wait 2-3 minutes for instance creation

10. Note Public IP Address:
    Example: 123.456.789.10
    ⚠️ IMPORTANT: Save this IP!
```

---

#### **Step 3: Configure Firewall (Security Lists)**

```
Oracle Cloud has strict firewall by default!

1. Instance Details → Virtual Cloud Network

2. Click your VCN → Security Lists → Default Security List

3. Add Ingress Rules (Allow incoming):

   Rule 1: SSH
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 22

   Rule 2: HTTP
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 80

   Rule 3: HTTPS
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 443

   Rule 4: SMTP (Send Email)
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 25

   Rule 5: SMTP Submission
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 587

   Rule 6: SMTPS
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 465

   Rule 7: IMAP
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 143

   Rule 8: IMAPS
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 993

   Rule 9: POP3
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 110

   Rule 10: POP3S
   ├── Source: 0.0.0.0/0
   ├── IP Protocol: TCP
   └── Destination Port: 995

4. Click: "Add Ingress Rules" untuk semua rules di atas

5. Save changes
```

---

### **PHASE 2: DNS CONFIGURATION (15 minutes)**

#### **Step 4: Configure DNS in Cloudflare**

```
⚠️ IMPORTANT: 
Before installing Mail-in-a-Box, DNS MUST be configured!

Cloudflare → fadhlirajwaa.my.id → DNS → Records

Add/Update these records:
```

**A Record (Main domain):**
```
Type: A
Name: @
IPv4 address: [Your Oracle VPS IP]
Proxy: DNS only ☁️ (IMPORTANT!)
TTL: Auto
→ Save
```

**A Record (Mail subdomain):**
```
Type: A
Name: box
IPv4 address: [Your Oracle VPS IP]
Proxy: DNS only ☁️
TTL: Auto
→ Save

Result: box.fadhlirajwaa.my.id → Your VPS
```

**MX Record:**
```
Delete existing MX (SendGrid/Zoho/Yandex)

Add new:
Type: MX
Name: @
Mail server: box.fadhlirajwaa.my.id
Priority: 10
Proxy: DNS only ☁️
TTL: Auto
→ Save
```

**Important DNS Records Summary:**
```
A @ → [VPS IP] (DNS only)
A box → [VPS IP] (DNS only)
MX @ → box.fadhlirajwaa.my.id (10)

Wait 10-30 minutes for DNS propagation!
```

---

### **PHASE 3: INSTALL MAIL-IN-A-BOX (1 hour)**

#### **Step 5: Connect to VPS via SSH**

**Windows (PowerShell):**
```powershell
# Change key permissions (important!)
icacls "C:\path\to\your-key.key" /inheritance:r
icacls "C:\path\to\your-key.key" /grant:r "%username%:R"

# SSH to server
ssh -i "C:\path\to\your-key.key" ubuntu@[Your-VPS-IP]
```

**Example:**
```powershell
ssh -i "C:\Users\Fadhli\Downloads\oracle-key.key" ubuntu@123.456.789.10
```

---

#### **Step 6: Prepare Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Set hostname
sudo hostnamectl set-hostname box.fadhlirajwaa.my.id

# Verify hostname
hostname -f
# Should show: box.fadhlirajwaa.my.id

# Disable Ubuntu firewall (Oracle firewall is enough)
sudo ufw disable

# Reboot (important!)
sudo reboot

# Reconnect after 1-2 minutes
ssh -i "C:\path\to\your-key.key" ubuntu@[Your-VPS-IP]
```

---

#### **Step 7: Install Mail-in-a-Box**

```bash
# Download and run installer
cd ~
curl -s https://mailinabox.email/setup.sh | sudo bash

# Installer will start (takes 30-60 minutes)
```

**During Installation, you'll be asked:**

```
1. Email Address:
   Enter: admin@fadhlirajwaa.my.id
   (This is YOUR email for admin access)

2. Hostname:
   Should auto-detect: box.fadhlirajwaa.my.id
   Press Enter to confirm

3. Country Code:
   Enter: ID (for Indonesia)

4. Admin Password:
   Enter strong password
   ⚠️ SAVE THIS PASSWORD!

5. Timezone:
   Should auto-detect
   Press Enter to confirm

6. Installation continues automatically...
   (Wait 30-60 minutes)
```

**What Gets Installed:**
```
✅ Postfix (SMTP server)
✅ Dovecot (IMAP/POP3 server)
✅ Roundcube (Webmail)
✅ Nginx (Web server)
✅ SpamAssassin (Spam filter)
✅ Let's Encrypt (SSL certificates)
✅ DKIM, SPF, DMARC (Email authentication)
✅ DNS server (optional)
✅ Backup system
```

---

#### **Step 8: Post-Installation**

```bash
# After installation completes, you'll see:

Your Mail-in-a-Box is running!

Please log in to the control panel for further instructions:

https://box.fadhlirajwaa.my.id/admin

# Open this URL in browser
# Login:
#   Email: admin@fadhlirajwaa.my.id
#   Password: [your admin password]
```

---

### **PHASE 4: CONFIGURATION (30 minutes)**

#### **Step 9: Mail-in-a-Box Admin Panel**

```
1. Open: https://box.fadhlirajwaa.my.id/admin

2. Login dengan admin credentials

3. Dashboard will show:
   ✅ System Status
   ✅ DNS Checks
   ✅ Email Settings
   ✅ User Management
```

---

#### **Step 10: Fix DNS Issues**

**Mail-in-a-Box will check your DNS:**

```
In Admin Panel → System → Status Checks

Fix any DNS warnings:
1. Click on each warning
2. See required DNS records
3. Add them in Cloudflare
4. Wait 10-30 minutes
5. Click "Check Again"

Common DNS records needed:
- SPF: TXT @ → v=spf1 ...
- DKIM: TXT [key]._domainkey → v=DKIM1...
- DMARC: TXT _dmarc → v=DMARC1...
- Reverse DNS (PTR) → Contact Oracle support
```

---

#### **Step 11: Create Email Accounts**

```
Admin Panel → Mail → Users

Add User:
1. Click: "Add User"
2. Email: cursor@fadhlirajwaa.my.id
3. Password: [strong password]
4. Click: "Add"

Repeat for more users:
- me@fadhlirajwaa.my.id
- fadhli@fadhlirajwaa.my.id
- admin@fadhlirajwaa.my.id

Unlimited users! ✅
```

---

#### **Step 12: Access Webmail**

```
Webmail URL: https://box.fadhlirajwaa.my.id/mail

Login:
Email: cursor@fadhlirajwaa.my.id
Password: [your password]

Interface: Roundcube (like Mailo!)
Features:
✅ Read email
✅ Send email
✅ Folders
✅ Contacts
✅ Calendar
✅ Mobile responsive
```

---

### **PHASE 5: TESTING (30 minutes)**

#### **Step 13: Test Receiving Email**

```
1. Send email from Gmail to: cursor@fadhlirajwaa.my.id

2. Check webmail: https://box.fadhlirajwaa.my.id/mail

3. Email should arrive! ✅

If not:
- Check spam folder
- Check Mail-in-a-Box logs
- Verify MX record: mxtoolbox.com
```

---

#### **Step 14: Test Sending Email**

```
1. Login to webmail

2. Compose new email

3. To: Your Gmail
   Subject: Test Send
   Body: Testing email sending

4. Send

5. Check Gmail inbox

6. Email should arrive! ✅

If in spam:
- Normal for new servers
- Will improve with reputation
```

---

#### **Step 15: Test IMAP/POP3**

**Configure in Email Client:**

```
Gmail App / Outlook / Thunderbird:

IMAP Settings:
├── Server: box.fadhlirajwaa.my.id
├── Port: 993
├── Security: SSL/TLS
├── Username: cursor@fadhlirajwaa.my.id
└── Password: [your password]

SMTP Settings (Outgoing):
├── Server: box.fadhlirajwaa.my.id
├── Port: 587
├── Security: STARTTLS
├── Username: cursor@fadhlirajwaa.my.id
└── Password: [your password]

Test: Should work! ✅
```

---

### **PHASE 6: REPUTATION BUILDING (3-6 months)**

#### **Step 16: Build Sender Reputation**

```
New email servers have LOW reputation!
Services like Cursor might still block!

How to build reputation:

Week 1-4:
├── Send legitimate emails to friends/family
├── Receive emails from trusted sources
├── No spam, no mass emails
└── Low volume (10-50 emails/day)

Month 2-3:
├── Gradually increase volume
├── Maintain low spam complaints
├── Consistent sending patterns
└── Monitor delivery rates

Month 4-6:
├── Reputation improving
├── Services start trusting
├── Cursor might accept signup
└── Professional email service! ✅

Tips:
✅ Never send spam
✅ Respond to emails
✅ Keep bounce rate low
✅ Use SPF, DKIM, DMARC
✅ Monitor blacklists
```

---

## 💰 TOTAL COST BREAKDOWN

```
Oracle Cloud VPS:
- Instance: FREE (E2.1.Micro - Always Free)
- Storage: 50GB FREE
- Bandwidth: 10TB/month FREE
- Public IP: FREE
Cost: $0/month ✅

Domain:
- fadhlirajwaa.my.id: Already purchased ✅
Cost: $0 (already paid)

Mail-in-a-Box:
- Software: FREE (open source)
- SSL: FREE (Let's Encrypt)
- Spam Filter: FREE (included)
Cost: $0/month ✅

Maintenance:
- Your time: 2-5 hours/month
- Learning: Priceless! ✅

TOTAL: $0/month! 🎉
```

---

## 📊 COMPARISON

```
┌─────────────────┬────────────┬──────────┬────────────┐
│ Feature         │ Your Server│ Mailo    │ Zoho/Yandex│
├─────────────────┼────────────┼──────────┼────────────┤
│ Cost            │ FREE ✅    │ FREE ✅  │ FREE ✅    │
│ Users           │ Unlimited✅│ 1 ❌     │ 5 ❌       │
│ Storage         │ 50GB ✅    │ 1GB ❌   │ 5-10GB ⏸️  │
│ Control         │ Full ✅    │ None ❌  │ Limited ⏸️ │
│ Learning        │ High ✅    │ None ❌  │ None ❌    │
│ Setup Time      │ 10h ❌     │ 5min ✅  │ 30min ✅   │
│ Maintenance     │ 5h/mo ❌   │ None ✅  │ None ✅    │
│ Reputation      │ 6mo ❌     │ High ✅  │ High ✅    │
│ Cursor Works    │ Later ⏳   │ Now ✅   │ Now ✅     │
│ Portfolio Value │ High ✅    │ None ❌  │ None ❌    │
└─────────────────┴────────────┴──────────┴────────────┘
```

---

## ⚠️ IMPORTANT CONSIDERATIONS

### **Oracle Cloud Port 25 Block:**

```
Oracle blocks outbound port 25 by default!
This prevents sending email to some servers!

Solutions:
1. Submit ticket to Oracle support (may take days)
2. Use port 587 for submission (most servers accept)
3. Use email relay service (SendGrid for sending)
4. Wait for approval
```

### **IP Reputation:**

```
Oracle Cloud IPs might be in blacklists!

Check before starting:
1. Go to: mxtoolbox.com/blacklists
2. Enter your Oracle VPS IP
3. If blacklisted: Request delisting
4. If clean: Good to proceed! ✅
```

---

## 🎯 RECOMMENDED PATH

### **For Immediate Cursor Access:**

```
Use Gmail or existing service:
fadhlirajwaarahmana+cursor@gmail.com

Time: 2 minutes
Success: 100%
Get Cursor TODAY! ✅
```

### **For Learning & Long-term:**

```
Build your own email server:
1. Follow this guide (10-35 hours)
2. Learn valuable skills
3. Portfolio project
4. Full control
5. After 3-6 months: Professional service! ✅
```

### **Best Strategy:**

```
Phase 1 (NOW):
└── Gmail for Cursor signup ✅

Phase 2 (This weekend):
└── Setup Oracle + Mail-in-a-Box ✅

Phase 3 (Next 3-6 months):
└── Build reputation ✅

Phase 4 (Future):
└── Use your own email service! ✅
```

---

## 📚 RESOURCES

**Official Docs:**
```
Mail-in-a-Box: https://mailinabox.email/guide.html
Oracle Cloud: https://docs.oracle.com/en-us/iaas/
Let's Encrypt: https://letsencrypt.org/docs/
```

**Video Tutorials:**
```
YouTube: "Mail-in-a-Box setup"
YouTube: "Oracle Cloud Free Tier"
YouTube: "Email server tutorial"
```

**Community Support:**
```
Mail-in-a-Box Forum: https://discourse.mailinabox.email/
Reddit: r/selfhosted
Stack Overflow: Email server questions
```

---

## ✅ SUCCESS CRITERIA

**You'll know it works when:**

```
✅ Can access webmail: box.fadhlirajwaa.my.id/mail
✅ Can send email to Gmail
✅ Can receive email from Gmail
✅ IMAP works in email clients
✅ SPF, DKIM, DMARC pass
✅ MXToolbox shows green checkmarks
✅ Not in blacklists
✅ Mail-in-a-Box status: All green
```

---

## 🎉 WHAT YOU'LL ACHIEVE

**After completing this:**

```
✅ Own email server on your domain
✅ Unlimited email accounts
✅ Full control over email service
✅ Valuable DevOps skills
✅ Portfolio project
✅ Understanding of email infrastructure
✅ No monthly costs (FREE!)
✅ Professional email service
✅ Eventually trusted by Cursor & others
```

---

## 💡 NEXT STEPS

**Ready to start?**

```
1. Review this guide completely
2. Prepare 1-2 days for setup
3. Sign up Oracle Cloud
4. Follow steps carefully
5. Join Mail-in-a-Box community
6. Be patient with reputation building
7. Enjoy your own email service! 🎉
```

---

**Created by: Jarvis for Tuan Fadhli**  
**Date: 8 November 2025**  
**Difficulty: ⭐⭐⭐⭐ (Challenging but rewarding!)**  
**Cost: $0 (100% FREE!)**  
**Time: 10-35 hours (initial setup + learning)**
