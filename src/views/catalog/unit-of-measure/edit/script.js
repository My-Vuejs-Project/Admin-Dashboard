import Service from "../../../../utils/api/service";

export default {
  name: "EditUnitOfMeasure",
  data() {
    return {
      isUpdating: false,
      data: {},
      customToolbar: [
        ["bold", "italic", "underline"],
        [{
          list: "ordered"
        }, {
          list: "bullet"
        }],
      ]
    };
  },
  components: {},
  computed: {},
  created() {
    this.getUnitOfMeasureDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListUnitOfMeasure",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    getUnitOfMeasureDetail(id) {
      Service.getUnitOfMeasureDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getUnitOfMeasureDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data = response.data;
        }
      });
    },

    subminUpdateUnitOfMeasure() {
      if (!this.data.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isUpdating = true;
        this.updateUnitOfMeasure();
      }
    },

    updateUnitOfMeasure() {
      let id = this.$route.query.id;
      let body = {
        name: this.data.name,
        description: this.data.description
      };

      Service.updateUnitOfMeasure(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateUnitOfMeasure();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack()
          this.$toasted.show("Unit of measure has been updated.");
        }
      });
    },
  },
};