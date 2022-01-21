import Service from "../../../../utils/api/service";

export default {
  name: "CreateStockStatus",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
      },
      body: {
        name: "",
        description: "",
        sortOrder: 0
      },
    };
  },
  components: {
  },
  computed: {},
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListStockStatus",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    subminCreateStockStatus() {
      if (!this.body.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isCreating = true;
        this.createStockStatus()
      }
    },

    createStockStatus() {
      let body = {
        name: this.body.name,
        sortOrder: this.body.sortOrder ? this.body.sortOrder : 0,
        description: this.body.description
      };

      Service.createStockStatus(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createStockStatus();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Stock status has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
        sortOrder: 0
      };
    },
  },
};