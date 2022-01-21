import Pagination from "./../../../../components/share/pagination";
import Update from "../edit";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListCategory",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      search: {
        startDate: null,
        endDate: null,
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
          large: false,
        },
      },
      data: {
        defaultType: "banner",
        defaultStatus: "",
        categories: [],
        detail: {},
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
    Update,
    TableLoading,
    NoItem,
  },
  created() {
    this.getCategory();
  },
  watch: {
    "$route.fullPath": function() {
      this.getCategory();
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
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    getCategory() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param =
        "/ROOT" + "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      Service.getAllCategories(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCategory();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.categories = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.categories = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.categories = [];
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
      } else {
        this.display.modal.large = true;
        this.data.detail = this.data.categories[index];
      }
    },

    deleteCategory() {
      this.isDeleting = true;
      let categoryId = this.data.categories[this.fields.index].id;
      Service.deleteCategory(categoryId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteCategory();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.categories.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Category has been deleted.");
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

    updated(value) {
      this.data.categories[this.fields.index] = value;
    },
  },
};
