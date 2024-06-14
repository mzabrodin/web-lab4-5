function addItemToOrder(button) {
    const buyButton = button.closest(".buy_button");
    const size_property = Array.from(buyButton.classList)[1];

    let size;

    if (size_property === "big_pizza") {
        size = "big";
    } else {
        size = "small";
    }

    const pizzaCard = button.closest("div.pizza-card");
    const pizzaName = pizzaCard.querySelector(".caption > h3").innerText;

    fetch("./scripts/data.json")
        .then((response) => response.json())
        .then((data) => {
            let pizza = data.find(p => p.title === pizzaName);
            if (!pizza) return;

            let sizeLabel = size === "big" ? "(Велика)" : "(Мала)";

            let orderData = JSON.parse(localStorage.getItem("orderData")) || {};
            let pizzaKey = `${pizza.title} ${sizeLabel}`;

            if (orderData[pizzaKey]) {
                orderData[pizzaKey].amount += 1;
            } else {
                orderData[pizzaKey] = {
                    title: pizza.title,
                    sizeLabel: sizeLabel,
                    size: pizza[size + "_size"].size,
                    weight: pizza[size + "_size"].weight,
                    price: pizza[size + "_size"].price,
                    icon: pizza.icon,
                    amount: 1,
                };
            }

            localStorage.setItem("orderData", JSON.stringify(orderData));
            updateOrderDisplay();
        })
        .catch((error) => {
            console.error("Error in orderlist:", error);
        });
}

window.addEventListener("load", function () {
    updateOrderDisplay();
});

function plusItem(button) {
    const listItem = button.closest(".order-list-item");
    const pizzaName = listItem.querySelector(".ordered-pizza-name").innerText;

    let orderData = JSON.parse(localStorage.getItem("orderData")) || {};
    if (!orderData[pizzaName]) return;

    orderData[pizzaName].amount += 1;
    localStorage.setItem("orderData", JSON.stringify(orderData));
    updateOrderDisplay();
}

function minusItem(button) {
    const listItem = button.closest(".order-list-item");
    const pizzaName = listItem.querySelector(".ordered-pizza-name").innerText;

    let orderData = JSON.parse(localStorage.getItem("orderData")) || {};
    if (!orderData[pizzaName]) return;

    if (orderData[pizzaName].amount > 1) {
        orderData[pizzaName].amount -= 1;
    } else {
        delete orderData[pizzaName];
    }

    localStorage.setItem("orderData", JSON.stringify(orderData));
    updateOrderDisplay();
}

function removeItem(button) {
    const listItem = button.closest(".order-list-item");
    const pizzaName = listItem.querySelector(".ordered-pizza-name").innerText;

    let orderData = JSON.parse(localStorage.getItem("orderData")) || {};
    if (orderData[pizzaName]) {
        delete orderData[pizzaName];
    }

    localStorage.setItem("orderData", JSON.stringify(orderData));
    updateOrderDisplay();
}

function removeAllItems() {
    localStorage.removeItem("orderData");
    updateOrderDisplay();
}

function updateOrderDisplay() {
    const order = document.querySelector(".order");
    order.innerHTML = "";

    let orderData = JSON.parse(localStorage.getItem("orderData")) || {};
    let generalAmount = 0;
    let generalPrice = 0;

    for (let key in orderData) {
        const pizzaObject = orderData[key];

        let itemElement = document.createElement("div");
        itemElement.classList.add("order-list-item");

        itemElement.innerHTML = `
          <div class="order-list-text">
            <span class="ordered-pizza-name">${pizzaObject.title} ${pizzaObject.sizeLabel}</span>
            <div class="features">
              <div class="svg-container">
                <img src="assets/images/size-icon.svg" alt="size-icon" />
                <span>${pizzaObject.size}</span>
              </div>
              <div class="svg-container">
                <img src="assets/images/weight.svg" alt="size-icon" />
                <span>${pizzaObject.weight}</span>
              </div>
            </div>
            <div class="price-config">
              <div class="order-list-price">${pizzaObject.price * pizzaObject.amount} грн</div>
              <div class="amount-config">
                <button class="round-button delete" onclick="minusItem(this)">-</button>
                <span class="order-counter">${pizzaObject.amount}</span>
                <button class="round-button add" onclick="plusItem(this)">+</button>
                <button class="round-button remove" onclick="removeItem(this)">x</button>
              </div>
            </div>
        </div>
        <img
            src="${pizzaObject.icon}"
            alt="small order pizza"
            class="ordered-pizza-img"
          />
        `;

        order.appendChild(itemElement);

        generalAmount += pizzaObject.amount;
        generalPrice += pizzaObject.amount * pizzaObject.price;
    }

    document.querySelector("#amount-cart").innerHTML = generalAmount.toString();
    document.querySelector(".sum").innerHTML = generalPrice + " грн";
}
