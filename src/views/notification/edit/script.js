import moment from "moment";
import Service from "../../../utils/api/service";
import Helper from "./../../../utils/global/func";
import Media from './../../../components/share/media'
import TableLoading from "./../../../components/share/table-loading";
export default {
  name: "EditNotification",
  props: {},
  data() {
    return {
      isUpdating: false,
      isFetching: true,
      display: {
        imagePreview: false,
        media: false,
        schedule: false,
      },
      body: {
        imageUrl: "",
        title: "",
        description: "",
        pushAt: "",
      },
      data: {
        notificationDetail: "",
        media: ""
      },
      models: {
        time: "",
        date: "",
      }
    };
  },
  components: {
    Media,TableLoading
  },
  computed: {

  },
  created() {
    this.getNotification();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListNotification",
      });
    },

    getNotification() {
      Service.getNotificationDetail(this.$route.query.id).then((response) => {
        this.isFetching = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getNotification();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.notificationDetail = response.data;
          this.body = {
            imageUrl: response.data.imageUrl,
            title: response.data.title,
            description: response.data.description,
            status: response.data.status,
            pushAt: response.data.pushAt,
          }
          if (response.data.imageUrl) {
            this.data.media = {
              fileName: this.getNameFromUrl(response.data.imageUrl),
              url: response.data.imageUrl
            }
          }
          if (response.data.type == "schedule") {
            this.display.schedule = true
            this.models.date = moment(response.data.pushAt).format("YYYY-MM-DD")
            this.models.time = moment(response.data.pushAt).format("HH:mm")
          }
        }
      });
    },
    removeMedia() {
      this.data.media = ""
      this.body.imageUrl = ""
    },
    closeModal() {
      this.display = {
        imagePreview: false,
        media: false
      }
    },

    imagePreview() {
      if (this.body.imageUrl) {
        this.display.imagePreview = true;
      }
    },

    getFullImage(path) {
      let dev = path.split('/')[0]
      if (dev == 'DEVELOPMENT') {
        return Helper.getFullImage(path);
      } else return path
    },

    getNameFromUrl(url) {
      return url.split("/").pop();
    },

    chooseImage() {
      this.display.media = true
    },

    existedMediaCallback(media) {
      this.data.media = media
      this.body.imageUrl = media.url
      this.closeModal()
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    confirmUpdate() {
      if (this.data.notificationDetail.type == "instant") {
        let validatedMessage = this.validateBody(this.body);
        if (validatedMessage == "ok") {
          this.isUpdating = true;
          this.updateNotification();
        } else {
          this.$toasted.show(validatedMessage);
        }
      } else {
        let validatedMessage = this.validateScheduleBody(this.body);
        if (validatedMessage == "ok") {
          this.isUpdating = true;
          this.updateNotificationSchedule();
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

    updateNotification() {
      delete this.body.pushAt;
      Service.updateNotification(this.$route.query.id, this.body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateNotification();
              }
            });
          } else {
            this.isUpdating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.goBack();
          this.$toasted.show("Notification has been updated.");
        }
      });
    },
    updateNotificationSchedule() {
      let concatenateDateTime = this.models.date + " " + this.models.time;
      var dateTime = new Date(concatenateDateTime.replace(/-/g, "/"));
      this.body.pushAt = dateTime
      Service.updateNotificationSchedule(this.$route.query.id, this.body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateNotificationSchedule();
              }
            });
          } else {
            this.isUpdating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.goBack();
          this.$toasted.show("Notification has been updated.");
        }
      });
    },
  },
};