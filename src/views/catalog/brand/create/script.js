import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "CreateBrand",
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
        img: "",
        name: "",
        categoryId: "",
        sortOrder: 0,
        status: "active",
      },
      data: {
        categoryList: [],
      },
    };
  },
  components: {
    Media,
  },
  computed: {},
  created() {
    this.getCategory();
  },
  methods: {
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
          this.data.categoryList = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({
        name: "ListBrand",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    closeModal() {
      this.display = {
        imagePreview: false,
        media: false,
      };
    },

    imagePreview() {
      if (this.body.image.file || this.data.media) {
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

    newMediaCallBack(file) {
      this.body.image.file = file;
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

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    submitCreateBrand() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        if (this.body.image.file) {
          this.uploadPresign();
        } else {
          this.createBrand();
        }
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!(body.image.file || (this.data.media && this.data.media.url))) {
        return "Image cannot be empty!";
      } else if (!body.name) {
        return "Name cannot be empty!";
      } else if (!body.categoryId) {
        return "Category cannot be empty!";
      } else if (!body.sortOrder) {
        return "Sort order cannot be empty!";
      } else if (!body.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    uploadPresign() {
      let body = {
        media: [
          {
            ext: this.body.image.file.type.split("/").pop(),
            type: "brand",
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
              this.createBrand();
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
        type: file.type.split("/")[0],
        folder: "catelog",
        status: "active",
      };

      Service.addMedia(body);
    },

    createBrand() {
      let image = "";
      if (this.data.media && this.data.media.url) {
        image = this.data.media.url;
      } else if (this.body.image.file) {
        image = this.body.image.presign ? this.body.image.presign[0].key : "";
      }

      let body = {
        categoryId: this.body.categoryId,
        name: this.body.name,
        imageUrl: image,
        sortOrder: this.body.sortOrder,
        status: this.body.status,
      };

      Service.createBrand(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createBrand();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Brand has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        image: {
          file: "",
          presign: "",
        },
        img: "",
        name: "",
        categoryId: "",
        sortOrder: 0,
        status: "active",
      };

      this.data.media = "";
    },
  },
};
