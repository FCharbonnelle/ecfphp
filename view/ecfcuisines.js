document.addEventListener('DOMContentLoaded', function() {
    const commandes = document.getElementById('commandes');

    // Récupérer le panier depuis le stockage local
    const panier = JSON.parse(localStorage.getItem('panier')) || [];

    panier.forEach(pizza => {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = pizza.name;

        const quantityTd = document.createElement('td');
        quantityTd.textContent = pizza.quantite;

        const statusTd = document.createElement('td');
        const select = document.createElement('select');
        select.className = 'order-status';
        ['commandee', 'en_preparation', 'prete', 'livree'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
            if (pizza.status === status) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        statusTd.appendChild(select);

        const actionTd = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm delete-order';
        deleteButton.textContent = 'Supprimer';
        actionTd.appendChild(deleteButton);

        tr.appendChild(nameTd);
        tr.appendChild(quantityTd);
        tr.appendChild(statusTd);
        tr.appendChild(actionTd);

        commandes.appendChild(tr);
    });

    // Ajouter un écouteur d'événement pour mettre à jour le statut de la commande
    commandes.addEventListener('change', function(event) {
        if (event.target.classList.contains('order-status')) {
            const tr = event.target.closest('tr');
            const pizzaName = tr.children[0].textContent;
            const newStatus = event.target.value;

            // Mettre à jour le statut dans le stockage local
            const pizza = panier.find(p => p.name === pizzaName);
            if (pizza) {
                pizza.status = newStatus;
                localStorage.setItem('panier', JSON.stringify(panier));
            }
        }
    });

    // Ajouter un écouteur d'événement pour supprimer la commande
    commandes.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-order')) {
            const tr = event.target.closest('tr');
            const pizzaName = tr.children[0].textContent;

            // Supprimer la commande du stockage local
            const pizzaIndex = panier.findIndex(p => p.name === pizzaName);
            if (pizzaIndex !== -1) {
                panier.splice(pizzaIndex, 1);
                localStorage.setItem('panier', JSON.stringify(panier));
            }

            // Supprimer la ligne du tableau
            tr.remove();
        }
    });
});