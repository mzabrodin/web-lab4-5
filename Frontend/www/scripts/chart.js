document.addEventListener('DOMContentLoaded', function () {

    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    const params = new URLSearchParams(window.location.search);
    const orderData = JSON.parse(decodeURIComponent(params.get('data')));

    function drawChart() {
        drawGeneralChart();
        drawTypeChart();
        drawSizeChart();
    }

    function drawGeneralChart() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Pizza');
        data.addColumn('number', 'Amount');
        data.addColumn({type: 'string', role: 'tooltip'});

        for (let key in orderData) {
            let pizza = orderData[key];
            let tooltip = `${pizza.title} ${pizza.sizeLabel} \n Amount: ${pizza.amount}\nTotal Price: ${pizza.amount * pizza.price} грн`;
            data.addRow([pizza.title + ' ' + pizza.sizeLabel, pizza.amount, tooltip]);
        }

        const options = {
            title: 'General',
            is3D: true
        };

        const chart = new google.visualization.PieChart(document.getElementsByClassName('chart-general')[0]);
        chart.draw(data, options);
    }

    function drawTypeChart() {
        const typeData = {};

        for (let key in orderData) {
            let pizza = orderData[key];
            if (typeData[pizza.title]) {
                typeData[pizza.title].amount += pizza.amount;
                typeData[pizza.title].totalPrice += pizza.amount * pizza.price;
            } else {
                typeData[pizza.title] = {
                    amount: pizza.amount,
                    totalPrice: pizza.amount * pizza.price
                };
            }
        }

        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Pizza');
        data.addColumn('number', 'Amount');
        data.addColumn({type: 'string', role: 'tooltip'});

        for (let title in typeData) {
            let pizzaData = typeData[title];
            let tooltip = `${title} \n Amount: ${pizzaData.amount}\nTotal Price: ${pizzaData.totalPrice} грн`;
            data.addRow([title, pizzaData.amount, tooltip]);
        }

        const options = {
            title: 'General',
            is3D: true
        };

        const chart = new google.visualization.PieChart(document.getElementsByClassName('chart-type')[0]);
        chart.draw(data, options);
    }

    function drawSizeChart() {
        const sizeData = {};
        const sizeTooltipData = {};

        for (let key in orderData) {
            let pizza = orderData[key];
            if (sizeData[pizza.sizeLabel]) {
                sizeData[pizza.sizeLabel] += pizza.amount;
                sizeTooltipData[pizza.sizeLabel] += pizza.amount * pizza.price;
            } else {
                sizeData[pizza.sizeLabel] = pizza.amount;
                sizeTooltipData[pizza.sizeLabel] = pizza.amount * pizza.price;
            }
        }

        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Size');
        data.addColumn('number', 'Amount');
        data.addColumn({type: 'string', role: 'tooltip'});

        for (let sizeLabel in sizeData) {
            let tooltip = `${sizeLabel}\n Amount: ${sizeData[sizeLabel]}\nTotal Price: ${sizeTooltipData[sizeLabel]} грн`;
            data.addRow([sizeLabel, sizeData[sizeLabel], tooltip]);
        }

        const options = {
            title: 'Size',
            is3D: true,
            tooltip: { isHtml: true }
        };

        const chart = new google.visualization.PieChart(document.getElementsByClassName('chart-size')[0]);
        chart.draw(data, options);
    }
});

function redirectToChart() {
    const orderData = localStorage.getItem("orderData");
    const encodedData = encodeURIComponent(orderData);
    window.location.href = `index.html?data=${encodedData}`;
}