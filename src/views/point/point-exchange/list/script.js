import Pagination from "./../../../../components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListPointExchange",
  data() {
    return {
      isFetching: true,
      isUpdating: false,
      isNoData: false,
      data: {
        points: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      search: {
        text: "",
        status: "",
      },
      update: {
        data: "",
        show: false,
        index: -1,
      },
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllPointExchange();
  },
  mounted() {},
  watch: {
    "$route.fullPath": function() {
      this.getAllPointExchange();
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

    async searchStatus() {
      const query = Object.assign({}, this.$route.query);
      query.search = this.search.text;
      query.status = this.search.status;
      await this.$router.push({ query });
    },

    getAllPointExchange() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let querySearch = this.$root.$route.query.search;
      let queryStatus = this.$root.$route.query.status;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (querySearch != undefined) this.search.text = querySearch;
      if (queryStatus != undefined) this.search.status = queryStatus;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      if (this.search.text) {
        param = param + "&search=" + this.search.text;
      }
      if (this.search.status) {
        param = param + "&status=" + this.search.status;
      }

      Service.getAllPointExchange(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllPointExchange();
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
            this.data.points = response.data;
            this.isNoData = false;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.points = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    displayFormUpdate(index) {
      var version = this.data.points[index];
      this.update.data = {
        id: version.id,
        merchandiseImageUrl: version.merchandiseImageUrl,
        merchandiseId: version.merchandiseId,
        merchandiseName: version.merchandiseName,
        firstName: version.account.firstName,
        lastName: version.account.lastName,
        points: version.points,
        quantity: version.quantity,
        status: version.status,
      };
      this.update.show = true;
      this.update.index = index;
    },

    confirmUpdate() {
      this.isUpdating = true;
      let id = this.update.data.id;
      let body = {
        status: this.update.data.status,
      };

      Service.updatePointExchange(id, body).then((response) => {
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
          this.data.points[this.update.index].status = this.update.data.status;
          this.$toasted.show("Point exchange status has been updated.");
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
