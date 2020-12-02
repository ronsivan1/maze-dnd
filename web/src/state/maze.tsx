import React, {createContext, useEffect, useReducer} from "react";
import io from 'socket.io-client'
import {create} from "domain";

export const socket = io("http://localhost:8001")

// CONSTANTS
export const START_BTN_PRESS = "maze/START_BTN_PRESS"
export const END_BTN_PRESS = "maze/END_BTN_PRESS"
export const INSERT_CHARACTERS = "maze/INSERT_CHARACTERS"
export const UPDATE_CHARACTER_POSITION = "maze/UPDATE_CHARACTER_POSITION"

export const myID = `${Date.now()}`

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// REDUCER
type Action =
      { type: "maze/START_BTN_PRESS", payload: any }
    | { type: "maze/END_BTN_PRESS" }
    | { type: "maze/INSERT_CHARACTERS", characters: {} }
    | { type: "maze/REMOVE_CHARACTERS", id: string }
    | { type: "maze/UPDATE_CHARACTER_POSITION",
        id: string, character: Character  }

export type Character = {
    color: string, top: number, left: number
}

function reducer(state: ApplicationState, action: Action): ApplicationState {
    switch(action.type) {
        case START_BTN_PRESS:
            socket.emit('character-joined',
                { id: myID, newChar: action.payload})
            state.characters[myID] = action.payload
            return { ...state, characters: state.characters };
        case END_BTN_PRESS:
            socket.emit('remove-character', myID)
            return state;
        case INSERT_CHARACTERS:
            return { ...state, characters: action.characters }
        case UPDATE_CHARACTER_POSITION:
            socket.emit("update-character", { id: action.id, top: action.character.top, left: action.character.left })
            return { ...state, characters: { [action.id]:
            { color: action.character.color, top: action.character.top, left: action.character.left } }}
        default:
            return state
    }
}
//STORE

export interface ApplicationState {
    characters: { [id: string]: Character }
}

// Interface to define the state of the context object.
interface IStateContext {
    state: ApplicationState;
    dispatch?: React.Dispatch<Action>;
}

const initialState: ApplicationState = { characters: {} }

// An wrapping function to handle thunks (dispatched actions which are wrapped in a function, needed for async callbacks)
/*const asyncer = (dispatch: any, state: ApplicationState) => (action: any) =>
    typeof action === 'function' ? action(dispatch, state) : dispatch(action);*/

// A basic empty context object.
export const GlobalContext = createContext({} as IStateContext);

// The Store component to provide the global state to all child components
export function Store({ children }: { children: JSX.Element }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    //const dispatch = useCallback(asyncer(dispatchBase, state), [])

    useEffect(() => {
        document.title = "maze-dnd"
        socket.on('client-character-joined', (characters: {}) => {
            dispatch({ type: "maze/INSERT_CHARACTERS", characters })
        })

        return() => {socket.removeEventListener('client-character-joined')}
    }, [])

    return (
        <GlobalContext.Provider value={{state, dispatch}}  >
            {children}
        </GlobalContext.Provider>
    )
}

// A higher order component to inject the state and dispatcher
export function withApplicationState(Component: any) {
    return function WrapperComponent(props: any) {
        return (
            <GlobalContext.Consumer>
                {context => <Component {...props} state={context.state} dispatch={context.dispatch} />}
            </GlobalContext.Consumer>
        );
    }
}
