import Pagination from "./../../../../components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListVoucher",
  data() {
    return {
      isFetching: true,
      isNoData: false,
      data: {
        vouchers: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      display: {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
          send: {
            index: -1,
            show: false,
          },
        },
      },
      isSending: false,
      isDeleting: false,
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllVoucher();
  },
  mounted() {},
  watch: {
    "$route.fullPath": function() {
      this.getAllVoucher();
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

    getFullImage(path) {
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    getAllVoucher() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let params = "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      Service.getAllVoucher(params).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllVoucher();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.vouchers = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.vouchers = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
    },

    popupModalSend(index) {
      this.display.modal.send.index = index;
      this.display.modal.send.show = true;
    },

    closeModal() {
      this.display = {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
          send: {
            index: -1,
            show: false,
          },
        },
      };
    },

    sendVoucher() {
      this.isSending = true;
      let index = this.display.modal.send.index;
      let id = this.data.vouchers[index].id;
      let param = "/send/" + id;

      Service.sendVoucher(param, {}).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.sendVoucher();
              }
            });
          } else {
            this.isSending = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.$toasted.show("Voucher has been sent.");
          this.isSending = false;
          this.closeModal();
        }
      });
    },

    deleteVoucher() {
      this.isDeleting = true;
      let index = this.display.modal.delete.index;
      let id = this.data.vouchers[index].id;

      Service.deleteVoucher(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteVoucher();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.vouchers.splice(index, 1);
          this.$toasted.show("Voucher has been deleted.");
          this.isDeleting = false;
          this.closeModal();
        }
      });
    },

    resetPagination() {
      this.data.pagination = {
        limit: 10,
        page: 1,
        total: 0,
        totalPage: 0,
      };
    },
  },
};
