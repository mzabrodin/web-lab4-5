let pizzaCardAmount = 0;

document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filters-buttons button");

    filterButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            changeFilter(event.target);
        });
    });

    const defaultButton = document.querySelector(".filters-buttons button[content='all']");
    if (defaultButton) {
        defaultButton.click();
    }
});

function changeFilter(element) {
    pizzaCardAmount = 0;
    const content = element.getAttribute("content");

    const filterProperties = document.querySelectorAll(".filters-buttons button");
    filterProperties.forEach((prop) => {
        if (prop) prop.removeAttribute("chosen");
    });
    element.setAttribute("chosen", "chosen");

    const filterNameElement = document.querySelector(".filter-name");
    filterNameElement.textContent = element.textContent;

    fetch("./scripts/data.json")
        .then((response) => response.json())
        .then((data) => {
            const pizzaCards = document.querySelectorAll(".pizza-card");

            pizzaCards.forEach((pizzaCard) => {
                pizzaCard.style.display = "none";
                const pizzaTitle = pizzaCard.querySelector(".caption > h3").textContent;

                const pizza = data.find(p => p.title === pizzaTitle);

                if (pizza) {
                    const contentList = Object.keys(pizza["content"]);

                    if (content === "all" || contentList.includes(content) || (content === "vegan" && pizza.type === "Вега піца")) {
                        pizzaCard.style.display = "block";
                        pizzaCardAmount++;
                    }
                }
            });

            document.querySelector("#amount-main").innerText = pizzaCardAmount;
        })
        .catch((error) => {
            console.error("Error in orderlist:", error);
        });
}