import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "CreateOptionValue",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
        media: false,
      },
      body: {
        image: {
          file: "",
          presign: "",
        },
        optionId: "",
        text: "",
        sortOrder: "",
      },
      data: {
        option: {},
      },
    };
  },
  components: {
    Media,
  },
  computed: {},
  created() {
    this.getOptions(this.$route.query.optionId);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    getOptions(id) {
      Service.getOptionDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOptions(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.option = response.data;
        }
      });
    },

    imagePreview() {
      if (this.body.image.file || this.data.media) {
        this.display.imagePreview = true;
      }
    },

    chooseImage() {
      this.display.media = true;
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

    existedMediaCallback(media) {
      this.data.media = media;
      this.closeModal();
    },

    newMediaCallBack(file) {
      this.body.image.file = file;
      this.closeModal();
    },

    subminCreateOption() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        if (this.body.image.file) {
          this.uploadPresign();
        } else {
          this.createOptionValue();
        }
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.text) {
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
              this.createOptionValue();
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

    createOptionValue() {
      let image = "";
      if (this.data.media && this.data.media.url) {
        image = this.data.media.url;
      } else if (this.body.image.file) {
        image = this.body.image.presign ? this.body.image.presign[0].key : "";
      }

      let body = {
        optionId: this.data.option.id,
        text: this.body.text,
        imageUrl: image,
        sortOrder: this.body.sortOrder,
      };

      Service.createOptionValue(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createOptionValue();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Option value has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        image: {
          file: "",
          presign: "",
        },
        optionId: "",
        text: "",
        sortOrder: "",
      };

      this.data.media = {};
    },

    closeModal() {
      this.display.media = false;
      this.display.imagePreview = false;
      this.isCreating = false;
    },
  },
};
