import data from "./data";
import "./App.css";
import { useState } from "react";

const BOARD = Array.from([...Array(10).keys()], (el) => {
  let subarray = [];
  for (let i = 0; i < 10; i++) {
    const currentPosition = [el, i];
    const shipOnPosition = data.layout.find(({ positions }) =>
      positions.find(
        (position) =>
          position[0] === currentPosition[0] &&
          position[1] === currentPosition[1]
      )
    );
    subarray.push({
      position: currentPosition,
      ship: shipOnPosition?.ship || null,
      isHit: false,
    });
  }
  return subarray;
}).flat();

const SHIPS = data.layout.map(({ ship, positions }) => {
  return {
    ship,
    positions: positions.map((position) => ({
      position,
      isHit: false,
    })),
    isSunk: false,
  };
});

function App() {
  const [board, setBoard] = useState(BOARD);
  const [ships, setShips] = useState(SHIPS);

  const handleClick = (index) => {
    const copyOfBoard = [...board];
    const cell = copyOfBoard[index];
    cell.isHit = true;

    setBoard(copyOfBoard);

    const copyOfShips = [...ships];
    const shipIndex = copyOfShips.findIndex(({ positions }) =>
      positions.find(
        (position) =>
          position.position[0] === cell.position[0] &&
          position.position[1] === cell.position[1]
      )
    );

    copyOfShips[shipIndex]?.positions.map((position) =>
      position.position[0] === cell.position[0] &&
      position.position[1] === cell.position[1]
        ? (position.isHit = true)
        : (position.isHit = position.isHit)
    );

    const positionsHit = copyOfShips[shipIndex]?.positions.filter(
      ({ isHit }) => isHit
    ).length;
    const positions = copyOfShips[shipIndex]?.positions.length;

    if (copyOfShips[shipIndex] && positionsHit === positions) {
      copyOfShips[shipIndex].isSunk = true;
    }

    setShips(copyOfShips);
  };

  return (
    <div
      className={
        ships.filter(({ isSunk }) => isSunk).length !== ships.length
          ? "App"
          : "EndGame"
      }
    >
      <h1>Battleships</h1>
      <div className="Wrapper">
        {board.map((cell, index) => (
          <button
            disabled={cell.isHit}
            className="Cell"
            cell={index}
            onClick={() => handleClick(index)}
            key={index}
          >
            {!cell.isHit ? (
              cell.position
            ) : cell.ship ? (
              <img src={"/assets/HitSmall.png"} />
            ) : (
              <img src={"/assets/MissSmall.png"} />
            )}
          </button>
        ))}
      </div>
      <div>
        {ships
          .filter(({ isSunk }) => isSunk)
          .map(({ ship, positions }) => (
            <div>
              <img src={`/assets/${ship}Shape.png`} />
              {positions.map(() => (
                <img src={"/assets/HitSmall.png"} />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
