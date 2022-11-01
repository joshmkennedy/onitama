import { createContext, useContext, useState } from "react";
import { Card, GameState, Position, Unit } from "./types";
import { inverseMovePositions } from "./utils";
export default function useGameState() {
  return useContext<{
    gameState: GameState;
    playTurn: (
      cardIndex: number,
      proposedUnit?: Unit,
      position?: Position | null
    ) => boolean | void;
  }>(GameStateContext);
}

const GameStateContext = createContext<any>(null);

const cards: Card[] = [
  {
    name: "Boar",
    positions: [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
  },
  {
    name: "Cobra",
    positions: [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
  },
  {
    name: "Kick",
    positions: [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
  },
  {
    name: "Snake",
    positions: [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
  },
  {
    name: "Cactus",
    positions: [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
    ],
  },
];

export function StateWrapper({ children }: { children: any }) {
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: 1,
    Cards: cards,
    player1Cards: [0, 1],
    player1NextCard: 2,
    player2NextCard: null,
    player2Cards: [3, 4],
    player1Units: [
      { id: 1, type: "pawn", position: { x: 0, y: 0 }, owner: 1 },
      { id: 2, type: "pawn", position: { x: 1, y: 0 }, owner: 1 },
      { id: 3, type: "captain", position: { x: 2, y: 0 }, owner: 1 },
      { id: 4, type: "pawn", position: { x: 3, y: 0 }, owner: 1 },
      { id: 5, type: "pawn", position: { x: 4, y: 0 }, owner: 1 },
    ],
    player2Units: [
      { id: 6, type: "pawn", position: { x: 0, y: 4 }, owner: 2 },
      { id: 7, type: "pawn", position: { x: 1, y: 4 }, owner: 2 },
      { id: 8, type: "captain", position: { x: 2, y: 4 }, owner: 2 },
      { id: 9, type: "pawn", position: { x: 3, y: 4 }, owner: 2 },
      { id: 10, type: "pawn", position: { x: 4, y: 4 }, owner: 2 },
    ],
  });

  function playTurn(cardIndex: number, proposedUnit: Unit, position: Position) {
    const currentPlayer = gameState.currentPlayer == 1 ? "player1" : "player2";
    //checks to make sure we own the unit
    const unitIndex = gameState[`${currentPlayer}Units`].findIndex(
      (unit) => unit.id == proposedUnit.id
    );
    if (unitIndex == -1) {
      throw new Error("currentPlayer doesnt own that unit");
    }

    const unit = proposedUnit;

    if (!gameState[`${currentPlayer}Cards`].includes(cardIndex)) {
      throw new Error(`${currentPlayer} doesnt own played card`);
    }

    const card = cards[cardIndex];

    //check if position exits on card
    if (
      !normalizePositions(currentPlayer, card.positions).some(({ x, y }) => {
        const uPos = unit.position;
        const newX = uPos.x + x;
        const newY = uPos.y + y;
        console.log(newX, newY, position.x, position.y);
        return newX == position.x && newY == position.y;
      })
    ) {
      throw new Error(`position does not exist on card`);
    }

    //check if position exists
    if (
      !(position.x >= 0 && position.x < 5) ||
      !(position.y >= 0 && position.y < 5)
    ) {
      throw new Error(`position not on board`);
    }

    setGameState((prevState) => {
      const newState = { ...prevState };
      //check for collisions
      const opponent = prevState.currentPlayer == 1 ? 2 : 1;
      const opponentUnitsProp = `player${opponent}Units`;
      //@ts-ignore
      const opponentUnits: Unit[] = [...gameState[opponentUnitsProp]];
      const deadUnit = opponentUnits
        .map((unit) => unit.position)
        .findIndex((OPos) => OPos.x == position.x && OPos.y == position.y);
      if (deadUnit != -1) {
        opponentUnits.splice(deadUnit, 1);
        //@ts-ignore
        newState[opponentUnitsProp] = opponentUnits;

        // check for winner
        // @ts-ignore
        if (prevState[opponentUnitsProp][deadUnit].type == "captain") {
          window.alert(`the winner is ${currentPlayer}`);
        }
      }
      //move the peice(s)
      newState[`${currentPlayer}Units`][unitIndex].position = position;

      //update currentPlayer
      newState.currentPlayer = opponent;

      //update the cards
      newState[`${currentPlayer}NextCard`] = null;
      newState[`player${opponent}NextCard`] = cardIndex;
      console.log(cardIndex, prevState[`${currentPlayer}Cards`]);
      const oldCardIndex = prevState[`${currentPlayer}Cards`].find(
        (c) => c != cardIndex
      );
      if (typeof oldCardIndex == "undefined") {
        throw new Error("couldnt find alternate card for player");
      }
      newState[`${currentPlayer}Cards`] = [
        oldCardIndex,
        prevState[`${currentPlayer}NextCard`] as number,
      ];

      return newState;
    });
    return true;
  }

  return (
    <GameStateContext.Provider value={{ gameState, playTurn }}>
      {children}
    </GameStateContext.Provider>
  );
}

function normalizePositions(
  currentPlayer: "player1" | "player2",
  positions: Position[]
) {
  if (currentPlayer == "player2") {
    return positions;
  }
  return inverseMovePositions(positions);
}
