import Service from "../../../../utils/api/service";
import TableLoading from '../../../../components/share/table-loading'
export default {
  name: "EditOrder",
  data() {
    return {
      isUpdating: false,
      isFetching: true,
      body: {
        orderStatusId: "",
        text:""
      },
      data:{
        orderDetail: "",
        orderStatus: []
      }
    };
  },
  components: {
    TableLoading
  },
  computed: {},
  created() {
    this.getOrderDetail()
    this.getAllOrderStatus()
  },
  methods: {
    goBack() {
      let query = this.$root.$route.query
      delete query.id
      this.$router.push({ 
        name: "ListOrder",
        query: query
    });
    },
    getOrderDetail() {
      Service.getOrderDetail(this.$route.query.id).then((response) => {
        this.isFetching = false
        if (response.statusCode) {
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getOrderDetail()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
     
          this.data.orderDetail = response.data
          this.body.orderStatusId = response.data.orderStatus.id
        }
      })
    },
    getAllOrderStatus() {
      Service.getAllOrderStatus("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getAllOrderStatus()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.data.orderStatus = response.data
        }
      })
    },
    submitUpdateOrder(){
      let validatedMessage = this.validateBody(this.body)
      if(validatedMessage == "ok"){
        this.isUpdating = true
        this.updateOrder()
      }else{
        this.$toasted.show(validatedMessage)
      }
    },
    updateOrder() {
      let id = this.$route.query.id
      if (this.body.text == "") { delete this.body.text }
      Service.updateOrder(id, this.body).then((response) => {
        this.isUpdating = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateOrder();
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
      if (!data.orderStatusId) {
        return "Status cannot be empty!"
      } else {
        return "ok"
      }
    },
  },
};
