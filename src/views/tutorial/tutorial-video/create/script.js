import Service from "../../../../utils/api/service";
import Helper from '../../../../utils/global/func'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
export default {
  name: "CreateTutorialVideo",
  data() {
    return {
      isCreating: false,
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
        types: [],
        playlist: [],
        parentId: ""
      }
    };
  },
  components: {
    VueTimepicker
  },
  created() {
    this.getTypeTutorialPlaylist()
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'ListTutorialVideo'
      });
    },
    getTypeTutorialPlaylist() {
      Service.getTypeTutorialPlaylist().then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize())
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getTypeTutorialPlaylist()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.data.types = response.data
          this.data.parentId = response.data[0].id
          this.getTutorialPlaylistByType()
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
          this.body.playlistId = response.data[0].id
          
        }
      })
    },

    submitCreateTutorialVideo() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createTutorialVideo();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    createTutorialVideo() {
      var body = this.body
      body.duration = parseFloat(body.duration)
      body.sortOrder = parseInt(body.sortOrder)
      Service.createTutorialVideo(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createTutorialVideo()
              }
            })
          } else {
            this.isCreating = false
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.isCreating = false
          this.resetBody();
          this.$toasted.show("Tutorial video has been created.");
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

    resetBody() {
      this.isCreating = false;
      this.body = {
        playlistId: this.body.playlistId,
        name: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        duration: this.body.duration,
        sortOrder: ""
      };
    },
    checkFormatTime () {
      this.body.duration = Helper.timeToMillisecond(this.model.duration)
    },
  },
};