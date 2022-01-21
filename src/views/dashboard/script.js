import Service from "../../utils/api/service";
import AreaChart from "./../../components/chart/area-chart.vue";
import BarChart from "./../../components/chart/bar-chart.vue";
import PieChart from "./../../components/chart/pie-chart.vue";
import TableLoading from "./../../components/share/table-loading";
export default {
    name: "dashboard",
    data() {
        return {
            isFetching: true,
            data: {
                customers: 0,
                movies: 0,
                successOrder: 0,
                watching: 0,
                paymentMethod: [],
                userAccount: [],
            },
            userAccountAreaChart: {
                labels: [],
                datasets: [
                    {
                        label: "Customer Registration",
                        borderColor: "#1a222e",
                        pointBackgroundColor: "#1a222e",
                        borderWidth: 1,
                        pointBorderColor: "white",
                        backgroundColor: this.gradient,
                        data: [],
                    },
                ],
            },
            paymentMethodPieChart: {
                labels: [],
                datasets: [
                    {
                        backgroundColor: [],
                        data: [],
                    },
                ],
            },
        };
    },
    components: {
        AreaChart,
        BarChart,
        PieChart,
        TableLoading
    },
    created() {
        this.getPaymentGraphData()
    },
    mounted() {

    },
    methods: {
        getPaymentGraphData() {
            Service.getPaymentGraphData().then((response) => {
                if (response.statusCode) {
                    if (response.statusCode == "4410") {
                        Service.refreshToken().then((response) => {
                            if (response == "ok") {
                                this.getPaymentGraphData();
                            }
                        });
                    } else {
                        this.$toasted.show(response.message.capitalize());
                    }
                } else {
                    this.data.customers = response.customers;
                    this.data.movies = response.products;
                    this.data.successOrder = response.successOrder;
                    this.data.watching = response.onlineCustomers;
                    this.data.paymentMethod = response.data;
                    this.mapDataPaymentMethodToPieChart();
                    this.getReportUserGraphData();
                }
            });
        },
        mapDataPaymentMethodToPieChart() {
            this.data.paymentMethod.forEach( item => {
                if (item.id == 1){
                    this.paymentMethodPieChart.datasets[0].backgroundColor.push("#e5e5e5");
                }else if (item.id == 2){
                    this.paymentMethodPieChart.datasets[0].backgroundColor.push("#e4872e");
                }else if (item.id == 3){
                    this.paymentMethodPieChart.datasets[0].backgroundColor.push("#c8a337");
                }else if (item.id == 4){
                    this.paymentMethodPieChart.datasets[0].backgroundColor.push("#005c76");
                }else {
                    this.paymentMethodPieChart.datasets[0].backgroundColor.push("#a1abb0");
                }
                let chartLabel = item.name + " : " + item.count
                this.paymentMethodPieChart.labels.push(chartLabel);
                this.paymentMethodPieChart.datasets[0].data.push(parseInt(item.count));
            });
        },

        getReportUserGraphData() {
            Service.getReportUserGraphData().then((response) => {
                this.isFetching = false;
                if (response.statusCode) {
                    if (response.statusCode == "4410") {
                        Service.refreshToken().then((response) => {
                            if (response == "ok") {
                                this.getReportUserGraphData();
                            }
                        });
                    } else {
                        this.$toasted.show(response.message.capitalize());
                    }
                } else {
                    this.data.userAccount = response.data;
                    this.mapDataUserAccountToAreaChart();
                }
            });
        },

        mapDataUserAccountToAreaChart() {
            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];

            for (let i = 0; i < this.data.userAccount.length; i++) {
                let item = this.data.userAccount[i];
                const date = new Date(item.date + "-01");
                this.userAccountAreaChart.labels.push(monthNames[date.getMonth()]);
                this.userAccountAreaChart.datasets[0].data.push(parseInt(item.count));
            }
        },
    },
}