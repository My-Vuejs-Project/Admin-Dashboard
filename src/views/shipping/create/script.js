import Service from "../../../utils/api/service";
export default {
  name: "CreateShipping",
  data() {
    return {
      isCreating: false,
      body: {
        courierName: "",
        courierNumber: "",
        courierCode: "",
      },
    };
  },
  components: {
  },
  created() {

  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListShipping"
      });
    },
    submitCreateShipping() {
      let validatedMessage = this.validateBody(this.body)
      if (validatedMessage == "ok") {
        this.isCreating = true
        this.createShipping()
      } else {
        this.$toasted.show(validatedMessage)
      }
    },
    validateBody(data) {
      if (!data.courierName) {
        return "Courier name cannot be empty!"
      } else if (!data.courierNumber) {
        return "Courier number cannot be empty!"
      } else if (!data.courierCode) {
        return "Courier code cannot be empty!"
      } else {
        return "ok"
      }
    },

    createShipping() {
      Service.createShipping(this.body).then((response) => {
        this.isCreating = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createShipping()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.resetBody()
          this.$toasted.show("Shipping courier has been created.")
        }
      });
    },
    resetBody() {
      this.body = {
        courierName: "",
        courierNumber: "",
        courierCode: "",
      }
    }
  },
};