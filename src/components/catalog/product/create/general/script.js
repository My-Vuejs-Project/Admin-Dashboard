import Service from "../../../../../utils/api/service";
import Media from "./../../../../share/media";
import Helper from "./../../../../../utils/global/func";
import Multiselect from "vue-multiselect";

export default {
  name: "product_general",

  props: {
    productDetail: Object,
  },

  data() {
    return {
      data: {
        stockStatus: [],
        currencies: [],
        brands: [],
        categories: [],
        productList: [],
        options: [],
        optionValues: [],
        product: {},
        uom: []
      },
      body: {
        image: {
          file: "",
          presign: "",
          fileList: [],
        },
        name: "",
        specification: "",
        sku: "",
        code: "",
        currency: "",
        price: "",
        quantity: "",
        tax: "",
        imageUrl: "",
        shipping: true,
        status: "active",
        points: 0,
        stockStatusId: "",
        brandId: "",
        categoryId: [],
        mediaId: [],
        relatedId: [],
        optionId: [],
        uomId: "",
        relatedProduct: [],
        options: [],
      },
      loading: {
        isCreating: false,
        isUpdating: false,
      },
      display: {
        imagePreview: false,
        media: {
          single: false,
          multiple: false,
        },
        category: false,
        option: false,
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [
          {
            list: "ordered",
          },
          {
            list: "bullet",
          },
        ],
        ["image"],
      ],
      update: false,
    };
  },

  components: { Media, Multiselect },

  created() {
    this.getCategory();
    this.getAllCurrency();
    this.getStockStatus();
    this.getAllProducts();
    this.getOptions();
    this.getAllUnitOfMeasure();
  },

  watch: {
    "$route.fullPath": function () {
      this.getCategory();
      this.getAllCurrency();
      this.getStockStatus();
      this.getAllProducts();
      this.getOptions();
      this.getAllUnitOfMeasure();
    },
  },

  methods: {
    async getCategory() {
      await Service.getAllCategories("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCategory();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.categories = response.data;
        }
      });
    },

    showCheckboxes(type) {
      if (type == "category") {
        if (this.display.category) {
          this.display.category = false;
        } else {
          this.display.category = true;
        }
      } else {
        if (this.display.option) {
          this.display.option = false;
        } else {
          this.display.option = true;
        }
      }
    },

    getBrands() {
      let param = "?categoryId=" + this.body.categoryId;
      Service.getAllBrands(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getBrands();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.brands = response.data;
        }
      });
    },

    async getAllCurrency() {
      let param = "?status=active";

      await Service.getAllCurrency(param).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllCurrency();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.currencies = response.data;
        }
      });
    },

    async getStockStatus() {
      await Service.getAllStockStatus("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getStockStatus();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.stockStatus = response.data;
        }
      });
    },

    async getAllProducts() {
      let param = "?status=active";

      await Service.getAllProducts(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllProducts();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.productList = response.data;
        }
      });
    },

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

    async getAllUnitOfMeasure() {
      await Service.getAllUnitOfMeasure("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllUnitOfMeasure();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.uom = response.data;
        }
      });
    },

    closeModal() {
      this.display.imagePreview = false;
      this.display.media = {
        single: false,
        multiple: false,
      };
    },

    chooseImage(type) {
      if (type == "single") {
        this.display.media.single = true;
      } else this.display.media.multiple = true;
    },

    existedMediaCallback(media) {
      this.data.media = media;
      this.body.imageUrl = media.url;
      this.closeModal();
    },

    existedMultiMediaCallback(media) {
      this.data.mediaList = media;
      for (let index = 0; index < media.length; index++) {
        const element = media[index];
        this.body.mediaId.push(element.id);
      }

      this.closeModal();
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

    submitCreate() {
      let validatedMessage = this.validateBody(this.body);
      if (validatedMessage == "ok") {
        if (this.body.id) {
          this.loading.isUpdating = true;
          this.submitUpdateProduct();
        } else {
          this.loading.isCreating = true;
          this.submitProduct();
        }
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validateBody(data) {
      if (!data.name) {
        return "Name cannot be empty!";
      } else if (!data.shortDescription) {
        return "Short description cannot be empty!";
      } else if (!data.sku) {
        return "SKU cannot be empty!";
      } else if (!data.code) {
        return "Code cannot be empty!";
      } else if (!data.tax) {
        return "Tax cannot be empty!";
      } else if (!data.quantity) {
        return "Quantity cannot be empty!";
      } else if (!(data.imageUrl || (this.data.media && this.data.media.url))) {
        return "Image cannot be empty!";
      } else if (!data.categoryId) {
        return "Category cannot be empty!";
      } else if (this.data.brands.lenght > 0 && !data.brandId) {
        return "Brand cannot be empty!";
      } else if (!data.currency) {
        return "Currency cannot be empty!";
      } else if (!data.price) {
        return "Price cannot be empty!";
      } else if (!data.stockStatusId) {
        return "Stock Status cannot be empty!";
      } else if (!data.shipping) {
        return "Shipping cannot be empty!";
      } else if (!data.status) {
        return "Status cannot be empty!";
      } else {
        return "ok";
      }
    },

    async submitProduct() {
      this.body.relatedId = [];
      if (this.body.relatedProduct) {
        for (let index = 0; index < this.body.relatedProduct.length; index++) {
          const product = this.body.relatedProduct[index];
          this.body.relatedId.push(product.id);
        }
      }

      this.body.optionId = [];
      let categoryId = [];
      categoryId.push(this.body.categoryId);

      let body = {
        name: this.body.name,
        shortDescription: this.body.shortDescription,
        description: this.body.description,
        specification: this.body.specification,
        sku: this.body.sku,
        code: this.body.code,
        price: this.body.price,
        quantity: this.body.quantity,
        tax: this.body.tax,
        imageUrl: this.body.imageUrl,
        shipping: this.body.shipping,
        points: this.body.points,
        stockStatusId: this.body.stockStatusId,
        currency: this.body.currency,
        status: this.body.status,
        brandId: this.body.brandId,
        categoryId: categoryId,
        mediaId: this.body.mediaId,
        optionId: this.body.optionId,
        uomId: this.body.uomId,
        relatedId: this.body.relatedId,
      };

      await Service.createProduct(body).then((response) => {
        this.loading.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.submitProduct();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.update = true;
          this.body.id = response.data.id;
          this.data.product = {
            sku: this.body.sku,
            code: this.body.code,
          };
          this.$emit("createProduct", response.data);
          this.$toasted.show("Product has been created.");
        }
      });
    },

    async submitUpdateProduct() {
      this.body.relatedId = [];
      if (this.body.relatedProduct) {
        for (let index = 0; index < this.body.relatedProduct.length; index++) {
          const product = this.body.relatedProduct[index];
          this.body.relatedId.push(product.id);
        }
      }

      let categoryId = [];
      categoryId.push(this.body.categoryId);

      let body = {
        name: this.body.name,
        shortDescription: this.body.shortDescription,
        description: this.body.description,
        specification: this.body.specification,
        sku: this.body.sku,
        code: this.body.code,
        price: this.body.price,
        quantity: this.body.quantity,
        tax: this.body.tax,
        imageUrl: this.body.imageUrl,
        shipping: this.body.shipping,
        points: this.body.points,
        stockStatusId: this.body.stockStatusId,
        currency: this.body.currency,
        status: this.body.status,
        brandId: this.body.brandId,
        categoryId: categoryId,
        mediaId: this.body.mediaId,
        optionId: this.body.optionId,
        relatedId: this.body.relatedId,
      };

      if (this.data.product.sku == this.body.sku) delete body.sku;
      if (this.data.product.code == this.body.code) delete body.code;

      let id = this.body.id;
      await Service.updateProduct(id, body).then(async (response) => {
        this.loading.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.submitUpdateProduct();
              }
            });
          } else {
            this.loading.isUpdating = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.update = true;
          this.loading.isUpdating = false;
          this.$emit("updateProduct");
          this.data.product = {
            sku: this.body.sku,
            code: this.body.code,
          };
          this.$toasted.show("Product general has been updated.");
        }
      });
    },

    handleImageAdded(file, Editor, cursorLocation) {
      let body = {
        media: [
          {
            ext: file.type.split("/").pop(),
            type: "editor",
            filename: file.name,
          },
        ],
      };
      Service.uploadPresign(body).then((response) => {
        this.body.image.presign = response.data;
        this.uploadFile(file);

        let url = this.body.image.presign[0].accessUrl;
        Editor.insertEmbed(cursorLocation, "image", url);
      });
    },

    async uploadFile(file) {
      if (file) {
        let uploadUrl = this.body.image.presign[0].uploadUrl;
        await Service.uploadMedia(uploadUrl, file, file.type).then(
          (response) => {
            if (response != "ok") {
              this.$toasted.show("File upload fail!");
            }
          }
        );
      } else {
        this.$toasted.show("File cannot be empty!");
      }
    },

    toUpperCase(string) {
      return string.toUpperCase();
    },

    toCapitalLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    resetBody() {
      this.body = {
        image: {
          file: "",
          presign: "",
          fileList: [],
        },
        specification: "",
        sku: "",
        code: "",
        currency: "",
        price: "",
        quantity: "",
        tax: "",
        imageUrl: "",
        shipping: true,
        status: "active",
        points: 0,
        stockStatusId: "",
        brandId: "",
        categoryId: [],
        mediaId: [],
        relatedId: [],
        optionId: [],
        relatedProduct: [],
      };

      this.data.mediaList = [];
    },

    goBack() {
      this.$router.push({
        name: "ListProduct",
        query: {
          page: 1,
          limit: 10,
        },
      });
    },
  },
};
