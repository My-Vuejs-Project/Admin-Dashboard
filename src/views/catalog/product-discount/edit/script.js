import Service from "../../../../utils/api/service";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";

export default {
  name: "EditProductDiscount",
  data() {
    return {
      isUpdating: false,
      data: {
        detail: {},
        customerGroups: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      showTimePanel: false,
      showTimeRangePanel: false,
      model: {
        startDate: {
          date: "",
          time: "",
        },
        endDate: {
          date: "",
          time: "",
        },
      },
    };
  },
  components: { DatePicker },
  computed: {},

  mounted() {},

  created() {
    this.getCustomerGroups();
    this.getProductDiscountDetail(this.$route.query.id, this.$route.query.type);
  },

  methods: {
    getProductDiscountDetail(id, type) {
      let param = "/" + id + "?type=" + type;
      Service.getProductDiscountDetail(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getProductDiscountDetail(id, type);
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
        }
      });
    },

    getCustomerGroups() {
      Service.getCustomerGroups("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomerGroups();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.customerGroups = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({
        name: "ListProductDiscount",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    submitUpdateDiscount() {
      let validatedMessage = this.validateBody(this.data.detail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateProductDiscount();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!body.type) {
        return "Type cannot be empty!";
      } else if (!body.customerGroupId) {
        return "Customer group cannot be empty!";
      } else if (!body.minQuantity) {
        return "Mininum quantity cannot be empty!";
      } else if (!body.price) {
        return "Price cannot be empty!";
      } else if (!body.priority) {
        return "Priority cannot be empty!";
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

    updateProductDiscount() {
      let id = this.$route.query.id;
      let body = {
        type: this.data.detail.type,
        customerGroupId: this.data.detail.customerGroupId,
        minQuantity: this.data.detail.minQuantity,
        priority: this.data.detail.priority,
        price: this.data.detail.price,
        status: this.data.detail.status,
        startDate: this.data.detail.startDate,
        endDate: this.data.detail.endDate,
      };

      Service.updateProductDiscount(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateProductDiscount();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.$toasted.show("Product discount has been updated.");
          this.goBack()
        }
      });
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
