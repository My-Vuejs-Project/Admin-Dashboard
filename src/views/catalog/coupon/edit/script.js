import Service from "../../../../utils/api/service";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";

export default {
  name: "EditCoupon",
  data() {
    return {
      isUpdating: false,
      freeShipping: true,
      body: {
        name: "",
        code: "",
        type: "percentage",
        discount: 0,
        freeShipping: true,
        categoryId: [],
        productId: [],
        minAmount: 0,
        startDate: "",
        endDate: "",
        usesTotal: 0,
        usesCustomer: 0,
        status: "active",
      },
      data: {
        productList: [],
        categories: [],
        detail: {},
      },
      display: {
        category: false,
      },
      model: {
        products: [],
        cateogries: []
      },
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  components: { Multiselect, DatePicker },
  computed: {},
  created() {
    this.getCouponDetail(this.$route.query.id);
    this.getCategory();
    this.getAllProducts();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListCoupon",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    getCouponDetail(id) {
      Service.getCouponDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCouponDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.detail = response.data;
          // convert date
          let convertStartDate = moment(this.data.detail.startDate).toDate();
          let convertEndDate = moment(this.data.detail.endDate).toDate();
          this.data.detail.startDate = convertStartDate;
          this.data.detail.endDate = convertEndDate;

          //map category
          this.data.detail.categoryId = [];
          if (this.data.detail.categories.length > 0) {
            for (let i = 0; i < this.data.detail.categories.length; i++) {
              const element = this.data.detail.categories[i];
              this.data.detail.categoryId.push(element.id);
            }
          }

          //map product
          this.model.products = [];
          if (this.data.detail.products.length > 0) {
            for (let i = 0; i < this.data.detail.products.length; i++) {
              const element = this.data.detail.products[i];
              this.model.products.push(element);
            }
          }
        }
      });
    },

    getCategory() {
      Service.getAllCategories("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCategory();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.categories = response.data;
        }
      });
    },

    showCheckboxes() {
      if (this.display.category) {
        this.display.category = false;
      } else {
        this.display.category = true;
      }
    },

    getAllProducts() {
      Service.getAllProducts("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllProducts();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          let productList = response.data;
          let newList = [
            {
              name: "Select All",
              list: productList,
            },
          ];

          this.data.productList = newList;
        }
      });
    },

    submitUpdateCoupon() {
      let validatedMessage = this.validateBody(this.data.detail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateCoupon();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!body.name) {
        return "Name cannot be empty!";
      } else if (!body.code) {
        return "Code cannot be empty!";
      } else if (!body.type) {
        return "Type group cannot be empty!";
      } else if (!body.discount) {
        return "Discount cannot be empty!";
      } else if (!body.minAmount) {
        return "Amounts cannot be empty!";
      } else if (!body.usesTotal) {
        return "Uses per coupon cannot be empty!";
      } else if (!body.usesCustomer) {
        return "Uses per customer cannot be empty!";
      } else if (!body.startDate) {
        return "Start date/time cannot be empty!";
      } else if (!body.endDate) {
        return "End date/time cannot be empty!";
      } else if (!body.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateCoupon() {
      this.data.detail.productId = [];
      if (this.model.products) {
        for (let index = 0; index < this.model.products.length; index++) {
          const product = this.model.products[index];
          this.data.detail.productId.push(product.id);
        }
      }

      this.data.detail.categoryId = [];
      if (this.model.categories) {
        for (let index = 0; index < this.model.categories.length; index++) {
          const product = this.model.categories[index];
          this.data.detail.categoryId.push(product.id);
        }
      }

      let couponId = this.$route.query.id;

      let body = {
        name: this.data.detail.name,
        code: this.data.detail.code,
        type: this.data.detail.type,
        discount: this.data.detail.discount,
        freeShipping: this.data.detail.freeShipping,
        categoryId: this.data.detail.categoryId,
        productId: this.data.detail.productId,
        minAmount: this.data.detail.minAmount,
        startDate: this.data.detail.startDate,
        endDate: this.data.detail.endDate,
        usesTotal: this.data.detail.usesTotal,
        usesCustomer: this.data.detail.usesCustomer,
        status: this.data.detail.status,
      };
      
      delete body.code
      Service.updateCoupon(couponId, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateCoupon();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack();
          this.$toasted.show("Coupon has been updated.");
        }
      });
    },

    toUpperCase(string) {
      return string.toUpperCase();
    },

    toCapitalLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    toggleTimePanel() {
      this.showTimePanel = !this.showTimePanel;
    },
    toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleOpenChange() {
      this.showTimePanel = false;
    },
    handleRangeClose() {
      this.showTimeRangePanel = false;
    },
  },
};
