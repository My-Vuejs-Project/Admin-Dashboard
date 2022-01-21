import Service from "../../../utils/api/service";
import TableLoading from './../../../components/share/table-loading'
export default {
  name: "EditShipping",
  data() {
    return {
      isUpdating: false,
      isFetching: false,
      body: {
        courierName: "",
        courierNumber: "",
        courierCode: "",
      },
    };
  },
  components: {
    TableLoading
  },
  computed: {},
  created() {
    this.getShippingDetail()
  },
  methods: {
    goBack() {
      this.$router.push({ name: "ListShipping" });
    },
    getShippingDetail() {
      this.isFetching = true
      Service.getShippingDetail(this.$route.query.id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getShippingDetail()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.isFetching = false
          this.body = {
            courierName: response.data.courierName,
            courierNumber: response.data.courierNumber,
            courierCode: response.data.courierCode,
          }
        }
      })
    },
    submitUpdateShipping(){
      let validatedMessage = this.validateBody(this.body)
      if(validatedMessage == "ok"){
        this.isUpdating = true
        this.updateShipping()
      }else{
        this.$toasted.show(validatedMessage)
      }
    },
    updateShipping() {
      let id = this.$route.query.id
      Service.updateShipping(id, this.body).then((response) => {
        this.isUpdating = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateShipping();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.$toasted.show("Shipping has been updated.");
          this.goBack();
        }
      });
    },

    validateBody(data) {
      if (!data.courierName) {
        return "Courier name cannot be empty!"
      } else if (!data.courierNumber) {
        return "Courier number cannot be empty!"
      } else if (!data.courierCode) {
        return "Courier code cannot be empty!"
      } else {
        return "ok"
      }
    },


  },
};
