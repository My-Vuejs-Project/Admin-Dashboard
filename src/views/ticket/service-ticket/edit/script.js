import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";

export default {
  name: "EditServiceTicket",
  props: {
    detail: Object,
  },
  data() {
    return {
      isUpdating: false,
      isFetching: true,
      serviceDetail: {},
      imagePreview: false,
      imagePreviewIndex: -1,
      body: {
        status: "",
        text:""
      },
    };
  },
  components: {},
  computed: {},
  created() {
    this.getServiceTicketDetail(this.$route.query.id);
  },
  methods: {
    getServiceTicketDetail(id) {
      Service.getServiceTicketDetail(id).then((response) => {
        this.isFetching = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getServiceTicketDetail();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.serviceDetail = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({name: "ListServiceTicket"});
    },

    preview(index) {
      if (this.serviceDetail.media) {
        this.imagePreview = true;
        this.imagePreviewIndex = index
      }
    },

    closeModal() {
      this.imagePreview = false
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      return dev == "DEVELOPMENT" ? Helper.getFullImage(path) : path;
    },

    submitUpdateServiceTicket() {
      let validatedMessage = this.validateBody(this.serviceDetail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateServiceTicket();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.text) {
        return "Description cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateServiceTicket() {
      let body = {
        status: this.serviceDetail.status,
        text: this.serviceDetail.text,
      };

      Service.updateServiceTicket(this.serviceDetail.id, body).then(
        (response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.updateServiceTicket();
                }
              });
            } else {
              this.isUpdating = false;
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.isUpdating = false;
            this.$toasted.show("Service has been updated.");
            this.goBack()
          }
        }
      );
    },
  },
};
