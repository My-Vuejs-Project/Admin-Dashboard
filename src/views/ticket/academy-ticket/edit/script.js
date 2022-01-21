import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";

export default {
  name: "EditAcademyTicket",
  props: {
    detail: Object,
  },
  data() {
    return {
      isUpdating: false,
      isFetching: true,
      academyDetail: {},
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
    this.getAcademyTicketDetail(this.$route.query.id);
  },
  methods: {
    getAcademyTicketDetail(id) {
      Service.getAcademyTicketDetail(id).then((response) => {
        this.isFetching = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAcademyTicketDetail();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.academyDetail = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({name: "ListAcademyTicket"});
    },

    preview(index) {
      if (this.academyDetail.media) {
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

    submitUpdateAcademyTicket() {
      let validatedMessage = this.validateBody(this.academyDetail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateAcademyTicket();
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

    updateAcademyTicket() {
      let body = {
        status: this.academyDetail.status,
        text: this.academyDetail.text,
      };

      Service.updateAcademyTicket(this.academyDetail.id, body).then(
        (response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.updateAcademyTicket();
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
