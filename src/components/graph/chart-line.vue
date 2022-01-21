<template>
  <div >
    <div title="Line">
      <div
        v-for="(item, index) in btn" :key="index"
        :name="item.label"
        :value="item.value"
        @change="updateChart"
      >
        <!-- {{ item.label }} -->
      </div>
    </div>
    <div img-bottom>
      <ChartLineBase :chart-data="chartData" />
    </div>
  </div>
</template>
<style scoped>



</style>
<script>
import ChartLineBase from "../../components/graph/chart-line-base";

export default {
  components: {
    ChartLineBase
  },
  data() {
    return {
      btn: [
        { label: "Today", value: "day" },
        { label: "This Week", value: "week" }
      ],
      chartData: null,
      data: {
        day: [1.5, 2, 5, 2, 1, 1.5, 4.5, 3, 2, 4],
        week: [12, 14, 16, 18, 11, 13, 15]
      },
      labels: {
        day: [8, 10, 12, 14, 16, 18, 20],
        week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      radio: "day"  
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.chartData = {
        labels: this.labels[this.radio],
        datasets: [
          {
            borderColor: "#81894e",
            data: this.data[this.radio],
            label: "recent user register"
          }
        ]
      };
    },
    updateChart() {
      this.$nextTick(() => {
        this.fillData();
      });
    }
  }
};
</script>