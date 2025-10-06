window.onload() = main;

function main (){
  let element = document.getElementById("veureMissatge");
    console.log(element);

}

function missatge() {
  let element = document.getElementById("veureMissatge");
  console.log(element);
  console.error(element);
  element.textContent = "Es la 1 i 5 minuts";
  element.innerHTML ="<strong>NOOOOOOO</strong>";
  element.style="color:red";
}
