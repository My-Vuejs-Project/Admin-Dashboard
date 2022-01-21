import Service from "../../../../utils/api/service";
import Helper from '../../../../utils/global/func'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
export default {
  name: "EditTutorialVideo",
  data() {
    return {
      isUpdating: false,
      body: {
        playlistId: "",
        name: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        duration: "",
        sortOrder: ""
      },
      model:{
        duration: ""
      },
      data:{
        playlist: [],
        parentId: ""
      }
    };
  },
  components: {
    VueTimepicker
  },
  created() {
    this.getTutorialVideoDetail()
  },
  methods: {

   
    getTutorialVideoDetail() {
      Service.getTutorialVideoDetail(this.$root.$route.query.id).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize())
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getTutorialVideoDetail()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.data.parentId = response.data.parentPlaylist.id
          this.body = {
            playlistId: response.data.playlist.id,
            name: response.data.name,
            description: response.data.description,
            imageUrl: response.data.imageUrl,
            videoUrl: response.data.videoUrl,
            duration: response.data.duration,
            sortOrder: response.data.sortOrder
          };
          this.getTutorialPlaylistByType()
          this.model.duration = Helper.durationToTime(this.body.duration)
        }
      })
    },
    getTutorialPlaylistByType() {
      let param =
      '?all=true&parentId=' + this.data.parentId
      Service.getTutorialPlaylistByType(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize())
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getTutorialPlaylistByType()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.data.playlist = response.data          
        }
      })
    },

    goBack() {
      this.$router.push({ name: "ListTutorialVideo" });
    },

    submitUpdateTutorialVideo() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateTutorialVideo();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    updateTutorialVideo() {
      let id = this.$root.$route.query.id
      var body = this.body
      body.duration = parseFloat(body.duration)
      body.sortOrder = parseInt(body.sortOrder)
      Service.updateTutorialVideo(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateTutorialVideo();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.$toasted.show("Tutorial video has been updated.");
          this.goBack();
        }
      });
    },

    validateBody(data) {

      if (!data.playlistId) {
        return "PlaylistId cannot be empty!";
      }
      else if (!data.name) {
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
    checkFormatTime () {
      this.body.duration = Helper.timeToMillisecond(this.model.duration)
    },
  },
};
