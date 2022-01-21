import Service from "./../../../utils/api/service";
import Pagination from "@/components/share/pagination";
import Helper from "./../../../utils/global/func";
import TableLoading from "./../../../components/share/table-loading";
import NoItem from "./../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListReview",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      search: {
        type: "product",
        status: "",
      },
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
          imagePreview: {
            show: false,
            index: "",
          },
        },
      },
      data: {
        limit: 10,
        detail: {},
        reviews: [],
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
    this.getAllReview();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllReview();
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

    getFullImage(path) {
      return Helper.getFullImage(path);
    },

    getAllReview() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let status = this.$root.$route.query.status;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (status != undefined) this.search.status = status;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "";

      if (this.search.status) {
        param =
          "?type=" +
          this.search.type +
          "&status=" +
          this.search.status +
          "&limit=" +
          this.data.pagination.limit +
          "&offset=" +
          offset;
      } else {
        param =
          "?type=" +
          this.search.type +
          "&limit=" +
          this.data.pagination.limit +
          "&offset=" +
          offset;
      }

      Service.getAllReview(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllReview();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.reviews = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.reviews = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.reviews = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    async filterSearch() {
      const query = Object.assign({}, this.$route.query);
      query.type = this.search.type;
      query.status = this.search.status;
      await this.$router.push({ query });
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
    },

    deleteReview() {
      this.isDeleting = true;
      let data = this.data.reviews[this.display.modal.delete.index];

      let body = {
        refId: data.refId,
        accountId: data.accountId,
        type: data.type,
      };

      Service.deleteReview(body).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteReview();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.reviews.splice(this.display.modal.delete.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Review has been deleted.");
          this.closeModal();
        }
      });
    },

    imagePreview(index) {
      if (this.data.reviews[index].imageUrl) {
        this.display.modal.imagePreview.index = index;
        this.display.modal.imagePreview.show = true;
      }
    },

    closeModal() {
      this.display = {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
          imagePreview: {
            show: false,
            index: "",
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
