import Service from "../../../../../utils/api/service"
import Helper from '../../../../../utils/global/func'
import Media from "../../../../../components/share/media"
export default {
  name: "CreateSubTicketType",
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
        parentId: this.$route.query.id,
        description: "",
        shortDescription: "",
        price: "",
        sortOrder: 1,
        status: "active",
        type: this.$route.query.type
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
      ]
    };
  },
  components: { Media },
  created() {
  },
  methods: {
  
    goBack() {
      this.$router.push({
        name: "EditTicketType", query: {id: this.body.parentId, type: this.body.type},
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
      if (!data.imageUrl) {
        return "Image file cannot be empty!";
      } else if (!data.name) {
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
      this.body.price = parseFloat(this.body.price)
      this.body.sortOrder = parseInt(this.body.sortOrder)
      Service.createTicketType(this.body).then((response) => {
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
          this.$toasted.show("Sub type has been created.");
        }
      });
    },

    resetBody() {
      this.isCreating = false;
      this.body = {
        imageUrl: "",
        name: "",
        parentId: this.body.parentId,
        shortDescription: "",
        description: "",
        price: "",
        sortOrder: 1,
        status: "active",
        type: this.body.type
      };
    },
  },
};