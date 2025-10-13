//window.onload(alert("Activitat 1"));


/*function missatge() {
    alert("Hola!");
}*/

window.onload = main;

function main (){
let element = document.getElementById("veureMissatge");
console.log(element);

}

function missatge(mis) {
   let element = document.getElementById("veureMissatge");
    console.log(element);
    console.error(element);
    element.textContent="Es la 1 i la 5 minuts";
    element.innerHTML="<strong>Nooo</strong>";
    element.style="color:red";
}
