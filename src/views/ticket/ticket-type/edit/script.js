import Service from "./../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";
import Media from "../../../../components/share/media";
import TableLoading from "./../../../../components/share/table-loading";
import SubType from "../sub-ticket-type/list";
export default {
  name: "EditTicketType",
  data() {
    return {
      isCreating: false,
      isFetching: true,
      display: {
        imagePreview: false,
        media: false,
        url: "",
      },
      body: {
        name: "",
        imageUrl: "",
        description: "",
        shortDescription: "",
        price: "",
        subId: "",
        sortOrder: "",
        status: "active",
      },
      data: {
        ticketTypeDetail: {},
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [
          {
            list: "ordered",
          },
          {
            list: "bullet",
          },
        ],
      ],
    };
  },
  components: {
    Media,
    TableLoading,
    SubType,
  },
  created() {
    this.getTicketTypeDetail();
  },
  methods: {
    getTicketTypeDetail() {
      Service.getTicketTypeDetail(this.$route.query.id).then((response) => {
        this.isFetching = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getTicketTypeDetail();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.ticketTypeDetail = response.data;
          this.body = {
            name: response.data.name,
            imageUrl: response.data.imageUrl,
            description: response.data.description,
            shortDescription: response.data.shortDescription,
            price: response.data.price,
            subId: response.data.subId,
            sortOrder: response.data.sortOrder,
            status: response.data.status,
          };
        }
      });
    },

    goBack() {
      this.$router.push({
        name: "ListTicketType",
        query: { type: this.$route.query.type },
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
    submitUpdateTicketType() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.updateTicketType();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.shortDescription) {
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

    updateTicketType() {
      let id = this.$route.query.id;
      let body = {
        name: this.body.name,
        shortDescription: this.body.shortDescription,
        description: this.body.description,
        imageUrl: this.body.imageUrl,
        sortOrder: parseInt(this.body.sortOrder),
        price: parseFloat(this.body.price),
        status: this.body.status,
        subId: parseInt(this.body.subId),
      };

      Service.updateTicketType(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateTicketType();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.$toasted.show("Type has been updated.");
          this.goBack();
        }
      });
    },
  },
};
