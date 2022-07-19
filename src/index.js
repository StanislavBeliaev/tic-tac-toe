import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  createrows(size) {
    return Array(size)
      .fill(null)
      .map((_, index1) => (
        <div key={index1} className="board-row">
          {Array(size)
            .fill(null)
            .map((_, index2) => this.renderSquare(size * index1 + index2))}
        </div>
      ));
  }

  render() {
    return <div>{this.createrows(this.props.Size)}</div>;
  }
}
class GameManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShownOption: false,
      Size: 3,
      GameMode: "MainMenu",
    };
  }
  //  changeisshown(param) {
  //   return this.setState({ isShown: false });
  // }
  render() {
    if (this.state.GameMode === "1vs1") {
      return (
        <Game
          backtomenu={() => this.setState({ GameMode: "MainMenu" })}
          Size={this.state.Size}
        />
      );
    } else if (this.state.GameMode === "AI") {
      return (
        <Game
          isAI
          backtomenu={() => this.setState({ GameMode: "MainMenu" })}
          Size={this.state.Size}
        />
      );
    } else if (this.state.GameMode === "MainMenu") {
      return (
        <div className="GameManager">
          <button
            className="GameManager__button"
            onClick={() => this.setState({ GameMode: "1vs1" })}
          >
            1 vs 1
          </button>
          <button
            className="GameManager__button"
            onClick={() => this.setState({ GameMode: "AI" })}
          >
            Man vs AI
          </button>
          <button
            className="GameManager__button"
            onClick={() => this.setState({ GameMode: "Options" })}
          >
            Options
          </button>
        </div>
      );
    } else if (this.state.GameMode === "Options") {
      return (
        <Option
          onSizeSelect={(i) => this.setState({ GameMode: "MainMenu", Size: i })}
        />
      );
    }
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(props.Size).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    if (this.props.isAI && !calculateWinner(squares)) {
      let index = getRandomInt(8);
      while (squares[index]) {
        index = getRandomInt(8);
      }
      squares[index] = this.state.xIsNext ? "O" : "X";
    }
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: this.props.isAI ? true : !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? "Перейти к ходу #" + move : "К началу игры";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Выиграл " + winner;
    } else {
      status = "Следующий ход: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            Size={this.props.Size}
          />
        </div>

        <div className="game-info">
          <button onClick={this.props.backtomenu}> Back to menu </button>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
class Option extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <button
          className="button__option"
          onClick={() => this.props.onSizeSelect(3)}
        >
          3x3
        </button>
        <button
          className="button__option"
          onClick={() => this.props.onSizeSelect(5)}
        >
          5x5
        </button>
      </div>
    );
  }
}
// ========================================
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GameManager />);
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
