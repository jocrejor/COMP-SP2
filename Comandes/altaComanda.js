// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", () => {

    let form = document.getElementById("pedidoForm");
    let llistaBtn = document.getElementById("afegir");
    let addProductBtn = document.getElementById("addProduct");
    let productsTable = document.getElementById("productsTable").getElementsByTagName("tbody")[0];

 // Funció per mostrar missatges
    function showMessage(text, color = "red") {
        let messageBox = document.getElementById("message-box");
        if (!messageBox) {
            messageBox = document.createElement("div");
            messageBox.id = "message-box";
            messageBox.style.marginTop = "10px";
            messageBox.style.fontWeight = "bold";
            form.appendChild(messageBox);
        }
        messageBox.textContent = text;
        messageBox.style.color = color;
    }

    // Funció per afegir una nova línia de producte
    function addProductLine() {
        let firstLine = document.querySelector(".product-line");
        let newLine = firstLine.cloneNode(true);

        // Netejar valors
        //NewLine es una nova fila de producte creada a partir d'una còpia de la primera fila, amb els camps buits i el boto per a eliminar-la
        newLine.querySelector("select[name='product_id[]']").value = "";
        newLine.querySelector("input[name='quantity[]']").value = "";
        newLine.querySelector("input[name='price[]']").value = "";
        newLine.querySelector("input[name='discount[]']").value = "0.00";

        productsTable.appendChild(newLine);

        // Afegim al botó eliminar de la nova línia
        let removeBtn = newLine.querySelector(".removeProduct");
        removeBtn.addEventListener("click", () => removeProductLine(newLine));
    }

    // Funció per eliminar una línia de producte
    function removeProductLine(row) {
        let allRows = productsTable.getElementsByClassName("product-line");
        if (allRows.length > 1) {
            productsTable.removeChild(row);
        } else {
            showMessage("Ha de quedar almenys una línia de producte!");
        }
    }

    // Afegir al primer botó eliminar existent
    let firstRemoveBtn = document.querySelector(".product-line .removeProduct");
    firstRemoveBtn.addEventListener("click", () => {
        let row = firstRemoveBtn.closest("tr");
        removeProductLine(row);
    });

    // Per afegir línia nova
    addProductBtn.addEventListener("click", addProductLine);

    // Enviar formulari
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    form.querySelector("button[type='submit']").disabled = true;

        let date = document.getElementById("date").value;
        let payment = document.getElementById("payment").value;
        let shipping = parseFloat(document.getElementById("shipping").value) || 0;
        let client = document.getElementById("client").value;

        let products = [];
        let allLines = document.getElementsByClassName("product-line");

        for (let i = 0; i < allLines.length; i++) {
            let line = allLines[i];
            let product_id = line.querySelector("select[name='product_id[]']").value;
            let quantity = parseInt(line.querySelector("input[name='quantity[]']").value) || 0;
            let price = parseFloat(line.querySelector("input[name='price[]']").value) || 0;
            let discount = parseFloat(line.querySelector("input[name='discount[]']").value) || 0;

            products.push({ product_id, quantity, price, discount });
        }
    
        //Missatge
        if (products.length === 0) {
             showMessage("Has d’afegir almenys un producte!", "red");
            return;
        }

        let total = 0;
        for (let i = 0; i < products.length; i++) {
            let p = products[i];
            total += (p.quantity * p.price) - p.discount;
        }
        total += shipping;

        let pedido = {
            id: Date.now(),
            date,
            payment,
            shipping,
            client,
            total,
            products
        };

        // Guardar al localStorage
        let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
        pedidos.push(pedido);
        localStorage.setItem("pedidos", JSON.stringify(pedidos));

         showMessage("Comanda guardada ✅", "green");

        // Redirigir després de 1 segons
        setTimeout(() => {
            window.location.href = "comandesLlistar.html";
        }, 1000);
    });

    // Botó per anar a la llista de comandes
    llistaBtn.addEventListener("click", () => {
        window.location.href = "comandesLlistar.html";
    });

});
