//Here we're importing items we'll need. You can add other imports here.
import * as TimePicker from "./TimePicker.js"


TimePicker.activate();

const btn = document.querySelector("button");
btn.onclick = function () {

  alert("You ran some JavaScript");
};
