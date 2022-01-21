import Service from "../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";

export default {
  name: "EditCustomerGroup",
  data() {
    return {
      isUpdating: false,
      body: {
        badge: "",
        presign: "",
      },
      data: {
        name: "",
        description: "",
        sortOrder: 0,
      },
    };
  },
  components: {},
  computed: {},
  created() {
    this.getCustomerGroupDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListCustomerGroup",
        query: { page: 1, limit: 10 },
      });
    },

    getCustomerGroupDetail(id) {
      Service.getCustomerGroupDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomerGroupDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data = response.data;
        }
      });
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      return dev == "DEVELOPMENT" ? Helper.getFullImage(path) : path;
    },

    getNameFromUrl(url) {
      return url.split("/").pop();
    },

    chooseLogo(e) {
      this.body.badge = e.target.files[0];
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    submitUpdate() {
      if (!this.data.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isUpdating = true;
        if (this.body.badge) {
          this.uploadPresign();
        } else {
          this.updateCustomerGroup();
        }
      }
    },

    uploadPresign() {
      let body = {
        media: [
          {
            ext: this.body.badge.type.split("/").pop(),
            type: "customerGroup",
            filename: this.body.badge.name,
          },
        ],
      };
      Service.uploadPresign(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.uploadPresign();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
            this.isUpdating = false;
          }
        } else {
          this.body.presign = response.data;
          this.uploadFile(this.body.badge);
        }
      });
    },

    async uploadFile(file) {
      if (file) {
        let uploadUrl = this.body.presign[0].uploadUrl;
        await Service.uploadMedia(uploadUrl, file, file.type).then(
          (response) => {
            if (response == "ok") {
              this.updateCustomerGroup();
            } else {
              this.$toasted.show("File upload fail!");
              this.isUpdating = false;
            }
          }
        );
      } else {
        this.$toasted.show("File cannot be empty!");
      }
    },

    updateCustomerGroup() {
      let id = this.data.id;

      if (this.body.presign) {
        this.data.badge = this.body.presign[0].key;
      }

      let body = {
        name: this.data.name,
        badge: this.data.badge ? this.data.badge : "",
        description: this.data.description,
        sortOrder: this.data.sortOrder,
      };

      Service.updateCustomerGroup(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateCustomerGroup();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack();
          this.$toasted.show("Customer group has been created.");
        }
      });
    },
  },
};
