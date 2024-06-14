document.addEventListener("DOMContentLoaded", function () {

    const menu = document.querySelector(".menu");
    const amountMain = document.getElementById("amount-main");

    fetch("./scripts/data.json")
        .then((response) => response.json())
        .then((data) => {
            let pizzas = data;
            renderPizzas(pizzas);

            // Update the total count of pizzas
            amountMain.textContent = pizzas.length;
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to load pizza data. Please try again later.");
        });

        function renderPizzas(pizzas) {
            menu.innerHTML = "";
            pizzas.forEach((pizza) => {
                const card = document.createElement("div");
                card.className = "pizza-card";
    
                let content = Object.values(pizza.content).flat().join(", ");
                content = content.charAt(0).toUpperCase() + content.slice(1);
    
                card.innerHTML = `
                    <img src="${pizza.icon}" alt="${pizza.title}" />
                    <div class="caption">
                        <h3>${pizza.title}</h3>
                        <p class="pizza-type">${pizza.type}</p>
                        <p>${content}</p>
                    </div>
                    <div class="order-buttons"></div>
                `;
    
                const orderButtonsContainer = card.querySelector(".order-buttons");
    
                if (pizza.small_size) {
                    const smallSize = createOrderButton(pizza, pizza.small_size, "small_pizza");
                    orderButtonsContainer.appendChild(smallSize);
                }
    
                if (pizza.big_size) {
                    const bigSize = createOrderButton(pizza, pizza.big_size, "big_pizza");
                    orderButtonsContainer.appendChild(bigSize);
                }

                if (pizza.is_new) {
                    const newBadge = createBadge("Нова", "new");
                    card.appendChild(newBadge);
                } else if (pizza.is_popular) {
                    const popularBadge = createBadge("Популярна", "popular");
                    card.appendChild(popularBadge);
                }
    
                menu.appendChild(card);
            });
        }

    function createOrderButton(pizza, size, className) {
        const button = document.createElement("div");
        button.classList.add("buy_button", className);
        button.innerHTML = `
            <div class="svg-container">
                <img src="assets/images/size-icon.svg" alt="size-icon" />
                ${size.size}
            </div>
            <div class="svg-container">
                <img src="assets/images/weight.svg" alt="weight-icon" />
                ${size.weight}
            </div>
            <div class="price-container">
                <div class="price">${size.price}</div>
                <div class="grn">грн.</div>
            </div>
            <button onclick="addItemToOrder(this)" class="add-to-order" data-id="${pizza.id}">Купити</button>
        `;
        return button;
    }

    function createBadge(text, type) {
        const badge = document.createElement("div");
        badge.classList.add("pizza-badge");
        badge.setAttribute("badge", type);
        badge.textContent = text;
        return badge;
    }
});

function redirectToChart() {
    const orderData = localStorage.getItem("orderData");
    const encodedData = encodeURIComponent(orderData);
    window.location.href = `chart.html?data=${encodedData}`;
}
