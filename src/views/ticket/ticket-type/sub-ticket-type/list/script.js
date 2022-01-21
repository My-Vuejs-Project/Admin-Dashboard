import Service from "../../../../../utils/api/service";
import Helper from "../../../../../utils/global/func";
import TableLoading from "./../../../../../components/share/table-loading";
import NoItem from "./../../../../../components/share/table-no-item";

export default {
  name: "ListSubTicketType",
  props:{
    ticketSubTypes: Array
  },
  data() {
    return {
      isFetching: true,
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
    };
  },
  components: {
    TableLoading,
    NoItem
  },
  created() {
  },
  mounted() { },
  methods: {
    getFullImage(path) {
      return Helper.getFullImage(path);
    },

    htmlToText(html) {
      return Helper.convertToPlain(html)
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
      let param = this.ticketSubTypes[index].id;

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
          this.ticketSubTypes.splice(index, 1);
          this.$toasted.show("Sub type has been deleted.");
          this.isDeleting = false;
          this.closeModal();
        }
      });
    },
  },
};