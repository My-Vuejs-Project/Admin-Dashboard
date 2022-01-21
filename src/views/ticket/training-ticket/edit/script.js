import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";

export default {
  name: "EditTrainingTicket",
  props: {
    detail: Object,
  },
  data() {
    return {
      isUpdating: false,
      isFetching: true,
      trainingDetail: {},
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
    this.getTrainingTicketDetail(this.$route.query.id);
  },
  methods: {
    getTrainingTicketDetail(id) {
      Service.getTrainingTicketDetail(id).then((response) => {
        this.isFetching = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getTrainingTicketDetail();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.trainingDetail = response.data;
        }
      });
    },

    goBack() {
      this.$router.push({name: "ListTrainingTicket"});
    },

    preview(index) {
      if (this.trainingDetail.media) {
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
  },
};
