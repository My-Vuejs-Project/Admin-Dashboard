import Pagination from "./../../../../components/share/pagination";
import Update from "../../../../views/catalog/category/subcategory/edit";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";

export default {
  name: "ListSubcategory",
  props: {
    id: Number
  },
  data() {
    return {
      isFetching: true,
      isDeleting: false,
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
        subcategories: [],
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
  },
  created() {
    this.getSubcategories(this.id);
  },
  watch: {
    "$route.fullPath": function () {
      this.getSubcategories(this.id);
    },
  },
  mounted() {},
  methods: {
    getFullImage(path) {
      let dev = path.split('/')[0]
      if (dev == 'DEVELOPMENT') {
        return Helper.getFullImage(path);
      } else return path
    },

    getSubcategories(id) {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "/" + id + "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      Service.getAllCategories(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getSubcategories();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          this.data.subcategories = response.data;
          this.data.pagination = Helper.calculatePagination(response.meta);
        }
      });
    },

    popupModal(type, index) {
      this.fields.index = index;
      if (type == "delete") {
        this.display.modal.delete.show = true;
      } else {
        this.display.modal.large = true;
        this.data.detail = this.data.subcategories[index];
      }
    },

    deleteSubcategory() {
      this.isDeleting = true;
      let categoryId = this.data.subcategories[this.fields.index].id;

      Service.deleteCategory(categoryId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteSubcategory();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.subcategories.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Subcategory has been deleted.");
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
  },
};