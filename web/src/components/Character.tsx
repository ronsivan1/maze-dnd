import React from 'react'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'
import { ItemTypes } from "../types";

interface CharacterProps {
    className?: string;
    id: string;
    bgColor: string;
    top: number;
    left: number;
    hideSourceOnDrag: boolean;
}

function Character({ className, id, bgColor, top, left, hideSourceOnDrag }: CharacterProps) {

    const [{isDragging}, drag] = useDrag({
        item: { id, left, top, type: ItemTypes.Character },
        collect: monitor => ({ isDragging: monitor.isDragging() })
    })
    if(isDragging && hideSourceOnDrag)
        return <div ref={drag} />
    return (
        <div className={className} ref={drag}
            style={{
                left, top, backgroundColor: bgColor
            }} />

    )
}

const StyledCharacter = styled(Character)`
    position: absolute;
    height: 35px;
    width: 35px;
    border-radius: 10px;
    cursor: move;
`
export default StyledCharacter
