import * as React from "react"
import { buildGrid } from "./Board"
import { Card, Position } from "./types"

const cardGrid = buildGrid(5)
export default function CardDisplay({classes, owner,handleClick, card }: { classes:string,owner?:1|2,handleClick?:()=>void, card: Card }) {
  return <div className={`card ${classes}`} onClick={handleClick} >
    <h3>{card.name}</h3>
    <div className="card-grid">
      {cardGrid.map((row, y) => {
        return row.map((_, x) => {
          return <div
            onClick={handleClick}
            className={`
              move-position 
              ${isCenter(5, { x, y }) ? 'me' : ''}
              ${isPossibleMove(card.positions, { x, y },owner) ? 'possible-move' : ''}
            `}
          ></div>
        })
      })}
    </div>
  </div>
}

function isCenter(count: number, pos: Position) {
  if (count % 2 == 0) return false
  const center = ((count - 1) / 2)
  return pos.x == center && pos.y == center
}
function isPossibleMove(cardPosistions: Position[], { x, y }: Position,owner?:1|2) {
  return cardPosistions.some(({ x: _xPos, y: _yPos }) => {
    const xPos = owner && owner == 1 ? _xPos * -1 :_xPos
    const yPos = owner && owner == 1 ? _yPos * -1 :_yPos
    return x == 2 + xPos && y == 2 + yPos
  })
}
