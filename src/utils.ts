import { Position } from "./types";

export function inverseMovePositions(positions:Position[]){
  return positions.map(({x,y})=>{
    return {x:x * -1, y:y * -1} 
  })
}
