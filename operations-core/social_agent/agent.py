import requests
from typing import Optional

class SocialAgent:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def log_action(self, action: str, lead_id: Optional[str] = None, details: Optional[dict] = None):
        print(f"[LOG] {action} | Lead: {lead_id} | Details: {details}")
        # Optionally, send to a logging endpoint or file

    def post(self, platform: str, message: str, media_url: Optional[str] = None):
        print(f"[POST] Platform: {platform} | Message: {message} | Media: {media_url}")
        # Integrate with platform API (e.g., Facebook, Instagram, WhatsApp)
        # Placeholder for actual API call
        return True

    def comment(self, platform: str, post_id: str, comment: str):
        print(f"[COMMENT] Platform: {platform} | Post: {post_id} | Comment: {comment}")
        # Placeholder for actual API call
        return True

    def finalise_lead(self, lead_id: str):
        print(f"[FINALISE] Lead: {lead_id}")
        # Example: update lead state to COMPLETED in operations-core
        resp = requests.get(f"{self.api_url}/leads/{lead_id}")
        if resp.status_code == 200:
            lead = resp.json()
            # Only update if not already completed
            if lead['state'] != 'COMPLETED':
                # Here you would call a PATCH/PUT endpoint to update state
                print(f"Would update lead {lead_id} to COMPLETED (implement PATCH call)")
        else:
            print(f"Lead {lead_id} not found.")
        return True
