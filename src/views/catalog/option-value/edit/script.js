import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "EditOptionValue",
  data() {
    return {
      isUpdating: false,
      data: {
        options: [],
        detail: {},
      },
      display: {
        imagePreview: false,
        media: false,
      },
      body: {
        image: {
          file: "",
          presign: "",
        },
      },
    };
  },
  components: {
    Media,
  },
  computed: {},
  created() {
    this.getOptionValueDetail(this.$route.query.id);
    this.getOptions(this.$route.query.optionId);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getOptionValueDetail(id) {
      Service.getOptionValueDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOptionValueDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.detail = response.data;
        }
      });
    },

    getOptions() {
      Service.getOptionDetail("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOptions();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.options = response.data;
        }
      });
    },

    imagePreview() {
      if (
        this.body.image.file ||
        this.data.detail.imageUrl ||
        this.data.media.url
      ) {
        this.display.imagePreview = true;
      }
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

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    chooseImage() {
      this.display.media = true;
    },

    existedMediaCallback(media) {
      this.data.media = media;
      this.closeModal();
    },

    newMediaCallBack(file) {
      this.body.image.file = file;
      this.closeModal();
    },

    subminUpdateOptionValue() {
      let validatedMessage = this.validateBody(this.data.detail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        if (this.body.image.file) {
          this.uploadPresign();
        } else {
          this.updateOptionValue();
        }
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.optionId) {
        return "Option type cannot be empty!";
      } else if (!data.text) {
        return "Option value name cannot be empty!";
      } else if (!data.sortOrder) {
        return "Sort order cannot be empty!";
      } else {
        return "ok";
      }
    },

    uploadPresign() {
      let body = {
        media: [
          {
            ext: this.body.image.file.type.split("/").pop(),
            type: "option",
            filename: this.body.image.file.name,
          },
        ],
      };
      Service.uploadPresign(body).then((response) => {
        this.body.image.presign = response.data;
        this.uploadFile(this.body.image.file);
      });
    },

    async uploadFile(file) {
      if (file) {
        let uploadUrl = this.body.image.presign[0].uploadUrl;
        await Service.uploadMedia(uploadUrl, file, file.type).then(
          (response) => {
            if (response == "ok") {
              this.updateOptionValue();
              this.addMedia();
            } else {
              this.$toasted.show("File upload fail!");
            }
          }
        );
      } else {
        this.$toasted.show("File cannot be empty!");
      }
    },

    addMedia() {
      let file = this.body.image.file;
      let body = {
        fileName: file.name,
        url: this.body.image.presign ? this.body.image.presign[0].key : "",
        type: file.type.split("/")[0].split("/")[0],
        folder: "catelog",
        status: "active",
      };

      Service.addMedia(body);
    },

    updateOptionValue() {
      let id = this.$route.query.id;
      if (this.body.image.file) {
        this.data.detail.imageUrl = this.body.image.presign
          ? this.body.image.presign[0].key
          : "";
      } else if (this.data.media) {
        this.data.detail.imageUrl = this.data.media.url;
      }

      let body = {
        optionId: this.data.option.id,
        text: this.data.detail.text,
        imageUrl: this.data.detail.imageUrl,
        sortOrder: this.data.detail.sortOrder,
      };

      Service.updateOptionValue(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateOptionValue();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack();
          this.$toasted.show("Option value has been updated.");
        }
      });
    },

    closeModal() {
      this.display.media = false;
      this.display.imagePreview = false;
    },
  },
};
