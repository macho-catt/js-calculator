import React, { useState, useEffect } from 'react'
import Button from './Button.js'
import Screen from './Screen.js'
//import axios from 'axios'
//import { faTwitter } from '@fortawesome/free-brands-svg-icons'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const App = () => {
  const [ currentClick, setCurrentClick ] = useState('0');
  const [ expression, setExpression ] = useState('');
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

  // Set currentClick state based on the provided boolean
  const currentClickSetter = (id, option) => {
    option
    ? setCurrentClick(symbols[id])
    : setCurrentClick(currentClick.concat(symbols[id]));
  }

  // Set expression state based on the provided boolean
  const expressionSetter = (id, option) => {
    option
    ? setExpression(symbols[id])
    : setExpression(expression.concat(symbols[id]));
  }

  // Evaluate an input equation and return the result
  const evaluateExpression = (equation) => {
    let operation = '';
    let result = 0;

    // Set operation based on the matching regex 
    if (equation.match(/[+]/)){
      operation = '+';
    }
    else if (equation.match(/[X]/)){
      operation = 'X';
    }
    else if (equation.match(/[/]/)){
      operation = '/';
    }
    // Place subtraction last so multiplication and division takes effect and negative numbers retain the minus sign
    else if (equation.match(/[-]/)){
      operation = '-';
    }

    let equationArray = equation.split(operation);
    // If the first index is empty because of a split from minus sign (i.e. negative number), treat it as zero
    if (equationArray[0] === ""){
      equationArray[0] = '0';
    }
    console.log(`array is: ${equationArray}`)

    switch(operation){
      case "+":
        result = equationArray.reduce((total, sum) => parseFloat(total) + parseFloat(sum));
        break;
      case "-":
        result = equationArray.reduce((total, difference) => parseFloat(total) - parseFloat(difference));
        console.log(result)
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

  // Use event delegation for the group of buttons
  const handleOnClick = (event) => {
    switch (event.target.id){
      // Ignore none-button clicks
      case "screen":
        break;
      case "calculator":
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
        break;
      case "add":
        // Allow only one + in the currentClick state
        if (currentClick !== '+'){
          currentClickSetter(event.target.id, true);
          // If expression is currently empty, treat it as zero
          expression === ''
          ? setExpression(expression.concat('0').concat(symbols["add"]))
          // If expression currently has a valid arithmetic equation, evaluate it first
          : expression.match(/[+]/) !== null
          || expression.match(/[-]/) !== null
          || expression.match(/[X]/) !== null
          || expression.match(/[/]/) !== null
          ? setExpression(evaluateExpression(expression).concat('+'))
          // Else, just concatenate the sign
          : expressionSetter(event.target.id, false);
        }
        break;
      case "subtract":
        // Allow only one minus in the currentClick state
        if (currentClick !== '-'){
          currentClickSetter(event.target.id, true);  
          // If expression is currently empty, treat it as zero
          expression === ''
          ? setExpression(expression.concat('0').concat(symbols["subtract"]))
          // If expression currently has a subtraction expression, evaluate it first
          : expression.match(/[-]/) !== null
          ? setExpression(evaluateExpression(expression).concat('-'))
          : expression.match(/[+]/) !== null
          || expression.match(/[X]/) !== null
          || expression.match(/[/]/) !== null
          ? console.log('do something else')
          // Else, just concatenate the sign
          : expressionSetter(event.target.id, false);
        }
        break;
      case "multiply":
        // Allow only one multiplication in the currentClick state
        if (currentClick !== 'X'){
          currentClickSetter(event.target.id, true);
          // If expression is currently empty, treat it as zero
          expression === ''
          ? setExpression(expression.concat('0').concat(symbols["multiply"]))
          // If expression currently has a valid arithmetic equation, evaluate it first
          : expression.match(/[+]/) !== null
          || expression.match(/[-]/) !== null
          || expression.match(/[X]/) !== null
          || expression.match(/[/]/) !== null
          ? setExpression(evaluateExpression(expression).concat('X'))
          // Else, just concatenate the sign
          : expressionSetter(event.target.id, false);
        }
        break;
      case "divide":
        // Allow only one division in the currentClick state
        if (currentClick !== '/'){
          currentClickSetter(event.target.id, true);
          // If expression is currently empty, treat it as zero
          expression === ''
          ? setExpression(expression.concat('0').concat(symbols["divide"]))
          // If expression currently has a valid arithmetic equation, evaluate it first
          : expression.match(/[+]/) !== null
          || expression.match(/[-]/) !== null
          || expression.match(/[X]/) !== null
          || expression.match(/[/]/) !== null
          ? setExpression(evaluateExpression(expression).concat('/'))
          // Else, just concatenate the sign
          : expressionSetter(event.target.id, false);
        }
        break;
      case "decimal":
        // Each number can only have one decimal
        if (currentClick.match(/[.]/) === null){
          // If the currentClick state is an operation, treat the decimal as 0.xxxx
          currentClick === '+'
          || currentClick === '-'
          || currentClick === 'X'
          || currentClick === '/'
          ? setCurrentClick('0'.concat(symbols[event.target.id]))
          // Otherwise, just concatenate the decimal
          : currentClickSetter(event.target.id, false);
          // If the expression is empty, treat the decimal as 0.xxx
          expression === ''
          ? setExpression(expression.concat('0').concat(symbols["decimal"]))
          // Otherwise, just concatenate the decimal
          : expressionSetter(event.target.id, false);
        }
        break;
      default:
        // Keep the number on zero until a different number is selected
        currentClick === '0' 
        || currentClick === '+'
        || currentClick === '-'
        || currentClick === 'X'
        || currentClick === '/'
        || currentClick === '='
        ? currentClickSetter(event.target.id, true)
        : currentClickSetter(event.target.id, false);
        expression === '0'
        ? expressionSetter(event.target.id, true)
        : expressionSetter(event.target.id, false);
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
        {/* can declare this using map */}
        <Button id="one" name="1" />
        <Button id="two" name="2" />
        <Button id="three" name="3" />
        <Button id="four" name="4" />
        <Button id="five" name="5" />
        <Button id="six" name="6" />
        <Button id="seven" name="7" />
        <Button id="eight" name="8" />
        <Button id="nine" name="9" />
        <Button id="zero" name="0" />
        <Button id="decimal" name="." />
        <Button id="equals" name="=" />
        <Button id="add" name="+" />
        <Button id="subtract" name="-" />
        <Button id="multiply" name="X" />
        <Button id="divide" name="/" />
        <Button id="clear" name="AC" />
      </div>
    </div>
  )
}

export default App