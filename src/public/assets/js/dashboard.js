const likeCount = document.getElementById('likeCount');
const viewCount = document.getElementById('viewCount');
let myChart;
const ctx = document.getElementById('myChart')
// eslint-disable-next-line no-unused-vars
myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true

            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                boxPadding: 3
            }
        }
    }
})
function getDashboardData(timeQuery) {
    fetch(`/dashboard/dashboard-data?timeQuery=${timeQuery}`)
        .then(response => response.json())
        .then(data => {
            const likeData = formatDashboardDataQuery(data.data.likes, timeQuery)
            const viewData = formatDashboardDataQuery(data.data.views, timeQuery)

            updateChart(viewData, likeData);
        })
}
getDashboardData("1week");


const updateChart = (viewData, likeData) => {
    const newLabels = viewData.map((d) => d.name);
    const newDatasets = [{
        data: viewData.map((d) => d.value),
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
    },
    {
        data: likeData.map((d) => d.value),
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#28a745',
        borderWidth: 4,
        pointBackgroundColor: '#28a745'
    }]
    myChart.data.labels = newLabels;
    myChart.data.datasets = newDatasets;
    myChart.update();
    likeCount.innerHTML = likeData.reduce((acc, curr) => acc + curr.value, 0);
    viewCount.innerHTML = viewData.reduce((acc, curr) => acc + curr.value, 0);
}

// // ["1week", "2weeks", "1month", "6months", "1year", "all"]
const formatDashboardDataQuery = (data, timeQuery) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function getRangeFromQuery(query) {
        const endDate = new Date();
        const startDate = new Date();

        switch (query) {
            case "1week":
                startDate.setDate(endDate.getDate() - 7);
                break;
            case "2weeks":
                startDate.setDate(endDate.getDate() - 14);
                break;
            case "1month":
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case "6months":
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case "1year":
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
        }

        return { startDate, endDate };
    }

    function generateDateLabels(query, startDate, endDate) {
        const labels = [];
        const currentDate = new Date(startDate);

        if (query === '1week' || query === '2weeks' || query === '1month') {
            while (currentDate <= endDate) {
                labels.push(`${daysOfWeek[currentDate.getDay()]} ${currentDate.getDate()}`);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else if (query === '2months' || query === '6months' || query === '1year') {
            while (currentDate <= endDate) {
                const monthLabel = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
                if (!labels.includes(monthLabel)) {
                    labels.push(monthLabel);
                }
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        } else {
            while (currentDate <= endDate) {
                labels.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        return labels;
    }

    const { startDate, endDate } = getRangeFromQuery(timeQuery);
    const dateLabels = generateDateLabels(timeQuery, startDate, endDate);

    const summaryMap = {};
    dateLabels.forEach((label) => {
        summaryMap[label] = 0;
    });

    data.forEach((d) => {
        const date = b.soldDate;
        const dateLabel =
            timeQuery === '1week' || timeQuery === '2weeks' || timeQuery === '1month'
                ? `${daysOfWeek[new Date(date).getDay()]} ${new Date(date).getDate()}`
                : timeQuery === '2months' || timeQuery === '6months' || timeQuery === '1year'
                    ? `${months[new Date(date).getMonth()]} ${new Date(date).getFullYear()}`
                    : new Date(date).toISOString().split("T")[0];

        if (summaryMap[dateLabel]) {
            summaryMap[dateLabel] += 1;
        }
    });

    return dateLabels.map((label) => ({
        name: label,
        value: summaryMap[label],
    }));
};

document.querySelectorAll('.time-query-item').forEach((el) => {
    let timeQueryInfo = [
        { key: "1 Week", value: "1week" },
        { key: "2 Weeks", value: "2weeks" },
        { key: "1 Month", value: "1month" },
        { key: "2 Months", value: "2months" },
        { key: "6 Months", value: "6months" },
        { key: "1 Year", value: "1year" },
    ]
    el.addEventListener('click', (e) => {
        document.querySelector('.time-query-item.active')?.classList.remove('active');
        e.target.classList.add('active');
        const timeQuery = e.target.getAttribute('data-time-query')
        document.getElementById("time-query-select").innerText = timeQueryInfo.find((i) => i.value == timeQuery).key
        getDashboardData(timeQuery)
        // getDashboardData();
    });
});