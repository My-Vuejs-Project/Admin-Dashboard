import General from "./../../../../components/catalog/product/edit/general";
import Variation from "./../../../../components/catalog/product/edit/variation";
import Service from "./../../../../utils/api/service";

export default {
  name: "EditProduct",
  data() {
    return {
      data: {
        productDetail: {},
        categories: [],
        productGeneral: {},
      },
      display: {
        tab: "general",
      },
      // define the default value
      value: null,
      options: [],
    };
  },
  components: {
    General,
    Variation,
  },
  created() {
    this.getProductDetail(this.$route.query.id);
  },
  methods: {
    async getProductDetail(id) {
      await Service.getProductDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getProductDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.productDetail = response.data;
        }
      });
    },

    changeTab(type) {
      this.display.tab = type;
    },

    createProductGeneralListener(productGeneral) {
      this.data.productGeneral = productGeneral;
    },
  },
};
