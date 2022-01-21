<template>
  <div id="app">
    <div v-if="!isLogging">
      <div class="sidebar-container m-scroll">
        <Sidebar></Sidebar>
      </div>
      <Navbar></Navbar>
      <div class="wrapper-container">
        <router-view></router-view>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
</template>
<script>
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import Service from "./utils/api/service";
import VueCookies from "vue-cookies";

export default {
  name: "app",
  data() {
    return {
      isLogging: false,
    };
  },
  components: {
    Sidebar,
    Navbar,
  },
  created() {
    this.checkRouteName();
    this.getAccountDetail();
    this.getMediaDirectory();
  },
  methods: {
    checkRouteName() {
      let routeName = this.$route.name;
      if (routeName == "login") {
        this.isLogging = true;
      } else {
        this.isLogging = false;
      }
    },

    getAccountDetail() {
      let token = VueCookies.get("accessToken");
      let refreshToken = VueCookies.get("refreshToken");
      if (token || refreshToken) {
        Service.getAccountDetail().then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.getAccountDetail();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.$store.dispatch("storeAccountInfo", response.data);
          }
        });
      }
    },

    getMediaDirectory() {
      let token = VueCookies.get("accessToken");
      let refreshToken = VueCookies.get("refreshToken");

      if (token || refreshToken) {
        Service.getMediaDirectory().then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.getMediaDirectory();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.$store.dispatch("storeMediaDirectory", response.data);
          }
        });
      }
    },
  },
};
</script>
<style>
* {
  box-sizing: border-box;
}
body {
  /* font-family: var(--font-family-monospace); */
  font-display: var(--font-family-monospace);
  font-weight: 300 !important;
  margin: 0;
  padding: 0;
  background: #f6f6f6f6;
}

/* ===== Remove Arrows/Spinners in Input Number ==== */
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.option-all {
  color: #555;
  font-weight: 600;
}
.vti__dropdown-list.below {
  top: 33px;
  display: none !important ;
}
.vti__dropdown-arrow {
  display: none !important;
}
.vti__dropdown {
  padding: 12px !important;
}
.vti__input {
  padding-left: 12px !important;
  padding-top: 5px !important;
}
.sidebar-container {
  width: 235px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #19222e;
  z-index: 99;
  overflow-y: auto;
  overflow-x: hidden;
  color: var(--white);
}
.display-flex {
  display: flex;
}
.not-allowed {
  cursor: not-allowed;
  background: #cccccc24;
}
tr.hover-list {
  height: 50px;
}
input {
  outline-style: none;
  border-style: none;
  width: 100%;
  background: transparent;
}
.display-time {
  border: none !important;
}
div#editor {
  height: 200px;
}
.resize-v {
  resize: vertical;
}
i.far.fa-question-circle {
  font-size: 13px;
}

/* multiselect */
.multiselect__tags {
  border: 1px solid #ccc !important;
  min-height: 34px !important;
  font-size: 12px !important;
  padding: 4px 7px 0px 7px !important;
  overflow-y: scroll;
  max-height: 100px !important;
}

.multiselect__tag {
  background: rgb(216, 216, 216) !important;
  color: #000 !important;
  padding: 4px 25px !important;
  margin-bottom: 0 !important;
}

.multiselect__placeholder {
  font-size: 13px !important;
  margin-bottom: 0 !important;
}

.multiselect__tag-icon {
  padding-top: 0px !important;
  padding-left: 3px !important;
}
.multiselect__tag-icon:hover {
  background: none !important;
}
.multiselect__tag-icon:after {
  color: #000 !important;
}
.multiselect__single {
  margin-bottom: 0px !important;
  font-size: 14px !important;
}
.multiselect__option {
  font-size: 13px !important;
}
input.multiselect__input {
  font-size: 13px;
}
span.multiselect__single {
  color: black;
  margin-top: 2px;
}
@media screen and (max-width: 1200px) {
  .sidebar-container {
    display: none;
  }
  .wrapper-container {
    padding: 60px 5px 5px 5px;
  }
}
</style>