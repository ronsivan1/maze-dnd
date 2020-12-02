import React, {useContext} from 'react'
import {useDrop, XYCoord} from 'react-dnd';
import {ItemTypes} from '../types';
import Character from "./Character";
import { ApplicationState, withApplicationState,
    myID, UPDATE_CHARACTER_POSITION
} from '../state/maze'
import { DragItem } from '../interfaces'

const styles: React.CSSProperties = {
    width: 1000,
    height: 1000,
    position: 'relative',
    display: 'flex',
    backgroundImage: require("../maze.png")
};

interface MazeContainerProps {
    hideSourceOnDrag: boolean,
    state: ApplicationState,
    dispatch: ({ type, id, character } : { type: string; id: string, character: {} }) => void
}

const MazeContainer = ({hideSourceOnDrag, state, dispatch}: MazeContainerProps) => {

    const [, drop] = useDrop({
        accept: ItemTypes.Character,
        drop(item: DragItem, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
            const left = Math.round(item.left + delta.x)
            const top = Math.round(item.top + delta.y)
            moveBox(item.id, left, top, item.color);
            return undefined
        }
    })

    const moveBox = (id: string, left: number, top: number, color: string) => {
        if(myID === id)
            dispatch({ type: UPDATE_CHARACTER_POSITION,
                id, character: {top, left, color}})
    };

    return (
        <div ref={drop} style={styles} >
            {Object.keys(state.characters).map((key) => {
                const { color, top, left } = state.characters[key];
                return (<Character id={key}
                    {...{key, top, left, hideSourceOnDrag, bgColor: color}}
                />)
            })}
        </div>
    )
}

export default withApplicationState(MazeContainer)
