import {} from "react";
import "./App.css";
import Board from "./Board";
import { StateWrapper } from "./state";
import Header from "./Header";

function App() {
  return (
    <StateWrapper>
      <div className="App">
        <Header />
        <Board />
      </div>
    </StateWrapper>
  );
}

export default App;
