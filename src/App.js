import React, { useState } from 'react'
import Button from './Button.js'
import Screen from './Screen.js'

const App = () => {
  const [ currentClick, setCurrentClick ] = useState('0');
  const [ expression, setExpression ] = useState('');
  const [ isEqualsClicked, setIsEqualsClicked ] = useState(false);
  const symbols = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    zero: '0',
    decimal: '.',
    equals: '=',
    add: '+',
    subtract: '-',
    multiply: 'X',
    divide: '/',
    clear: 'AC',
  };

  // Parse and evaluate an equation and return the result
  const evaluateExpression = (equation) => {
    let operator = '';
    let result = 0;

    // If the equation is just an integer with no valid operation, just return it
    if (equation.match(/[-+/X]/) === null){
      return equation;
    }

    // Set operator based on the matching regex 
    if (equation.match(/[+]/)){
      operator = '+';
    }
    else if (equation.match(/[X]/)){
      operator = 'X';
    }
    else if (equation.match(/[/]/)){
      operator = '/';
    }
    // Place subtraction last so the previous operators take effect and negative numbers retain the minus sign
    else if (equation.match(/[-]/)){
      // Treat consecutive minus operators as plus
      if (equation.match(/--/)){
        equation = equation.replace('--', '+');
        operator = '+';
      }
      else{
        operator = '-';
      }
    }

    let equationArray = equation.split(operator);
    // If the first index is empty because of a split from minus sign (i.e. negative number), treat it as zero
    // This also deals with a negative integer input with no operators
    if (equationArray[0] === ""){
      equationArray[0] = '0';
    }

    switch(operator){
      case "+":
        result = equationArray.reduce((total, sum) => parseFloat(total) + parseFloat(sum));
        break;
      case "-":
        result = equationArray.reduce((total, difference) => parseFloat(total) - parseFloat(difference));
        break;
      case "X":
        result = equationArray.reduce((total, product) => parseFloat(total) * parseFloat(product));
        break;
      case "/":
        result = equationArray.reduce((total, quotient) => parseFloat(total) / parseFloat(quotient));
        break;
      default:
        break;
    }
    return `${result}`;
  }

  const handleOperator = (operator) => {
    setCurrentClick(symbols[operator]);
    setIsEqualsClicked(false);
    // Add, multiply, and divide will operatorally act the same
    if (operator === 'add' || operator === 'multiply' || operator === 'divide'){
      // If the operator is the first button clicked after a clean state
      if (expression === ''){
        setExpression(expression.concat('0').concat(symbols[operator]));
      }
      // For a case where the last two characters in the expression state are operators, change the two operators to the last clicked operator --> this can happen for a negative number
      else if(expression.length > 2 && expression[expression.length - 2].match(/[-+X/]/) !== null && expression[expression.length - 1].match(/[-+X/]/) !== null){
        setExpression(expression.slice(0, expression.length - 2).concat(symbols[operator]))
      }
      // For a case where the last character in the expression state is an operator, change the operator to the new one
      else if(expression[expression.length - 1].match(/[-+X/]/) !== null){
        setExpression(expression.slice(0, expression.length - 1).concat(symbols[operator]))
      }
      // For any other cases where the expression state has an operator character, evaluate the expression
      else if (expression.match(/[-+X/]/) !== null){
        setExpression(evaluateExpression(expression).concat(symbols[operator]));
      }
      else{
        setExpression(expression.concat(symbols[operator]));
      }
    }
    // Minus acts differently because of subtraction and negative numbers
    else{
      // If expression is empty or only has a minus sign, treat the minus as a leading negative sign
      if (expression === '' || expression === '-'){
        setExpression(symbols[operator]);
      }
      // For a case where the last two characters in the expression state are operators, treat the last operator as a leading negative sign --> this can happen for a negative number
      else if(expression.length > 2 && expression[expression.length - 2].match(/[-+X/]/) !== null && expression[expression.length - 1].match(/[-]/) !== null){
        setExpression(expression.slice(0, expression.length - 1).concat(symbols[operator]))
      }
      // For a case where the last character in the expression state is an operator, treat the minus as a leading negative sign
      else if(expression[expression.length - 1].match(/[-+X/]/) !== null ){
        setExpression(expression.concat(symbols[operator]))
      }
      // For any other cases where the expression state has an operator character, evaluate the expression
      else if (expression.match(/[-+X/]/) !== null){
        setExpression(evaluateExpression(expression).concat(symbols[operator]));
      }
      else{
        setExpression(expression.concat(symbols[operator]));
      }
    }
  }

  // Use event delegation for the group of buttons
  const handleOnClick = (event) => {
    switch (event.target.id){
      // Ignore none-button clicks
      case "screen":
        break;
      case "calculator":
        break;
      case "bottom-screen":
        break;
      case "top-screen":
        break;
      case "clear":
        // Clear all states
        setCurrentClick('0');
        setExpression('');
        break;
      case "equals":
        // Evaluate expression and update both states
        setCurrentClick(evaluateExpression(expression));
        setExpression(evaluateExpression(expression));
        setIsEqualsClicked(true);
        break;
      case "add":
        if (currentClick !== '+'){
          handleOperator('add');
        }
        break;
      case "subtract":
          handleOperator('subtract');
        break;
      case "multiply":
        if (currentClick !== 'X'){
          handleOperator('multiply');
        }
        break;
      case "divide":
        if (currentClick !== '/'){
          handleOperator('divide');
        }
        break;
      case "decimal":
        // Each number can only have one decimal
        if (currentClick.match(/[.]/) === null){
          // If the currentClick state is an operator, treat the decimal as 0.xxxx
          currentClick === '+'
          || currentClick === '-'
          || currentClick === 'X'
          || currentClick === '/'
          ? setCurrentClick('0'.concat(symbols[event.target.id]))
          // Otherwise, just concatenate the decimal
          : setCurrentClick(currentClick.concat(symbols[event.target.id]));

          // If the expression is empty, treat the decimal as 0.xxx
          expression === ''
          ? setExpression(expression.concat('0').concat(symbols["decimal"]))
          // Otherwise, just concatenate the decimal
          : setExpression(expression.concat(symbols[event.target.id]));
        }
        break;
      default:
        // If the last button clicked was equals, treat the next number clicked as a new expression
        if (isEqualsClicked === true){
          setCurrentClick(symbols[event.target.id]);
          setExpression(symbols[event.target.id]);
          setIsEqualsClicked(false);
        }
        else{
          // Keep the number on zero until a different number or operator is selected (except minus)
          currentClick === '0' 
          || currentClick === '+'
          || currentClick === 'X'
          || currentClick === '/'
          || currentClick === '='
          ? setCurrentClick(symbols[event.target.id])
          // Let bottom screen be a negative number if it's following an operator
          : currentClick === '-' && expression.length > 2 && expression[expression.length - 2].match(/[-+X/]/)
          ? setCurrentClick(currentClick.concat(symbols[event.target.id]))
          // Let bottom screen be a negative number if it's the expression is just a leading negative sign
          : currentClick ==='-' && expression === '-'
          ? setCurrentClick(currentClick.concat(symbols[event.target.id]))
          // For other cases of clicking the minus operator, just show the minus operator
          : currentClick === '-'
          ? setCurrentClick(symbols[event.target.id])
          // For numbers, just append
          : setCurrentClick(currentClick.concat(symbols[event.target.id]));

          // If expression is zero, overwrite it. Otherwise, append to it
          expression === '0'
          ? setExpression(symbols[event.target.id])
          : setExpression(expression.concat(symbols[event.target.id]));
        }
        
        break;
    }
  }
 
  return(
    <div id="container">
      <div id="calculator" onClick={handleOnClick}>
        <div id="screen">
          <Screen id="top-screen" name={expression}/>
          <Screen id="bottom-screen" name={currentClick}/>
        </div>
        {Object.keys(symbols).map(symbol => <Button id={symbol} name={symbols[symbol]} key={symbol} />)}
      </div>
    </div>
  )
}

export default App