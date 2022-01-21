import Service from "../../../../utils/api/service";

export default {
  name: "EditCustomerGroup",
  data() {
    return {
      isCreating: false,
      body: {
        name: "",
        description: "",
        status: "active",
      },
    };
  },
  components: {},
  computed: {},

  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListCustomerGroup",
        query: { page: 1, limit: 10 },
      });
    },

    submitCreate() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createCustomerGroup();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.description) {
        return "Description cannot be empty!";
      } else if (!data.status) {
        return "Status cannot be empty!";
      } else {
        return "ok";
      }
    },

    createCustomerGroup() {
      let body = {
        name: this.body.name,
        description: this.body.description,
        status: this.body.status,
      };

      Service.createCustomerGroup(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createCustomerGroup();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Customer group has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
        status: "active",
      };
    },
  },
};
