import { useState } from "react";
import "./App.css";
import Board from "./Board";
import { StateWrapper } from "./state";
import Header from "./Header";
import Help from "./Help";

function App() {
  const [isHelpShowing, setIsHelpShowing] = useState(true);
  return (
    <StateWrapper>
      {isHelpShowing ? <Help close={() => setIsHelpShowing(false)} /> : null}
      <div className="App">
        <Header showHelp={() => setIsHelpShowing(true)} />
        <Board />
      </div>
    </StateWrapper>
  );
}

/*
 *
 */

export default App;
