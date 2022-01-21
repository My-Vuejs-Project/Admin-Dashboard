import Service from "./../../../../utils/api/service";
import Helper from '../../../../utils/global/func'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
import TableLoading from './../../../../components/share/table-loading'
export default {
  name: "EditTutorialPlaylist",
  data() {
    return {
      isCreating: false,
      data: {
      },
      body: {
        name: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        duration: "",
        sortOrder: "",
        status: "active",
      },
      model: {
        duration: ""
      },
    };
  },
  components: {
    VueTimepicker,
    TableLoading
  },
  created() {
    this.getTutorialPlaylistDetail();
  },
  methods: {
    getTutorialPlaylistDetail() {
      let id = this.$route.query.id
      Service.getTutorialPlaylistDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getTutorialPlaylistDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.body = {
            name: response.data.name,
            description: response.data.description,
            imageUrl: response.data.imageUrl,
            videoUrl: response.data.videoUrl,
            duration: response.data.duration,
            sortOrder: response.data.sortOrder,
            status: response.data.status,
          };
          this.model.duration = Helper.durationToTime(this.body.duration)
        }
      });
    },

    goBack() {
      this.$router.push({ name: "ListTutorialPlaylist" });
    },

    submitUpdateTutorialPlaylist() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.updateTutorialPlaylist();

      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    updateTutorialPlaylist() {
      let id = this.$route.query.id
      var body = this.body 
      body.duration = parseFloat(body.duration)
      body.sortOrder = parseInt(body.sortOrder)
      Service.updateTutorialPlaylist(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateTutorialPlaylist();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.$toasted.show("TutorialPlaylist has been updated.");
          this.goBack();
        }
      });
    },

    validateBody(data) {

      if (!data.name) {
        return "Name cannot be empty!";
      }
      else if (!data.description) {
        return "Description cannot be empty!";
      }
      else if (!data.imageUrl) {
        return "Image URL cannot be empty!";
      }
      else if (!data.videoUrl) {
        return "Video URL cannot be empty!";
      }
      else if (!data.duration) {
        return "Duration cannot be empty!";
      } else if (!data.sortOrder) {
        return "Sort order cannot be empty!";
      } else {
        return "ok";
      }
    },
    checkFormatTime() {
      this.body.duration = Helper.timeToMillisecond(this.model.duration)
    },
  },
};
