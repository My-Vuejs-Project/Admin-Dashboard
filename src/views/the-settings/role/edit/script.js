import Service from "../../../../utils/api/service";

export default {
  name: "EditRole",
  data() {
    return {
      isUpdating: false,
      display: {
        modal: {
          formError: false,
          media: false,
        },
        message: {
          responseError: "",
        },
      },
      body: {
        name: "",
        status: "",
        permissionId: [],
      },
      data: {
        permissions: [],
      },
    };
  },
  components: {},
  computed: {},
  created() {
    this.getAdminRole(this.$route.query.id);
    this.getPermission();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListRole"
      });
    },

    closeModal() {
      this.display.modal.formError = false;
      this.display.modal.media = false;
    },

    getPermission() {
      Service.getListPermissions().then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getPermission();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.permissions = response.data;
        }
      });
    },

    getAdminRole(id) {
      Service.getAdminRole(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAdminRole(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.body = response.data;
          this.body.permissionId = [];
          if (response.data.permissions.length > 0) {
            for (
              let index = 0;
              index < response.data.permissions.length;
              index++
            ) {
              const element = response.data.permissions[index];
              this.body.permissionId.push(element.id);
            }
          }
        }
      });
    },

    submitUpdate() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateRole();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.status) {
        return "Status cannot be empty!";
      } else if (!data.permissionId) {
        return "Permission cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateRole() {
      let id = this.$route.query.id;
      let body = {
        name: this.body.name,
        status: this.body.status,
        permissionId: this.body.permissionId,
      };

      Service.updateRole(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateRole();
              }
            });
          } else {
            this.isUpdating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isUpdating = false;
          this.$toasted.show("Role has been updated.");
          this.$router.push({ name: "ListRole" });
        }
      });
    },
  },
};
