//Definim el array de numeros a gastar
let numeros=[8,16,22,128,3,1,54];
//Posem el màxim a zero perque volem que el valor canvie fins que trobem el màxim
let maxim = 0;
// Posem el minim al valor mès gran possible, per tal de poder trobar el mìnim (TOTS els nombres seràn < MAXINT)
let minim = Number.MAX_SAFE_INTEGER ;
function trobaValors() {
    //Bucle màxim
    for (let i=0; i < numeros.length; i++) {
        if(numeros[i] > maxim) {
            maxim = numeros[i];
        }
    }
    //Bucle mínim
    for (let i=0; i < numeros.length; i++) {
        if(numeros[i] < minim) {
            minim = numeros[i];
        }
    }
    alert("El major del array és: " + maxim);
    alert("El mínim del array és: " + minim);
}