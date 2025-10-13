window.onload = iniciar;

function iniciar (){
    document.getElementById("enviar").addEventListener("click", validar, false);
}


function validarnom () {
      var element = document.getElementById("nom");
      if (!element.checkValidity()){
          if (element.validity.valueMissing){
              error(element,"Deus d'introduïr un nom.");
          }
          if (element.validity.patternMismatch){
              error(element, "El nom ha de tindre entre 2 i 20 caracters.");
          }
          //error(element);
          return false;
      }
      return true;
}

function validarvalor () {
      var element = document.getElementById("valor");
      if (!element.checkValidity()){
          if (element.validity.valueMissing){
              error(element,"Deus d'introduïr un valor.");
          }
          if (element.validity.patternMismatch){
              error(element, "El valor ha de tindre entre 2 i 20 caracters.");
          }
          //error(element);
          return false;
      }
      return true;
}


    function validar (e) {
    esborrarError ();
    if (validarnom()  && validarvalor () && confirm("Confirma si vols enviar el formulari") ){
        return true;

    }
    else{
        e.preventDefault();
        return false;
    }
}

  function error (element, missatge){
    let miss=document.createTextNode(missatge);    
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}


    function esborrarError (){
    document.getElementById("missatgeError").textContent="";
    let formulari = document.forms[0];
        for ( let i=0; i < formulari.elements.length; i++){
            formulari.elements[i].classList.remove("error");
        }
}