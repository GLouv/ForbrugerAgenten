import os
import logging
import json
import urllib.request
import urllib.error

logger = logging.getLogger(__name__)

class EmailSender:
    def __init__(self):
        # Default credentials from project configuration
        self.api_key = os.getenv("SENDGRID_API_KEY", "REDACTED_SENDGRID_KEY")
        self.from_email = os.getenv("SENDGRID_FROM_EMAIL", "noreply@forbrugeragent.dk")

    def send_email(self, to_email: str, subject: str, body: str, html_body: str = None):
        if not self.api_key:
            logger.warning("SendGrid API key not set. Email not sent.")
            return False

        try:
            url = "https://api.sendgrid.com/v3/mail/send"
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "personalizations": [
                    {
                        "to": [{"email": to_email}]
                    }
                ],
                "from": {"email": self.from_email},
                "subject": subject,
                "content": [
                    {
                        "type": "text/plain",
                        "value": body
                    }
                ]
            }
            
            if html_body:
                data["content"].append({
                    "type": "text/html",
                    "value": html_body
                })

            req = urllib.request.Request(
                url, 
                data=json.dumps(data).encode('utf-8'), 
                headers=headers, 
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                if response.status in (200, 201, 202):
                    logger.info(f"Email sent to {to_email}")
                    return True
                else:
                    logger.error(f"Failed to send email. Status: {response.status}")
                    return False
                    
        except urllib.error.HTTPError as e:
            logger.error(f"SendGrid API Error: {e.code} - {e.read().decode('utf-8')}")
            return False
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False

# Global instance
email_sender = EmailSender()

