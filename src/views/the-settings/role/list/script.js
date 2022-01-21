import Service from "./../../../../utils/api/service";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListRole",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      search: {
        status: "",
      },
      display: {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
        },
      },
      data: {
        totalItems: 10,
        page: 1,
        pageSize: 10,
        totalNumPage: 1,
        roles: [],
        roleList: [],
      },
    };
  },
  components: {
    TableLoading,
    NoItem
  },
  created() {
    this.getAllUser();
  },
  mounted() {},
  watch: {
    "$route.fullPath": function() {
      this.getAllUser();
    },
  },
  computed: {
    ...mapState(["permissions"]),
  },
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

    getAllUser() {
      let queryStatus = this.$root.$route.query.status;
      if (queryStatus != undefined) this.search.status = queryStatus;
      let param = "";
      if (this.search.status) {
        param =
          "?status=" +
          this.search.status
      }

      Service.getAllRole(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllUser();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.roleList = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.roleList = response.data;
          } else {
            this.data.roleList = [];
            this.isNoData = true;
          }
          
        }
      });
    },

    async searchStatus() {
      const query = Object.assign({}, this.$route.query);
      query.status = this.search.status;
      await this.$router.push({ query });
    },

    deleteRole() {
      this.isDeleting = true;
      let roleId = this.data.roleList[this.display.modal.delete.index].id;
      Service.deleteRole(roleId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteRole();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.roleList.splice(this.display.modal.delete.index, 1);
          this.$toasted.show("Role has been deleted.");
          this.closeModal();
        }
      });
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
    },

    closeModal() {
      this.display = {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
        },
      };
    },

    modalDetail() {
      this.display.modal.detail = true;
    },
  },
};
