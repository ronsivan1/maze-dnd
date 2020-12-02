import React from 'react'
import styled from 'styled-components'
import { START_BTN_PRESS, END_BTN_PRESS, getRandomColor,
    ApplicationState, withApplicationState} from "../state/maze";

interface ButtonProps {
    className?: string;
    title: string;
    bgColor: string;

    state: ApplicationState;
    dispatch: ({ type }: { type: string, payload?: any }) => void
}

function Button(props: ButtonProps) {
    const { className, title, bgColor } = props

    function onBtnClick() {
        if(title === "Start Game") {
            // Create new character and send it
            const newChar = { color: getRandomColor(), top: 475, left: 485 }
            props.dispatch({ type: START_BTN_PRESS, payload: newChar})
        }
        else props.dispatch({ type: END_BTN_PRESS,  })
    }

    return (
        <button className={className} style={{ backgroundColor: bgColor }}
                onClick={() => onBtnClick()}>
            {title}
        </button>
    )
}

const StyledButton = styled(Button)`
    color: black;
    font-size: 20px;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 10px;
    cursor: pointer;
    width: 200px;
    height: 50px;
`

export default withApplicationState(StyledButton)
