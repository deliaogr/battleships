import data from "./data";
// import "./App.css";
import { useState } from "react";

const comparePositions = (pos1, pos2) => {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
};

const findPosition = (positions, currentPosition) => {
  return positions.find(
    (position) =>
      currentPosition[0] === position[0] && currentPosition[1] === position[1]
  );
};

const BOARD = Array.from([...Array(10).keys()], (el) => {
  let subarray = [];
  for (let i = 0; i < 10; i++) {
    const currentPosition = [el, i];
    const shipOnPosition = data.layout.find(({ positions }) =>
      positions.find(
        (position) =>
          currentPosition[0] === position[0] &&
          currentPosition[1] === position[1]
      )
    );

    subarray.push({
      currentPosition,
      isHit: false,
      ship: shipOnPosition?.ship || null,
    });
  }
  return subarray;
}).flat();

const SHIPS = data.layout.map(({ ship, positions }) => ({
  ship,
  isSunk: false,
  positions: positions.map((position) => ({ cell: position, isHit: false })),
}));

function App() {
  const [board, setBoard] = useState(BOARD);
  const [ships, setShips] = useState(SHIPS);

  // function handleClick(e) {
  //   e.preventDefault();
  //   const copyOfBoard = [...board];
  //   const cell = copyOfBoard[e.target.getAttribute("cell")];
  //   cell.isHit = true;

  //   setBoard(copyOfBoard);

  //   if (cell.ship) {
  //     const copyOfShips = [...ships];
  //     const shipIndex = copyOfShips.findIndex(
  //       ({ ship, positions }) =>
  //         ship === cell.ship &&
  //         positions.find((position) =>
  //           comparePositions(cell.currentPosition, position.cell)
  //         )
  //     );

  //     copyOfShips[shipIndex] = {
  //       ...copyOfShips[shipIndex],
  //       positions: copyOfShips[shipIndex].positions.map((position) => ({
  //         ...position,
  //         isHit: comparePositions(cell.currentPosition, position.cell)
  //           ? true
  //           : position.isHit,
  //       })),
  //     };

  //     const numberOfPositions = copyOfShips[shipIndex].positions.length;
  //     const numberOfPositionsHit = copyOfShips[shipIndex].positions.filter(
  //       ({ isHit }) => isHit
  //     ).length;

  //     console.log(numberOfPositions, numberOfPositionsHit);

  //     if (numberOfPositions === numberOfPositionsHit) {
  //       copyOfShips[shipIndex].isSunk = true;
  //       console.log("sunk");
  //     }

  //     setShips(copyOfShips);
  //   }
  // }

  const handleClick = (index) => {
    const copyOfBoard = [...board];
    copyOfBoard[index].isHit = true;

    setBoard(copyOfBoard);

    if (copyOfBoard[index].ship) {
      const copyOfShips = [...ships];
      const shipIndex = copyOfShips.find(({ ship, positions }) => {
        ship === copyOfBoard[index].ship &&
          positions.find((position) =>
            comparePositions(copyOfBoard[index].currentPosition, position.cell)
          );
      });

      copyOfShips[shipIndex] = {
        ...copyOfShips[shipIndex],
        positions: copyOfShips[shipIndex].positions.map((position) => ({
          ...position,
          isHit: true,
        })),
      };
      console.log(copyOfShips[shipIndex]);
      setShips(copyOfShips);
    }

    console.log(copyOfBoard[index]);
  };

  return (
    <div
      className={
        ships.length === ships.filter(({ isSunk }) => isSunk).length
          ? "EndGame"
          : "App"
      }
    >
      <h1>Battleships</h1>
      <div className="Wrapper">
        {board.map((cell, index) => (
          <button
            disabled={cell.isHit}
            className="Cell"
            cell={index}
            // onClick={handleClick}
            onClick={() => handleClick(index)}
            key={index}
          >
            {!cell.isHit ? (
              ""
            ) : cell.ship ? (
              <img draggable="false" src="/assets/HitSmall.png" />
            ) : (
              <img draggable="false" src="/assets/MissSmall.png" />
            )}
          </button>
        ))}
      </div>
      {ships
        .filter(({ isSunk }) => isSunk)
        .map(({ ship, positions }, index) => {
          return (
            <div className="SunkShip" key={index}>
              <img src={`/assets/${ship}Shape.png`} />
              {positions.map(() => (
                <img draggable="false" src="/assets/HitSmall.png" />
              ))}
            </div>
          );
        })}
    </div>
  );
}

export default App;
