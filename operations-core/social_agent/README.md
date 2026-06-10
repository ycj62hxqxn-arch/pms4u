# Social Media Local Agent

A local agent for social media automation:
- Logs actions
- Posts to platforms (Facebook, Instagram, WhatsApp, etc.)
- Publishes and comments
- Finalises leads (updates CRM)
- Fully automatable and can be extended for real API integration

## Usage Example
```python
from agent import SocialAgent

agent = SocialAgent(api_url="http://localhost:8000")
agent.log_action("new_lead", lead_id="1234", details={"source": "Instagram"})
agent.post("Instagram", "Welcome to Ägypten Hautnah! Book your tour now.")
agent.comment("Facebook", post_id="abcd1234", comment="Thank you for your interest!")
agent.finalise_lead("1234")
```
