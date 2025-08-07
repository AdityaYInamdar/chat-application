import { io } from 'socket.io-client';
// import { gr_setWsConnected } from './Redux/Actions/GlobalActions';
import { useEffect, useState } from 'react';
import { gr_setWsConnected } from '../Redux/Actions/GlobalActions';
import { useDispatch } from 'react-redux';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = "ws://localhost:8181";
// const URL = "ws://" + window.location.hostname + ":8181";

export const socket = io("ws://10.129.2.27:8098", {
    path: "/ws/socket.io",
    autoConnect: false,
});


// Creating a hook that connects to the socket and updates the redux store
export const useSocket = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to the socket HERE");
            console.log({
                connected: true,
                sid: socket.id,
            });
             dispatch(gr_setWsConnected({
                connected: true,
                sid: socket.id,
            }))
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from the socket HERE");
            dispatch(gr_setWsConnected({
                connected: false,
                sid: "",
            }))
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        }
    }, []);


    // Connect to the socket
    useEffect(() => {
        if (socket.connected) return;

        socket.connect();
        return () => {
            socket.disconnect();
        }
    }, []);


    return socket;
}
