from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import html
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Email config
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
RECEIVER_EMAIL = os.environ.get('RECEIVER_EMAIL', 'sales@9x.design')

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# Create the main app without a prefix
app = FastAPI(title="9x.design API", version="1.0.0")

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
    email_sent: bool = False


class ContactResponse(BaseModel):
    id: str
    success: bool = True
    message: str = "Thanks! We'll get back to you within 24 hours."


# ── Email helper ─────────────────────────────────────────────────────────────
def _build_lead_email_html(lead: Lead) -> str:
    service_label = {
        "web": "Website Development",
        "software": "Software Development",
        "mobile": "Mobile App Development",
        "uiux": "UI/UX Design",
        "other": "Other",
    }.get(lead.service, lead.service.title())

    # Escape user-provided content before injecting into the HTML template
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


async def _send_lead_email(lead: Lead) -> bool:
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not set — skipping email notification")
        return False
    params = {
        "from": SENDER_EMAIL,
        "to": [RECEIVER_EMAIL],
        "reply_to": lead.email,
        "subject": f"New Lead — {lead.name} ({lead.service})",
        "html": _build_lead_email_html(lead),
    }
    try:
        email = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Lead email sent: {email.get('id')}")
        return True
    except Exception as e:
        logger.error(f"Failed to send lead email: {e}")
        return False


# ── Routes ───────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "9x.design API", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "ok",
        "email_configured": bool(RESEND_API_KEY),
        "db": "connected",
    }


@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(payload: LeadCreate):
    # Normalize service field
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

    # Fire-and-ack: send email but don't block response on failure
    email_sent = await _send_lead_email(lead)
    lead.email_sent = email_sent

    # Persist to MongoDB (datetime -> ISO string)
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    try:
        await db.leads.insert_one(doc)
    except Exception as e:
        logger.error(f"DB insert failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to save lead")

    return ContactResponse(id=lead.id)


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(limit: int = 100):
    leads = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for lead in leads:
        if isinstance(lead.get('created_at'), str):
            try:
                lead['created_at'] = datetime.fromisoformat(lead['created_at'])
            except ValueError:
                lead['created_at'] = datetime.now(timezone.utc)
    return leads


# Keep legacy status endpoints for compatibility
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
