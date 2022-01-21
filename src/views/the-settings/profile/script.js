import Service from "./../../../utils/api/service";
import Helper from "./../../../utils/global/func";
import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      show: {
        current: false,
        new: false,
      },
      body: {
        image: {
          file: "",
          presign: "",
        },
        account: {
          firstName: "",
          lastName: "",
          isUpdating: false,
        },
        detail: { ...this.accountInfo },
        password: {
          currentPassword: "",
          newPassword: "",
          isUpdating: false,
          isEditable: false,
        },
        email: "",
      },
    };
  },
  components: {},

  created() {},

  computed: {
    ...mapState(["accountInfo"]),

    profile() {
      return JSON.parse(JSON.stringify(this.accountInfo));
    },
  },

  methods: {
    enableEdit(type) {
      if (type == "firstName") {
        document.getElementById("firstName").style.cursor = "text";
        document.getElementById("firstName").disabled = false;
      } else if (type == "lastName") {
        document.getElementById("lastName").style.cursor = "text";
        document.getElementById("lastName").disabled = false;
      } else if (type == "email") {
        document.getElementById("email").style.cursor = "text";
        document.getElementById("email").disabled = false;
      } else {
        this.body.password.isEditable = true;
      }
    },

    chooseImage(e) {
      this.body.image.file = e.target.files[0];
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

    uploadPresign() {
      let body = {
        media: [
          {
            ext: this.body.image.file.type.split("/").pop(),
            type: "profile",
            filename: this.body.image.file.name,
          },
        ],
      };
      Service.uploadPresign(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateProfile();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.body.image.presign = response.data;
          this.uploadFile(this.body.image.file);
        }
      });
    },

    async uploadFile(file) {
      if (file) {
        let uploadUrl = this.body.image.presign[0].uploadUrl;
        await Service.uploadMedia(uploadUrl, file, file.type).then(
          (response) => {
            if (response == "ok") {
              this.updateProfile();
            } else {
              this.$toasted.show("File upload fail!");
            }
          }
        );
      } else {
        this.$toasted.show("File cannot be empty!");
      }
    },

    submitUpdateProfile() {
      let validatedMessage = this.validateInformation(this.profile);
      let validatedPassword = this.validatePassword(this.body.password);

      if (validatedMessage == "ok") {
        if (this.body.image.file) {
          this.body.account.isUpdating = true;
          this.uploadPresign();
        } else {
          if (
            this.profile.firstName != this.accountInfo.firstName ||
            this.profile.lastName != this.accountInfo.lastName
          ) {
            this.body.account.isUpdating = true;
            this.updateProfile();
          }

          if (this.profile.email != this.accountInfo.email) {
            this.body.account.isUpdating = true;
            this.updateEmail(this.accountInfo.id);
          }
        }

        if (this.body.password.isEditable) {
          if (validatedPassword == "ok") {
            this.body.account.isUpdating = true;
            this.changePassword();
          } else this.$toasted.show(validatedPassword);
        }
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    isValidEmail(emailAdress) {
      let regexEmail =
        /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})/;
      return !emailAdress.match(regexEmail) ? false : true;
    },

    validateInformation(data) {
      if (!data.firstName) {
        return "First name cannot be empty!";
      } else if (!data.lastName) {
        return "Last name cannot be empty!";
      } else if (!data.email) {
        return "Email cannot be empty!";
      } else {
        return "ok";
      }
    },

    validatePassword(data) {
      if (!data.currentPassword) {
        return "Old password cannot be empty!";
      } else if (!data.newPassword) {
        return "New password cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateProfile() {
      let image;
      if (this.body.image.file) {
        image = this.body.image.presign[0].key;
      } else image = this.profile.imageUrl;

      let body = {
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        imageUrl: image,
      };

      Service.updateProfile(body).then((response) => {
        this.body.account.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateProfile();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          if (this.profile.firstName != this.accountInfo.firstName) {
            this.$store.dispatch("updateFirstName", body.firstName);
          }
          
          if (body.lastName != this.accountInfo.lastName) {
            this.$store.dispatch("updateLastName", body.lastName);
          }

          this.resetBody();
          this.$toasted.show("Your information has been updated.");
        }
      });
    },

    updateEmail(id) {
      let validEmail = this.isValidEmail(this.profile.email);

      if (!validEmail) {
        this.body.account.isUpdating = false;
        this.$toasted.show("Invalid email address");
      } else {
        let email = { email: this.profile.email };

        Service.updateEmail(id, email).then((response) => {
          this.body.account.isUpdating = false;
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.updateEmail();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.resetBody();
            this.$toasted.show("Your email has been updated.");
            this.$store.dispatch("updateEmail", this.profile.email);
          }
        });
      }
    },

    changePassword() {
      let body = {
        currentPassword: this.body.password.currentPassword,
        newPassword: this.body.password.newPassword,
      };

      Service.changePassword(body).then((response) => {
        this.body.password.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.changePassword();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
        }
      });
    },

    resetBody() {
      document.getElementById("firstName").style.cursor = "not-allowed";
      document.getElementById("firstName").disabled = true;
      document.getElementById("lastName").style.cursor = "not-allowed";
      document.getElementById("lastName").disabled = true;
      document.getElementById("email").style.cursor = "not-allowed";
      document.getElementById("email").disabled = true;

      this.body = {
        account: {
          firstName: "",
          lastName: "",
          isUpdating: false,
        },
        password: {
          currentPassword: "",
          newPassword: "",
          isUpdating: false,
          isEditable: false,
        },
      };
    },
  },
};
