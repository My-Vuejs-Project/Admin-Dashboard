import Pagination from "./../../../../components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import Update from "../edit";
import { mapState } from "vuex";

export default {
  name: "ListServiceTicket",
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
          large: false,
        },
      },
      data: {
        serviceTicket: [],
        detail: {},
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      search: {
        accountId: "",
      },
    };
  },
  components: {
    Pagination,
    TableLoading,
    Update,
    NoItem,
  },
  created() {
    this.getAllServiceTicket();
  },
  watch: {
    "$route.fullPath": function () {
      this.getAllServiceTicket();
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

    getAllServiceTicket() {
      this.isFetching = true;
      this.isNoData = false;
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param;

      if (this.search.accountId) {
        param =
          "?limit=" +
          this.data.pagination.limit +
          "&offset=" +
          offset +
          "&accountId=" +
          this.search.accountId;
      } else {
        param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      }
      
      Service.getAllServiceTicket(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllServiceTicket();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.serviceTicket = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.serviceTicket = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.serviceTicket = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    popupModal(index) {
      this.fields.index = index;
      this.display.modal.large = true;
      this.data.detail = this.data.serviceTicket[index];
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

    updated(value) {
      this.data.serviceTicket[this.fields.index] = value;
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
