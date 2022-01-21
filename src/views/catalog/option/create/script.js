import Service from "../../../../utils/api/service";

export default {
  name: "CreateOption",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
      },
      body: {
        text: "",
        type: "",
        sortOrder: ""
      },
      types: [{
          id: 1,
          label: 'Text',
          value: 'text',
        },
        {
          id: 2,
          label: 'Select',
          value: 'select',
        },
        {
          id: 3,
          label: 'Radio',
          value: 'radio',
        },
        {
          id: 4,
          label: 'Checkbox',
          value: 'checkbox',
        },
        {
          id: 5,
          label: 'Textarea',
          value: 'textarea',
        }
      ],
    };
  },
  components: {},
  computed: {},
  created() {},
  methods: {
    goBack() {
      this.$router.push({
        name: "ListOption",
        query: {
          page: 1,
          limit: 10
        },
      });
    },

    subminCreateOption() {
      if (!this.body.text) {
        this.$toasted.show("Option name cannot be empty!");
      }else if (!this.body.type) {
        this.$toasted.show("Option type cannot be empty!");
      }  
      else if (!this.body.sortOrder) {
        this.$toasted.show("Sort order cannot be empty!");
      } else {
        this.isCreating = true;
        this.createOption()
      }
    },

    createOption() {
      let body = {
        text: this.body.text,
        type: this.body.type.toLowerCase(),
        sortOrder: this.body.sortOrder,
      };

      Service.createOption(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createOption();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.resetBody();
          this.$toasted.show("Option has been created.");
        }
      });
    },

    resetBody() {
      this.body = {
        text: "",
        type: "",
        sortOrder: ""
      };
    },
  },
};