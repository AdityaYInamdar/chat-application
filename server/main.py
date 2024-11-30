from fastapi import FastAPI
from uvicorn import run
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from src.routes.all_routes import router as all_routes
from os import getenv
from _thread import start_new_thread
import socketio
from socketio_events import sio

app = FastAPI(
    title="CMS V2 Admin Portal API",
    # root_path="/api"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


sio_app = socketio.ASGIApp(socketio_server=sio)
app.mount("/ws", sio_app)
app.include_router(all_routes)

if __name__ == '__main__':
    logger.info("Started main")
    # start_http_server(int(getenv("PROM_METRICS_PORT")))
    run("main:app", host="0.0.0.0", port=8098, reload=True)
