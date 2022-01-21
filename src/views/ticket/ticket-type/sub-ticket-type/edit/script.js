import Service from "../../../../../utils/api/service";
import Helper from "../../../../../utils/global/func";
import Media from "../../../../../components/share/media"
import TableLoading from "../../../../../components/share/table-loading";
export default {
  name: "EditSubTicketType",
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
        imageUrl: "",
        description: "",
        shortDescription: "",
        price: "",
        sortOrder: "",
        status: "active",
      },
      data: {
        ticketTypeDetail: {},
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{
          list: "ordered"
        }, {
          list: "bullet"
        }],
      ]
    };
  },
  components: {
    Media,TableLoading
  },
  created() {
    this.getTicketTypeDetail();
  },
  methods: {
    getTicketTypeDetail() {
      Service.getTicketTypeDetail(this.$route.query.id).then((response) => {
        this.isFetching = false
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
            imageUrl: response.data.imageUrl,
            description: response.data.description,
            shortDescription: response.data.shortDescription,
            price: response.data.price,
            sortOrder: response.data.sortOrder,
            status: response.data.status,
          }
        }
      });
    },

    goBack() {
      this.$router.push({
        name: "EditTicketType", query: {id: this.data.ticketTypeDetail.parentId, type: this.$route.query.type},
      });
    },
    imagePreview(url) {
      if (url) {
        this.display.imagePreview = true
        this.display.url = url
      }
    },

    closeModal() {
      this.display.imagePreview = false
      this.display.media = false
    },

    chooseImage() {
      this.display.media = true
    },

    getFullImage(path) {
      let dev = path.split('/')[0]
      if (dev == 'DEVELOPMENT') {
        return Helper.getFullImage(path);
      } else return path
    },

    getNameFromUrl(url) {
      return url.split('/').pop()
    },
    existedMediaCallback(media) {
      this.body.imageUrl = media.url
      this.closeModal()
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
      if (!data.imageUrl) {
        return "Image file cannot be empty!";
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

    updateTicketType() {
      this.body.price = parseFloat(this.body.price),
      this.body.sortOrder = parseInt(this.body.sortOrder)
      Service.updateTicketType(this.$route.query.id, this.body).then((response) => {
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
          this.$toasted.show("Sub Type has been updated.");
          this.goBack();
        }
      });
    },
  },
};