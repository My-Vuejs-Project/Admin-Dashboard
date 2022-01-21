import Service from "../../../utils/api/service";
import Media from "./../../../components/share/media"
import Helper from './../../../utils/global/func'

export default {
  name: "CreateAdvertisement",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
        media: false
      },
      body: {
        image: {
          file: "",
          presign: ""
        },
        img: "",
        link: "",
        type: "banner",
        sortOrder: 0,
        status: "active",
      },
      data: {},
    };
  },
  components: {
    Media
  },
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListAdvertisement",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    imagePreview() {
      if (this.body.image.file || this.data.media) {
        this.display.imagePreview = true
      }
    },

    closeModal() {
      this.display.imagePreview = false
      this.display.media = false
    },

    chooseImage() {
      this.display.media = true
    },

    getFullImage(path) {
      let dev = path.split('/')[0]
      if (dev == 'DEVELOPMENT') {
        return Helper.getFullImage(path);
      } else return path
    },

    getNameFromUrl(url) {
      return url.split('/').pop()
    },

    existedMediaCallback(media) {
      this.data.media = media
      this.closeModal()
    },

    newMediaCallBack(file) {
      this.body.image.file = file
      this.closeModal()
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file)
    },

    submitCreateAdvertisement() {
      let validatedMessage = this.validateBody(this.body)
      if (validatedMessage == "ok") {
        this.isCreating = true
        if (this.body.image.file) {
          this.uploadPresign()
        } else {
          this.createAdvertisement()
        }
      } else {
        this.$toasted.show(validatedMessage)
      }
    },

    validateBody(data) {
      if (!(data.image.file || (this.data.media && this.data.media.url))) {
        return "Image cannot be empty!"
      } else if (!data.link) {
        return "Link cannot be empty!"
      } else if (!data.type) {
        return "Type cannot be empty!"
      } else if (!data.sortOrder) {
        return "Sort order cannot be empty!"
      } else if (!data.status) {
        return "Status order cannot be empty!"
      } else {
        return "ok"
      }
    },

    uploadPresign() {
      let body = {
        media: [{
          ext: this.body.image.file.type.split('/').pop(),
          type: "advertisement",
          filename: this.body.image.file.name
        }]
      }
      Service.uploadPresign(body).then((response) => {
        this.body.image.presign = response.data
        this.uploadFile(this.body.image.file)
      });
    },

    async uploadFile(file) {
      if (file) {
        let uploadUrl = this.body.image.presign[0].uploadUrl
        await Service.uploadMedia(uploadUrl, file, file.type)
          .then((response) => {
            if (response == "ok") {
              this.createAdvertisement();
              this.addMedia()
            } else {
              this.$toasted.show("File upload fail!")
            }
          })
      } else {
        this.$toasted.show("File cannot be empty!")
      }
    },

    addMedia() {
      let file = this.body.image.file
      let body = {
        fileName: file.name,
        url: this.body.image.presign ? this.body.image.presign[0].key : "",
        type: file.type.split("/")[0].split('/')[0],
        folder: "advertisement",
        status: "active"
      }

      Service.addMedia(body)
    },

    createAdvertisement() {
      let image = ""
      if (this.data.media && this.data.media.url) {
        image = this.data.media.url
      } else if (this.body.image.file) {
        image = this.body.image.presign ? this.body.image.presign[0].key : ""
      }


      let body = {
        link: this.body.link,
        imageUrl: image,
        duration: 0,
        sortOrder: this.body.sortOrder,
        type: this.body.type,
        status: this.body.status,
      };

      Service.createAdvertisement(body).then((response) => {
        this.isCreating = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createAdvertisement()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.resetBody()
          this.$toasted.show("Advertisement has been created.")
        }
      });
    },

    resetBody() {
      this.body = {
        image: {
          file: "",
          presign: ""
        },
        img: "",
        link: "",
        type: "banner",
        sortOrder: 0,
        status: "active"
      }

      this.data.media = {}
    }
  },
};