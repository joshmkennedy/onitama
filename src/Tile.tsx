import * as React from "react"
import type { Unit } from "./types"
export function Tile({ onClick, owner, isSelectedPos, isSelectedUnit }: { onClick: () => void, owner: null | Unit, isSelectedPos: boolean, isSelectedUnit: boolean }) {
  return <div
    onClick={onClick}
    className={`${owner && `player-${owner.owner}`} ${owner && `type-${owner.type}`} ${isSelectedUnit && 'selected-unit'} ${isSelectedPos && 'selected-pos'}`} >
    {` ${owner ? `${owner.owner}` : ""} `}
  </div>
}
