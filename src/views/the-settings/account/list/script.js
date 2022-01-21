import Service from "../../../../utils/api/service";
import TableLoading from "./../../../../components/share/table-loading";
import Pagination from "@/components/share/pagination";
import Helper from "./../../../../utils/global/func";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListAdminAccount",
  data() {
    return {
      adminId: 0,
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      search: {
        status: "",
        type: "",
      },
      field: {
        index: "",
        type: "",
      },
      display: {
        modal: {
          small: false,
          delete: {
            index: -1,
            show: false,
          },
        },
      },
      data: {
        account: [],
        roleList: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
    };
  },
  components: {
    TableLoading,
    NoItem,
    Pagination
  },
  created() {
    this.getAllAccount();
  },
  mounted() {},
  watch: {
    "$route.fullPath": function() {
      this.getAllAccount();
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

    getAllAccount() {
      let queryStatus = this.$root.$route.query.status;
      let queryType = this.$root.$route.query.type;
      if (queryStatus != undefined) this.search.status = queryStatus;
      if (queryType != undefined) this.search.type = queryType;
      let param = "";
      if (this.search.status && this.search.type) {
        param = "?status=" + this.search.status + "&role=" + this.search.type;
      } else if (this.search.status) {
        param = "?status=" + this.search.status;
      } else if (this.search.type) {
        param = "?role=" + this.search.type;
      }

      Service.getAllAdminAccounts(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllAccount();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.account = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.account = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.account = [];
            this.isNoData = true;
          }
        }
      });
    },

    async searchAccount() {
      const query = Object.assign({}, this.$route.query);
      query.type = this.search.type;
      query.status = this.search.status;
      query.page = 1;
      await this.$router.push({ query });
    },

    linkPage(type, index) {
      if (index >= 0) {
        this.$router.push({
          name: type,
          query: { id: this.data.account[index].id },
        });
      } else {
        this.$router.push({
          name: type,
        });
      }
    },

    modalPopup(type, index) {
      this.field.index = index;
      if (type) {
        this.field.type = type;
        this.display.modal.small = true;
      } else {
        this.display.modal.delete.show = true;
      }
    },

    confirmDelete() {
      this.isDeleting = true;
      let accountId = this.data.account[this.field.index].id;

      Service.deleteAdminAccount(accountId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.confirmDelete();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.account.splice(this.display.modal.delete.index, 1);
          this.$toasted.show("Account has been deleted.");
          this.closeModal();
        }
      });
    },

    confirmUpdate() {
      let id = this.data.account[this.field.index].id;
      let body = {
        status: this.field.type,
      };

      Service.updateAdminAccount(id, body).then((response) => {
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
          this.display.modal.small = false;

          if (body.status == "inactive") {
            this.data.account[this.field.index].status = "inactive";
          } else {
            this.data.account[this.field.index].status = "active";
          }
          this.$toasted.show("Account has been updated.");
        }
      });
    },

    closeModal() {
      this.display = {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
          small: false,
        },
      };
    },
  },
};
