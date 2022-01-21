import General from "./../../../../components/catalog/product/create/general";
import Variation from "./../../../../components/catalog/product/create/variation";

export default {
  name: "CreateProduct",
  data() {
    return {
      data: {
        categories: [],
        product: {},
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
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListProduct",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    changeTab(type) {
      this.display.tab = type;
    },
    
    createProductListener(id) {
      this.data.product = id;
      this.display.tab = "variation";
    },

    updateProductListener(){
      this.display.tab = "variation";
    }
  },
};
