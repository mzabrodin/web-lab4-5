google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    const params = new URLSearchParams(window.location.search);
    const orderData = JSON.parse(decodeURIComponent(params.get('data')));

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
        title: 'Pizza Orders',
        is3D: true // Optional: for a 3D effect
    };

    const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function redirectToChart() {
    const orderData = localStorage.getItem("orderData");
    const encodedData = encodeURIComponent(orderData);
    window.location.href = `index.html?data=${encodedData}`;
}