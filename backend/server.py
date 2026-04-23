from fastapi import FastAPI, APIRouter, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import asyncio
import html
import logging
import secrets
import subprocess
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone

import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL', 'sales@9x.design')

# Static files config (for production — serve Vite build output)
FRONTEND_DIST_DIR = os.environ.get(
    'FRONTEND_DIST_DIR',
    str((ROOT_DIR / '..' / 'frontend' / 'dist').resolve()),
)
SERVE_STATIC = os.environ.get('SERVE_STATIC', 'false').lower() in ('1', 'true', 'yes')

# Deploy config (for one-click GitHub auto-update)
DEPLOY_SECRET = os.environ.get('DEPLOY_SECRET', '')
DEPLOY_REPO_DIR = os.environ.get(
    'DEPLOY_REPO_DIR',
    str((ROOT_DIR / '..').resolve()),
)
DEPLOY_LOG_FILE = os.environ.get('DEPLOY_LOG_FILE', '/var/log/9x-deploy.log')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app
app = FastAPI(title="9x.design API", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ── Models ───────────────────────────────────────────────────────────────────
SERVICE_CHOICES = {"web", "software", "mobile", "uiux", "other"}


class LeadCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    service: Optional[str] = Field(default="other", max_length=40)
    message: str = Field(..., min_length=5, max_length=4000)
    company: Optional[str] = Field(default=None, max_length=120)
    budget: Optional[str] = Field(default=None, max_length=40)


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    service: str = "other"
    message: str
    company: Optional[str] = None
    budget: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactResponse(BaseModel):
    id: str
    success: bool = True
    message: str = "Thanks! We'll get back to you within 24 hours."


# ── Email helpers ────────────────────────────────────────────────────────────
def _build_lead_email_html(lead: Lead) -> str:
    service_label = {
        "web": "Website Development",
        "software": "Software Development",
        "mobile": "Mobile App Development",
        "uiux": "UI/UX Design",
        "other": "Other",
    }.get(lead.service, lead.service.title())

    e_name = html.escape(lead.name)
    e_email = html.escape(lead.email)
    e_message = html.escape(lead.message)
    e_company = html.escape(lead.company) if lead.company else ''
    e_budget = html.escape(lead.budget) if lead.budget else ''
    first_name = html.escape(lead.name.split()[0]) if lead.name.strip() else 'them'

    return f"""\
<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(20,20,30,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#FF4400,#FFA500);padding:28px 32px;color:#ffffff;">
              <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.9;">9x.design · New Lead</div>
              <div style="font-size:24px;font-weight:700;margin-top:6px;">{e_name}</div>
              <div style="font-size:14px;opacity:0.9;margin-top:2px;">{e_email}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;color:#1a1d23;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Service</td>
                </tr>
                <tr>
                  <td style="padding:0 0 16px 0;font-size:15px;color:#111827;font-weight:600;">{service_label}</td>
                </tr>
                {"<tr><td style='padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;'>Company</td></tr><tr><td style='padding:0 0 16px 0;font-size:15px;color:#111827;'>" + e_company + "</td></tr>" if e_company else ""}
                {"<tr><td style='padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;'>Budget</td></tr><tr><td style='padding:0 0 16px 0;font-size:15px;color:#111827;'>" + e_budget + "</td></tr>" if e_budget else ""}
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Project Details</td>
                </tr>
                <tr>
                  <td style="padding:0;font-size:15px;line-height:1.6;color:#111827;white-space:pre-wrap;">{e_message}</td>
                </tr>
              </table>
              <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0;" />
              <p style="font-size:12px;color:#6b7280;margin:0;">Received on {lead.created_at.strftime('%d %b %Y, %H:%M UTC')} · Lead ID: {lead.id}</p>
              <div style="margin-top:20px;">
                <a href="mailto:{e_email}" style="display:inline-block;background:#FF4400;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;">Reply to {first_name}</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px;">
              9x.design — Digital Studio · Automated notification
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


async def _send_lead_email(lead: Lead) -> str | None:
    """Send the lead notification email. Returns Resend message id or None on failure."""
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — email skipped")
        return None
    params = {
        "from": SENDER_EMAIL,
        "to": [RECEIVER_EMAIL],
        "reply_to": lead.email,
        "subject": f"New Lead — {lead.name} ({lead.service})",
        "html": _build_lead_email_html(lead),
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        msg_id = email.get("id")
        logger.info(f"Lead email sent: {msg_id}")
        return msg_id
    except Exception as e:
        logger.error(f"Failed to send lead email: {e}")
        return None


# ── Routes ───────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "9x.design API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "email_configured": bool(RESEND_API_KEY),
        "sender": SENDER_EMAIL,
        "receiver": RECEIVER_EMAIL,
    }


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: LeadCreate):
    service = (payload.service or "other").lower().strip()
    if service not in SERVICE_CHOICES:
        service = "other"

    lead = Lead(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        service=service,
        message=payload.message.strip(),
        company=payload.company.strip() if payload.company else None,
        budget=payload.budget.strip() if payload.budget else None,
    )

    msg_id = await _send_lead_email(lead)
    if not msg_id:
        # Email failed — still return success to user but log error
        # (User already filled form; we don't want them to retry)
        logger.error(f"Email delivery failed for lead {lead.id} ({lead.email})")
        raise HTTPException(
            status_code=502,
            detail="Unable to send your message right now. Please email us directly at sales@9x.design",
        )

    return ContactResponse(id=lead.id)


# ── Deploy (one-click GitHub auto-update) ────────────────────────────────────
def _verify_deploy_token(token: str) -> bool:
    """Constant-time token comparison."""
    if not DEPLOY_SECRET or not token:
        return False
    return secrets.compare_digest(token, DEPLOY_SECRET)


def _git(*args: str, cwd: str | None = None) -> str:
    """Run a git command and return stdout (stripped)."""
    result = subprocess.run(
        ['git', *args],
        cwd=cwd or DEPLOY_REPO_DIR,
        capture_output=True,
        text=True,
        timeout=30,
    )
    if result.returncode != 0:
        raise HTTPException(500, f"git {args[0]} failed: {result.stderr.strip()}")
    return result.stdout.strip()


@api_router.get("/deploy/status")
async def deploy_status(x_deploy_token: str = Header(default="")):
    """Check current version and whether an update is available."""
    if not _verify_deploy_token(x_deploy_token):
        raise HTTPException(401, "Invalid deploy token")

    try:
        current = _git('rev-parse', 'HEAD')
        # Fetch latest from remote (quiet)
        subprocess.run(
            ['git', 'fetch', '--all', '-q'],
            cwd=DEPLOY_REPO_DIR,
            capture_output=True,
            timeout=30,
        )
        # Resolve default remote branch (origin/HEAD)
        try:
            remote = _git('rev-parse', 'origin/HEAD')
        except HTTPException:
            remote = _git('rev-parse', 'origin/main')
        latest_commit = _git(
            'log', '-1', '--pretty=%h · %s · %an · %ar',
            remote,
        )
        return {
            'current_sha': current[:7],
            'remote_sha': remote[:7],
            'has_update': current != remote,
            'latest_commit': latest_commit,
            'repo_dir': DEPLOY_REPO_DIR,
        }
    except subprocess.TimeoutExpired:
        raise HTTPException(504, "Git timed out — check network / repo access")


@api_router.post("/deploy/run")
async def deploy_run(x_deploy_token: str = Header(default="")):
    """Trigger deploy.sh in background (detached). Returns immediately."""
    if not _verify_deploy_token(x_deploy_token):
        raise HTTPException(401, "Invalid deploy token")

    deploy_script = Path(DEPLOY_REPO_DIR) / 'deploy.sh'
    if not deploy_script.is_file():
        raise HTTPException(
            500,
            f"deploy.sh not found at {deploy_script}. "
            "See README for setup.",
        )

    # Detach child process so systemctl restart can kill uvicorn without
    # killing the deploy script. nohup + new session = fully independent.
    subprocess.Popen(
        [
            'bash', '-c',
            f'nohup bash {deploy_script} >> {DEPLOY_LOG_FILE} 2>&1 &',
        ],
        start_new_session=True,
    )
    logger.info("Deploy triggered via API")
    return {
        'status': 'started',
        'log_file': DEPLOY_LOG_FILE,
        'message': (
            "Deploy started in background. The service will restart in ~30–60s. "
            "Use /api/deploy/logs to tail output."
        ),
    }


@api_router.get("/deploy/logs")
async def deploy_logs(
    x_deploy_token: str = Header(default=""),
    tail: int = 200,
):
    """Return the last N lines of the deploy log."""
    if not _verify_deploy_token(x_deploy_token):
        raise HTTPException(401, "Invalid deploy token")

    tail = max(1, min(int(tail), 2000))
    if not Path(DEPLOY_LOG_FILE).is_file():
        return {'logs': '(no deploy runs yet)', 'file': DEPLOY_LOG_FILE}

    try:
        out = subprocess.check_output(
            ['tail', '-n', str(tail), DEPLOY_LOG_FILE],
            text=True,
        )
        return {'logs': out, 'file': DEPLOY_LOG_FILE}
    except Exception as e:
        return {'logs': f'Error reading logs: {e}', 'file': DEPLOY_LOG_FILE}


# ── Include router ───────────────────────────────────────────────────────────
# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Deploy console (self-contained HTML, obscured URL) ──────────────────────
DEPLOY_PAGE_HTML = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<title>9x.design · Deploy Console</title>
<style>
  :root {
    --bg: #0b0d12; --panel: #111418; --border: #1f242c;
    --text: #e7ecf2; --muted: #8b95a5; --primary: #FF4400;
    --ok: #2dd4a4; --err: #ef4444; --warn: #f59e0b;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    font-size: 14px; line-height: 1.5; }
  .wrap { max-width: 720px; margin: 40px auto; padding: 0 20px; }
  .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .brand-mark { width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--primary), #ffa500);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; color: white; font-size: 13px; }
  .brand-text { font-weight: 700; letter-spacing: -0.02em; font-size: 18px; }
  .brand-sub { color: var(--muted); font-size: 11px; text-transform: uppercase;
    letter-spacing: 2px; margin-left: 6px; padding: 3px 8px; border: 1px solid var(--border); border-radius: 20px; }
  .panel { background: var(--panel); border: 1px solid var(--border);
    border-radius: 14px; padding: 24px; margin-bottom: 16px; }
  h1 { font-size: 22px; margin: 0 0 4px; letter-spacing: -0.02em; }
  .muted { color: var(--muted); }
  label { display: block; font-size: 12px; color: var(--muted);
    text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
  input[type=password], input[type=text] {
    width: 100%; padding: 11px 14px; background: #0b0d12; color: var(--text);
    border: 1px solid var(--border); border-radius: 10px; font-size: 14px;
    font-family: inherit; outline: none; transition: border .15s;
  }
  input:focus { border-color: var(--primary); }
  button { display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 18px; background: var(--primary); color: white; border: 0;
    border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer;
    transition: transform .15s, opacity .15s; font-family: inherit; }
  button:hover { transform: translateY(-1px); }
  button:disabled { opacity: .5; cursor: not-allowed; transform: none; }
  button.ghost { background: transparent; color: var(--text);
    border: 1px solid var(--border); }
  .row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .status-row { display: flex; justify-content: space-between; padding: 10px 0;
    border-bottom: 1px solid var(--border); font-size: 13px; }
  .status-row:last-child { border: 0; }
  .status-row .k { color: var(--muted); text-transform: uppercase;
    font-size: 11px; letter-spacing: 1.5px; }
  .status-row .v { font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px; }
  .pill { display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .pill.ok { background: rgba(45,212,164,.15); color: var(--ok);
    border: 1px solid rgba(45,212,164,.3); }
  .pill.warn { background: rgba(245,158,11,.15); color: var(--warn);
    border: 1px solid rgba(245,158,11,.3); }
  pre.logs { background: #05070a; border: 1px solid var(--border);
    padding: 16px; border-radius: 10px; max-height: 400px; overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px;
    line-height: 1.5; white-space: pre-wrap; word-break: break-word;
    color: #cdd3de; margin: 12px 0 0; }
  .error { background: rgba(239,68,68,.1); color: var(--err);
    border: 1px solid rgba(239,68,68,.3); padding: 10px 14px; border-radius: 10px;
    font-size: 13px; margin-top: 12px; }
  .success { background: rgba(45,212,164,.1); color: var(--ok);
    border: 1px solid rgba(45,212,164,.3); padding: 10px 14px; border-radius: 10px;
    font-size: 13px; margin-top: 12px; }
  .spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid currentColor;
    border-right-color: transparent; border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .hidden { display: none; }
</style>
</head>
<body>
<div class="wrap">
  <div class="brand">
    <div class="brand-mark">9x</div>
    <div class="brand-text">9x.design</div>
    <div class="brand-sub">Deploy Console</div>
  </div>

  <div id="auth-panel" class="panel">
    <h1>Enter deploy password</h1>
    <p class="muted" style="margin:4px 0 18px">Password is your <code>DEPLOY_SECRET</code> from backend <code>.env</code>.</p>
    <label>Password</label>
    <input id="token" type="password" autocomplete="current-password" placeholder="••••••••••••••••" autofocus />
    <div class="row"><button id="auth-btn">Unlock</button></div>
    <div id="auth-error" class="error hidden"></div>
  </div>

  <div id="main-panel" class="hidden">
    <div class="panel">
      <h1>Current version</h1>
      <div id="status-box">
        <div class="muted" style="margin-top:8px">Loading…</div>
      </div>
      <div class="row">
        <button id="check-btn" class="ghost">↻ Refresh</button>
        <button id="deploy-btn">⬇ Deploy latest</button>
        <button id="logs-btn" class="ghost">📜 Show logs</button>
        <button id="logout-btn" class="ghost" style="margin-left:auto">Logout</button>
      </div>
      <div id="action-result" class="hidden"></div>
    </div>

    <div id="logs-panel" class="panel hidden">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <h1 style="margin:0">Deploy logs</h1>
        <button id="logs-refresh" class="ghost">↻ Refresh</button>
      </div>
      <pre id="logs-out" class="logs">Loading logs…</pre>
    </div>
  </div>
</div>

<script>
const TOKEN_KEY = '9x_deploy_token';
let token = sessionStorage.getItem(TOKEN_KEY) || '';

const el = (id) => document.getElementById(id);
const show = (e) => e.classList.remove('hidden');
const hide = (e) => e.classList.add('hidden');

async function api(path, opts = {}) {
  const res = await fetch('/api' + path, {
    ...opts,
    headers: { 'X-Deploy-Token': token, ...(opts.headers || {}) },
  });
  if (res.status === 401) { throw new Error('Invalid password'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { throw new Error(data.detail || `HTTP ${res.status}`); }
  return data;
}

function showError(elm, msg) {
  elm.textContent = msg;
  elm.className = 'error';
  show(elm);
}
function showSuccess(elm, msg) {
  elm.textContent = msg;
  elm.className = 'success';
  show(elm);
}

async function renderStatus() {
  el('status-box').innerHTML = '<div class="muted" style="margin-top:8px"><span class="spinner"></span> Fetching…</div>';
  try {
    const s = await api('/deploy/status');
    const pill = s.has_update
      ? '<span class="pill warn">Update available</span>'
      : '<span class="pill ok">Up to date</span>';
    el('status-box').innerHTML = `
      <div class="status-row"><span class="k">State</span><span class="v">${pill}</span></div>
      <div class="status-row"><span class="k">Current SHA</span><span class="v">${s.current_sha}</span></div>
      <div class="status-row"><span class="k">Remote SHA</span><span class="v">${s.remote_sha}</span></div>
      <div class="status-row"><span class="k">Latest commit</span><span class="v">${s.latest_commit || '-'}</span></div>
    `;
    el('deploy-btn').disabled = !s.has_update;
  } catch (e) {
    el('status-box').innerHTML = `<div class="error">${e.message}</div>`;
  }
}

el('auth-btn').addEventListener('click', async () => {
  const val = el('token').value.trim();
  if (!val) return;
  token = val;
  try {
    // Validate by hitting status endpoint
    const res = await fetch('/api/deploy/status', { headers: { 'X-Deploy-Token': val } });
    if (res.status === 401) throw new Error('Invalid password');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    sessionStorage.setItem(TOKEN_KEY, val);
    hide(el('auth-panel'));
    show(el('main-panel'));
    renderStatus();
  } catch (e) {
    token = '';
    showError(el('auth-error'), e.message);
  }
});

el('token').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('auth-btn').click(); });

el('check-btn').addEventListener('click', renderStatus);

el('deploy-btn').addEventListener('click', async () => {
  const result = el('action-result');
  hide(result);
  if (!confirm('Pull latest from GitHub, rebuild frontend, and restart the service?\\n\\nSite will be briefly unavailable (~20s).')) return;
  el('deploy-btn').disabled = true;
  el('deploy-btn').innerHTML = '<span class="spinner"></span> Deploying…';
  try {
    const r = await api('/deploy/run', { method: 'POST' });
    showSuccess(result, r.message);
    show(el('logs-panel'));
    setTimeout(tailLogs, 2000);
    let ticks = 0;
    const timer = setInterval(() => { tailLogs(); if (++ticks > 30) clearInterval(timer); }, 3000);
  } catch (e) {
    showError(result, e.message);
  } finally {
    el('deploy-btn').innerHTML = '⬇ Deploy latest';
    setTimeout(() => { el('deploy-btn').disabled = false; renderStatus(); }, 90000);
  }
});

async function tailLogs() {
  try {
    const r = await api('/deploy/logs?tail=300');
    el('logs-out').textContent = r.logs;
    el('logs-out').scrollTop = el('logs-out').scrollHeight;
  } catch (e) {
    el('logs-out').textContent = 'Error: ' + e.message;
  }
}

el('logs-btn').addEventListener('click', () => { show(el('logs-panel')); tailLogs(); });
el('logs-refresh').addEventListener('click', tailLogs);

el('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem(TOKEN_KEY);
  token = '';
  location.reload();
});

// Auto-unlock if we already have a token
if (token) {
  el('auth-btn').click = null;
  (async () => {
    try {
      const res = await fetch('/api/deploy/status', { headers: { 'X-Deploy-Token': token } });
      if (res.ok) {
        hide(el('auth-panel'));
        show(el('main-panel'));
        renderStatus();
      }
    } catch (_) {}
  })();
}
</script>
</body>
</html>
"""


@app.get("/__deploy", include_in_schema=False, response_class=HTMLResponse)
async def deploy_page():
    """Self-contained password-protected deploy console."""
    return HTMLResponse(DEPLOY_PAGE_HTML)


# ── Static file serving (production only) ───────────────────────────────────
# When SERVE_STATIC=true, FastAPI also serves the Vite build as the frontend
# so you can run a single process on the VPS: uvicorn server:app. Cloudflare
# Tunnel → localhost:8001 and you're done — no nginx needed.
if SERVE_STATIC and Path(FRONTEND_DIST_DIR).is_dir():
    assets_dir = Path(FRONTEND_DIST_DIR) / 'assets'
    if assets_dir.is_dir():
        app.mount('/assets', StaticFiles(directory=str(assets_dir)), name='assets')

    @app.get('/{full_path:path}', include_in_schema=False)
    async def serve_spa(full_path: str):
        # API routes are already handled by the router above
        if full_path.startswith('api/'):
            raise HTTPException(status_code=404)

        # Try the requested file first (favicon.svg, vite.svg, _redirects, etc.)
        candidate = Path(FRONTEND_DIST_DIR) / full_path
        if full_path and candidate.is_file():
            return FileResponse(str(candidate))

        # Fallback to index.html (SPA routing)
        index = Path(FRONTEND_DIST_DIR) / 'index.html'
        if index.is_file():
            return FileResponse(str(index))
        raise HTTPException(status_code=404)

    logger.info(f"Serving frontend from: {FRONTEND_DIST_DIR}")
else:
    logger.info("Static file serving disabled (dev mode — Vite handles frontend on :3000)")
