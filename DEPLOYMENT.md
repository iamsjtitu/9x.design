# 9x.design — VPS Deployment Guide

Complete production deployment guide for hosting `9x.design` alongside your existing `admin.9x.design` on the same VPS.

**Architecture:**
```
Internet → Nginx (80/443) → ├─ admin.9x.design  (your existing app, untouched)
                            └─ 9x.design / www.9x.design
                                 ├─ /        → static Vite build (dist/)
                                 └─ /api/*   → FastAPI on 127.0.0.1:8001
                            
Shared:  MongoDB :27017   (new DB name: nine_x_design)
```

Assumes Ubuntu/Debian VPS with **sudo access**. Replace `<YOUR_REPO_URL>` with your GitHub repo URL (e.g. `https://github.com/iamsjtitu/9x-design-studio.git`).

---

## 0 · Prerequisites on VPS

Check what's already installed:

```bash
node --version        # Need >= 18
python3 --version     # Need >= 3.10
mongod --version      # Already running (admin app uses it)
nginx -v              # Already running
git --version
```

Install missing bits (most likely Node + yarn):

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Yarn (global)
sudo npm install -g yarn

# Python venv
sudo apt-get install -y python3-venv python3-pip

# Certbot for SSL
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## 1 · DNS Setup (at your domain registrar)

Before SSL works, DNS must point to your VPS.

| Type  | Name | Value                | TTL   |
| ----- | ---- | -------------------- | ----- |
| A     | @    | `<YOUR_VPS_IP>`      | 3600  |
| A     | www  | `<YOUR_VPS_IP>`      | 3600  |
| A     | admin| `<YOUR_VPS_IP>`      | 3600  | (already set)

Verify DNS has propagated:
```bash
dig 9x.design +short
dig www.9x.design +short
```
Both should return your VPS IP. Usually takes 5–30 minutes.

---

## 2 · Clone the repo

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone <YOUR_REPO_URL> 9x-design
cd 9x-design
ls -la   # should see: frontend/  backend/
```

---

## 3 · Backend setup (FastAPI on 127.0.0.1:8001)

```bash
cd /var/www/9x-design/backend

# Create Python venv
python3 -m venv venv
source venv/bin/activate

# Install deps
pip install --upgrade pip
pip install -r requirements.txt
```

### Configure `.env` (production)

```bash
nano /var/www/9x-design/backend/.env
```

Paste (edit the Resend key + email values):

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="nine_x_design"
CORS_ORIGINS="https://9x.design,https://www.9x.design"
RESEND_API_KEY="re_FS8RA7H5_MBnjJzFJybqbzganCzRc9iNc"
SENDER_EMAIL="hello@9x.design"
RECEIVER_EMAIL="sales@9x.design"
```

> ⚠️ Tighten `CORS_ORIGINS` to your real domains — `*` is fine locally, not in prod.

### Quick smoke test (before systemd)

```bash
cd /var/www/9x-design/backend
source venv/bin/activate
uvicorn server:app --host 127.0.0.1 --port 8001
# Open another shell:
curl http://127.0.0.1:8001/api/health
# Expected: {"status":"ok","email_configured":true,"db":"connected"}
# Ctrl-C to stop
```

### Create systemd service

```bash
sudo nano /etc/systemd/system/9x-backend.service
```

Paste (change `YOUR_USER` to your VPS username, typically `ubuntu` or `root`):

```ini
[Unit]
Description=9x.design FastAPI backend
After=network.target mongodb.service

[Service]
Type=simple
User=YOUR_USER
Group=YOUR_USER
WorkingDirectory=/var/www/9x-design/backend
EnvironmentFile=/var/www/9x-design/backend/.env
ExecStart=/var/www/9x-design/backend/venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
Restart=always
RestartSec=5
StandardOutput=append:/var/log/9x-backend.log
StandardError=append:/var/log/9x-backend.err.log

[Install]
WantedBy=multi-user.target
```

Enable + start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable 9x-backend
sudo systemctl start 9x-backend
sudo systemctl status 9x-backend     # should show active (running)

# Verify
curl http://127.0.0.1:8001/api/health
```

---

## 4 · Frontend build (Vite static)

### Set the production backend URL in `.env`

```bash
cd /var/www/9x-design/frontend
nano .env
```

Replace the contents with:

```env
REACT_APP_BACKEND_URL=https://9x.design
VITE_BACKEND_URL=https://9x.design
```

### Install + build

```bash
yarn install
yarn build
# produces /var/www/9x-design/frontend/dist/
ls dist/    # should see index.html + assets/
```

That's it — no long-running frontend process needed. Nginx will serve the `dist/` folder as plain static files.

---

## 5 · Nginx config for 9x.design

```bash
sudo nano /etc/nginx/sites-available/9x.design
```

Paste this complete config (HTTP — we'll add SSL in step 6):

```nginx
# -------- 9x.design (main site) --------
server {
    listen 80;
    listen [::]:80;
    server_name 9x.design www.9x.design;

    # Frontend static files (Vite build output)
    root /var/www/9x-design/frontend/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;

    # Long cache for hashed assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # API → FastAPI backend
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
    }

    # SPA fallback — all other routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    client_max_body_size 10M;
    access_log /var/log/nginx/9x.design.access.log;
    error_log  /var/log/nginx/9x.design.error.log;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/9x.design /etc/nginx/sites-enabled/
sudo nginx -t                    # syntax check
sudo systemctl reload nginx
```

Test HTTP (before SSL):
```bash
curl -I http://9x.design
# Expected: HTTP/1.1 200 OK
```

---

## 6 · SSL via Let's Encrypt (free, auto-renewing)

```bash
sudo certbot --nginx -d 9x.design -d www.9x.design
```

Certbot will:
- Ask for your email
- Accept ToS
- Offer to redirect HTTP → HTTPS → choose **yes (option 2)**
- Automatically update the nginx config with SSL blocks

Verify:
```bash
curl -I https://9x.design
sudo certbot renew --dry-run      # test auto-renewal
```

Auto-renewal is already a systemd timer (`certbot.timer`) — you don't need to do anything.

---

## 7 · Final smoke test

Open in browser:

- ✅ `https://9x.design` → landing page loads
- ✅ `https://www.9x.design` → redirects to `https://9x.design`
- ✅ `https://9x.design/api/health` → `{"status":"ok","email_configured":true,"db":"connected"}`
- ✅ Submit the contact form → check `sales@9x.design` inbox
- ✅ `https://admin.9x.design` → still works (untouched)

---

## 8 · Re-deploy workflow (every time you push new code)

From Emergent, hit **"Save to GitHub"** (pushes latest code to your repo).

Then on VPS:

```bash
cd /var/www/9x-design

# Pull latest code
git pull origin main       # or whatever branch

# Rebuild frontend
cd frontend
yarn install               # only if deps changed
yarn build

# Restart backend (if backend code changed)
sudo systemctl restart 9x-backend

# Nginx reload (only if nginx config changed — usually NOT needed)
# sudo systemctl reload nginx

# Done ✅
```

Optional: save this as `/var/www/9x-design/redeploy.sh` for one-command redeploy:

```bash
#!/usr/bin/env bash
set -e
cd /var/www/9x-design
git pull origin main
cd frontend && yarn install --frozen-lockfile && yarn build
sudo systemctl restart 9x-backend
echo "✅ 9x.design redeployed at $(date)"
```

Make executable: `chmod +x redeploy.sh` → run with `./redeploy.sh`

---

## 9 · Troubleshooting

### Frontend loads but `/api/*` returns 404 / 502

```bash
sudo systemctl status 9x-backend
sudo tail -f /var/log/9x-backend.err.log
curl http://127.0.0.1:8001/api/health     # direct backend test
```

### Backend starts but can't connect to MongoDB

```bash
sudo systemctl status mongod
mongosh --eval 'db.runCommand({ping:1})'
```

### "502 Bad Gateway"
Nginx can't reach the backend. Ensure:
- Backend is running on `127.0.0.1:8001` (NOT `0.0.0.0`)
- SELinux/ufw aren't blocking localhost

```bash
sudo ufw status    # should allow 22, 80, 443
# If ufw blocks, localhost traffic is fine — no rule needed
```

### Contact form POST returns 422
That's Pydantic validation — message length <5 or invalid email. Check browser console.

### Emails not landing in sales@9x.design inbox
1. Check `curl https://9x.design/api/health` shows `email_configured: true`
2. Check backend logs: `sudo tail -f /var/log/9x-backend.err.log` → look for "Lead email sent: <id>" vs "Failed to send"
3. Check Resend dashboard → https://resend.com/emails → status per email
4. Check spam folder / Zoho/Gmail filters
5. **Mailbox must exist** — see "Mailbox setup" below

---

## 10 · Mailbox hosting for sales@9x.design

Resend sends emails TO `sales@9x.design` but you need an actual inbox to read them. Pick one:

### Option A — Zoho Mail (FREE, recommended)
- https://www.zoho.com/mail/
- Up to 5 users free on your custom domain
- Add MX + SPF + DKIM records at your registrar (Zoho will show them)

### Option B — Google Workspace
- https://workspace.google.com → ~₹136/user/month
- Gmail interface with `@9x.design`

### Option C — Email forwarding (simplest)
- Most domain registrars (GoDaddy / Namecheap / Cloudflare) offer free email forwarding
- Forward `sales@9x.design` → `iamsjtitu@gmail.com`
- Incoming only — can read but can't easily reply *as* sales@

---

## 11 · Optional hardening (recommended before public launch)

- [ ] `/api/leads` endpoint currently has **no auth** — add JWT protection or remove from production
- [ ] Tighten CORS in backend `.env`: `CORS_ORIGINS="https://9x.design,https://www.9x.design"`
- [ ] Add rate-limiting to `/api/contact` (nginx limit_req, or a library like `slowapi`)
- [ ] Enable UFW firewall: `sudo ufw allow ssh && sudo ufw allow 'Nginx Full' && sudo ufw enable`
- [ ] MongoDB auth — currently localhost-only, but add a user if you ever expose 27017
- [ ] Setup daily MongoDB backup: `mongodump` → cron → S3/Backblaze

---

## Quick reference

| Thing | Path / Command |
| ----- | -------------- |
| Frontend build | `/var/www/9x-design/frontend/dist/` |
| Backend code | `/var/www/9x-design/backend/` |
| Backend service | `sudo systemctl {status,restart,stop} 9x-backend` |
| Backend logs | `sudo tail -f /var/log/9x-backend.{log,err.log}` |
| Nginx config | `/etc/nginx/sites-available/9x.design` |
| Nginx logs | `/var/log/nginx/9x.design.{access,error}.log` |
| SSL renewal | Automatic via `certbot.timer` |
| DB name | `nine_x_design` (in MongoDB) |
| Health check | `curl https://9x.design/api/health` |

---

**That's it — aap ready ho production ke liye! 🚀**

Agar koi step pe stuck ho, logs bhejo (`sudo tail -n 100 /var/log/9x-backend.err.log` ya `sudo tail -n 50 /var/log/nginx/9x.design.error.log`) — main turant debug kar dunga.
