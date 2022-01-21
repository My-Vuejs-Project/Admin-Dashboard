import Pagination from "@/components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { mapState } from "vuex";

export default {
  name: "ListProductDiscount",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      fields: {
        id: "",
        index: "",
      },
      search: {
        status: "",
        dateRange: [],
      },
      display: {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
          large: false,
        },
      },
      data: {
        productDiscounts: [],
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
    DatePicker,
  },
  created() {
    this.getProductDiscount();
  },
  watch: {
    "$route.fullPath": function() {
      this.getProductDiscount();
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
    
    async searchDiscount() {
      const query = Object.assign({}, this.$route.query);
      query.status = this.search.status;
      query.page = 1;

      let startDate = this.search.dateRange[0];
      let endDate = this.search.dateRange[1];
      query.startDate = startDate;
      query.endDate = endDate;

      await this.$router.push({ query });
    },

    getProductDiscount() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let queryStatus = this.$root.$route.query.status;
      let queryStartDate = this.$root.$route.query.startDate;
      let queryEndDate = this.$root.$route.query.endDate;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (queryStatus != undefined) this.search.status = queryStatus;
      if (queryStartDate != undefined) this.search.dateRange[0] = queryStartDate;
      if (queryEndDate != undefined) this.search.dateRange[1] = queryEndDate;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      if (this.search.status) {
        param = param + "&status=" + this.search.status;
      }
      if (this.search.dateRange.length > 0 && this.search.dateRange[0] != null && this.search.dateRange[1] != null) {
        param = param + "&startDate=" + this.search.dateRange[0] + "&endDate=" + this.search.dateRange[1];
      }

      Service.getAllProductDiscounts(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getProductDiscount();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.productDiscounts = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.productDiscounts = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.productDiscounts = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    popupModal(type, index) {
      this.fields.index = index;
      if (type == "delete") {
        this.display.modal.delete.show = true;
      }
    },

    deleteProductDiscount() {
      this.isDeleting = true;
      let id = this.data.productDiscounts[this.fields.index].id;
      Service.deleteProductDiscount(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteProductDiscount();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.productDiscounts.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Product discount has been deleted.");
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
          large: false,
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
