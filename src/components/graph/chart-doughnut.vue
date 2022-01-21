<template>
  <div >
      <ChartDoughnutBase :chart-data="chartData" />
  </div>
</template>

<script>
import ChartDoughnutBase from "../../components/graph/chart-doughnut-base";

export default {
  components: {
    ChartDoughnutBase,
  },
  data() {
    return {
      chartData: null,
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.chartData = {
        labels: ["Cancel", "Buying", "Orders"],
        datasets: [
          {
            backgroundColor: ["#f36e60", "#ffdb3b", "#185190"],
            hoverBackgroundColor: ["#fbd2cd", "#fef5c9", "#d1e3f7"],
            data: [10, 20, 40],
          },
        ],
      };
    },
  },
};
</script>