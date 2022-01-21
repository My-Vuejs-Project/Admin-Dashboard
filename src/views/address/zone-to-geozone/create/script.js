import Service from "../../../../utils/api/service";
import TableLoading from "./../../../../components/share/table-loading";
import Multiselect from "vue-multiselect";
export default {
  name: "CreateZoneToGeoZone",
  data() {
    return {
      isFetching: true,
      isCreating: false,
      data: {
        country:[],
        province:[],
        district:[]
      },
      models: {
        geoZone: "",
        country: "",
        province: "",
        district: ""
      }
    };
  },
  components: {
    TableLoading,Multiselect
  },
  computed: {},
  created() { 
    this.getGeoZone()
    this.getCountry()
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ListZoneToGeoZone",
        // query: { page: 1, limit: 10 },
      });
    },

    getGeoZone() {
      let param = "?all=true"
      Service.getAllGeoZone(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getGeoZone();
              }
            });
          } else {
            this.isFetching = true;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.isFetching = false;
          this.data.geoZone = response.data;
          this.models.geoZone = response.data[0]
        }
      });
    },

    getCountry(){
      Service.getCountry().then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCountry();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.country = response.data;
          this.models.country = response.data[0];
          this.getProvince()
        }
      });
    },

    getProvince(){
      let _this = this
      setTimeout(function() { 
        let param = "?all=true&countryId=" + _this.models.country.id
        Service.getProvince(param).then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  _this.getProvince();
                }
              });
            } else {
              _this.$toasted.show(response.message.capitalize());
            }
          } else {
            _this.data.province = response.data;
            _this.models.province = response.data[0] ;
            _this.getDistrict()
          }
        });
      }, 100)
    },
    getDistrict(){
      let _this = this
      setTimeout(function() {
        let param = "?all=true&provinceId=" + _this.models.province.id
        Service.getDistrict(param).then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  _this.getDistrict();
                }
              });
            } else {
              _this.$toasted.show(response.message.capitalize());
            }
          } else {
            _this.data.district = response.data;
            if (_this.data.district.length == 0){
              _this.models.district = ""
              return
            }
            _this.models.district = response.data[0]
          }
        });
      }, 100)
    },

    subminCreateZoneToGeoZone() {
      if (!this.models.geoZone) {
        this.$toasted.show("GeoZone cannot be empty!");
      } else if (!this.models.country) {
        this.$toasted.show("Country cannot be empty!");
      } else if (!this.models.province) {
        this.$toasted.show("Province cannot be empty!");
      } else if (!this.models.district) {
        this.$toasted.show("DistrictId cannot be empty!");
      } else {
        this.isCreating = true;
        this.createZoneToGeoZone()
      }
    },

    createZoneToGeoZone() {
      let body = {
        geoZoneId: this.models.geoZone.id,
        countryId: this.models.country.id,
        provinceId: this.models.province.id,
        districtId: this.models.district.id
      };

      Service.createZoneToGeoZone(body).then((response) => {
        this.isCreating = false;
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createZoneToGeoZone();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          // this.resetBody();
          this.$toasted.show("Zone to geo zone has been created.");
        }
      });
    },

    resetBody() {
      this.models.geoZone = ""
      this.models.country = ""
      this.models.province= ""
      this.models.district= ""
    },
  },
};
