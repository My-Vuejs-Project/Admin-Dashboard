import Service from "./../../../utils/api/service";

export default {
  name: "login",
  data() {
    return {
      showPassword: false,
      body: {
        email: "user0@example.com",
        password: "1234567890",
      },
      isLogin: false,
    };
  },
  components: {
  },
  created() {},
  mounted() {},
  methods: {
    login() {
      this.isLogin = true;
      let body = {
        email: this.body.email,
        password: this.body.password,
      };
      Service.login(body).then((response) => {
        this.isLogin = false;
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
        } else {
          this.$cookies.set("accountId", response.data.account_id);
          this.$cookies.set("accessToken", response.data.access_token);
          this.$cookies.set("refreshToken", response.data.refresh_token);
          location.reload();
        }
      });
    },
  },
};
