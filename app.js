import React from 'react';
import ReactDOM from 'react-dom';

const Stars = (props) => {
  return (
  <div className=" col-5">
    {_.range(props.numberOfStars).map( i => 
    <i key={i} className="fa fa-star"></i> 
    )}
  </div>
  );
};

const Button = (props) => {
 let button;
 switch(props.answerIsCorrect){
 case true:
    button = <button className="btn btn-success" onClick={props.acceptAnswer} >
               <i className="fa fa-check"></i>
             </button>;
    break;
 case false: 
    button = <button className="btn btn-danger">
               <i className="fa fa-times"></i>
             </button>;
    break;
 default:
    button =  
    <button className="btn" 
            onClick={props.checkAnswer}
            disabled={props.selectedNumbers.length === 0}>
    =
    </button>;
    break;
 }
  return (
  <div className="col-2 text-center">
    {button}
    <br /><br />
    <button className="btn btn-warning btn-sm" 
            onClick={props.redraw}
            disabled={props.redraws === 0}>
    <i className="fa fa-spinner"></i> {props.redraws}
    </button>
  </div>
  );
};

const Answer = (props) => {
  return (
  <div className="col-4">
    {props.selectedNumbers.map( (number, i) =>
     <span key={i} onClick={() => props.cancelNumber(number)}>{number}</span>
    )}
  </div>
  );
};

const Numbers= (props) => {
  const numberClassName = (number) => {
  if(props.usedNumbers.indexOf(number) >= 0)
    return 'used';
  if(props.selectedNumbers.indexOf(number) >= 0)
    return 'selected';
  }

  return (
  <div className="card text-center">
    <div>
    {Numbers.list.map( (number,i) =>  
    <span key={i} className={numberClassName(number)}  onClick={() => props.selectNumber(number)}>{number}</span>)}
    </div>
  </div>
  );
};
Numbers.list = _.range(1,10);

const DoneFrame = (props) => {
  return(
    <div className="text-center">
    <br />
      <h2>{props.doneStatus}</h2>
      <button className=" btn btn-secondary" 
      onClick={props.resetGame}>Play again</button>
    </div>
  );
};

class Game extends React.Component {
  static randomNumber = () =>  (1+Math.floor(Math.random()*9));
  static initialState = () => ({
     selectedNumbers: [],
     usedNumbers: [],
     numberOfStars: Game.randomNumber() ,
     answerIsCorrect: null,
     redraws: 5,
     doneStatus: null 
  });
  state = Game.initialState();
  
  resetGame = () => this.setState(Game.initialState());
  
  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0){ return; }
    if (this.state.usedNumbers.indexOf(clickedNumber) >= 0){ return; }
      this.setState(prevState => ({ answerIsCorrect: null, 
  selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
      }));
  };
  
  cancelNumber = (clickedNumber) => {
    this.setState(prevState => ({ answerIsCorrect: null, 
    selectedNumbers: prevState.selectedNumbers.filter(item => item !== clickedNumber)
    }));
  };
  
  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.numberOfStars === prevState.selectedNumbers.reduce((acc, n) => acc + n,0)
    
    }));
  };
  
  acceptAnswer = () => {
  this.setState(prevState => ({ 
    usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
    selectedNumbers: [],
    answerIsCorrect: null,
    numberOfStars: Game.randomNumber()
    }), this.updateDoneStatus);
  };
  
  redraw = () => {
  if (this.state.redraws === 0){return;}
    this.setState(prevState => ({ 
      selectedNumbers: [],
      answerIsCorrect: null,
      numberOfStars:  Game.randomNumber() ,
      redraws: prevState.redraws - 1,
    }), this.updateDoneStatus);
  };
  
  updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNumbers.length === 9)
        { return  {doneStatus: 'Done.Nice!'} };
      if (prevState.redraws === 0)
        { return { doneStatus: 'Game Over!'} };
    });
  };
  
  render(){
  const { selectedNumbers, 
          numberOfStars, 
          answerIsCorrect,
          usedNumbers,
          redraws, 
          doneStatus } = this.state;
  return(
    <div className="container">
      <h3>Play Nine</h3>
      <br />
       <kbd> How to play : </kbd> <br />
      <kbd> Perpiqu te barazosh numrat nga menuja me numrin e yjeve.</kbd><br />
      <kbd> Ke deri ne 5 mundesi.</kbd>
       <br />
        <br />
      <div className="row">
        <Stars numberOfStars={numberOfStars}/>
        <Button selectedNumbers={selectedNumbers} 
                acceptAnswer={this.acceptAnswer} 
                checkAnswer={this.checkAnswer} 
                answerIsCorrect={answerIsCorrect}
                redraws={redraws} 
                redraw={this.redraw} />
                
        <Answer selectedNumbers={selectedNumbers} 
                cancelNumber={this.cancelNumber}/>
      </div>
      <br />
      {doneStatus ? 
      <DoneFrame doneStatus={doneStatus}
                 resetGame={this.resetGame} />:
      <Numbers selectedNumbers={selectedNumbers} 
                 usedNumbers={usedNumbers}
                 selectNumber={this.selectNumber}/>
      }
    </div>
  );
  }
}

class App extends React.Component {
  render(){
    return(
      <div>
        <Game />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
