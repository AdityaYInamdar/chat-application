const initialState = () => {
    // Process data if any !!

    var state = {
        ws: {
            connected: false,
            sid: "",
        },
        users: []
    }

    return state;
}

const globalReducer = (state = initialState(), action) => {

    switch (action.type) {
        case 'gr/setWsConnected':
            return {
                ...state,
                ws: action.payload,
            }
        case 'gr/setUsers':
            return {
                ...state,
                users: action.payload,
            }
            
        default:
            return state;
    }
}

export default globalReducer;
