import Service from "./../../../utils/api/service";
import Pagination from "@/components/share/pagination";
import Helper from "./../../../utils/global/func";
import TableLoading from "./../../../components/share/table-loading";
import NoItem from "./../../../components/share/table-no-item";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import { mapState } from "vuex";

export default {
  name: "ListNotification",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      fields: {
        id: "",
        index: "",
      },
      search: {
        dateRange: [],
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
        notifications: [],
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
    DatePicker,
  },
  created() {
    this.getAllNotification();
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllNotification();
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

    htmlToText(html) {
      return Helper.convertToPlain(html);
    },

    linkPage(type, index) {
      if (index >= 0) {
        this.$router.push({
          name: type,
          query: { id: this.data.notifications[index].id },
        });
      } else
        this.$router.push({
          name: type,
        });
    },

    getAllNotification() {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      let queryStartDate = this.$root.$route.query.startDate;
      let queryEndDate = this.$root.$route.query.endDate;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      if (queryStartDate != undefined)
        this.search.dateRange[0] = queryStartDate;
      if (queryEndDate != undefined) this.search.dateRange[1] = queryEndDate;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = "?limit=" + this.data.pagination.limit + "&offset=" + offset;
      if (
        this.search.dateRange.length > 0 &&
        this.search.dateRange[0] != null &&
        this.search.dateRange[1] != null
      ) {
        param =
          param +
          "&minDate=" +
          this.search.dateRange[0] +
          "&maxDate=" +
          this.search.dateRange[1];
      }

      Service.getAllNotification(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllNotification();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.notifications = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.notifications = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.notifications = [];
            this.isNoData = true;
          }
        }
      });
    },

    async searchNotification() {
      this.isFetching = true;
      this.isNoData = false;
      this.data.notifications = [];

      const query = Object.assign({}, this.$route.query);

      let startDate = this.search.dateRange[0];
      let endDate = this.search.dateRange[1];
      query.startDate = startDate;
      query.endDate = endDate;

      query.page = 1;
      await this.$router.push({ query });
    },

    filter() {
      let startDate = this.search.startDate;
      let endDate = this.search.endDate;
      let limit = this.data.limit;

      if (startDate && endDate) {
        Service.getFilterNotification(limit, startDate, endDate).then(
          (response) => {
            if (response.statusCode) {
              if (response.statusCode == "4410") {
                Service.refreshToken().then((response) => {
                  if (response == "ok") {
                    this.filter();
                  }
                });
              } else {
                this.$toasted.show(response.message.capitalize());
              }
            } else {
              this.data.notifications = response.data;
            }
          }
        );
      }
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
    },

    deleteNotification() {
      this.isDeleting = true;
      let notificationId = this.data.notifications[
        this.display.modal.delete.index
      ].id;
      Service.deleteNotification(notificationId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteNotification();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.notifications.splice(this.display.modal.delete.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Notification has been deleted.");
          this.closeModal();
        }
      });
    },

    imagePreview(index) {
      if (this.data.notifications[index].imageUrl) {
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
  },
};
