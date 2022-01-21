import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import Pagination from "@/components/share/pagination";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";
import Multiselect from "vue-multiselect";

export default {
  name: "ListZoneToGeoZone",
  data() {
    return {
      isFetching: true,
      isDeleting: false,
      isNoData: false,
      isFetchingZone: true,
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
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      geoZone: ""
    };
  },
  components: {
    TableLoading,
    Pagination,
    NoItem,
    Multiselect
  },
  created() {
    this.getGeoZone();
  },
  watch: {
    "$route.fullPath": function() {
      this.getZoneToGeoZone();
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

    getGeoZone() {
      let param = "?all=true";
      Service.getAllGeoZone(param).then((response) => {
        this.isFetchingZone = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getGeoZone();
              }
            });
          } else if (response.statusCode == "403" || response.statusCode == "400") {
            this.data.zoneToGeoZone = [];
            this.isFetching = false;
            this.isNoData = true;
            this.$toasted.show(response.message.capitalize());
          } else {
            this.data.zoneToGeoZone = "";
            this.isFetching = true;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.geoZone = response.data;
          this.geoZone =  response.data[0]
          this.selectGeoZone()
        }
      });
    },

    selectGeoZone() {
      this.isNoData = false;
      if (this.$root.$route.query.page != 1) {
        this.$router.replace({ query: { page: 1 } });
      }
      let _this = this
      setTimeout(function() { 
        _this.getZoneToGeoZone()
       }, 100)

    },

    getZoneToGeoZone() {
      this.isFetching = true;
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset = this.data.pagination.limit * this.data.pagination.page - this.data.pagination.limit;
      let param = 
      "?limit=" + this.data.pagination.limit + 
      "&offset=" + offset +
      "&geoZoneId=" + this.geoZone.id
      Service.getAllZoneToGeoZone(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getZoneToGeoZone();
              }
            });
          } else if (response.statusCode == "403" || response.statusCode == "400") {
            this.data.zoneToGeoZone = [];
            this.isFetching = false;
            this.isNoData = true;
            this.$toasted.show(response.message.capitalize());
          } else {
            this.data.zoneToGeoZone = "";
            this.isFetching = true;
            this.$toasted.show(response.message.capitalize());
          }
          this.resetPagination();
        } else {
          this.isFetching = false;
          if (response.data.length > 0) {
            this.isNoData = false;
            this.data.zoneToGeoZone = response.data;
            this.data.pagination = Helper.calculatePagination(response.meta);
          } else {
            this.data.zoneToGeoZone = [];
            this.isNoData = true;
            this.resetPagination();
          }
        }
      });
    },

    popupModal(index) {
      this.fields.index = index;
      this.display.modal.delete.show = true;
    },

    deleteZoneToGeoZone() {
      this.isDeleting = true;
      let zoneToGeoZone = this.data.zoneToGeoZone[this.fields.index].id;
      Service.deleteZoneToGeoZone(zoneToGeoZone).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteZoneToGeoZone();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.data.zoneToGeoZone.splice(this.fields.index, 1);
          this.data.pagination.total -= 1;
          this.$toasted.show("Zone to geo zone has been deleted.");
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
  },
};
