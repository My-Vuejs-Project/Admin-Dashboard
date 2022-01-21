import Pagination from "./../../../../components/share/pagination";
import Service from "../../../../utils/api/service";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import Helper from "../../../../utils/global/func";
import { mapState } from "vuex";

export default {
  name: "ListProduct",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      display: {
        modal: {
          delete: {
            index: -1,
            show: false,
          },
        },
      },
      data: {
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
        productList: [],
        brands: [],
        categories: [],
      },
      search: {
        text: "",
        brandId: "",
        categoryId: "",
      },
    };
  },
  components: {
    TableLoading,
    NoItem,
    Pagination,
  },
  created() {
    this.getAllProducts();
    this.getBrands();
    this.getCategory();
  },
  mounted() {},
  watch: {
    "$route.fullPath": function() {
      this.getAllProducts();
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

    async getBrands() {
      await Service.getAllBrands("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getBrands();
              }
            });
          }
        } else {
          this.data.brands = response.data;
        }
      });
    },

    async getCategory() {
      await Service.getAllCategories("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCategory();
              }
            });
          }
        } else {
          this.data.categories = response.data;
        }
      });
    },

    getAllProducts() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let querySearch = this.$root.$route.query.search;
      let queryBrand = this.$root.$route.query.brandId;
      let queryCategory = this.$root.$route.query.categoryId;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (querySearch != undefined) this.search.text = querySearch;
      if (queryBrand != undefined) this.search.brandId = queryBrand;
      if (queryCategory != undefined) this.search.categoryId = queryCategory;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      if (this.search.text) {
        param = param + "&search=" + this.search.text;
      }
      if (this.search.brandId) {
        param = param + "&brandId=" + this.search.brandId;
      }
      if (this.search.categoryId) {
        param = param + "&categoryId=" + this.search.categoryId;
      }

      Service.getAllProducts(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllProducts();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.productList = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.productList = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.productList = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    async searchProduct() {
      const query = Object.assign({}, this.$route.query);
      query.search = this.search.text;
      query.brandId = this.search.brandId;
      query.categoryId = this.search.categoryId;
      query.page = 1;
      await this.$router.push({ query });
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
    },

    deleteProduct() {
      this.isDeleting = true;
      let productId = this.data.productList[this.display.modal.delete.index].id;
      Service.deleteProduct(productId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteProduct();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.productList.splice(this.display.modal.delete.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Product has been deleted.");
          this.closeModal();
        }
      });
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    roundInt(int){
      return int.toFixed(2)
    },

    closeModal() {
      this.display = {
        modal: {
          delete: {
            index: -1,
            show: false,
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
