import Pagination from "@/components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../share/table-loading";
import NoItem from "./../../../share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListOptionValue",
  props: {
    id: Number,
  },
  data() {
    return {
      isFetching: true,
      isDeleting: false,
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
        optionValues: [],
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
    NoItem
  },
  created() {
    this.getAllOptionValue(this.id);
  },
  watch: {
    "$route.fullPath": function() {
      this.getAllOptionValue(this.id);
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

    getAllOptionValue(id) {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;

      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param =
        "?optionId=" +
        id +
        "limit=" +
        this.data.pagination.limit +
        "&offset=" +
        offset;

      Service.getAllOptionValue(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllOptionValue(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          this.data.optionValues = response.data;
          this.data.pagination = Helper.calculatePagination(response.meta);
        }
      });
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

    popupModal(index) {
      this.fields.index = index;
      this.display.modal.delete.show = true;
    },

    deleteOptionValue() {
      this.isDeleting = true;
      let optionValueId = this.data.optionValues[this.fields.index].id;

      Service.deleteOptionValue(optionValueId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteOptionValue();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.optionValues.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Option value has been deleted.");
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
