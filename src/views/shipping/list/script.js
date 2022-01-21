import Pagination from "@/components/share/pagination";
import Service from "./../../../utils/api/service";
import Helper from "./../../../utils/global/func";
import TableLoading from "./../../../components/share/table-loading";
import NoItem from "./../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListShipping",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      fields: {
        id: "",
        index: "",
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
        shipping: [],
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
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllShipping();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllShipping();
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

    getAllShipping() {
      this.isFetching = true;
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      Service.getAllShipping(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllShipping();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.shipping = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.shipping = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.shipping = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    popupModal(index) {
      this.fields.index = index;
      this.display.modal.delete.show = true;
    },

    deleteShipping() {
      this.isDeleting = true;
      let id = this.data.shipping[this.fields.index].id;
      Service.deleteShipping(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteShipping();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.shipping.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Shipping courier has been deleted.");
          this.closeModal();
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
        },
      };
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
