
// --------------------

var messenger = { 
  message: "Hello World", 
  start: function() { 
    setTimeout(() => { alert(this.message); }, 3000); 
  } 
}; 
messenger.start();

// --------------------

window.onmousemove = e => {
  console.log('Mouse at ('+e.screenX+','+e.screenY+')');
}
