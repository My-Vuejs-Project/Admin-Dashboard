<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  props: {
    chartData: Object,
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            try {
              let label = " " + data.labels[tooltipItem.index] || "";
              const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              if (label) {
                label += " ";
              }

              const sum = data.datasets[0].data.reduce(
                (accumulator, curValue) => {
                  return accumulator + curValue;
                }
              );
              

              label += "("+Number((value / sum) * 100).toFixed(2) + "%)";
              return label
            } catch (error) {
              console.log(error);
            }
          },
        },
      },
    });
  },
};
</script>