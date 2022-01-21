import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import Media from "./../../../../components/share/media";

export default {
  name: "EditManufacturer",
  props: {},
  data() {
    return {
      isUpdating: false,
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
        link: "",
        type: "",
        sortOrder: 0,
        status: "",
      },
      data: {},
    };
  },
  components: {
    Media,
  },
  computed: {},
  created() {
    this.getManufacturerDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListManufacturer",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    getManufacturerDetail(id) {
      Service.getManufacturerDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getManufacturerDetail(id);
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

    imagePreview() {
      if (this.body.image.file || this.data.imageUrl) {
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

    closeModal() {
      this.display = {
        imagePreview: false,
        media: false,
      };
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

    submitUpdateManufacturer() {
      let validatedMessage = this.validateBody(this.data);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateManufacturer();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!(data.imageUrl || (this.data.media && this.data.media.url))) {
        return "Image file cannot be empty!";
      } else if (!data.name) {
        return "Name cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateManufacturer() {
      let id = this.data.id;
      if (this.body.image.file) {
        this.data.imageUrl = this.body.image.presign
          ? this.body.image.presign[0].key
          : "";
      } else if (this.data.media && this.data.media.url) {
        this.data.imageUrl = this.data.media.url;
      }

      let body = {
        name: this.data.name,
        imageUrl: this.data.imageUrl,
        sortOrder: this.data.sortOrder,
      };

      Service.updateManufacturer(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateManufacturer();
              }
            });
          } else {
            this.isUpdating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack();
          this.$toasted.show("Brand has been updated.");
        }
      });
    },
  },
};
