import Service from "../../../utils/api/service";
import Media from "./../../../components/share/media";
import Helper from "./../../../utils/global/func";

export default {
  name: "CreateNotification",
  data() {
    return {
      isCreating: false,
      display: {
        schedule: false,
        media: false,
        imagePreview: false,
      },
      body: {
        imageUrl: "",
        title: "",
        description: "",
        pushAt: "",
      },
      data: {
        media: ""
      },

      models: {
        time: "",
        date: "",
      }
    };
  },
  components: {
    Media,
  },
  computed: {
  },
  created() { },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListNotification"
      });
    },
    removeMedia() {
      this.data.media = ""
      this.body.imageUrl = ""
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
      this.body.imageUrl = media.url
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

    submitCreateNotification() {
      if (this.models.time || this.models.date) {
        let validatedMessage = this.validateScheduleBody(this.body);
        if (validatedMessage == "ok") {
          this.isCreating = true;
          this.createScheduleNotification();
        } else {
          this.$toasted.show(validatedMessage);
        }
      } else {
        let validatedMessage = this.validateBody(this.body);
        if (validatedMessage == "ok") {
          this.isCreating = true;
          this.createNotification()
        } else {
          this.$toasted.show(validatedMessage);
        }
      }
    },

    validateScheduleBody(data) {
      if (!data.title) {
        return "Title cannot be empty!";
      } else if (!this.models.time) {
        return "Time cannot be empty!";
      } else if (!this.models.date) {
        return "Date cannot be empty!";
      } else if (!data.description) {
        return "Description cannot be empty!";
      } else {
        return "ok";
      }
    },

    validateBody(data) {
      if (!data.title) {
        return "Title cannot be empty!";
      } else if (!data.description) {
        return "Description cannot be empty!";
      } else {
        return "ok";
      }
    },

    createScheduleNotification() {
      let concatenateDateTime = this.models.date + " " + this.models.time;
      var dateTime = new Date(concatenateDateTime.replace(/-/g, "/"));
      this.body.pushAt = dateTime
      Service.createScheduleNotification(this.body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createScheduleNotification();
              }
            });
          } else {
            this.isCreating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.resetBody();
          this.$toasted.show("Notification has been created.");
        }
      });
    },

    createNotification() {
      delete this.body.pushAt;
      Service.createNotification(this.body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createNotification();
              }
            });
          } else {
            this.isCreating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.resetBody();
          this.$toasted.show("Notification has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        imageUrl: "",
        title: "",
        description: "",
        date: "",
        status: "",
      };
      this.data.media = ""; this.models.time = ""; this.models.date = ""
    },
  },
};
