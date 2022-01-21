import Service from "../../../../utils/api/service";

export default {
  name: "EditZoneToGeoZone",
  data() {
    return {
      isUpdating: false,
      body: {
        name: "",
        description: "",
        shippingPrice: "",
      },
    };
  },
  components: {},
  computed: {},
  created() {
    this.geoZoneDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListZoneToGeoZone",
        // query: { page: 1, limit: 10 },
      });
    },

    geoZoneDetail(id) {
      Service.getGeoZoneDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.geoZoneDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.body.name = response.data.name
          this.body.description = response.data.description
          this.body.shippingPrice = response.data.shippingPrice
        }
      });
    },

    subminUpdateGeoZone() {
      if (!this.body.name) {
        this.$toasted.show("Name cannot be empty!");
      } else if (!this.body.description) {
        this.$toasted.show("Description cannot be empty!");
      } else if (!this.body.shippingPrice) {
        this.$toasted.show("Shipping price cannot be empty!");
      } else {
        this.isUpdating = true;
        this.updateGeoZone();
      }
    },

    updateGeoZone() {
      let id = this.$route.query.id;
      let body = {
        name: this.body.name,
        description: this.body.description,
        shippingPrice: parseFloat(this.body.shippingPrice)
      };

      Service.updateGeoZone(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateGeoZone();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.goBack()
          this.$toasted.show("Stock status has been updated.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
        shippingPrice: "",
      };
    },
  },
};
