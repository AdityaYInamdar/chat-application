from loguru import logger
from src.db.alchemy import Base

try:
    users = Base.classes.users

except Exception as err:
    logger.error("error while creating models - {}".format(err))