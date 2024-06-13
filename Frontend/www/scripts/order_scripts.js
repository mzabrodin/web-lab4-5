function addItemToOrder(button) {
    const buyButton = button.closest(".buy_button");
    const size_property = Array.from(buyButton.classList)[1];
    const order = document.querySelector(".order");

    var size;

    if (size_property == "big_pizza") {
        size = "big";
    } else {
        size = "small";
    }

    const pizzaCard = button.closest("div.pizza-card");
    const pizzaName = pizzaCard.querySelector(".caption > h3").innerText;

    fetch("./scripts/data.json")
        .then((response) => response.json())
        .then((data) => {
            for (let pizza of data) {
                if (pizza.title !== pizzaName) {
                    continue;
                }
                var sizeLabel;
                if (size === "big") {
                    sizeLabel = "(Велика)";
                } else {
                    sizeLabel = "(Мала)";
                }

                // Check if item already exists in order
                let existingItem = null;
                const orderItems = order.getElementsByClassName("order-list-item");
                for (let i = 0; i < orderItems.length; i++) {
                    if (isSameItem(orderItems[i], pizza.title + " " + sizeLabel)) {
                        existingItem = orderItems[i];
                        break;
                    }
                }

                if (existingItem) {
                    // Increment quantity
                    const amountElement = existingItem.querySelector(".order-counter");
                    const currentAmount = parseInt(amountElement.textContent);
                    amountElement.textContent = currentAmount + 1;

                    // Update local storage
                    const pizzaObjectJSON = localStorage.getItem(pizza.title + " " + sizeLabel);
                    const pizzaObject = JSON.parse(pizzaObjectJSON);
                    pizzaObject.amount += 1;
                    localStorage.setItem(pizza.title + " " + sizeLabel, JSON.stringify(pizzaObject));

                    // Update total amount and price
                    const currentAmountCart = parseInt(document.querySelector("#amount-cart").innerHTML);
                    document.querySelector("#amount-cart").innerHTML = currentAmountCart + 1;

                    const currentPrice = parseInt(document.querySelector(".sum").innerHTML.split(" ")[0]);
                    document.querySelector(".sum").innerHTML = currentPrice + pizzaObject.price + " грн";

                    return; // Exit fetch loop
                }

                // If item does not exist, create new itemElement and add to order
                let itemElement = document.createElement("div");
                itemElement.classList.add("order-list-item");

                itemElement.innerHTML = `
                    <div class="order-list-text">
                        <span class="ordered-pizza-name">${pizza.title} ${sizeLabel}</span>
                        <div class="features">
                            <div class="svg-container">
                                <img src="assets/images/size-icon.svg" alt="size-icon" />
                                <span>${pizza[size + "_size"].size}</span>
                            </div>
                            <div class="svg-container">
                                <img src="assets/images/weight.svg" alt="size-icon" />
                                <span>${pizza[size + "_size"].weight}</span>
                            </div>
                        </div>
                        <div class="price-config">
                            <div class="order-list-price">${pizza[size + "_size"].price} грн</div>
                            <div class="amount-config">
                                <button class="round-button delete" onclick="minusItem(this)">-</button>
                                <span class="order-counter">1</span>
                                <button class="round-button add" onclick="plusItem(this)">+</button>
                                <button class="round-button remove" onclick="removeItem(this)">x</button>
                            </div>
                        </div>
                    </div>
                    <img src="${pizza.icon}" alt="small order pizza" class="ordered-pizza-img" />
                `;

                order.appendChild(itemElement);

                // Update local storage with new item
                let pizzaObject = {
                    title: pizza.title,
                    sizeLabel: sizeLabel,
                    size: pizza[size + "_size"].size,
                    weight: pizza[size + "_size"].weight,
                    price: pizza[size + "_size"].price,
                    icon: pizza.icon,
                    amount: 1,
                };

                let pizzaTitle = pizza.title + " " + sizeLabel;
                localStorage.setItem(pizzaTitle, JSON.stringify(pizzaObject));

                // Update total amount and price
                const currentAmountCart = parseInt(document.querySelector("#amount-cart").innerHTML);
                document.querySelector("#amount-cart").innerHTML = currentAmountCart + 1;

                const currentPrice = parseInt(document.querySelector(".sum").innerHTML.split(" ")[0]);
                document.querySelector(".sum").innerHTML = currentPrice + pizzaObject.price + " грн";
            }
        })
        .catch((error) => {
            console.error("Error in orderlist:", error);
        });
}

function isItemAlreadyInOrderList(itemElement) {
    const orderList = document.querySelector(".order");
    const orderItems = orderList.getElementsByClassName("order-list-item");
    for (let i = 0; i < orderItems.length; i++) {
        if (isSameItem(itemElement, orderItems[i])) {
            return true;
        }
    }
    return false;
}

function isSameItem(item, pizzaName) {
    const orderedPizzaName = item.querySelector(".ordered-pizza-name").textContent;
    return orderedPizzaName === pizzaName;
}


window.addEventListener("load", function () {
    var generalAmount = 0;
    var generalPrice = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const pizzaObjectJSON = localStorage.getItem(key);

        let itemElement = document.createElement("div");
        itemElement.classList.add("order-list-item");

        const pizzaObject = JSON.parse(pizzaObjectJSON);

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
              <div class="order-list-price">${pizzaObject.price} грн</div>
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

        const order = document.querySelector(".order");
        order.appendChild(itemElement);

        generalAmount += pizzaObject.amount;
        generalPrice += pizzaObject.amount * pizzaObject.price;
    }
    document.querySelector("#amount-cart").innerHTML = generalAmount;
    document.querySelector(".sum").innerHTML = generalPrice + " грн";

    console.log(generalAmount);
    console.log(generalPrice);
});

function plusItem(button) {
    const listItem = button.closest(".order-list-item");
    const pizzaName = listItem.querySelector(".ordered-pizza-name").innerText;

    const pizzaObjectJSON = localStorage.getItem(pizzaName);
    const pizzaObject = JSON.parse(pizzaObjectJSON);

    pizzaObject.amount += 1;

    const currentAmount = parseInt(
        document.querySelector("#amount-cart").innerHTML
    );
    document.querySelector("#amount-cart").innerHTML = currentAmount + 1;

    const currentPrice = parseInt(
        document.querySelector(".sum").innerHTML.split(" ")[0]
    );
    document.querySelector(".sum").innerHTML =
        parseInt(currentPrice + pizzaObject.price) + " грн";

    const amountElement = listItem.querySelector(".order-counter");
    amountElement.textContent = pizzaObject.amount;

    const finalPrice = listItem.querySelector(".order-list-price");
    finalPrice.textContent = pizzaObject.price * pizzaObject.amount + " грн";

    localStorage.setItem(pizzaName, JSON.stringify(pizzaObject));

    console.log("Updated pizza amount:", pizzaObject.amount);
}

function minusItem(button) {
    const listItem = button.closest(".order-list-item");
    const pizzaName = listItem.querySelector(".ordered-pizza-name").innerText;

    const pizzaObjectJSON = localStorage.getItem(pizzaName);
    const pizzaObject = JSON.parse(pizzaObjectJSON);

    if (pizzaObject.amount > 1) {
        pizzaObject.amount -= 1;

        const currentAmount = parseInt(
            document.querySelector("#amount-cart").innerHTML
        );
        document.querySelector("#amount-cart").innerHTML = currentAmount - 1;

        const currentPrice = parseInt(
            document.querySelector(".sum").innerHTML.split(" ")[0]
        );
        document.querySelector(".sum").innerHTML =
            parseInt(currentPrice - pizzaObject.price) + " грн";

        const amountElement = listItem.querySelector(".order-counter");
        amountElement.textContent = pizzaObject.amount;

        const finalPrice = listItem.querySelector(".order-list-price");
        finalPrice.textContent = pizzaObject.price * pizzaObject.amount + " грн";

        localStorage.setItem(pizzaName, JSON.stringify(pizzaObject));

        console.log("Updated pizza amount:", pizzaObject.amount);
    } else if (pizzaObject.amount === 1) {
        removeItem(button);
    }
}

function removeItem(button) {
    const listItem = button.closest(".order-list-item");
    const pizzaName = listItem.querySelector(".ordered-pizza-name").innerText;

    const pizzaObjectJSON = localStorage.getItem(pizzaName);
    const pizzaObject = JSON.parse(pizzaObjectJSON);

    const currentAmount = parseInt(
        document.querySelector("#amount-cart").innerHTML
    );
    document.querySelector("#amount-cart").innerHTML =
        currentAmount - pizzaObject.amount;

    const currentPrice = parseInt(
        document.querySelector(".sum").innerHTML.split(" ")[0]
    );
    document.querySelector(".sum").innerHTML = parseInt(
        currentPrice - pizzaObject.amount * pizzaObject.price
    );
    localStorage.removeItem(pizzaName);
    listItem.remove();

}

function removeAllItems() {
    const orderList = document.querySelector(".order");
    const orderItems = orderList.getElementsByClassName("order-list-item");

    while (orderItems.length > 0) {
        removeItem(orderItems[0].querySelector(".remove"));
    }
}