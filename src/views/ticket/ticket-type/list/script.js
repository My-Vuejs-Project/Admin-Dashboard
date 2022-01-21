import Service from "../../../../utils/api/service";
import Helper from "../../../../utils/global/func";
import TableLoading from "./../../../../components/share/table-loading";
import NoItem from "./../../../../components/share/table-no-item";
import { mapState } from "vuex";

export default {
  name: "ListTicketType",
  data() {
    return {
      isFetching: true,
      data: {
        ticketTypes: [],
      },
      search: {
        status: "",
        type: this.$route.query.type,
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
    TableLoading,
    NoItem,
  },
  created() {
    this.getAllTicketType();
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

    htmlToText(html) {
      return Helper.convertToPlain(html);
    },

    getAllTicketType(isSelectType) {
      if (!this.$route.query.type) {
        this.search.type = "service";
      }
      if (isSelectType == true) {
        this.search.status = "";
      }
      this.isFetching = true;
      let param =
        "/" +
        this.search.type +
        (this.search.status != "" ? "?status=" + this.search.status : "");

      Service.getAllTicketType(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllTicketType();
              }
            });
          } else if (response.statusCode == "403") {
            this.data.ticketTypes = [];
            this.isFetching = false;
            this.$toasted.show(response.message.capitalize());
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          this.data.ticketTypes = response.data;
          this.$router.replace({ query: { type: this.search.type } });
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
