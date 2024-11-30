export const gr_setWsConnected = (connected) => {
    return {
        type: 'gr/setWsConnected',
        payload: connected,
    }
}

export const gr_setUsers = (users) => {
    return {
        type: 'gr/setUsers',
        payload: users,
    }
}