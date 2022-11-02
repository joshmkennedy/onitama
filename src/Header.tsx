import * as React from "react";
import useGameState from "./state";

export default function Header({ showHelp }: { showHelp: () => void }) {
  const { gameState } = useGameState();
  const currentPlayer = gameState.currentPlayer;
  return (
    <header className="app-header">
      <div>Player {currentPlayer}'s Turn</div>
      <button onClick={showHelp}>?</button>
    </header>
  );
}
