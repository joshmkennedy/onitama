import * as React from "react"
import type { Position, Unit } from "./types"
import useGameState from "./state"
import { Tile } from "./Tile"
import { PlayerCards  } from "./PlayerCards"
import  NextCard  from "./NextCard"
import { inverseMovePositions, onBoard } from "./utils"

const boardGrid = buildGrid(5)

export default function Board() {
  const { gameState, playTurn } = useGameState()

  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null)
  const [selectedPos, setSelectedPos] = React.useState<Position | null>(null)
  const [selectedCard, setSelectedCard] = React.useState<number | null>(null)

  if(selectedCard == null && selectedPos != null){
    setSelectedPos(null)
  }

  if(selectedCard == null && selectedUnit != null){
    setSelectedUnit(null)
  }

  const isShowingConfirm = React.useMemo(() => selectedPos && selectedUnit, [selectedPos, selectedUnit])

  const chooseTile = React.useCallback(function chooseTile(unit: Unit | null, position: Position) {
    if (selectedCard == null) return;

    if(unit?.position.x == selectedUnit?.position.x && selectedUnit?.position.y == unit?.position.y){
      setSelectedUnit(null)
      setSelectedPos(null)
      return
    }

    if(unit && unit.owner == gameState.currentPlayer){
      setSelectedUnit(unit)
      return
    }

    if(selectedPos && selectedPos.x == position.x && selectedPos.y == position.y){
      setSelectedPos(null) 
      return
    }

    if(selectedUnit && unit?.owner != gameState.currentPlayer){
      if(movePosHints.some((hint)=> hint.x == position.x && hint.y == position.y)){
        setSelectedPos(position)
      }
    }
  },[selectedCard, selectedUnit, selectedPos])

  const movePosHints = React.useMemo(()=>{
    if(selectedCard==null || selectedUnit==null) return [];
    const card = gameState.Cards[selectedCard]
    const player = gameState.currentPlayer
    const possiblePosisitons = player == 2 ? card.positions: inverseMovePositions(card.positions)
    const relativePositions = possiblePosisitons.map((pos)=>{
      return {x:selectedUnit.position.x + pos.x, y:selectedUnit.position.y + pos.y}
    }).filter(onBoard)
    return relativePositions
  },[selectedCard, selectedUnit])

  return <div className="board-wrapper">
    <PlayerCards player={1} selected={selectedCard} setSelected={setSelectedCard} />
    <div className="board">
      {boardGrid.map((row, y: number) => {
        return row.map((_col, x: number) => {
          const owner = findOwner({ x, y }, gameState.player1Units, gameState.player2Units)
          return <Tile 
            isSelectedPos={selectedPos?.x == x && selectedPos?.y == y}
            isSelectedUnit={selectedUnit?.position.x == x && selectedUnit?.position.y == y} 
            onClick={() => chooseTile(owner, { x, y })} key={`${x}, ${y} `} 
            owner={owner} 
            classes={`${isMoveHint({x,y},movePosHints) ? 'move-hint' :''}`}
          />

        })
      })}
    </div>
    <NextCard player={1}/>
    <NextCard player={2}/>
    {isShowingConfirm &&
      <button
        onClick={()=>{
          if(selectedUnit==null || selectedCard==null) return
          playTurn( selectedCard, selectedUnit, selectedPos )
          setSelectedCard(null)
        }} 
        className="confirm-button"
      >
        Take Turn
      </button>}
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

function isMoveHint({x,y}:Position, possiblePosisitons:Position[]){
  const res = possiblePosisitons.some(({x:xpos, y:ypos})=>{
    const res = xpos == x && ypos == y
    return res
  })
  // console.log(res)
  return res
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
