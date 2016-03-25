


window.addEventListener('load', () => {

  var prev_val = "";
  var new_val = "";
  var operating = false;
  var last_op = "";
  var start_fresh = true;
  var in_decimal = false;
  var decLocation = 0;

  let calc_add = (new_val) => { return (prev_val) => { return Number(new_val) + Number(prev_val) }; }
  let calc_sub = (new_val) => { return (prev_val) => { return Number(new_val) - Number(prev_val) }; }
  let calc_mul = (new_val) => { return (prev_val) => { return Number(new_val) * Number(prev_val) }; }
  let calc_div = (new_val) => { return (prev_val) => { return Number(new_val) / Number(prev_val) }; }
  let evaluate = (prev_val, operation, new_val) => { return operation(prev_val)(new_val); }

  let result_screen = document.getElementsByClassName('screen_result')[0];
  let operation_screen = document.getElementsByClassName('screen_operation')[0];

  result_screen.innerHTML = prev_val;

  Array.prototype.forEach.call(document.getElementsByClassName('number'), (digit => {
    digit.addEventListener('click', () => {
      if(start_fresh){
        prev_val = "";
        start_fresh = false;
        result_screen.innerHTML = "";
      }
      if(!operating){
        prev_val += digit.innerHTML;
        result_screen.innerHTML += digit.innerHTML;
      }
      else{
        new_val += digit.innerHTML;
        result_screen.innerHTML += digit.innerHTML;
      }
    })
  }));

  document.getElementById('dec').addEventListener('click', () => {
    if(!operating && !in_decimal){
      prev_val = prev_val + ".";
      result_screen.innerHTML += ".";
    }
    else if(operating && !in_decimal){
      new_val = new_val + ".";
      result_screen.innerHTML += ".";
    }
    console.log(prev_val);
    in_decimal = true;
    start_fresh = false;
  });

  Array.prototype.forEach.call(document.getElementsByClassName('operator'), (operation => {
    operation.addEventListener('click', () => {
      operating = true;
      if(last_op != ""){
        prev_val = evaluate(prev_val,
          last_op == 'add'       ? calc_add :
          last_op == 'minus'     ? calc_sub :
          last_op == 'multiply'  ? calc_mul : calc_div,
          new_val)
        new_val = "";
      }
      result_screen.innerHTML = prev_val + "</br>" + operation.innerHTML;
      last_op = operation.id;
      start_fresh = false;
      decLocation = "";
    })
  }));

  document.getElementById('equal').addEventListener('click', () => {
    // console.log('hi');
    if(operating === true){
      prev_val = evaluate(prev_val,
        last_op == 'add'       ? calc_add :
        last_op == 'minus'     ? calc_sub :
        last_op == 'multiply'  ? calc_mul : calc_div,
        new_val)
        new_val = "";
        result_screen.innerHTML = prev_val;
        last_op = '';
        operating = false;
        start_fresh = true;
        decLocation = "";
    }
  })

  document.getElementById('clear').addEventListener('click', () => {
    prev_val = "";
    new_val = "";
    operating = false;
    last_op = "";
    start_fresh = true;
    result_screen.innerHTML = "0";
  })
});
