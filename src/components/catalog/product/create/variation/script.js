import Service from "./../../../../../utils/api/service";
import Media from "./../../../../../components/share/media";
import Helper from "./../../../../../utils/global/func";

export default {
  name: "product_variation",
  props: {
    productGeneral: Object,
  },
  data() {
    return {
      data: {
        options: [],
        optionValues: [],
      },
      body: {
        image: {
          file: "",
          presign: "",
          fileList: [],
        },
      },
      display: {
        media: {
          single: false,
          multiple: false,
        },
        modal: {
          delete: {
            index: "",
            show: false,
          },
          large: false,
        },
      },
      model: {
        addVariant: {
          optionSelected: [],
          name: "",
          sku: "000-001",
          code: "000-001",
          price: 0,
          imageUrl: "",
          tax: 0,
          quantity: 1,
          sortOrder: 1,
        },
        optionIndex: 0,
        optionValueIndex: 0,
        variants: [],
        editImage: {
          status: false,
          index: "",
        },
      },
      dialog: {
        visible: false,
        text: "",
      },
      isEditing: {
        index: -1,
      },
      isDeleting: false,
    };
  },
  components: { Media },
  created() {
    this.getOptions();
  },
  methods: {
    async getOptions() {
      await Service.getAllOption("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOptions();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.options = response.data;
        }
      });
    },

    async getOptionValue(optionId) {
      let param = "?optionId=" + optionId;

      return await Service.getAllOptionValue(param).then(async (response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllOptionValue(optionId);
              }
            });
          } else {
            return;
          }
        } else {
          return response.data;
        }
      });
    },

    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },

    async addOption() {
      if (this.model.variants.length < 1) {
        let optionId = this.data.options[this.model.optionIndex].id;
        let isExist = this.model.addVariant.optionSelected.filter((element) => {
          return element.option.id == optionId;
        });

        if (isExist.length < 1) {
          let values = await this.getOptionValue(optionId);

          let obj = {
            option: this.data.options[this.model.optionIndex],
            optionValues: values,
            optionValueSelectedIndex: 0,
          };
          this.model.addVariant.optionSelected.push(obj);
        } else {
          this.$toasted.show("This option is already selected.");
        }
      } else {
        this.dialog.visible = true;
        this.dialog.text =
          "If you add new option, product variant will be remove automatically.";
      }
    },

    async isVariantExist() {
      let variants = this.model.variants;
      if (variants.length > 0) {
        let variantSelected = [];
        for (let i = 0; i < variants.length; i++) {
          let options = variants[i].options;
          let optionValueSelected = [];

          for (let k = 0; k < options.length; k++) {
            optionValueSelected.push(options[k].optionValue.id);
          }
          variantSelected.push(optionValueSelected);
        }

        let optionList = this.model.addVariant.optionSelected;
        let optionSelected = [];
        for (let k = 0; k < optionList.length; k++) {
          let option = optionList[k];
          let valueId = option.optionValues[option.optionValueSelectedIndex].id;
          optionSelected.push(valueId);
        }

        for (let j = 0; j < variantSelected.length; j++) {
          let variant = variantSelected[j];
          if (JSON.stringify(variant) == JSON.stringify(optionSelected)) {
            this.$toasted.show("This variant is already added.");
            return true;
          }
        }
      }

      return false;
    },

    async addVariant() {
      this.isVariantExist().then(async (isExist) => {
        if (!isExist) {
          let options = [];
          for (
            let i = 0;
            i < this.model.addVariant.optionSelected.length;
            i++
          ) {
            let option = this.model.addVariant.optionSelected[i];
            let obj = {
              option: option.option,
              optionValue: option.optionValues[option.optionValueSelectedIndex],
            };
            options.push(obj);
          }

          let variantObj = {
            options: options,
            name: this.model.addVariant.name,
            shortDescription: this.model.addVariant.shortDescription,
            description: this.model.addVariant.description,
            imageUrl: this.model.addVariant.imageUrl,
            sku: this.model.addVariant.sku,
            code: this.model.addVariant.code,
            price: this.model.addVariant.price,
            tax: this.model.addVariant.tax,
            quantity: this.model.addVariant.quantity,
            sortOrder: this.model.addVariant.sortOrder,
          };

          this.model.variants.push(variantObj);
          this.clearVariantValue();
        }
      });
    },

    removeVariant(index) {
      this.model.variants.splice(index, 1);
    },

    editVariant(variantIndex) {
      if (this.isEditing.index == -1) {
        this.isEditing.index = variantIndex;
      } else {
        this.$toasted.show("Please finish your current editing first!");
      }
    },

    removeAllProductVariant() {
      this.model.variants = [];
    },

    clearProductVariant() {
      this.model.variants = [];
      this.dialog.visible = false;
      this.dialog.text = "";
    },

    clearVariantValue() {
      this.model.addVariant.name = "";
      this.model.addVariant.shortDescription = "";
      this.model.addVariant.description = "";
      this.model.addVariant.imageUrl = "";
      this.model.addVariant.sku = "000-001";
      this.model.addVariant.code = "000-001";
      this.model.addVariant.price = 0;
      this.model.addVariant.tax = 0;
      this.model.addVariant.quantity = 1;
      this.model.addVariant.sortOrder = 1;
    },

    async addOptionsToProduct() {
      let options = [];
      for (let i = 0; i < this.model.variants[0].options.length; i++) {
        options.push(this.model.variants[0].options[i].option.id);
      }

      let productId = this.productGeneral.id;
      let body = {
        optionId: options,
      };

      await Service.updateProduct(productId, body)
        .then(async (response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.addOptionsToProduct();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.submitProductVariant();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submitProductVariant() {
      for (let i = 0; i < this.model.variants.length; i++) {
        let variant = this.model.variants[i];
        this.createProductVariant(variant, i);
      }
    },

    async createProductVariant(variant, index) {
      let options = [];
      for (let i = 0; i < variant.options.length; i++) {
        let option = {
          optionId: variant.options[i].option.id,
          optionValueId: variant.options[i].optionValue.id,
        };
        options.push(option);
      }

      let body = {
        productId: this.productGeneral.id,
        name: variant.name,
        shortDescription: variant.shortDescription,
        description: variant.description,
        imageUrl: variant.imageUrl,
        sku: variant.sku,
        code: variant.code,
        price: parseInt(variant.price),
        tax: parseInt(variant.tax),
        quantity: parseInt(variant.quantity),
        sortOrder: parseInt(variant.sortOrder),
        options: options,
      };

      await Service.createProductVariant(body)
        .then(async (response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.createProductVariant();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            if (index == this.model.variants.length - 1) {
              this.clearProductVariant();
              this.clearVariantValue();
              this.$toasted.show(response.message.capitalize());
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submitRemoveVariant(variantIndex) {
      this.display.modal.delete.show = true;
      this.display.modal.delete.index = variantIndex;
    },

    deleteProductVariant() {
      this.isDeleting = true;
      let variantId = this.model.variants[this.display.modal.delete.index].id;

      Service.deleteProductVariant(variantId).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteProductVariant();
              }
            });
          } else {
            this.isDeleting = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isDeleting = false;
          this.model.variants.splice(this.display.modal.delete.index, 1);
          this.$toasted.show("Variant has been deleted.");
          this.closeModal();
        }
      });
    },

    htmlToText(html) {
      return Helper.convertToPlain(html);
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      if (dev == "DEVELOPMENT") {
        return Helper.getFullImage(path);
      } else return path;
    },

    getNameFromUrl(url) {
      return url.split("/").pop();
    },

    chooseImage(index) {
      this.display.media.single = true;
      if (this.model.variants[index]) {
        this.model.editImage.status = true;
        this.model.editImage.index = index;
      }
    },

    existedMediaCallback(media) {
      if (this.model.editImage.status) {
        this.model.variants[this.model.editImage.index].imageUrl = media.url;
      } else {
        this.data.media = media;
        this.model.addVariant.imageUrl = media.url;
      }
      this.closeModal();
    },

    closeModal() {
      this.display = {
        media: {
          single: false,
          multiple: false,
        },
        modal: {
          delete: {
            index: "",
            show: false,
          },
          large: false,
        },
      };

      this.model.editImage = {
        status: false,
        index: "",
      };
    },
  },
};
