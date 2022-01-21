import Service from "../../../../utils/api/service";
import Media from "./../../../../components/share/media";
import Helper from "./../../../../utils/global/func";

export default {
  name: "createMerchandise",
  data() {
    return {
      isCreating: false,
      body: {
        name: "",
        imageUrl: "",
        shortDescription: "",
        description: "",
        quantity: 0,
        points: 0,
        sortOrder: 0,
        status: "active",
      },
      data: {},
      display: {
        imagePreview: false,
        media: false,
      },
    };
  },
  components: { Media },
  computed: {},
  created() {},
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

    chooseImage() {
      this.display.media = true;
    },

    imagePreview() {
      if (this.data.media) {
        this.display.imagePreview = true;
      }
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

    submitCreateMerchandise() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createMerchandise();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(body) {
      if (!body.name) {
        return "Name cannot be empty!";
      } else if (!(this.data.media && this.data.media.url)) {
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

    createMerchandise() {
      let body = {
        name: this.body.name,
        imageUrl: this.data.media ? this.data.media.url : "",
        shortDescription: this.body.shortDescription,
        description: this.body.description,
        quantity: this.body.quantity,
        points: this.body.points,
        sortOrder: this.body.sortOrder,
        status: this.body.status,
      };

      Service.createMerchandise(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createMerchandise();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Merchandise has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        imageUrl: "",
        shortDescription: "",
        description: "",
        quantity: 0,
        points: 0,
        sortOrder: 0,
        status: "active",
      };
      this.data = {};
    },

    closeModal() {
      this.display = {
        imagePreview: false,
        media: false,
      };
    },
  },
};
