import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "EditMerchandise",
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
  computed: {},
  created() {
    this.getMerchandiseDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListMerchandise",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    getMerchandiseDetail(id) {
      Service.getMerchandiseDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getMerchandiseDetail(id);
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
      if (this.data.imageUrl) {
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

    submitUpdateMerchandise() {
      let validatedMessage = this.validateBody(this.data);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateMerchandise();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!body.name) {
        return "Name cannot be empty!";
      } else if (!(body.imageUrl || (this.data.media && this.data.media.url))) {
        return "Image cannot be empty!";
      } else if (!body.shortDescription) {
        return "Short description cannot be empty!";
      } else if (!body.quantity) {
        return "Quantity cannot be empty!";
      } else if (!body.points) {
        return "Points cannot be empty!";
      } else if (!body.sortOrder) {
        return "Sort order cannot be empty!";
      } else if (!body.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateMerchandise() {
      let id = this.$route.query.id;
      if (this.data.media && this.data.media.url) {
        this.data.imageUrl = this.data.media.url;
      }

      let body = {
        name: this.data.name,
        imageUrl: this.data.imageUrl,
        shortDescription: this.data.shortDescription,
        description: this.data.description,
        quantity: this.data.quantity,
        points: this.data.points,
        sortOrder: this.data.sortOrder,
        status: this.data.status,
      };

      Service.updateMerchandise(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateMerchandise();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack();
          this.$toasted.show("Merchandise has been updated.");
        }
      });
    },
  },
};
