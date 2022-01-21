import Pagination from "./../../../../components/share/pagination";
import Service from "./../../../../utils/api/service";
import Helper from "./../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListTutorialPlaylist",
  data() {
    return {
      isFetching: true,
      isNoData: false,
      data: {
        playlist: [],
        types: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      search: {
        parentId: "",
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
    this.getTypeTutorialPlaylist();
  },
  computed: {
    ...mapState(["permissions"]),
  },
  watch: {
    "$route.fullPath": function() {
      this.getTutorialPlaylistByType();
    },
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

    selectType() {
      this.$router.replace({
        query: { page: "1" },
      });
      this.getTutorialPlaylistByType();
    },

    getTypeTutorialPlaylist() {
      Service.getTypeTutorialPlaylist().then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getTypeTutorialPlaylist();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.playlist = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.types = response.data;
          this.search.parentId = response.data[0].id;
          this.getTutorialPlaylistByType();
        }
      });
    },

    getTutorialPlaylistByType() {
      this.isFetching = true;
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;
      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param =
        "?parentId=" +
        this.search.parentId +
        "&limit=" +
        this.data.pagination.limit +
        "&offset=" +
        offset;
      Service.getTutorialPlaylistByType(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getTutorialPlaylistByType();
              }
            });
          } else if (response.statusCode == "403") {
            this.isFetching = false;
            this.isNoData = true;
            this.data.playlist = [];
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.playlist = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.playlist = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
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

    deleteTutorialPlaylist() {
      this.isDeleting = true;
      let index = this.display.modal.delete.index;
      let param = this.data.playlist[index].id;

      Service.deleteTutorialPlaylist(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteTutorialPlaylist();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
            this.closeModal();
          }
        } else {
          this.data.playlist.splice(index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Tutorial playlist method has been deleted.");
          this.isDeleting = false;
          this.closeModal();
        }
      });
    },

    updated(value) {
      this.data.playlist[this.field.index] = value;
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
