import Pagination from "./../../../../components/share/pagination";
import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";

export default {
  name: "ListChildrenTicketType",
  props: {
    id: Number
  },
  data() {
    return {
      isFetching: true,
      data: {
        ticketTypes: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
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
    NoItem
  },
  created() {
    this.getAllTicketType(this.id);
  },
  mounted() {},
  methods: {
    getFullImage(path) {
      return Helper.getFullImage(path);
    },

    htmlToText(html){
      return Helper.convertToPlain(html)
    },

    getAllTicketType(id) {
      let queryPage = this.$root.$route.query.page;
      let queryLimit = this.$root.$route.query.limit;
      if (queryPage != undefined) this.data.pagination.page = queryPage;
      if (queryLimit != undefined) this.data.pagination.limit = queryLimit;

      let offset =
        this.data.pagination.limit * this.data.pagination.page -
        this.data.pagination.limit;
      let param = id + "?limit=" + this.data.pagination.limit + "&offset=" + offset;

      Service.getTicketTypeDetail(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllTicketType(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          this.data.ticketTypes = response.data;
          this.data.pagination = Helper.calculatePagination(response.meta);
        }
      });
    },

    async searchStatus() {
      const query = Object.assign({}, this.$route.query);
      query.status = this.search.status;
      await this.$router.push({
        query
      });
    },

    popupModalDelete(index) {
      this.display.modal.delete.index = index;
      this.display.modal.delete.show = true;
    },

    closeModal() {
      this.display.modal = {
        delete: {
          index: -1,
          show: false,
        },
        large: false,
      };
    },

    modalDetail() {
      this.display.modal.detail = true;
    },

    deleteTicketType() {
      this.isDeleting = true;
      let index = this.display.modal.delete.index;
      let param = this.data.ticketTypes[index].id;

      Service.deleteTicketType(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteTicketType();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.ticketTypes.splice(index, 1);
          this.$toasted.show("Ticket type has been deleted.");
          this.isDeleting = false;
          this.closeModal();
        }
      });
    },
  },
};