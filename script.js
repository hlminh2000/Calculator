


window.addEventListener('load', () => {

  var prev_val = 0;
  var new_val = 0;
  var operating = false;
  var lastOp = "";
  var freshStart = true;
  var inDecimal = false;

  let calc_add = (new_val) => { return (prev_val) => {return new_val + prev_val}; }
  let calc_sub = (new_val) => { return (prev_val) => {return new_val - prev_val}; }
  let calc_mul = (new_val) => { return (prev_val) => {return new_val * prev_val}; }
  let calc_div = (new_val) => { return (prev_val) => {return new_val / prev_val}; }
  let evaluate = (prev_val, operation, new_val) => { return operation(prev_val)(new_val); }

  let result_screen = document.getElementsByClassName('screen_result')[0];
  let operation_screen = document.getElementsByClassName('screen_operation')[0];

  result_screen.innerHTML = prev_val;

  Array.prototype.forEach.call(document.getElementsByClassName('number'), (digit => {
    digit.addEventListener('click', () => {
      if(freshStart === true){
        prev_val = 0;
        freshStart = false;
        result_screen.innerHTML = "";
      }
      if(operating === false){
        prev_val *= 10;
        prev_val += Number(digit.innerHTML);
        console.log(prev_val);
        result_screen.innerHTML += digit.innerHTML;
        operation_screen.innerHTML += prev_val;
      }
      else{
        new_val *= 10;
        new_val += Number(digit.innerHTML);
        console.log(new_val);
        result_screen.innerHTML += digit.innerHTML;
        // operation_screen.innerHTML += new_val;
      }
    })
  }));

  document.getElementById('dec').addEventListener('click', () => {
    inDecimal = true;
  });

  Array.prototype.forEach.call(document.getElementsByClassName('operator'), (operation => {
    operation.addEventListener('click', () => {
      operating = true;
      if(lastOp != ""){
        prev_val = evaluate(prev_val,
          lastOp == 'add'       ? calc_add :
          lastOp == 'minus'     ? calc_sub :
          lastOp == 'multiply'  ? calc_mul : calc_div,
          new_val)
        new_val = 0;
      }
      result_screen.innerHTML = prev_val + "</br>" + operation.innerHTML;
      lastOp = operation.id;
      freshStart = false;
      // operation_screen.innerHTML += (" " + operation.innerHTML + " ");
    })
  }));

  document.getElementById('equal').addEventListener('click', () => {
    // console.log('hi');
    if(operating === true){
      prev_val = evaluate(prev_val,
        lastOp == 'add'       ? calc_add :
        lastOp == 'minus'     ? calc_sub :
        lastOp == 'multiply'  ? calc_mul : calc_div,
        new_val)
        new_val = 0;
        result_screen.innerHTML = prev_val;
        lastOp = '';
        operating = false;
        freshStart = true;
    }
  })

  document.getElementById('clear').addEventListener('click', () => {
    prev_val = 0;
    new_val = 0;
    operating = false;
    lastOp = "";
    freshStart = true;
    result_screen.innerHTML = "0";
  })
});
