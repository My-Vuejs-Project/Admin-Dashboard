import Service from "../../../../utils/api/service";

export default {
  name: "EditCurrency",
  data() {
    return {
      isUpdating: false,
      data: {
        currencyDetail: {
        },
      },
    };
  },
  components: {},
  created() {
    this.getCurrencyDetail(this.$route.query.code);
  },
  methods: {
    getCurrencyDetail(id) {
      Service.getCurrencyDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCurrencyDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.currencyDetail = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({ name: "ListCurrency" });
    },

    submitUpdateCurrency() {
      let validatedMessage = this.validateBody(this.data.currencyDetail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateCurrency();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    updateCurrency() {
      let id = this.data.currencyDetail.id;

      let body = {
        name: this.data.currencyDetail.name,
      };

      Service.updateCurrency(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateCurrency();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.$toasted.show("Currency has been updated.");
          this.goBack();
        }
      });
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else {
        return "ok";
      }
    },
  },
};
