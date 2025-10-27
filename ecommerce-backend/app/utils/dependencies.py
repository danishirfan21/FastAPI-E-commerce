from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils import auth as auth_utils

security = HTTPBearer()


def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = auth_utils.jwt = {}  # placeholder — decode if needed
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    # In a real app, fetch user here
    return {"id": 1}
