import Service from "../../../../utils/api/service";

export default {
  name: "CreateGeoZone",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
      },
      body: {
        name: "",
        description: "",
        shippingPrice: "",
      },
    };
  },
  components: {},
  computed: {},
  created() { },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListGeoZone",
        query: { page: 1, limit: 10 },
      });
    },

    subminCreateGeoZone() {
      if (!this.body.name) {
        this.$toasted.show("Name cannot be empty!");
      } else if (!this.body.description) {
        this.$toasted.show("Description cannot be empty!");
      } else if (!this.body.shippingPrice) {
        this.$toasted.show("Shipping price cannot be empty!");
      } else {
        this.isCreating = true;
        this.createGeoZone()
      }
    },

    createGeoZone() {
      let body = {
        name: this.body.name,
        description: this.body.description,
        shippingPrice: parseFloat(this.body.shippingPrice)
      };

      Service.createGeoZone(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createGeoZone();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Geo zone has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
        shippingPrice: ""
      };
    },
  },
};
