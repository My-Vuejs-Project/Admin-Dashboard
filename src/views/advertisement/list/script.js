import Pagination from "@/components/share/pagination";
import Update from "../edit";
import Service from "./../../../utils/api/service";
import Helper from "./../../../utils/global/func";
import TableLoading from "./../../../components/share/table-loading";
import NoItem from "./../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListAdvertisement",
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
        defaultType: "",
        defaultStatus: "",
        advertisements: [],
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
    this.getAdvertisements();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAdvertisements();
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

    getAdvertisements() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let queryType = this.$root.$route.query.type;
      let queryStatus = this.$root.$route.query.status;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (queryType != undefined) this.data.defaultType = queryType;
      if (queryStatus != undefined) this.data.defaultStatus = queryStatus;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "";
      if (this.data.defaultType && this.data.defaultStatus) {
        param =
          "?type=" +
          this.data.defaultType +
          "&status=" +
          this.data.defaultStatus +
          "&limit=" +
          this.data.pagination.limit +
          "&offset=" +
          offset;
      } else if (this.data.defaultStatus) {
        param =
          "?status=" +
          this.data.defaultStatus +
          "&limit=" +
          this.data.pagination.limit +
          "&offset=" +
          offset;
      } else if (this.data.defaultType) {
        param =
          "?type=" +
          this.data.defaultType +
          "&limit=" +
          this.data.pagination.limit +
          "&offset=" +
          offset;
      } else {
        param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      }

      Service.getAllAdvertisements(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAdvertisements();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.advertisements = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.advertisements = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.advertisements = [];
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
        this.data.detail = this.data.advertisements[index];
      }
    },

    deleteAdvertise() {
      this.isDeleting = true;
      let advertisementId = this.data.advertisements[this.fields.index].id;
      Service.deleteAdvertisement(advertisementId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteAdvertise();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.advertisements.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Advertisement has been deleted.");
          this.closeModal();
        }
      });
    },

    async searchAdvertisement() {
      const query = Object.assign({}, this.$route.query);
      query.type = this.data.defaultType;
      query.status = this.data.defaultStatus;
      query.page = 1;
      await this.$router.push({ query });
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
      this.data.advertisements[this.fields.index] = value;
    },
  },
};
