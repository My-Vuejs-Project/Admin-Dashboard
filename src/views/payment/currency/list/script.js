import Pagination from "./../../../../components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListCurrency",
  data() {
    return {
      isFetching: true,
      isNoData: false,
      data: {
        currencies: [],
      },
      search: {
        status: "",
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
      field: {
        index: "",
      },
      isDeleting: false,
      detail: {},
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllCurrency(10, 0);
  },
  mounted() {},
  watch: {
    "$route.fullPath": function() {
      this.getAllCurrency();
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
      return Helper.getFullImage(path);
    },

    getAllCurrency(limit, offset) {
      let queryStatus = this.$root.$route.query.status;
      if (queryStatus != undefined) this.search.status = queryStatus;
      let param = "";
      if (this.search.status) {
        param =
          "?status=" +
          this.search.status +
          "&limit=" +
          limit +
          "&offset=" +
          offset;
      } else {
        param = "?limit=" + limit + "&offset=" + offset;
      }

      Service.getAllCurrency(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllCurrency(limit, offset);
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
            this.data.currencies = response.data;
            this.isNoData = false;
          } else {
            this.data.currencies = [];
            this.isNoData = true;
          }
        }
      });
    },

    async searchStatus() {
      const query = Object.assign({}, this.$route.query);
      query.status = this.search.status;
      await this.$router.push({ query });
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
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

    modalDetail() {
      this.display.modal.detail = true;
    },

    deleteCurrency() {
      this.isDeleting = true;
      let index = this.display.modal.delete.index;
      let param = this.data.currencies[index].code;

      Service.deleteCurrency(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteCurrency();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.currencies.splice(index, 1);
          this.$toasted.show("Currency has been deleted.");
          this.isDeleting = false;
          this.closeModal();
        }
      });
    },

    updated(value) {
      this.data.currencies[this.field.index] = value;
    },
  },
};
