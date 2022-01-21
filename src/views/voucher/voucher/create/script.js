import Service from "../../../../utils/api/service";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import Multiselect from "vue-multiselect";

export default {
  name: "CreateVoucher",
  data() {
    return {
      isCreating: false,
      body: {
        themeId: "",
        accountId: "",
        code: "",
        amount: 0,
        minAmount: 0,
        message: "",
        expiredAt: "",
        status: "active",
      },
      data: { themes: [], customers: [] },
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  components: { Multiselect, DatePicker },
  created() {
    this.getAllVoucherTheme();
    this.getCustomer();
  },
  methods: {
    getAllVoucherTheme() {
      Service.getAllVoucherTheme("").then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllVoucherTheme();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.themes = response.data;
        }
      });
    },

    getCustomer() {
      Service.getCustomers("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomer();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.customers = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({
        name: "ListVoucher",
      });
    },

    submitCreate() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createVoucher();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.themeId) {
        return "Voucher theme cannot be empty!";
      } else if (!data.code) {
        return "Code cannot be empty!";
      } else if (!data.accountId) {
        return "To account cannot be empty!";
      } else if (!data.message) {
        return "Message cannot be empty!";
      } else if (!data.expiredAt) {
        return "Expiry date cannot be empty!";
      } else if (!data.minAmount) {
        return "Min amount cannot be empty!";
      } else if (!data.amount) {
        return "Amount cannot be empty!";
      } else {
        return "ok";
      }
    },

    createVoucher() {
      let body = {
        themeId: this.body.themeId,
        accountId: this.body.accountId.id,
        code: this.body.code,
        amount: this.body.amount,
        minAmount: this.body.minAmount,
        message: this.body.message,
        expiredAt: this.body.expiredAt,
        status: this.body.status,
      };

      Service.createVoucher(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createVoucher();
              }
            });
          } else {
            this.isCreating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.resetBody();
          this.$toasted.show("Voucher has been created.");
        }
      });
    },

    resetBody() {
      this.isCreating = false;
      this.body = {
        themeId: "",
        accountId: "",
        code: "",
        amount: 0,
        minAmount: 0,
        message: "",
        expiredAt: "",
        status: "active",
      };
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
