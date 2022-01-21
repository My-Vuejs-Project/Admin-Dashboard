import Service from "../../../utils/api/service";
import Media from "./../../../components/share/media";
import Helper from "./../../../utils/global/func";

export default {
  name: "EditAdvertisemet",
  props: {
    detail: Object,
  },
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
    this.getAdvertisement(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListAdvertisement",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    getAdvertisement(id) {
      Service.getAdvertisementDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAdvertisement(id);
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
      if (this.data.imageUrl || (this.data.media && this.data.media.url)) {
        this.display.imagePreview = true;
      }
    },

    existedMediaCallback(media) {
      this.data.media = media;
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

    chooseImage() {
      this.display.media = true;
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    submitUpdateAdvertisement() {
      let validatedMessage = this.validateBody(this.data);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateAdvertisement();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.imageUrl) {
        return "Image file cannot be empty!";
      } else if (!data.link) {
        return "Link cannot be empty!";
      } else if (!data.type) {
        return "Type cannot be empty!";
      } else if (!data.sortOrder) {
        return "Sort order cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateAdvertisement() {
      let id = this.data.id;

      if (this.data.media) {
        this.data.imageUrl = this.data.media.url;
      }

      let body = {
        link: this.data.link,
        imageUrl: this.data.imageUrl,
        sortOrder: this.data.sortOrder,
        status: this.data.status,
      };

      Service.updateAdvertisement(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateAdvertisement();
              }
            });
          } else {
            this.isUpdating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.$toasted.show("Advertisement has been updated.");
          this.goBack();
        }
      });
    },
  },
};
