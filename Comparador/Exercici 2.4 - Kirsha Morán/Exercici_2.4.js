let persona = null;

//Objecte persona amb atributs
persona = {
    nombre:"Pepe",
    edad: 30,
    altura: 178
};

//Funció
function mostraDades(){
    console.log("El usuario " + persona.nombre + " tiene " + persona.edad + " años y mide " + persona.altura + " centímetros.")
}

mostraDades();