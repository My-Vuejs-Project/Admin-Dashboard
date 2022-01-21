import Service from "../../../../utils/api/service";

export default {
  name: "CreateCurrency",
  data() {
    return {
      isCreating: false,
      body: {
        name: "",
        code: "",
      },
    };
  },
  components: {},
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: 'ListCurrency'
      });
    },

    closeModal() {
      this.display.modal.formError = false;
      this.display.modal.media = false;
    },

    submitCreateCurrency() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createCurrency();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    createCurrency() {
      let code = this.body.code;

      let body = {
        name: this.body.name,
        code: code.toUpperCase(),
      };

      Service.createCurrency(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createCurrency()
              }
            })
          } else {
            this.isCreating = false
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.isCreating = false
          this.resetBody();
          this.$toasted.show("Currency has been created.");
        }
      });
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.code) {
        return "Currency code cannot be empty!";
      } else {
        return "ok";
      }
    },

    resetBody() {
      this.isCreating = false;
      this.body = {
        name: "",
        code: "",
      };
    },
  },
};