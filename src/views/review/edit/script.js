import Service from "../../../utils/api/service";
import Helper from "./../../../utils/global/func";
import StarRating from "vue-star-rating";

export default {
  name: "EditReview",
  props: {},
  data() {
    return {
      isUpdating: false,
      media: {
        mediaUrl: "",
        mediaId: "",
      },
      display: {
        imagePreview: false,
      },
      body: {
        image: {
          file: "",
          presign: "",
        },
        detail: { ...this.$attrs.review },
      },
    };
  },
  components: {
    StarRating,
  },
  computed: {},
  created() {
    this.getReview();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListReview",
        query: { page: 1, limit: 10 },
      });
    },

    getReview() {
      if (this.$attrs.review) {
        let body = {
          refId: this.$attrs.review.refId,
          accountId: this.$attrs.review.accountId,
          type: this.$attrs.review.type,
        };

        Service.getReviewDetail(body).then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.getReview();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.body.detail = response.data;
          }
        });
      }
    },

    closeModal() {
      this.display.imagePreview = false;
    },

    imagePreview() {
      if (this.body.detail.product.imageUrl) {
        this.display.imagePreview = true;
      }
    },

    getFullImage(path) {
      return Helper.getFullImage(path);
    },

    getNameFromUrl(url) {
      return url.split("/").pop();
    },

    confirmUpdate() {
      let validatedMessage = this.validatedBody(this.body.detail);
      if (validatedMessage == "ok") {
        this.isUpdating = true;
        this.updateReview();
      } else {
        this.$toasted.show(validatedMessage);
      }
    },

    validatedBody(data) {
      if (!data.rating) {
        return "Rating cannot be empty!";
      } else if (!data.text) {
        return "Text cannot be empty!";
      } else if (!data.status) {
        return "Status cannot be empty!";
      } else {
        return "ok";
      }
    },

    updateReview() {
      if (this.body.detail) {
        let body = {
          refId: this.body.detail.refId,
          accountId: this.body.detail.accountId,
          type: this.body.detail.type,
          text: this.body.detail.text,
          rating: this.body.detail.rating,
          status: this.body.detail.status,
        };

        Service.updateReview(body).then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.updateReview();
                }
              });
            } else {
              this.isUpdating = false;
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.isUpdating = false;
            this.goBack();
            this.$toasted.show("Review has been updated.");
          }
        });
      }
    },
  },
};
