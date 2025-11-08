# 🚀 AZURE SELF-HOSTED EMAIL SERVER - COMPLETE SETUP
## Step-by-Step Guide untuk Temp Mail Project

**Total Time: 2-3 weekends (20-30 hours)**  
**Difficulty: ⭐⭐⭐⭐ (Hard but doable!)**  
**Cost: FREE (using your $100 Azure credit)**

---

## 📋 OVERVIEW

**What We'll Build:**
```
Current: Email → SendGrid → Webhook → Backend → MongoDB
New:    Email → Azure Email Server → IMAP → Backend → MongoDB
```

**Benefits:**
✅ Real mailbox (not webhook)
✅ IMAP/POP3/SMTP support
✅ Unlimited mailboxes
✅ Full control
✅ Great learning experience

---

## 🎯 PHASE 1: AZURE VM SETUP (2-3 hours)

### **Step 1.1: Activate Azure Student Account**

```
1. Go to: https://portal.azure.com
2. Sign in with your Microsoft account
3. Go to: Education → Azure for Students
4. Verify with GitHub Student Pack
5. Check credit: Cost Management → Credits
   Should show: $100 available ✅
```

---

### **Step 1.2: Create Virtual Machine**

**Azure Portal → Virtual Machines → Create → Azure Virtual Machine**

**Basics Tab:**
```
Subscription: Azure for Students
Resource group: [Create new] → "email-server-rg"
Virtual machine name: mail-server
Region: East US ⚠️ IMPORTANT! (Azure for Students tidak support Southeast Asia!)
Availability options: No infrastructure redundancy
Security type: Standard
Image: Ubuntu Server 22.04 LTS - x64 Gen2
Size: B1s (1 vCPU, 1 GB RAM) ← Click "See all sizes"

⚠️ NOTE: If "East US" tidak available, coba:
   - West US
   - Central US  
   - North Europe
   - West Europe
   JANGAN pilih Southeast Asia! Will error! ❌
```

**Administrator Account:**
```
Authentication type: SSH public key
Username: azureuser
SSH public key source: Generate new key pair
Key pair name: mail-server-key
```

**Inbound Port Rules:**
```
Public inbound ports: Allow selected ports
Select inbound ports: 
☑ SSH (22)
☑ HTTP (80)
☑ HTTPS (443)
```

Click: **Next: Disks**

---

**Disks Tab:**
```
OS disk type: Standard SSD (locally-redundant storage)
Delete with VM: ☑ Yes

Click: Next: Networking
```

---

**Networking Tab:**
```
Virtual network: [Create new]
  Name: email-vnet
  Address space: 10.0.0.0/16
  
Subnet: default (10.0.0.0/24)

Public IP: [Create new]
  Name: mail-server-ip
  SKU: Standard
  Assignment: Static ← IMPORTANT!
  
NIC network security group: Basic
Public inbound ports: Same as before
Delete NIC when VM is deleted: ☑ Yes

Click: Review + Create
```

---

**Review + Create:**
```
Estimated cost: ~$8.76/month

Click: Create
```

**Download SSH Key:**
```
⚠️ CRITICAL: Download private key (.pem file)
Save to: C:\Users\Fadhli\Downloads\mail-server-key.pem
Keep it safe!

Wait 3-5 minutes for VM creation...
```

---

### **Step 1.3: Note Your Public IP**

```
After VM created:
1. Go to: Virtual Machines → mail-server
2. Overview tab
3. Find: Public IP address
   Example: 20.212.45.78
   
⚠️ SAVE THIS IP! You'll need it for DNS!
```

---

### **Step 1.4: Configure Network Security Group**

**Add Email Ports:**

```
Virtual Machines → mail-server → Networking → Network settings

Add inbound port rules (one by one):

1. SMTP (Port 25):
   Source: Any
   Source port ranges: *
   Destination: Any
   Service: Custom
   Destination port ranges: 25
   Protocol: TCP
   Action: Allow
   Priority: 1010
   Name: SMTP
   → Add

2. SMTP Submission (587):
   Destination port ranges: 587
   Priority: 1020
   Name: SMTP-Submission
   → Add

3. SMTPS (465):
   Destination port ranges: 465
   Priority: 1030
   Name: SMTPS
   → Add

4. IMAP (143):
   Destination port ranges: 143
   Priority: 1040
   Name: IMAP
   → Add

5. IMAPS (993):
   Destination port ranges: 993
   Priority: 1050
   Name: IMAPS
   → Add

6. POP3 (110):
   Destination port ranges: 110
   Priority: 1060
   Name: POP3
   → Add

7. POP3S (995):
   Destination port ranges: 995
   Priority: 1070
   Name: POP3S
   → Add
```

✅ Done! All email ports now open!

---

## 🌐 PHASE 2: DNS CONFIGURATION (30 min)

### **Step 2.1: Configure Cloudflare DNS**

**⚠️ IMPORTANT: Do this BEFORE installing Mail-in-a-Box!**

```
Cloudflare Dashboard → fadhlirajwaa.my.id → DNS → Records
```

**Add These Records:**

**1. A Record for Email Server:**
```
Type: A
Name: box
IPv4 address: [Your Azure VM Public IP]
Proxy status: DNS only ☁️ (gray cloud, NOT proxied!)
TTL: Auto
→ Save
```

**2. Update MX Record:**
```
First, DELETE existing:
❌ Delete: MX @ → mx.sendgrid.net

Then ADD new:
Type: MX
Name: @
Mail server: box.fadhlirajwaa.my.id
Priority: 10
Proxy status: DNS only ☁️
TTL: Auto
→ Save
```

**3. Verify DNS:**
```
Wait 10-30 minutes for propagation

Check: https://dnschecker.org
Query: box.fadhlirajwaa.my.id
Should show: Your Azure IP ✅
```

---

## 🔧 PHASE 3: MAIL-IN-A-BOX INSTALLATION (2-3 hours)

### **Step 3.1: Connect to Azure VM**

**Windows PowerShell:**

```powershell
# Navigate to where you saved the key
cd C:\Users\Fadhli\Downloads

# Fix permissions (IMPORTANT!)
icacls mail-server-key.pem /inheritance:r
icacls mail-server-key.pem /grant:r "$env:USERNAME`:R"

# Connect to VM (replace with YOUR IP!)
ssh -i mail-server-key.pem azureuser@20.212.45.78

# First time: type "yes" when prompted
```

✅ You should now be connected to Azure VM!

---

### **Step 3.2: Prepare Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Set hostname
sudo hostnamectl set-hostname box.fadhlirajwaa.my.id

# Verify
hostname -f
# Should show: box.fadhlirajwaa.my.id

# Update /etc/hosts
sudo nano /etc/hosts

# Add this line (replace IP with yours!):
20.212.45.78 box.fadhlirajwaa.my.id box

# Save: Ctrl+O, Enter, Ctrl+X

# Reboot
sudo reboot

# Wait 2 minutes, then reconnect
ssh -i mail-server-key.pem azureuser@20.212.45.78
```

---

### **Step 3.3: Install Mail-in-a-Box**

```bash
# Download and run installer
cd ~
curl -s https://mailinabox.email/setup.sh | sudo bash
```

**During Installation (30-60 minutes):**

```
1. Email Address for Admin:
   → admin@fadhlirajwaa.my.id
   Press Enter

2. Hostname:
   → box.fadhlirajwaa.my.id (should auto-detect)
   Press Enter

3. Country Code:
   → ID
   Press Enter

4. Password for admin@fadhlirajwaa.my.id:
   → [Enter strong password]
   ⚠️ WRITE THIS DOWN!
   → [Confirm password]

5. Timezone:
   → Asia/Jakarta (should auto-detect)
   Press Enter

Installation will continue...
☕ Take a break! 30-60 minutes
```

**What Gets Installed:**
- Postfix (SMTP server)
- Dovecot (IMAP/POP3 server)
- Roundcube (Webmail)
- Nginx (Web server)
- SpamAssassin (Spam filter)
- Let's Encrypt (SSL certificates)

---

### **Step 3.4: Post-Installation**

```
After installation completes:

---------------------------------------
Your Mail-in-a-Box is running!

Please log in to the control panel:
https://box.fadhlirajwaa.my.id/admin

Username: admin@fadhlirajwaa.my.id
Password: [your password]
---------------------------------------
```

✅ Email server is now RUNNING!

---

## 🔍 PHASE 4: CONFIGURATION & TESTING (1-2 hours)

### **Step 4.1: Access Admin Panel**

```
1. Open browser: https://box.fadhlirajwaa.my.id/admin

2. Login:
   Email: admin@fadhlirajwaa.my.id
   Password: [your password]

3. You'll see Mail-in-a-Box dashboard ✅
```

---

### **Step 4.2: Fix DNS Warnings**

```
Admin Panel → System → Status Checks

You'll see warnings for DNS records.

For each warning:
1. Click to see required record
2. Go to Cloudflare DNS
3. Add the record
4. Common records needed:

SPF Record:
Type: TXT
Name: @
Value: v=spf1 mx -all
TTL: Auto
→ Save

DKIM Record:
Type: TXT
Name: mail._domainkey
Value: [Copy from Mail-in-a-Box]
TTL: Auto
→ Save

DMARC Record:
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine
TTL: Auto
→ Save

5. Wait 10-30 minutes
6. Click "Check Again" in Mail-in-a-Box
7. Repeat until all green ✅
```

---

### **Step 4.3: Create Test Mailbox**

```
Admin Panel → Mail → Users

Click: Add User

Email: test@fadhlirajwaa.my.id
Password: [strong password]
Quota: Default
→ Add

✅ First mailbox created!
```

---

### **Step 4.4: Test Email**

**Test Receiving:**
```
1. Send email from Gmail to: test@fadhlirajwaa.my.id
2. Access webmail: https://box.fadhlirajwaa.my.id/mail
3. Login: test@fadhlirajwaa.my.id
4. Check inbox
5. Email should arrive! ✅
```

**Test Sending:**
```
1. In webmail, compose new email
2. To: Your Gmail
3. Send
4. Check Gmail
5. Should receive! ✅
```

✅ Email server working perfectly!

---

**CONTINUE TO PART 2: INTEGRATION_WITH_TEMP_MAIL.md**

Created by: Jarvis for Tuan Fadhli
Date: 8 November 2025
Part: 1 of 2
