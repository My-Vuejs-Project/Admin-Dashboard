import Service from "./../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";
import Media from "./../../../../components/share/media";
export default {
  name: "EditPaymentMethod",
  data() {
    return {
      isCreating: false,
      display: {
        media: false,
        imagePreview: false,
      },
      data: {
        paymentDetail: {},
      },
    };
  },
  components: {Media},
  created() {
    this.getPaymentMethodDetail(this.$route.query.id);
  },
  methods: {
    getPaymentMethodDetail(id) {
      Service.getPaymentMethodDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getPaymentMethodDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.paymentDetail = response.data;
          if (response.data.logoUrl) {
            this.data.media = {
              fileName: this.getNameFromUrl(response.data.logoUrl),
              url: response.data.logoUrl
            }
          }
        }
      });
    },

    goBack() {
      this.$router.push({ name: "ListPaymentMethod" });
    },

    closeModal() {
      this.display.media = false;
      this.display.imagePreview = false;
    },

    imagePreview() {
      if (this.data.media != "") {
        this.display.imagePreview = true;
      }
    },

    chooseImage() {
      this.display.media = true;
    },

    existedMediaCallback(media) {
      this.data.media = media;
      this.closeModal();
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    getNameFromUrl(url) {
      return url.split("/").pop();
    },
    
    submitUpdatePayment() {
      let validatedMessage = this.validateBody(this.data.paymentDetail);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.updatePayment();
        
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    updatePayment() {
      let id = this.data.paymentDetail.id;
      let body = {
        logoUrl: (this.data.media && this.data.media.url) ? this.data.media.url : "",
        name: this.data.paymentDetail.name,
        sortOrder: this.data.paymentDetail.sortOrder ? parseInt(this.data.paymentDetail.sortOrder) : 0,
        status: this.data.paymentDetail.status,
      };

      Service.updatePaymentMethod(id, body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updatePayment();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {

          this.$toasted.show("Payment method has been updated.");
          this.goBack();
        }
      });
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },
  },
};
