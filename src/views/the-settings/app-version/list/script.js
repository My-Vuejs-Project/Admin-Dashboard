import Service from "./../../../../utils/api/service";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListAppVersion",
  data() {
    return {
      isFetching: true,
      isUpdating: false,
      isNoData: false,
      data: {
        versions: [],
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
    this.getAllAppVersion();
  },
  watch: {
    "$route.fullPath": function () {
      this.getAllAppVersion();
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

    getAllAppVersion() {
      Service.getAllAppVersion().then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllAppVersion();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.versions = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.versions = response.data;
          } else {
            this.data.versions = [];
            this.isNoData = true;
          }
        }
      });
    },

    displayFormUpdate(index) {
      var version = this.data.versions[index];
      this.update.data = {
        id: version.id,
        ios: version.ios,
        android: version.android,
        huawei: version.huawei,
        forceUpdate: version.forceUpdate.toString() == "true" ? true : false,
        maintenanceStatus: version.maintenanceStatus.toString() == "true" ? true : false,
      };
      this.update.show = true;
      this.update.index = index;
    },

    confirmUpdate() {
      this.isUpdating = true;
      let id = this.update.data.id;
      let body = {
        ios: this.update.data.ios,
        android: this.update.data.android,
        huawei: this.update.data.huawei,
        forceUpdate: this.update.data.forceUpdate.toString() == "true" ? true : false,
        maintenanceStatus: this.update.data.maintenanceStatus.toString() == "true" ? true : false,
      };

      Service.updateAppVersion(id, body).then((response) => {
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
          this.data.versions[this.update.index] = this.update.data;
          this.data.versions[this.update.index].forceUpdate = this.update.data.forceUpdate.toString() == "true" ? true : false
          this.data.versions[this.update.index].maintenanceStatus = this.update.data.maintenanceStatus.toString() == "true" ? true : false
          this.$toasted.show("App version has been updated.");
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