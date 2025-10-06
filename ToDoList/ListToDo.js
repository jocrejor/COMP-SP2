document.addEventListener("DOMContentLoaded", main);

let llista = new Array();


function main() {
    const tasques = document.getElementById("llista");
    const tascaInput = document.getElementById("tasca");
    const afegirButton = document.getElementById("afegir");
    if(window.localStorage.getItem("llista")) {
        llista = JSON.parse(window.localStorage.getItem("llista"));
    }
    visualitzaLlista();
    afegirButton.addEventListener("click", function () {
        if(tascaInput.value === "") {
            alert("No es poden crear tasques buides");
            return;
        }
        const tasca = document.getElementById("tasca").value;
        const prioritat = document.getElementById("prioritat").value;
        llista.push({tasca: tasca, prioritat: prioritat});
        window.localStorage.setItem("llista", JSON.stringify(llista));
        visualitzaLlista();
        tascaInput.value = "";
        console.log(llista);

    });
    function visualitzaLlista() {
        const visllista = document.getElementById("llista");
        visllista.innerHTML = "";
        let li="";
        llista.forEach((item, index) => {
           li += "<li>" + item.tasca + " - Prioritat: " + item.prioritat + "</li>";
        });
        visllista.innerHTML = li;

            

    }
}