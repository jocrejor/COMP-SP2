window.onload() = main;

function main(){
        let Element = document.getElementById("Veure missatge");
    console.log(Element);
}

function alerta(){
    alert("Que psa bala")
}

function missatge(mis){
    let Element = document.getElementById("Veure missatge");
    console.log(Element);
    console.error(Element);
    Element.textContent="QUE PAAAASSSSSAA BALAAA";
}