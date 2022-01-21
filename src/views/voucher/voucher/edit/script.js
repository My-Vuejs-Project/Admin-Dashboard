import Service from "../../../../utils/api/service";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import moment from "moment";
import Multiselect from "vue-multiselect";

export default {
  name: "EditVoucher",
  data() {
    return {
      isUpdating: false,
      data: {
        detail: {},
        themes: [],
        customers: [],
      },
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  components: { Multiselect, DatePicker },
  created() {
    this.getVoucherDetail(this.$route.query.id);
    this.getAllVoucherTheme();
    this.getCustomer();
  },
  methods: {
    getVoucherDetail(id) {
      Service.getVoucherDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") { this.getVoucherDetail(id);}
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.detail = response.data;

          // convert date
          this.data.detail.expiredAt = moment(this.data.detail.expiredAt).toDate();

          let userName = this.data.detail.account.firstName + " " + this.data.detail.account.lastName;
          this.data.detail.account.username = userName;
        }
      });
    },

    getAllVoucherTheme() {
      Service.getAllVoucherTheme("").then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") { this.getAllVoucherTheme();}
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
              if (response == "ok") { this.getCustomer();}
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
      this.$router.push({ name: "ListVoucher" });
    },

    submitUpdate() {
      let validatedMessage = this.validateBody(this.data.detail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateVoucher();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.theme.id) {
        return "Voucher theme cannot be empty!";
      } else if (!data.code) {
        return "Code cannot be empty!";
      } else if (!data.account) {
        return "To account cannot be empty!";
      } else if (!data.message) {
        return "Message cannot be empty!";
      } else if (!data.expiredAt) {
        return "Expiry date cannot be empty!";
      } else if (!data.amount) {
        return "Amount cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateVoucher() {
      let id = this.data.detail.id;

      let body = {
        themeId: this.data.detail.theme.id,
        accountId: this.data.detail.account.id,
        code: this.data.detail.code,
        amount: this.data.detail.amount,
        minAmount: this.data.detail.minAmount ? this.data.detail.minAmount : 0,
        message: this.data.detail.message,
        expiredAt: this.data.detail.expiredAt,
        status: this.data.detail.status,
      };

      Service.updateVoucher(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") { this.updateVoucher(); }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.$toasted.show("Voucher has been updated.");
          this.goBack();
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
