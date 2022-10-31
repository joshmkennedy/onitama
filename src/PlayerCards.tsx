import {} from "react"
import CardDisplay from "./CardDisplay"
import useGameState from "./state"
import { Card  } from "./types"
export function PlayerCards({player, selected, setSelected }: { player:1|2, selected: number | null, setSelected: React.Dispatch<React.SetStateAction<number | null>> }) {

  const { gameState } = useGameState()
  const {currentPlayer} = gameState
  const cardIndexes: number[] = gameState[playerCardsKey(player) as 'player1Cards' | 'player2Cards']
  const cards:[Card,number ][] = cardIndexes.map((cardIndex) =>{ return [gameState.Cards[cardIndex],cardIndex]})
  return <div className="player-cards">
  {cards.map((card) => 
    <CardDisplay
      key={card[1]}
      classes={
        selected == card[1] ? `selected-card`:''
      } 
      handleClick={
        currentPlayer==player ?
        ()=>{
        setSelected((prevSelected)=>{
          if(prevSelected==card[1]){
            return null
          }
         return card[1]
        })}  
        : undefined
      } 
      owner={player}
      card={card[0]}
    />)}
  </div>
}


export function playerCardsKey(player: 1 | 2) {
  return `player${player}Cards`
}

