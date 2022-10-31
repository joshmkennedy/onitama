import * as React from "react"
import type { Position, Unit } from "./types"
import useGameState from "./state"
import { Tile } from "./Tile"
import { PlayerCards } from "./PlayerCards"
import  NextCard  from "./NextCard"

const boardGrid = buildGrid(5)

export default function Board() {
  const { gameState } = useGameState()

  const [selectedUnit, setSelectedUnit] = React.useState<Position | null>(null)
  const [selectedPos, setSelectedPos] = React.useState<Position | null>(null)
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null)

  if(selectedCard == null && selectedPos != null){
    setSelectedPos(null)
  }

  if(selectedCard == null && selectedUnit != null){
    setSelectedUnit(null)
  }

  const isShowingConfirm = React.useMemo(() => selectedPos && selectedUnit, [selectedPos, selectedUnit])

  function chooseTile(unit: Unit | null, position: Position) {
    if (selectedCard == null) {
      return
    }
    if (unit && unit.owner == gameState.currentPlayer) {
      if (selectedPos?.x == position?.x && selectedPos?.y == position?.y) {
        setSelectedPos(null)
      } else {
        setSelectedPos(position)
      }
    }
    else {
      if (selectedUnit?.x == position?.x && selectedUnit?.y == position?.y) {
        setSelectedUnit(null)
      } else {
        setSelectedUnit(position)
      }
    }
  }

  return <div className="board-wrapper">
    <PlayerCards player={1} selected={selectedCard} setSelected={setSelectedCard} />
    <div className="board">
      {boardGrid.map((row, y: number) => {
        return row.map((_col, x: number) => {
          const owner = findOwner({ x, y }, gameState.player1Units, gameState.player2Units)
          return <Tile isSelectedPos={selectedPos?.x == x && selectedPos?.y == y} isSelectedUnit={selectedUnit?.x == x && selectedUnit?.y == y} onClick={() => chooseTile(owner, { x, y })} key={`${x}, ${y} `} owner={owner} />
        })
      })}
    </div>
    <NextCard player={1}/>
    <NextCard player={2}/>
    {isShowingConfirm && <button className="confirm-button">Take Turn</button>}
    <PlayerCards player={2} selected={selectedCard} setSelected={setSelectedCard} />
  </div>
}

function findOwner(position: Position, player1Units: Unit[], player2Units: Unit[]) {
  for (let unit of player1Units) {
    if (unit.position.x == position.x && unit.position.y == position.y) {
      return unit
    }
  }

  for (let unit of player2Units) {
    if (unit.position.x == position.x && unit.position.y == position.y) {
      return unit
    }
  }

  return null
}

export function buildGrid(count: number) {
  const grid: number[][] = []
  for (let y = 0; y < count; y++) {
    grid.push([])
    for (let x = 0; x < count; x++) {
      grid[y].push(0)
    }
  }
  return grid
}
