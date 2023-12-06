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
strKey = "ER#&^HGJNFDVSAdsdwoasdSDwyhq@zxw"

@router.post('/register', tags=["register"])
#basic registration single table function
def register(
        username: str = Body(...),
        password: str = Body(...),
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # verify if same username exists in db
        same_user_query = db.query(users).filter_by(username=username).all()
        if len(same_user_query) > 0:
            raise HTTPException(status_code=400, detail=f"Username Already Exists")
        user_add = users(
            username=username,
            password=password,
            created_time=datetime.now(),
            updated_time=datetime.now(),
            is_deleted=0,
            is_active=0
        )
        db.add(user_add)
        db.commit()
        return {
            "status": True,
            "message": "User Registered Successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")


@router.post('/login', tags=["User / Login"])
def auth_route(
        username: str = Body(...),
        password: str = Body(...),
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:

        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        query = f"""
            SELECT u.*
            FROM users u
            WHERE u.username='{username}' AND u.password='{password}' AND u.is_deleted=0
        """
        cursor.execute(query)
        res = cursor.fetchall()
        if len(res) > 0:
            db.query(users).filter_by(username=username).update({
                "updated_time": datetime.now(),
                "last_login": datetime.now(),
                "is_active": 1
            })
        db.commit()
        if len(res) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid username or password!")

        token = generate_token({
            "username": username,
            "user_id": res[0]["user_id"],
        }, set_expiry=True)

        return {
            "data": {
                "token": token,
            }
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")

@router.post('/logout', tags=["User / Logout"])
def logout(
        user_id: int,
        db: Session = Depends(get_db),
        rdb: Session = Depends(get_raw_db)
):
    try:
        cursor = rdb.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        query = f"""
            SELECT u.*
            FROM users u
            WHERE u.user_id = {user_id} AND u.is_deleted=0
        """
        cursor.execute(query)
        res = cursor.fetchall()
        if len(res) == 0:
            raise HTTPException(status_code=404, detail=f"Invalid username!")

        db.query(users).filter_by(user_id=user_id).update({
            "updated_time": datetime.now(),
            "is_active": 0
        })
        db.commit()
        return {
            "status": True,
            "message": "User Logged Out Successfully"
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")
# test Route for SqlAlchemy ORM
@router.get('/test', tags=["Templates"])
def test(password: str, db: Session = Depends(get_db), rdb: Session = Depends(get_raw_db)):
    try:
        strKey = "ER#&^HGJNFDVSAdsdwoasdSDwyhq@zxw"
        print(fnDecrypt('DjBdcAdnVX0Mb1diAzoCYw==', strKey))
        print(fnDecrypt('WGYJJAFhACgGZQI3UGkHZg==', strKey))

        return fnDecrypt(password, strKey)

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")


def fnDecrypt(strString, strKey):
    strString = fnKeyED(base64.b64decode(strString), strKey)
    strTemp = ""

    i = 0
    for cnt in range(len(strString)):
        ch1 = strString[i]
        i += 1
        if i >= len(strString):
            ch2 = chr(2)
        else:
            ch2 = strString[i]

        strTemp += chr(ord(ch2) ^ ord(ch1))
        i += 1

        if i >= len(strString):
            break

    return strTemp


def fnKeyED(strString, strEncryptKey):
    strEncryptKey = hashlib.md5(strEncryptKey.encode()).hexdigest()
    intCtr = 0
    strTemp = ""
    for i in range(len(strString)):
        if intCtr == len(strEncryptKey):
            intCtr = 0

        ch = strString[i]
        ch2 = strEncryptKey[intCtr]
        strTemp += chr(ch ^ ord(ch2))

        intCtr += 1
    return strTemp
