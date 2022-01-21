import Pagination from "@/components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListMerchandise",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      fields: {
        id: "",
        index: "",
      },
      search: "",
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
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
        merchandises: [],
      },
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllMerchandise();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllMerchandise();
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

    async searchMerchandise() {
      const query = Object.assign({}, this.$route.query);
      query.search = this.search;
      query.page = 1;

      await this.$router.push({ query });
    },

    getAllMerchandise() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let querySearch = this.$root.$route.query.search;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (querySearch != undefined) this.search = querySearch;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      if (this.search) {
        param = param + "&search=" + this.search;
      }

      Service.getAllMerchandise(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllMerchandise();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.merchandises = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.merchandises = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.merchandises = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    toUpperCase(string) {
      return string.toUpperCase();
    },

    popupModal(index) {
      this.fields.index = index;
      this.display.modal.delete.show = true;
    },

    deleteMerchandise() {
      this.isDeleting = true;
      let merchandiseId = this.data.merchandises[this.fields.index].id;

      Service.deleteMerchandise(merchandiseId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteMerchandise();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.merchandises.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Merchandise has been deleted.");
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
