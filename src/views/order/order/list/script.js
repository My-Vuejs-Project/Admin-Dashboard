import Pagination from "@/components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListOrder",
  data() {
    return {
      isFetching: true,
      isNoData: false,
      data: {
        order: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      search: {
        accountId: "",
        transactionNumber: "",
        invoiceNumber: "",
        orderStatus: "",
      },
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.search = {
      accountId: this.$root.$route.query.accountId
        ? this.$root.$route.query.accountId
        : "",
      transactionNumber: this.$root.$route.query.transactionNumber
        ? this.$root.$route.query.transactionNumber
        : "",
      invoiceNumber: this.$root.$route.query.invoiceNumber
        ? this.$root.$route.query.invoiceNumber
        : "",
    };
    this.getAllOrder();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllOrder();
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

    searching() {
      this.isNoData = false;
      let object = {
        page: 1,
        accountId: this.search.accountId,
        transactionNumber: this.search.transactionNumber,
        invoiceNumber: this.search.invoiceNumber,
      };
      if (this.search.accountId == "") {
        delete object.accountId;
      }
      if (this.search.transactionNumber == "") {
        delete object.transactionNumber;
      }
      if (this.search.invoiceNumber == "") {
        delete object.invoiceNumber;
      }
      this.$router.replace({ query: object });
      this.getAllOrder();
    },

    getAllOrder() {
      this.isFetching = true;
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param =
        "?limit=" +
        this.data.pagination.limit +
        "&offset=" +
        offset +
        (this.search.accountId != ""
          ? "&accountId=" + this.search.accountId
          : "") +
        (this.search.transactionNumber != ""
          ? "&transactionNumber=" + this.search.transactionNumber
          : "") +
        (this.search.invoiceNumber != ""
          ? "&invoiceNumber=" + this.search.invoiceNumber
          : "");

      Service.getAllOrder(param).then((response) => {
        this.isFetching = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllOrder();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.order = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.order = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.order = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    viewOrder(id) {
      let object = {
        id: id,
        page: this.$root.$route.query.page,
        accountId: this.search.accountId,
        transactionNumber: this.search.transactionNumber,
        invoiceNumber: this.search.invoiceNumber,
      };
      if (this.search.accountId == "") {
        delete object.accountId;
      }
      if (this.search.transactionNumber == "") {
        delete object.transactionNumber;
      }
      if (this.search.invoiceNumber == "") {
        delete object.invoiceNumber;
      }
      this.$router.push({ name: "EditOrder", query: object });
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
