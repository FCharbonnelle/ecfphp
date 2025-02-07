document.addEventListener('DOMContentLoaded', function() {
    const menu = document.getElementById('menu');
    const baseSelect = document.getElementById('base-select');
    const panierItems = document.querySelector('.panier-items');
    const totalElement = document.getElementById('total');
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    let pizzasData = [];

    // Récupérer tous les fichiers JSON
    const pizzaFiles = [
        'json/Capricciosa.json',
        'json/Hawaienne.json',
        'json/Margherita.json',
        'json/Marinara.json',
        'json/Prosciutto.json',
        'json/Sicilienne.json'
    ];

    Promise.all(pizzaFiles.map(file => fetch(file).then(response => response.json())))
        .then(pizzas => {
            pizzasData = pizzas;
            afficherPizzas(pizzasData);
        });

    baseSelect.addEventListener('change', function() {
        const selectedBase = baseSelect.value;
        const filteredPizzas = selectedBase === 'all' ? pizzasData : pizzasData.filter(pizza => pizza.base === selectedBase);
        afficherPizzas(filteredPizzas);
    });

    function afficherPizzas(pizzas) {
        while (menu.firstChild) {
            menu.removeChild(menu.firstChild);
        }
        pizzas.forEach(pizza => {
            const template = document.getElementById('pizza-template').content.cloneNode(true);
            template.querySelector('.card-img-top').src = pizza.image;
            template.querySelector('.card-title').textContent = pizza.name;
            template.querySelector('.description').textContent = pizza.ingredients.join(', ');
            template.querySelector('.price').textContent = `${pizza.price} €`;

            const addToCartButton = template.querySelector('.add-to-cart');
            const quantityDisplay = template.querySelector('.quantity');
            const increaseButton = template.querySelector('.increase');
            const decreaseButton = template.querySelector('.decrease');

            let quantity = 0;
            quantityDisplay.textContent = quantity;

            addToCartButton.addEventListener('click', () => {
                if (quantity > 0) {
                    ajouterAuPanier({ ...pizza, quantite: quantity });
                    quantity = 0;
                    quantityDisplay.textContent = quantity;
                    // Ajouter une animation pour montrer que la pizza a été ajoutée au panier
                    addToCartButton.classList.add('added');
                    setTimeout(() => {
                        addToCartButton.classList.remove('added');
                    }, 1000);
                    // Afficher la modale
                    afficherModale(pizza.name);
                }
            });

            increaseButton.addEventListener('click', () => {
                quantity++;
                quantityDisplay.textContent = quantity;
            });

            decreaseButton.addEventListener('click', () => {
                if (quantity > 0) {
                    quantity--;
                    quantityDisplay.textContent = quantity;
                }
            });

            menu.appendChild(template);
        });
    }

    function ajouterAuPanier(pizza) {
        const pizzaExistante = panier.find(p => p.name === pizza.name);
        if (pizzaExistante) {
            pizzaExistante.quantite += pizza.quantite;
        } else {
            panier.push(pizza);
        }
        localStorage.setItem('panier', JSON.stringify(panier));
        afficherPanier();
    }

    function afficherPanier() {
        while (panierItems.firstChild) {
            panierItems.removeChild(panierItems.firstChild);
        }

        let total = 0;
        panier.forEach(pizza => {
            const li = document.createElement('li');
            li.textContent = `${pizza.name} - Quantité: ${pizza.quantite}`;
            panierItems.appendChild(li);
            total += pizza.quantite * pizza.price;
        });
        totalElement.textContent = total.toFixed(2) + ' €';
    }

    window.viderPanier = function() {
        panier = [];
        localStorage.removeItem('panier');
        afficherPanier();
    };

    function afficherModale(pizzaName) {
        const modale = document.createElement('div');
        modale.className = 'modale';
        modale.textContent = `La pizza ${pizzaName} a été ajoutée au panier.`;
        document.body.appendChild(modale);

        setTimeout(() => {
            modale.remove();
        }, 1000);
    }

    // Function to display order summary on ecfcommandes.html
    function afficherRecapitulatif() {
        const recapitulatif = document.getElementById('recapitulatif');
        while (recapitulatif.firstChild) {
            recapitulatif.removeChild(recapitulatif.firstChild);
        }

        let totalCommande = 0;

        panier.forEach(pizza => {
            const tr = document.createElement('tr');
            const totalPizza = pizza.quantite * pizza.price;
            totalCommande += totalPizza;

            const nameTd = document.createElement('td');
            nameTd.textContent = pizza.name;

            const quantityTd = document.createElement('td');
            quantityTd.textContent = pizza.quantite;

            const priceTd = document.createElement('td');
            priceTd.textContent = `${pizza.price} €`;

            const totalTd = document.createElement('td');
            totalTd.textContent = `${totalPizza.toFixed(2)} €`;

            tr.appendChild(nameTd);
            tr.appendChild(quantityTd);
            tr.appendChild(priceTd);
            tr.appendChild(totalTd);
            recapitulatif.appendChild(tr);
        });

        const totalTr = document.createElement('tr');
        const totalLabelTd = document.createElement('td');
        totalLabelTd.colSpan = 3;
        totalLabelTd.textContent = 'Total Commande';
        const totalValueTd = document.createElement('td');
        totalValueTd.textContent = `${totalCommande.toFixed(2)} €`;

        totalTr.appendChild(totalLabelTd);
        totalTr.appendChild(totalValueTd);
        recapitulatif.appendChild(totalTr);
    }

    // Call afficherRecapitulatif when needed, e.g., on page load or button click

    document.querySelector('.panier-actions .btn-success').addEventListener('click', () => {
        const panierItems = document.querySelectorAll('.panier-items .item');
        const order = Array.from(panierItems).map(item => ({
            id: item.dataset.id,
            name: item.querySelector('.name').textContent,
            price: item.querySelector('.price').textContent
        }));
        fetch('index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Commande passée avec succès !');
                viderPanier();
            }
        });
    });
});

function fetchPizzas() {
    fetch('index.php')
        .then(response => response.json())
        .then(pizzas => {
            const pizzasContainer = document.getElementById('pizzas');
            pizzas.forEach(pizza => {
                const pizzaElement = document.createElement('div');
                pizzaElement.classList.add('col-md-4');
                pizzaElement.innerHTML = `
                    <div class="card mb-4">
                        <img src="${pizza.image}" class="card-img-top" alt="${pizza.name}">
                        <div class="card-body">
                            <h5 class="card-title">${pizza.name}</h5>
                            <p class="card-text">${pizza.description}</p>
                            <p class="card-text"><strong>${pizza.price}€</strong></p>
                            <button class="btn btn-primary" onclick="ajouterAuPanier(${pizza.id}, '${pizza.name}', ${pizza.price})">Ajouter au panier</button>
                        </div>
                    </div>
                `;
                pizzasContainer.appendChild(pizzaElement);
            });
        });
}

function ajouterAuPanier(id, name, price) {
    const panierItems = document.querySelector('.panier-items');
    const item = document.createElement('div');
    item.classList.add('item');
    item.dataset.id = id;
    item.innerHTML = `
        <p class="name">${name}</p>
        <p class="price">${price}€</p>
    `;
    panierItems.appendChild(item);
    mettreAJourTotal();
}

function viderPanier() {
    document.querySelector('.panier-items').innerHTML = '';
    mettreAJourTotal();
}

function mettreAJourTotal() {
    const panierItems = document.querySelectorAll('.panier-items .item');
    const total = Array.from(panierItems).reduce((sum, item) => sum + parseFloat(item.querySelector('.price').textContent), 0);
    document.getElementById('total').textContent = total.toFixed(2) + '€';
}