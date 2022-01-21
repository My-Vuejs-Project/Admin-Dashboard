import Pagination from "./../../../../components/share/pagination";
import Service from "./../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListCustomerGroup",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      data: {
        fields: {
          index: "",
        },
        customerGroups: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      modal: {
        delete: false,
      },
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getCustomerGroups();
  },
  watch: {
    "$route.fullPath": function() {
      this.getCustomerGroups();
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

    getCustomerGroups() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let params = "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      Service.getCustomerGroups(params).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomerGroups();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.customerGroups = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.customerGroups = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.customerGroups = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    htmlToText(html) {
      return Helper.convertToPlain(html);
    },

    getFullImage(path) {
      let dev = path.split("/")[0];

      return dev == "DEVELOPMENT" ? Helper.getFullImage(path) : path;
    },

    popupModalDelete(index) {
      this.data.fields.index = index;
      this.modal.delete = true;
    },

    confirmDelete() {
      this.isDeleting = true;
      let id = this.data.customerGroups[this.data.fields.index].id;
      Service.deleteCustomerGroup(id).then((response) => {
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
          this.data.customerGroups.splice(this.data.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Successfully deleted");
          this.closeModal();
        }
      });
    },

    closeModal() {
      this.modal = {
        delete: false,
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
