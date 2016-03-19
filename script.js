


window.addEventListener('load', () => {
  Array.prototype.forEach.call(document.getElementsByClassName('number'), (button => {
    button.addEventListener('click', () => {
      console.log('hi');
    })
  }));

});
