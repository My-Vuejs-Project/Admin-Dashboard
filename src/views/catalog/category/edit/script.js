import Service from "../../../../utils/api/service";
import Media from './../../../../components/share/media'
import SubCategoryList from './../../../../components/catalog/subcategory/list'
import Helper from './../../../../utils/global/func'

export default {
  name: "EditCategory",
  data() {
    return {
      isUpdating: false,
      display: {
        imagePreview: false,
        media: false
      },
      body: {
        image: {
          file: "",
          presign: ""
        },
      },
      data: {},
      subcategories: []
    };
  },
  components: {
    Media,
    SubCategoryList
  },
  computed: {},
  created() {
    this.getCategoryDetail(this.$route.query.id)
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListCategory",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    getCategoryDetail(id) {
      Service.getCategoryDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCategoryDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data = response.parent
          this.subcategories = response.data;
        }
      })
    },

    imagePreview() {
      if (this.body.image.file || this.data.imageUrl) {
        this.display.imagePreview = true
      }
    },

    closeModal() {
      this.display = {
        imagePreview: false,
        media: false
      }
    },

    stringToNumber(id){
      return parseInt(id)
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

    fileToPath(file) {
      return window.URL.createObjectURL(file)
    },

    chooseImage() {
      this.display.media = true
    },

    existedMediaCallback(media) {
      this.data.media = media
      this.closeModal()
    },

    newMediaCallBack(file) {
      this.body.image.file = file
      this.closeModal()
    },

    submitUpdate() {
      let validatedMessage = this.validateBody(this.data)
      if (validatedMessage == "ok") {
        this.isUpdating = true
        if (this.body.image.file) {
          this.uploadPresign()
        } else {
          this.updateCategory()
        }
      } else {
        this.$toasted.show(validatedMessage)
      }
    },

    validateBody(data) {
      if (!(this.body.image.file || (this.data.media && this.data.media.url) || data.imageUrl)) {
        return "Image file cannot be empty!"
      } else if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.sortOrder) {
        return "Sort order cannot be empty!";
      } else if (!data.status) {
        return "Status order cannot be empty!";
      } else {
        return "ok";
      }
    },

    uploadPresign() {
      let body = {
        media: [{
          ext: this.body.image.file.type.split('/').pop(),
          type: "category",
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
              this.updateCategory();
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
        type: file.type.split("/")[0].split("/")[0],
        folder: "catelog",
        status: "active"
      }

      Service.addMedia(body)
    },

    updateCategory() {
      let id = this.data.id;
      if (this.body.image.file) {
        this.data.imageUrl = this.body.image.presign ? this.body.image.presign[0].key : ""
      } else if (this.data.media) {
        this.data.imageUrl = this.data.media.url
      }

      let body = {
        name: this.data.name,
        imageUrl: this.data.imageUrl,
        sortOrder: this.data.sortOrder,
        status: this.data.status,
      };

      Service.updateCategory(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateCategory()
              }
            })
          } else {
            this.isUpdating = false
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.isUpdating = false
          this.$router.push({
            name: 'ListCategory'
          })
          this.$toasted.show('Category has been updated.')
        }
      });
    },
  },
};