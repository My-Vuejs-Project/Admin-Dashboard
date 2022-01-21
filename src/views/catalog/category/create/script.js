import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "CreateCategory",
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
        sortOrder: 0,
        parentId: 0,
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
      let id = "/ROOT";
      Service.getAllCategories(id).then((response) => {
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
        name: "ListCategory",
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

    submitCreateCategory() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createCategory();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!(data.image.file || (this.data.media && this.data.media.url))) {
        return "Image file cannot be empty!";
      } else if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    createCategory() {
      let image = "";
      if (this.data.media && this.data.media.url) {
        image = this.data.media.url;
      }

      let body = {
        parentId: parseInt(this.body.parentId),
        name: this.body.name,
        imageUrl: image,
        sortOrder: this.body.sortOrder ? this.body.sortOrder : 0,
        status: this.body.status,
      };

      Service.createCategory(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createCategory();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Category has been created.");
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
        sortOrder: 0,
        status: "active",
      };

      this.data.media = {};
    },
  },
};
