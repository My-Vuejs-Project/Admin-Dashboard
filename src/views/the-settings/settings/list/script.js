import Service from "../../../../utils/api/service";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListSettings",
  data() {
    return {
      isFetching: true,
      isUpdating: false,
      isNoData: false,
      data: {
        settings: [],
      },
      update: {
        data: "",
        show: false,
        index: -1,
      },
    };
  },
  components: {
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllSetting();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllSetting();
    },
  },
  computed: {
    ...mapState(["permissions"]),
  },
  mounted() {},
  methods: {
    checkoutPermission(permissionName) {
      if (this.permissions) {
        let result = false;
        this.permissions.find((item) => {
          item.permissions.find((permission) => {
            if (permission.name == permissionName) {
              result = true;
            }
          });
        });

        return result;
      }
    },

    getAllSetting() {
      Service.getAllSetting().then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllSetting();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.settings = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;

          if (response.data.length > 0) {
            this.isNoData = false;

            // loop to create string name
            response.data.forEach((item) => {
              let stringName = convertString(item.key);
              item.name = stringName;

              this.data.settings.push(item);
            });
          } else {
            this.data.settings = [];
            this.isNoData = true;
          }
        }
      });

      function convertString(str) {
        let tempString = "";

        str.split("").forEach((char) => {
          tempString += char == char.toUpperCase() ? " " + char.toLowerCase() : char;
        });
        tempString = tempString.replace(/^./, (str) => str.toUpperCase());
        tempString = tempString.replace("Gc", "Group Customer");
        tempString = tempString.replace(/(?:^|\s)\S/g, function(word) { return word.toUpperCase()});
        return tempString;
      }
    },

    displayFormUpdate(index) {
      var setting = this.data.settings[index];
      this.update.data = {
        name: setting.name,
        key: setting.key,
        value: setting.value,
        description: setting.description,
      };
      this.update.show = true;
      this.update.index = index;
    },

    confirmUpdate() {
      this.isUpdating = true;
      let key = this.update.data.key;
      let body = {
        value: this.update.data.value,
        description: this.update.data.description,
      };

      Service.updateSetting(key, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.confirmUpdate();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.settings[this.update.index] = this.update.data;
          this.$toasted.show("Setting has been updated.");
          this.closeModal();
        }
      });
    },

    closeModal() {
      this.update = {
        data: "",
        show: false,
        index: -1,
      };
    },
  },
};
