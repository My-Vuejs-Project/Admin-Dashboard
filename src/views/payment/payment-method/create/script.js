import Service from "./../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";
import Media from "./../../../../components/share/media";
export default {
  name: "CreatePaymentMethod",
  data() {
    return {
      isCreating: false,
      display: {
        media: false,
        imagePreview: false,
      },
      body: {
        logoUrl: "",
        name: "",
        sortOrder: 0,
        status: "active",
      },
      data:{
        media: ""
      }
    };
  },
  components: {Media},
  created() {},
  methods: {
    goBack() {
      this.$router.push({name: 'ListPaymentMethod'});
    },
    closeModal() {
      this.display.media = false;
      this.display.imagePreview = false;
    },
    imagePreview() {
      if (this.data.media != "") {
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

    fileToPath(file) {
      return window.URL.createObjectURL(file);
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
    

    submitCreatePayment() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createPayment();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    createPayment() {
      let body = {
        logoUrl: (this.data.media && this.data.media.url) ? this.data.media.url : "",
        name: this.body.name,
        sortOrder: this.body.sortOrder ? parseInt(this.body.sortOrder) : 0,
        status: this.body.status,
      };

      Service.createPaymentMethod(body).then((response) => {
        this.isCreating = false
        if (response.statusCode) {
          if(response.statusCode == "4410"){
            Service.refreshToken().then((response) => {
              if(response == "ok"){
                this.createPayment()
              }
            })  
          }else{

            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.resetBody();
          this.$toasted.show("Payment method has been created.");
        }
      });
    },

    
    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    resetBody() {
      this.isCreating = false;
      this.body = {
        logoUrl:"",
        name: "",
        price: "",
        sortOrder: 0,
        status: "active",
      };
      this.data.media = ""
    },
  },
};
