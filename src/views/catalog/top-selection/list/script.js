import Pagination from "@/components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListTopSelection",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isUpdating: false,
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
          update: {
            data: "",
            show: false,
            index: -1,
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
      },
    };
  },
  components: {
    Pagination,
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllTopSelection();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllTopSelection();
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

    getAllTopSelection() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      Service.getAllTopSelection(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllTopSelection();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.topSelection = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.topSelection = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.topSelection = [];
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

    roundInt(int){
      return +int.toFixed(2)
    },

    popupModal(index) {
      this.fields.index = index;
      this.display.modal.delete.show = true;
    },

    deleteTopSelection() {
      this.isDeleting = true;
      let topSelectionId = this.data.topSelection[this.fields.index].id;
      Service.deleteTopSelection(topSelectionId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteTopSelection();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.topSelection.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Top selection product has been deleted.");
          this.closeModal();
        }
      });
    },

    displayFormUpdate(index) {
      var topSelection = this.data.topSelection[index];
      this.display.modal.update.data = {
        id: topSelection.id,
        name: topSelection.name,
        code: topSelection.code,
        imageUrl: topSelection.imageUrl,
        price: topSelection.price,
        sortOrder: topSelection.sortOrder,
      };
      this.display.modal.update.show = true;
      this.display.modal.update.index = index;
    },

    confirmUpdate() {
      this.isUpdating = true;
      let productId = this.display.modal.update.data.id;
      let body = {
        sortOrder: this.display.modal.update.data.sortOrder,
      };

      Service.updateTopSelection(productId, body).then((response) => {
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
          this.$toasted.show("Top selection product has been updated.");
          this.closeModal();
          this.getAllTopSelection()
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
          update: {
            data: "",
            show: false,
            index: -1,
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

    updated(value) {
      this.data.brands[this.fields.index] = value;
    },
  },
};
