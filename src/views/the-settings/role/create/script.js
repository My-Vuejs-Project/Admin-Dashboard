import Service from "../../../../utils/api/service";

export default {
  name: "CreateRole",
  data() {
    return {
      isCreating: false,
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
        permissionId: [],
      },
      data:{
        listPermission: [],
      }
    };
  },
  components: {},
  computed: {},
  created() {
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
          this.data.listPermission = response.data;
        }
      });
    },

    selectAll(){
      let allPermission = []
      for (let index = 0; index < this.data.listPermission.length; index++) {
        const permissionGroup = this.data.listPermission[index];
        for (let index = 0; index < permissionGroup.permissions.length; index++) {
          const permission = permissionGroup.permissions[index];
          allPermission.push(permission.id)
        }
      }

      this.body.permissionId = allPermission
    },

    submitCreate() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        this.isCreating = true;
        this.createRole();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },
    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.permissionId) {
        return "Permission cannot be empty!";
      } else {
        return "ok";
      }
    },
    createRole() {
      let body = {
        name: this.body.name,
        permissionId: this.body.permissionId,
      };

      Service.createRole(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createRole();
              }
            });
          } else {
            this.isCreating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isCreating = false;
          this.resetBody();
          this.$toasted.show("Role has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        name: "",
        permissionId: [],
      };
    },
  },
};
