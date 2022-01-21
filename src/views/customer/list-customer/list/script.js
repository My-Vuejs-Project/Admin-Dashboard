import Pagination from "./../../../../components/share/pagination";
import Service from "./../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  name: "ListCustomer",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      search: {
        email: "",
        username: "",
        dateRange: [],
        status: "",
      },
      data: {
        fields: {
          index: "",
          status: "",
        },
        customers: [],
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
    DatePicker,
  },
  created() {
    this.getCustomer();
  },
  watch: {
    "$route.fullPath": function() {
      this.getCustomer();
    },
  },
  mounted() {},
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

    async filterSearch() {
      const query = Object.assign({}, this.$route.query);
      query.email = this.search.email;
      query.username = this.search.username;
      query.status = this.search.status;
      query.page = 1;

      let startDate = this.search.dateRange[0];
      let endDate = this.search.dateRange[1];
      query.startDate = startDate;
      query.endDate = endDate;

      await this.$router.push({ path: '/customer', query }).catch(() => {});
    },

    getCustomer() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let queryEmail = this.$root.$route.query.email;
      let queryUsername = this.$root.$route.query.username;
      let queryStartDate = this.$root.$route.query.startDate;
      let queryEndDate = this.$root.$route.query.endDate;
      let queryStatus = this.$root.$route.query.status;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (queryEmail != undefined) this.search.type = queryEmail;
      if (queryUsername != undefined) this.search.type = queryUsername;
      if (queryStartDate != undefined) this.search.dateRange[0] = queryStartDate;
      if (queryEndDate != undefined) this.search.dateRange[1] = queryEndDate;
      if (queryStatus != undefined) this.search.status = queryStatus;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let params = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      if (this.search.email) {
        params = params + "&email=" + this.search.email;
      }
      if (this.search.username) {
        params = params + "&username=" + this.search.username;
      }
      if (this.search.dateRange.length > 0 && this.search.dateRange[0] != null && this.search.dateRange[1] != null) {
        params = params + "&startDate=" + this.search.dateRange[0] + "&endDate=" + this.search.dateRange[1];
      }
      if (this.search.status) {
        params = params + "&status=" + this.search.status;
      }

      Service.getCustomers(params).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomer();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.customers = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.customers = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.customers = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    popup(status, index) {
      this.data.fields.index = index;
      this.data.fields.status = status;
      this.modal.delete = true;
    },

    confirmUpdate() {
      this.isDeleting = true;
      let id = this.data.customers[this.data.fields.index].id;
      let body = {
        status: this.data.fields.status,
      };

      Service.updateCustomer(id, body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.confirmUpdate();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
            this.closeModal();
          }
        } else {
          this.isDeleting = false;
          this.$toasted.show("Successfully updated");
          if (this.data.customers[this.data.fields.index].status == 'active') {
            this.data.customers[this.data.fields.index].status = 'inactive'
          } else {
            this.data.customers[this.data.fields.index].status = 'active'
          }
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
