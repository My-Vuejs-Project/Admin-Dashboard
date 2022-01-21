import Service from "../../../../utils/api/service";
import OptionValue from "./../../../../components/catalog/option-value/list";

export default {
  name: "EditOption",
  data() {
    return {
      isUpdating: false,
      data: {},
      types: [
        {
          id: 1,
          label: "Text",
        },
        {
          id: 2,
          label: "Select",
        },
        {
          id: 3,
          label: "Radio",
        },
        {
          id: 4,
          label: "Checkbox",
        },
        {
          id: 5,
          label: "Textarea",
        },
      ],
    };
  },
  components: { OptionValue },
  computed: {},
  created() {
    this.getOptionDetail(this.$route.query.id);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListOption",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },

    getOptionDetail(id) {
      Service.getOptionDetail(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOptionDetail(id);
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data = response.data;
        }
      });
    },

    subminUpdateOption() {
      if (!this.data.text) {
        this.$toasted.show("Option name cannot be empty!");
      } else if (!this.data.type) {
        this.$toasted.show("Option type cannot be empty!");
      } else if (!this.data.sortOrder) {
        this.$toasted.show("Sort order cannot be empty!");
      } else {
        this.isUpdating = true;
        this.updateOption();
      }
    },

    updateOption() {
      let id = this.$route.query.id;
      let body = {
        text: this.data.text,
        type: this.data.type.toLowerCase(),
        sortOrder: this.data.sortOrder,
      };

      Service.updateOption(id, body).then((response) => {
        this.isUpdating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.updateOption();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.goBack();
          this.$toasted.show("Option type has been updated.");
        }
      });
    },
  
    stringToNumber(id){
      return parseInt(id)
    },
  },
};
