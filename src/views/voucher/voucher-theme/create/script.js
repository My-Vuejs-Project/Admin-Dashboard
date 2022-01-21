import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "CreateVoucherTheme",
  data() {
    return {
      isCreating: false,
      body: {
        name: "",
      },
      display: {
        imagePreview: false,
        media: false,
      },
      data: {},
    };
  },
  components: { Media },
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListVoucherTheme",
      });
    },

    closeModal() {
      this.display.media = false;
      this.display.imagePreview = false;
    },

    imagePreview() {
      if (this.data.media) {
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

    submitCreate() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createVoucherTheme();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!(this.data.media && this.data.media.url)) {
        return "Image cannot be empty!";
      } else {
        return "ok";
      }
    },

    createVoucherTheme() {
      let image =
        this.data.media && this.data.media.url ? this.data.media.url : "";

      let body = {
        name: this.body.name,
        imageUrl: image,
      };

      Service.createVoucherTheme(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createVoucherTheme();
              }
            });
          } else {
            this.isCreating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.resetBody();
          this.$toasted.show("Voucher theme has been created.");
        }
      });
    },

    resetBody() {
      this.isCreating = false;
      this.body = {
        name: "",
        code: "",
      };
      this.data = {};
    },
  },
};
