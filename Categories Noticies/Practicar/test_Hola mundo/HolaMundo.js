


function missatge(){

    let element = document.getElementById("title1");
    console.log(element);
    console.error(element);
    element.textContent="Hola Mundo";
    element.innerHTML("Hola mundo");
}




let numerosAR = new Array();
numerosAR[0] = 4;
numerosAR[1] = 9;
numerosAR[2] = 15;
numerosAR[3] = 8;
numerosAR[4] = 7;
numerosAR[5] = 22;
numerosAR[6] = 1100;
numerosAR[7] = 99;
numerosAR[8] = 77;
numerosAR[9] = 32;

let negativeAR = new Array();

function comparative(){
    let more
    for(let i = 0 ; i < numerosAR.length; i++){
        more = numerosAR[i];
        negativeAR.push[1] = more;
        console.log(negativeAR[i]);
    }
}

function speakNumbers(){
    for(let i = 0; i <= numerosAR.length; i++){
        let speakN = numerosAR[i];
        console.log(speakN);
    }
}
