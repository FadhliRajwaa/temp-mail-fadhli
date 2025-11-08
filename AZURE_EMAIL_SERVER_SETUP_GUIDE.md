# 🚀 AZURE EMAIL SERVER SETUP GUIDE
## Using GitHub Student Pack $100 Credit

**Transform your Azure credits into a professional email server!**

---

## ✅ PREREQUISITES

```
✅ GitHub Student Pack activated
✅ $100 Azure credit available
✅ Domain: fadhlirajwaa.my.id
✅ Access to Cloudflare DNS
✅ SSH client (Windows PowerShell)
✅ 10-15 hours for complete setup
```

---

## 💰 BUDGET PLANNING

### **Your $100 Credit:**

```
Recommended Plan:
├── VM: B1s (1 vCPU, 1 GB RAM)
├── Cost: $8.76/month
├── Storage: 30 GB Standard SSD
├── Network: Minimal cost
├── Total: ~$9-10/month
└── Duration: 10-11 months! ✅

Alternative Plan (More Power):
├── VM: B2s (2 vCPU, 4 GB RAM)
├── Cost: $35/month
└── Duration: ~2.8 months
```

**We'll use B1s for maximum duration!**

---

## 📋 PHASE 1: AZURE SETUP (30 minutes)

### **STEP 1: Activate GitHub Student Pack**

```
1. Go to: https://education.github.com/pack

2. Click: "Get the Student Pack"

3. Verify student status:
   - Upload student ID
   - Or use .ac.id email
   - Or school documentation

4. Wait for approval (instant to 48 hours)

5. Once approved, access Azure benefits
```

---

### **STEP 2: Activate Azure Student Account**

```
1. In GitHub Student Pack → Find "Microsoft Azure"

2. Click: "Get access to Azure"

3. Sign in with:
   - Microsoft account (existing)
   - Or create new Microsoft account

4. Activate Azure for Students:
   ✅ No credit card required!
   ✅ $100 credit automatically added
   ✅ 12 months validity

5. Access Azure Portal: https://portal.azure.com

6. Verify credit:
   Portal → Cost Management → Credits
   Should show: $100 available ✅
```

---

### **STEP 3: Create Virtual Machine**

```
Azure Portal → Virtual Machines → Create

1. Basics:
   ┌─────────────────────────────────────┐
   │ Subscription: Azure for Students    │
   │ Resource group: Create new          │
   │   Name: email-server-rg             │
   │ Virtual machine name: mail-server   │
   │ Region: Southeast Asia (Singapore)  │
   │   OR: East Asia (Hong Kong)         │
   │ Availability: No redundancy needed  │
   │ Security: Standard                  │
   │ Image: Ubuntu Server 22.04 LTS      │
   │ Size: B1s (1 vCPU, 1 GB RAM)        │
   │   💰 Cost: ~$8.76/month             │
   └─────────────────────────────────────┘

   Click: Next

2. Disks:
   ┌─────────────────────────────────────┐
   │ OS disk type: Standard SSD (30 GB)  │
   │ Encryption: Default (SSE)           │
   │ Delete with VM: ✅ Yes              │
   └─────────────────────────────────────┘

   Click: Next

3. Networking:
   ┌─────────────────────────────────────┐
   │ Virtual network: Create new         │
   │   Name: email-vnet                  │
   │ Subnet: default (10.0.0.0/24)       │
   │ Public IP: Create new               │
   │   Name: mail-server-ip              │
   │   SKU: Standard                     │
   │ NIC network security group: Basic   │
   │ Public inbound ports:               │
   │   ☑ SSH (22)                        │
   │   ☑ HTTP (80)                       │
   │   ☑ HTTPS (443)                     │
   │ Delete NIC with VM: ✅ Yes          │
   └─────────────────────────────────────┘

   Click: Next

4. Management:
   ┌─────────────────────────────────────┐
   │ Boot diagnostics: Disable           │
   │ Enable auto-shutdown: Optional      │
   │   (Save costs if not 24/7)          │
   └─────────────────────────────────────┘

   Click: Next

5. Advanced:
   ┌─────────────────────────────────────┐
   │ Keep defaults                       │
   └─────────────────────────────────────┘

   Click: Next

6. Tags (Optional):
   ┌─────────────────────────────────────┐
   │ Name: Project                       │
   │ Value: Email-Server                 │
   └─────────────────────────────────────┘

   Click: Review + Create

7. Review:
   - Check estimated cost: ~$8.76/month
   - Verify configuration
   - Click: Create

8. Authentication:
   When prompted, create admin account:
   ┌─────────────────────────────────────┐
   │ Username: azureuser                 │
   │ Authentication: SSH public key      │
   │ SSH key source: Generate new        │
   │ Key name: mail-server-key           │
   └─────────────────────────────────────┘

   ⚠️ DOWNLOAD PRIVATE KEY (.pem file)
   ⚠️ SAVE IT SECURELY!

9. Wait 3-5 minutes for deployment

10. Get Public IP:
    VM Overview → Public IP address
    Example: 20.212.xxx.xxx
    ⚠️ SAVE THIS IP!
```

---

### **STEP 4: Configure Network Security Group**

```
Azure Portal → Virtual Machines → mail-server
→ Networking → Network settings

Add Inbound Port Rules (untuk email):

Rule 1: SMTP (Port 25)
├── Priority: 1010
├── Name: SMTP
├── Port: 25
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Rule 2: SMTP Submission (Port 587)
├── Priority: 1020
├── Name: SMTP-Submission
├── Port: 587
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Rule 3: SMTPS (Port 465)
├── Priority: 1030
├── Name: SMTPS
├── Port: 465
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Rule 4: IMAP (Port 143)
├── Priority: 1040
├── Name: IMAP
├── Port: 143
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Rule 5: IMAPS (Port 993)
├── Priority: 1050
├── Name: IMAPS
├── Port: 993
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Rule 6: POP3 (Port 110)
├── Priority: 1060
├── Name: POP3
├── Port: 110
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Rule 7: POP3S (Port 995)
├── Priority: 1070
├── Name: POP3S
├── Port: 995
├── Protocol: TCP
├── Source: Any
├── Destination: Any
└── Action: Allow

Click: Add for each rule
```

---

## 📋 PHASE 2: DNS CONFIGURATION (15 minutes)

### **STEP 5: Configure Cloudflare DNS**

```
Cloudflare Dashboard → fadhlirajwaa.my.id → DNS

⚠️ IMPORTANT: Configure BEFORE installing Mail-in-a-Box!

1. A Record (Root):
   Type: A
   Name: @
   IPv4: [Your Azure VM Public IP]
   Proxy: DNS only ☁️ (gray cloud)
   TTL: Auto
   → Save

2. A Record (Mail subdomain):
   Type: A
   Name: box
   IPv4: [Your Azure VM Public IP]
   Proxy: DNS only ☁️
   TTL: Auto
   → Save
   
   Result: box.fadhlirajwaa.my.id

3. MX Record:
   DELETE existing MX (SendGrid/Zoho/Yandex)
   
   Type: MX
   Name: @
   Mail server: box.fadhlirajwaa.my.id
   Priority: 10
   Proxy: DNS only ☁️
   TTL: Auto
   → Save

4. Verify DNS propagation:
   Wait 10-30 minutes
   Check: https://dnschecker.org
   Query: box.fadhlirajwaa.my.id
   Should show: Your Azure IP ✅
```

---

## 📋 PHASE 3: MAIL-IN-A-BOX INSTALLATION (1-2 hours)

### **STEP 6: Connect to VM via SSH**

**Windows (PowerShell):**

```powershell
# Navigate to folder with private key
cd C:\path\to\key\folder

# Set permissions (important!)
icacls mail-server-key.pem /inheritance:r
icacls mail-server-key.pem /grant:r "%username%:R"

# Connect to VM
ssh -i mail-server-key.pem azureuser@[Your-Azure-IP]

# Example:
ssh -i mail-server-key.pem azureuser@20.212.123.45
```

**First time connecting:**
```
Are you sure you want to continue connecting (yes/no)?
Type: yes
```

---

### **STEP 7: Prepare Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Set hostname
sudo hostnamectl set-hostname box.fadhlirajwaa.my.id

# Verify hostname
hostname -f
# Should show: box.fadhlirajwaa.my.id

# Update /etc/hosts
sudo nano /etc/hosts

# Add this line:
[Your-Azure-IP] box.fadhlirajwaa.my.id box

# Example:
20.212.123.45 box.fadhlirajwaa.my.id box

# Save: Ctrl+O, Enter, Ctrl+X

# Reboot (important!)
sudo reboot

# Wait 2 minutes, reconnect
ssh -i mail-server-key.pem azureuser@[Your-Azure-IP]
```

---

### **STEP 8: Install Mail-in-a-Box**

```bash
# Download and run installer
cd ~
curl -s https://mailinabox.email/setup.sh | sudo bash

# Installation starts (takes 30-60 minutes)
```

**During Installation:**

```
1. Email Address (for admin):
   Enter: admin@fadhlirajwaa.my.id
   → This is YOUR admin email

2. Hostname:
   Auto-detected: box.fadhlirajwaa.my.id
   → Press Enter to confirm

3. Country Code:
   Enter: ID
   → For Indonesia

4. Admin Password:
   Enter: [Strong password]
   ⚠️ SAVE THIS PASSWORD!
   Confirm password

5. Timezone:
   Auto-detected: Asia/Jakarta (or similar)
   → Press Enter to confirm

6. Installation continues...
   ☕ Take a break! 30-60 minutes
```

**What Gets Installed:**
```
✅ Postfix (SMTP server)
✅ Dovecot (IMAP/POP3)
✅ Roundcube (Webmail)
✅ Nginx (Web server)
✅ SpamAssassin (Spam filter)
✅ Let's Encrypt (SSL)
✅ DKIM, SPF, DMARC
✅ Backup system
✅ DNS server (optional)
```

---

### **STEP 9: Post-Installation**

```bash
# After installation completes:

Your Mail-in-a-Box is running!

Please log in to the control panel:
https://box.fadhlirajwaa.my.id/admin

Login:
Email: admin@fadhlirajwaa.my.id
Password: [your admin password]
```

---

## 📋 PHASE 4: CONFIGURATION (30 minutes)

### **STEP 10: Access Admin Panel**

```
1. Open browser: https://box.fadhlirajwaa.my.id/admin

2. Login:
   Email: admin@fadhlirajwaa.my.id
   Password: [your password]

3. Dashboard shows:
   - System Status
   - DNS Checks
   - User Management
   - Backup Status
```

---

### **STEP 11: Fix DNS Warnings**

```
Admin Panel → System → Status Checks

Mail-in-a-Box will list DNS issues:

1. Click each warning
2. See required DNS records
3. Add them in Cloudflare DNS
4. Common records:

   SPF Record:
   Type: TXT
   Name: @
   Value: v=spf1 mx -all
   
   DKIM Record:
   Type: TXT
   Name: mail._domainkey
   Value: [Copy from Mail-in-a-Box]
   
   DMARC Record:
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=quarantine
   
5. Wait 10-30 minutes
6. Click "Check Again" in Mail-in-a-Box
7. All green checks! ✅
```

---

### **STEP 12: Create Email Accounts**

```
Admin Panel → Mail → Users

1. Add User:
   Email: cursor@fadhlirajwaa.my.id
   Password: [strong password]
   Quota: Default
   → Add

2. Repeat for more users:
   - me@fadhlirajwaa.my.id
   - fadhli@fadhlirajwaa.my.id
   - admin@fadhlirajwaa.my.id

Unlimited users with $100 credit! ✅
```

---

## 📋 PHASE 5: TESTING (30 minutes)

### **STEP 13: Access Webmail**

```
Webmail: https://box.fadhlirajwaa.my.id/mail

Login:
Email: cursor@fadhlirajwaa.my.id
Password: [your password]

Interface: Roundcube (like Mailo!)
```

---

### **STEP 14: Test Receiving Email**

```
1. Send from Gmail to: cursor@fadhlirajwaa.my.id
2. Wait 10-30 seconds
3. Check webmail inbox
4. Email should arrive! ✅

If not arriving:
- Check spam folder
- Verify MX record: mxtoolbox.com
- Check Mail-in-a-Box logs
```

---

### **STEP 15: Test Sending Email**

```
1. Login to webmail
2. Compose new email
3. To: Your Gmail
4. Subject: Test Send
5. Send

6. Check Gmail inbox
7. Email should arrive! ✅

If in spam (normal for new servers):
- Will improve with time
- Build reputation gradually
```

---

## 💰 COST MONITORING

### **Track Your Azure Credits:**

```
Azure Portal → Cost Management + Billing → Credits

Monitor:
✅ Current balance
✅ Daily spending
✅ Estimated months remaining
✅ Cost by service

Expected spending:
- VM (B1s): ~$8.76/month
- Storage: ~$1-2/month
- Network: ~$0.50/month
- Total: ~$10-11/month

$100 ÷ $10 = 10 months! ✅
```

---

## ⚠️ AZURE PORT 25 RESTRICTIONS

### **Important Info:**

```
Azure restricts outbound port 25 for new accounts!

Impact:
❌ Can't send email to some servers
✅ Can receive all emails
✅ Can send via port 587 (submission)

Solutions:
1. Request port 25 removal (business accounts)
2. Use port 587 (works for most)
3. Use email relay (SendGrid)
4. Most email clients use 587 anyway ✅
```

---

## 🎯 AFTER SETUP CHECKLIST

```
□ VM created and running ✅
□ DNS configured (A, MX, TXT) ✅
□ Mail-in-a-Box installed ✅
□ Admin panel accessible ✅
□ DNS checks passing ✅
□ Email accounts created ✅
□ Can receive emails ✅
□ Can send emails (via 587) ✅
□ Webmail working ✅
□ IMAP/POP3 working ✅
□ Monitoring Azure costs ✅
```

---

## 📊 TIMELINE

```
Day 1 (3-4 hours):
├── Azure VM setup (30 min)
├── DNS configuration (15 min)
├── Mail-in-a-Box install (1-2 hours)
└── Initial testing (30 min)

Day 2-7 (2-3 hours):
├── Fix DNS warnings
├── Test thoroughly
├── Configure email clients
└── Fine-tune settings

Month 1-3:
├── Build sender reputation
├── Monitor deliverability
└── Adjust as needed

Month 4-12:
├── Stable operation
├── Professional email service!
└── Monitor Azure credits
```

---

## 💡 COST OPTIMIZATION TIPS

### **Make $100 Last Longer:**

```
1. Use B1s VM (not B2s)
   Saves: ~$26/month

2. Enable auto-shutdown (optional):
   If not needed 24/7
   Saves: ~30-50%

3. Delete unused resources:
   Remove test VMs, old disks
   Saves: varies

4. Monitor daily:
   Azure Portal → Cost Management
   Catch issues early!

5. Use reserved instances (advanced):
   After 6 months of stable use
   Saves: up to 40%
```

---

## 🚀 AFTER CREDITS EXPIRE

### **Options after 12 months:**

**Option 1: Pay for Azure**
```
Cost: ~$10-11/month
Continue same setup
Seamless transition
```

**Option 2: Migrate to Hetzner**
```
Cost: €3.79/month (~Rp 66k)
Cheaper long-term
Port 25 open
Export data → Migrate → Continue
```

**Option 3: Back to Free Services**
```
Migrate to:
- Zoho Mail (free, 5 users)
- Yandex Mail (free, 5 users)
- Oracle Cloud (free forever)
```

---

## ✅ SUCCESS INDICATORS

```
✅ Webmail accessible at box.fadhlirajwaa.my.id/mail
✅ Can send/receive emails
✅ SPF, DKIM, DMARC passing
✅ Not in blacklists
✅ Email clients (IMAP) working
✅ Azure credits tracking properly
✅ Daily cost ~$0.30-0.35
✅ Estimated 10-11 months runtime
```

---

## 🎉 WHAT YOU'LL ACHIEVE

```
✅ Professional email server
✅ Own domain (@fadhlirajwaa.my.id)
✅ Unlimited email accounts
✅ Full control
✅ Learning experience
✅ Portfolio project
✅ Using your $100 wisely!
✅ 10-11 months of free email service!
```

---

**TOTAL COST: $0 (using your $100 credit!)**  
**DURATION: 10-11 months**  
**VALUE: Priceless learning + Email service!** 🏆

---

**Created by: Jarvis for Tuan Fadhli**  
**Date: 8 November 2025**  
**Best for: GitHub Student Pack holders!** ✅
