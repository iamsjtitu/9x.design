"""Backend API tests for 9x.design studio backend.

Covers: /api/health, /api/contact (validation + normalization + persistence),
/api/leads (list w/o _id). Uses public REACT_APP_BACKEND_URL with /api prefix.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get(
    "REACT_APP_BACKEND_URL",
    "https://design-workspace-40.preview.emergentagent.com",
).rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ── Health ───────────────────────────────────────────────────────────────────
class TestHealth:
    def test_health_ok(self, client):
        r = client.get(f"{API}/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "email_configured" in data
        assert data["db"] == "connected"
        # RESEND_API_KEY is empty per task note
        assert data["email_configured"] is False


# ── Contact form happy path + persistence ────────────────────────────────────
class TestContact:
    created_ids: list = []

    def test_contact_submit_valid(self, client):
        payload = {
            "name": "TEST_John Doe",
            "email": "test_john@example.com",
            "service": "web",
            "message": "We need a new website for our SaaS product.",
            "company": "TEST Acme Inc",
            "budget": "5k-10k",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["success"] is True
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "message" in data and len(data["message"]) > 0
        TestContact.created_ids.append(data["id"])

    def test_contact_persisted_in_leads(self, client):
        # Must have at least one lead from previous test; verify listing works
        r = client.get(f"{API}/leads?limit=50", timeout=15)
        assert r.status_code == 200
        leads = r.json()
        assert isinstance(leads, list)
        # Ensure no _id leakage
        for ld in leads:
            assert "_id" not in ld
        # Our created id should be in the list
        ids = [ld["id"] for ld in leads]
        assert TestContact.created_ids[0] in ids
        # Find it and validate fields
        mine = next(ld for ld in leads if ld["id"] == TestContact.created_ids[0])
        assert mine["name"] == "TEST_John Doe"
        assert mine["email"] == "test_john@example.com"
        assert mine["service"] == "web"
        assert mine["company"] == "TEST Acme Inc"
        assert mine["budget"] == "5k-10k"
        assert mine["email_sent"] is False  # RESEND not configured

    def test_contact_service_normalized_to_other(self, client):
        payload = {
            "name": "TEST_Jane",
            "email": "test_jane@example.com",
            "service": "unknown-service-xyz",
            "message": "Need help with something custom.",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200
        lead_id = r.json()["id"]
        TestContact.created_ids.append(lead_id)

        # Verify persisted service == 'other'
        r2 = client.get(f"{API}/leads?limit=50", timeout=15)
        assert r2.status_code == 200
        mine = next(ld for ld in r2.json() if ld["id"] == lead_id)
        assert mine["service"] == "other"

    def test_contact_invalid_email_returns_422(self, client):
        payload = {
            "name": "TEST_Bad",
            "email": "not-an-email",
            "service": "web",
            "message": "Hello there friend.",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contact_short_name_returns_422(self, client):
        payload = {
            "name": "A",
            "email": "test_shortname@example.com",
            "service": "web",
            "message": "Hello there friend.",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contact_short_message_returns_422(self, client):
        payload = {
            "name": "TEST_Bob",
            "email": "test_bob@example.com",
            "service": "web",
            "message": "hi",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_contact_minimal_payload_no_company_budget(self, client):
        payload = {
            "name": "TEST_Min",
            "email": "test_min@example.com",
            "service": "software",
            "message": "Minimal payload without company and budget.",
        }
        r = client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200
        lead_id = r.json()["id"]
        TestContact.created_ids.append(lead_id)

        r2 = client.get(f"{API}/leads?limit=50", timeout=15)
        mine = next(ld for ld in r2.json() if ld["id"] == lead_id)
        assert mine["company"] is None
        assert mine["budget"] is None
        assert mine["service"] == "software"


# ── Leads listing ────────────────────────────────────────────────────────────
class TestLeads:
    def test_leads_list_no_objectid(self, client):
        r = client.get(f"{API}/leads", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for ld in data:
            assert "_id" not in ld
            assert "id" in ld
            assert "email" in ld
            assert "name" in ld
