from fastapi import APIRouter, Depends, HTTPException, Body, Query
from sqlalchemy.orm import Session
import pymysql.cursors
from pydantic import BaseModel
from typing import Optional
from src.utils.MySQLConnection import MySQLConnection
from . import get_db, get_raw_db
from src.utils.jwt_utils import generate_token
from src.db.alchemy_models import users
import base64
import hashlib
from datetime import datetime, timedelta
import psycopg2.extras

router = APIRouter()

@router.get('/all-users', tags=["users"])
def get_all_users(
        db: Session = Depends(get_db)
):
    try:
        users_query = db.query(users).all()
        if len(users_query) == 0:
            raise HTTPException(status_code=400, detail=f"No Users Found")
        return {'data': users_query}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")