import Service from "../../../../utils/api/service";

export default {
  name: "CreateUnitOfMeasure",
  data() {
    return {
      isCreating: false,
      body: {
        name: "",
        description: "",
      },
    };
  },
  components: {},
  computed: {},
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListUnitOfMeasure",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    subminCreateUnitOfMeasure() {
      if (!this.body.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isCreating = true;
        this.createUnitOfMeasure();
      }
    },

    createUnitOfMeasure() {
      let body = {
        name: this.body.name,
        description: this.body.description,
      };

      Service.createUnitOfMeasure(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createUnitOfMeasure();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Unit of measurement has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
      };
    },
  },
};
