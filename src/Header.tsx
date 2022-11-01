import * as React from "react";
import useGameState from "./state";

export default function Header() {
  const { gameState } = useGameState();
  const currentPlayer = gameState.currentPlayer;
  return (
    <header className="app-header">
      <div>Player {currentPlayer}'s Turn</div>
    </header>
  );
}
