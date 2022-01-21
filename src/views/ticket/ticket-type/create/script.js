import Service from "./../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import Media from "../../../../components/share/media";
export default {
  name: "CreateTicketType",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
        media: false,
        url: "",
      },
      body: {
        imageUrl: "",
        name: "",
        parentId: "",
        description: "",
        shortDescription: "",
        price: "",
        sortOrder: 1,
        status: "active",
        type: "service",
        subId: 0,
      },
      data: {
        ticketTypes: [],
        categories: [],
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    };
  },
  components: { Media },
  created() {
    this.getCategory();
  },
  methods: {
    getCategory() {
      let param = "/ROOT";

      Service.getAllCategories(param).then((response) => {
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
          this.data.categories = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({
        name: "ListTicketType",
      });
    },

    imagePreview(url) {
      if (url) {
        this.display.imagePreview = true;
        this.display.url = url;
      }
    },

    closeModal() {
      this.display.imagePreview = false;
      this.display.media = false;
    },

    chooseImage() {
      this.display.media = true;
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
      this.body.imageUrl = media.url;
      this.closeModal();
    },

    submitCreateTicketType() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createTicketType();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },
    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.shortDescription) {
        return "Short description cannot be empty!";
      } else if (!data.description) {
        return "Sescription cannot be empty!";
      } else if (!data.price) {
        return "Price cannot be empty!";
      } else if (!data.sortOrder) {
        return "Sort order cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    createTicketType() {
      let body = {
        parentId: parseInt(this.body.parentId),
        name: this.body.name,
        shortDescription: this.body.shortDescription,
        description: this.body.description,
        imageUrl: this.body.imageUrl,
        sortOrder: parseInt(this.body.sortOrder),
        price: parseFloat(this.body.price),
        status: this.body.status,
        type: this.body.type,
        subId: this.body.subId,
      };

      Service.createTicketType(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createTicketType();
              }
            });
          } else {
            this.isCreating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.resetBody();
          this.$toasted.show("Type has been created.");
        }
      });
    },

    resetBody() {
      this.isCreating = false;
      this.body = {
        imageUrl: "",
        name: "",
        parentId: "",
        description: "",
        shortDescription: "",
        price: "",
        sortOrder: 1,
        status: "active",
        type: "service",
        subId: 0,
      };
    },
  },
};
