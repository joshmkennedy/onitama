import * as React from "react"
import type { Unit } from "./types"
export function Tile({ classes, onClick, owner, isSelectedPos, isSelectedUnit }: { classes:string, onClick: () => void, owner: null | Unit, isSelectedPos: boolean, isSelectedUnit: boolean }) {
  return <div
    onClick={onClick}
    className={`${owner ? `player-${owner.owner}`:''} ${owner ? `type-${owner.type}`:''} ${isSelectedUnit ? 'selected-unit':''} ${isSelectedPos ? 'selected-pos':''} ${classes}`.trim()} >
    {` ${owner ? `${owner.owner}` : ""} `}
  </div>
}
