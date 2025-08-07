import socketio
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[])
from loguru import logger

@sio.on("connect")
async def connect(sid, environ, auth):
    print("SocketIO: connect", sid)
    logger.info("SocketIO: connect", sid)

@sio.on("disconnect")
def disconnect(sid):
    print("SocketIO: disconnect", sid)
    logger.info("SocketIO: disconnect", sid)

@sio.on("leave-all-room")
async def leave_all_room(sid):
    print("leave_all_room", sid)
    for room in sio.rooms(sid):
        sio.leave_room(sid, room)

@sio.on("message")
async def send_message(sid, message):
    print("message", sid, message)
    await sio.emit("send", {'sid': sid, 'text': message['message'], 'type': 'message', 'name': message['name']})

@sio.on("typing")
async def typing(sid, user):
    print("typing", sid, user)
    await sio.emit("typing-status", {'sid': sid, 'user': user})

@sio.on("done-typing")
async def done_typing(sid, user):
    print("done-typing", sid, user)
    await sio.emit("done-typing-status", {'sid': sid, 'user': user})