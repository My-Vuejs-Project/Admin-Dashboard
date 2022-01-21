import Service from "../../../../utils/api/service";

export default {
  name: "CreateCustomerGroup",
  data() {
    return {
      isCreating: false,
      body: {
        name: "",
        description: "",
        badge: "",
        presign: "",
        sortOrder: 0,
      },
    };
  },
  components: {},
  computed: {},

  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListCustomerGroup",
        query: { page: 1, limit: 10 },
      });
    },

    chooseLogo(e) {
      this.body.badge = e.target.files[0];
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    submitCreate() {
      if (!this.body.name) {
        this.$toasted.show("Name cannot be empty!");
      } else {
        this.isCreating = true;
        if (this.body.badge) {
          this.uploadPresign();
        } else {
          this.createCustomerGroup();
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
            this.isCreating = false;
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
              this.createCustomerGroup();
            } else {
              this.$toasted.show("File upload fail!");
              this.isCreating = false;
            }
          }
        );
      } else {
        this.$toasted.show("File cannot be empty!");
      }
    },

    createCustomerGroup() {
      let body = {
        name: this.body.name,
        description: this.body.description,
        badge: this.body.presign ? this.body.presign[0].key : "",
        sortOrder: this.body.sortOrder,
      };

      Service.createCustomerGroup(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createCustomerGroup();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Customer group has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        description: "",
        badge: "",
        presign: "",
        sortOrder: 0,
      };
    },
  },
};
