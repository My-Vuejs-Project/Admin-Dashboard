import Service from "../../../../utils/api/service";
import Helper from '../../../../utils/global/func'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
export default {
  name: "CreateTutorialPlaylist",
  data() {
    return {
      isCreating: false,
      data: {
        playlist: [],
      },
      body: {
        parentId: "",
        name: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        duration: "",
        sortOrder: "",
        status: "active",
      },
      model:{
        duration: ""
      },
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
      this.$router.push({name: 'ListTutorialPlaylist'});
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
          this.data.playlist = response.data
          this.body.parentId =  response.data[0].id
        }
      })
    },
    closeModal() {
      this.display.modal.formError = false;
      this.display.modal.media = false;
    },

    submitCreateTutorialPlaylist() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createTutorialPlaylist();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    createTutorialPlaylist() {
      let body = this.body
      body.duration = parseFloat(body.duration)
      body.sortOrder = parseInt(body.sortOrder)
      Service.createTutorialPlaylist(body).then((response) => {
        if (response.statusCode) {
          if(response.statusCode == "4410"){
            Service.refreshToken().then((response) => {
              if(response == "ok"){this.createPayment()}
            })
          }else{
            this.isCreating = false
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.isCreating = false
          this.resetBody();
          this.$toasted.show("Tutorial playlist method has been created.");
        }
      });
    },

    validateBody(data) {

      if (!data.parentId) {
        return "Type cannot be empty!";
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
        parentId: this.body.parentId,
        name: "",
        description: "",
        imageUrl: "",
        videoUrl: "",
        duration: this.body.duration,
        sortOrder: "",
        status: "active",
      };
      this.model.duration = ""
    },
    
    checkFormatTime () {
      this.body.duration = Helper.timeToMillisecond(this.model.duration)
    },
  },
};
