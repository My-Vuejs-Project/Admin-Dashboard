import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "EditVoucherTheme",
  data() {
    return {
      isUpdating: false,
      data: {},
      display: {
        imagePreview: false,
        media: false,
      },
    };
  },
  components: { Media },
  created() {
    this.getVoucherThemeDetail(this.$route.query.id);
  },
  methods: {
    getVoucherThemeDetail(id) {
      Service.getVoucherThemeDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getVoucherThemeDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({ name: "ListVoucherTheme" });
    },

    closeModal() {
      this.display = {
        imagePreview: false,
        media: false,
      };
    },

    imagePreview() {
      if (this.data.imageUrl || (this.data.media && this.data.media.url)) {
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

    getFullImage(path) {
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    getNameFromUrl(url) {
      return url.split("/").pop();
    },

    submitUpdate() {
      let validatedMessage = this.validateBody(this.data);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateVoucherTheme();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateVoucherTheme() {
      let id = this.data.id;
      let image =
        this.data.media && this.data.media.url
          ? this.data.media.url
          : this.data.imageUrl;

      let body = {
        name: this.data.name,
        imageUrl: image,
      };

      Service.updateVoucherTheme(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateVoucherTheme();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.$toasted.show("Voucher theme has been updated.");
          this.goBack();
        }
      });
    },
  },
};
