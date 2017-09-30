document.addEventListener("DOMContentLoaded", function (event) {

  let selectedColor = '';
  let outerColor = '';
  let selInner = document.getElementsByClassName('selector-inner');
  let selOuter = document.getElementsByClassName('selector-outer');
  let marbles = document.getElementsByClassName('guess-marble');
  let tempArray = document.getElementsByClassName('guess-marbles');
  let marbleBoxes = [];//receives list of elements from tempArray, reversed order of tempArray to make bottom row of board index 0
  let tempPegBoxArray = document.getElementsByClassName('hint-pegs');
  let pegBoxes = [];
  let rowNumber = 0; //increment this number to activate next row
  let clickCount = 0;
  let answerArray = [];
  makeAnswer();
  let masterArray = [[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]]
  let guessArray = [];
  let gradeArray = [];
  let winState = false;

  //hightlight selected color to be placed on board
  for (let i = 0; i < selInner.length; i++) {
    selInner[i].addEventListener('click', function() {
      for (let j =0; j < selOuter.length; j++){
        outerColor = 'white';
        selOuter[j].style.backgroundColor = outerColor;
      }
      selectedColor = getComputedStyle(this).backgroundColor;
      this.parentNode.style.backgroundColor = selectedColor;
    });
  }

//make bottom row the first active row
  for (let i = 9; i >= 0; i--) {
    marbleBoxes.push(tempArray[i]);
    pegBoxes.push(tempPegBoxArray[i]);
  }
  for (let i = 0; i < marbleBoxes.length; i++) {
    let tempCount = 0;
    [].forEach.call(marbleBoxes[i].getElementsByClassName('guess-marble'), function(elem) {
      elem.setAttribute('id', `pos-${i}-${tempCount}`);
      tempCount ++;
    });
  }

  //make only one row active at time
  marbleBoxes[rowNumber].classList.add('active');

  //choose position to place selected color / remove color if same position is clicked again
  for(let i = 0; i < marbles.length; i++) {
    marbles[i].addEventListener('click', function() {
      if(this.parentNode.classList.contains('active') && selectedColor !== '') {
        let orgColor = getComputedStyle(this).backgroundColor;
        //logic to make sure that clickCount is only incremented if a blank position is chosen, and decrements if a color is removed
        if (getComputedStyle(this).backgroundColor === selectedColor) {
          this.style.backgroundColor = 'white';
          clickCount--;
        } else if (getComputedStyle(this).backgroundColor !== selectedColor && getComputedStyle(this).backgroundColor !== 'rgb(255, 255, 255)') {
          this.style.backgroundColor = selectedColor;
          updateMasterArray(getComputedStyle(this).backgroundColor, this.getAttribute('id'));
        }
        else {
          this.style.backgroundColor = selectedColor;
          clickCount++;
          updateMasterArray(getComputedStyle(this).backgroundColor, this.getAttribute('id'));
        }
      }
      if (clickCount === 4) {
        document.getElementById('submit-button').style.display = 'flex';
      }
      else {
        document.getElementById('submit-button').style.display = 'none';
      }
    })
  }

//hide submit button until all 4 positions have been marked
  document.getElementById('submit-button').style.display = 'none';

//on click of submit, deactivate current row, activate next row
  document.getElementById('submit-button').addEventListener('click', function(){
    guessArray = masterArray[rowNumber];
    getGrade();
    checkForWin();
    if(rowNumber !== 9 && !winState) {
      moveToNextRow();
    } else if (rowNumber === 9 && !winState) {
      alert(`Game Over. Keep Trying!`);
      resetBoard();
    }
    clickCount = 0;
    selectedColor = '';
    gradeArray = [];
    for (var i = 0; i < selOuter.length; i++) {
      selOuter[i].style.backgroundColor = 'white';
    }
  })

  function makeAnswer() {
    for (let i = 0; i < 4; i++) {
      answerArray.push(Math.floor(Math.random() * 6));
    }
  }

  function updateMasterArray(col, xy) {
    let array = xy.split('-');
    let x = array[1];
    let y = array[2]
    masterArray[x][y] = makeColorANumber(col);
  }

  function makeColorANumber(col) {
    if(col === 'rgb(255, 0, 0)') return 0;//red
    if(col === 'rgb(0, 0, 255)') return 1;//blue
    if(col === 'rgb(0, 128, 0)') return 2;//green
    if(col === 'rgb(255, 255, 0)') return 3;//yellow
    if(col === 'rgb(0, 0, 0)') return 4;//black
    if(col === 'rgb(128, 128, 128)') return 5;//grey
  }

  function getGrade() {
    let blackPeg = 0;
    let whitePeg = 0;
    let tempGuessArray = [];
    let tempAnswerArray = [];

    for (let i = 0; i < 4; i++) {
      tempAnswerArray.push(answerArray[i]);
      tempGuessArray.push(guessArray[i]);
    }
    for (let i = 0; i < 4; i++) {
      if (tempGuessArray[i] === tempAnswerArray[i]) {
        blackPeg++;
        tempGuessArray[i] = -1;
        tempAnswerArray[i] = -3;
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if(tempGuessArray[i] === tempAnswerArray[j]){
          whitePeg ++;
          tempGuessArray[i] = -2;
          tempAnswerArray[j] = -4;
        }
      }
    }
    //push black pegs (represented as the number 1) to grade array
    for(let i = 0; i < blackPeg; i++){
      gradeArray[i]=1;
    }
    //push white pegs (repres ented as the number 2) to grade array
    for(let i = blackPeg; i < (blackPeg + whitePeg); i++){
      gradeArray[i]=2;
    }

    for(let i = 0; i < 4; i ++){
      let pegBox = pegBoxes[rowNumber].children;
      if (gradeArray[i] === 1){
        pegBox[i].style.backgroundColor = 'black'
      } else if (gradeArray[i] === 2) {
        pegBox[i].style.backgroundColor = 'white'
      }
    }

    console.log('guessArray: ' + guessArray);
    console.log('answerArray: ' + answerArray);
  }

  function moveToNextRow() {
    setTimeout(function() {
      marbleBoxes[rowNumber].classList.remove('active');
      rowNumber++;
      marbleBoxes[rowNumber].classList.add('active');
      document.getElementById('submit-button').style.display = 'none';
    }, 20)
  }

  function checkForWin() {
    if(gradeArray.length === 4 && gradeArray.every(isBlack)) {
      winState = true;
      setTimeout(function(){
        if(confirm(`Way to go Master Mind! You cracked the code in ${rowNumber} guesses! Would you like to try again?`)) {
          resetBoard();
        }
      }, 10);
    }
  }

  function isBlack(index) {
    return index === 1;
  }

  function resetBoard() {
    let hintPegs = document.getElementsByClassName('hint-peg');
    clickCount = 0;
    marbleBoxes[rowNumber].classList.remove('active');
    rowNumber = 0;
    marbleBoxes[rowNumber].classList.add('active');
    answerArray = [];
    makeAnswer();
    winState = false;
    for (var i = 0; i < tempArray.length; i++) {
      for (var j = 0; j < tempArray[i].length; j++) {
        masterArray[i][j] = -1;
      }
    }
    for(var i = 0; i < marbles.length; i++) {
      marbles[i].style.backgroundColor = 'rgb(255, 255, 255)';
    }
    for (var i = 0; i < hintPegs.length; i++) {
      hintPegs[i].style.backgroundColor = '#bab58f';
    }
  };

});
