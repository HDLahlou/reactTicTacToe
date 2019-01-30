import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const lines = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6],
];

var winningLine = null;
//To remember things components use state, react components set through this.state
//in their constructors, should be considered private to a react component that its defined in.
//Store current value of square in this.state
//Function components are simplier way to write components that contain only a render
function Square(props) {
  var style = calculateStyle(props.number);
    return (
      <button
      className="square"
      onClick={props.onClick}
      style = {style}
      >
        {props.value}
      </button>
    );
}
/* Parent is Board, passes information to child square component
Square is a component, Board calls the layout
*/
/* To collect data from multiple childen, or have two children components communicate, need
to declare the shared state in their parent component instead. The parent component can pass
the state back down to the children by using props, keeps the child in sync with eachother
and with parent
*/

/* Square Components are now controlled components, board has full control over them
slice() creates a copy to modify instead of modifying the existing array for immutability
allows for an easy redo undo mechanic
*/
class Board extends React.Component {

  renderSquare(i) {

    return(<Square
    number = {i}
    key = {i*100}
    value = {this.props.squares[i]}
    onClick = {() => this.props.onClick(i)}
    />);
  }


  render() {
    var grid = []
    var j = 0;
    var i = 0;
    for(i=0; i < 3; i++){
      grid.push(<div key ={i*3 +j +1} className="board-row"></div>);
      for (j=0; j < 3; j++) {
        grid.push(this.renderSquare(i*3+j));
      }
    }

    return (
      <div>
        {grid}
      </div>
    );
  }
}


//Lifting state again, taking board component and putting into game
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      descend: true,
      position: [],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = this.state.position.slice(0, this.state.stepNumber + 1);
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' :'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      position: position.concat(i),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    winningLine = null;
    this.setState({
      stepNumber: step,
      xIsNext: (step %2) === 0,
    });
  }

  ascDes(){
    this.setState({
      descend: !this.state.descend,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const position = this.state.position;
    const descend = this.state.descend;

    var order = <button onClick ={() => this.ascDes()}>ORDER</button>

    const moves = history.map((step, thisMove) =>{


      var move = descend ?
      thisMove:
      (history.length - 1 - thisMove);

      const pos = move ?
      calculateColRow(position[move-1]):
      "";

      const coord = move ?
        `Col:${pos.col} Row:${pos.row}`:
        "";

      const desc = move ?
        'Go to move #' +move:
        'Go to game start';

      const style = history[move] === current ?
      { fontWeight: 'bold' } :
      { fontWeight: 'normal' };

      return (
        <li key ={move}  style={style} >
          <button onClick={() => this.jumpTo(move)} style={style}>{`${desc} ${coord}`}</button>
        </li>
      );
    });


    let status;
    if(winner){
      // var winner = lines[gameEnd]
      status = 'Winner ' + winner;
    } else{
      if (history.length > 9) {
          status = "Draw"
      }
      else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status} {order}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){

  for (let i = 0; i< lines.length; i++){
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      winningLine = i;
      return squares[a];
    }
  }
  return null;
}


function calculateColRow(position){
  return {
    col:position%3,
    row:Math.floor(position/3),
  }
}

function calculateStyle(index){
  if(winningLine){
    var array = lines[winningLine];
    if(index === array[0] || index === array[1] || index === array[2]){
      return {fontWeight: 'bold'};
    }
  }
  return {fontWeight: 'normal'};

}
