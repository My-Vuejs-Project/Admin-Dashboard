import Service from "../../../utils/api/service";
import Helper from './../../../utils/global/func'
import VueTimepicker from 'vue2-timepicker/src/vue-timepicker.vue'
import Media from "./../../../components/share/media"
import Map from "./../../../components/share/map"
import Multiselect from "vue-multiselect";
export default {
  name: "CreateShowroom",
  data() {
    return {
      isCreating: false,
      display: {
        imagePreview: false,
        media: false,
        url: "",
        chooseImageType: ""
      },
      body: {
        name: "",
        phone: "",
        description: "",
        thumbnailUrl: "",
        workingDays: "",
        openingHours: "",
        closingHours: "",
        lat: 0,
        lng: 0,
        houseNo: "",
        street: "",
        countryId: "",
        provinceId: "",
        districtId: "",
        mediaId: [],
        status: "active",
      },
      data: {
        country: [],
        province: [],
        district: [],
        single: {
          media: ""
        },
        multiple: {
          media: []
        }
      },
      map: {
        isOpenMap: false,
        locPlaces: "",
        location: ""
      },
      models: {
        country: "",
        province: "",
        district: ""
      }
    };
  },
  components: {
    Media,
    VueTimepicker,
    Map,
    Multiselect
  },
  created() {
    this.getCountry()
  },
  methods: {
    existedLocPlaces(places){
      this.map.locPlaces = places
      this.map.location = places.geometry.location
      this.body.lat = places.geometry.location.lat
      this.body.lng = places.geometry.location.lng
      this.handleMap(false)
    },
    handleMap(isOpen) {
      this.map.isOpenMap = isOpen
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

    checkFormatTime(type) {
      if (type == "openingHours") {
        this.body.openingHours = Number.isNaN(Helper.timeToMillisecond(this.body.openingHours)) ? "" : this.body.openingHours
      } else {
        this.body.closingHours = Number.isNaN(Helper.timeToMillisecond(this.body.closingHours)) ? "" : this.body.closingHours
      }
    },

    goBack() {
      this.$router.push({
        name: "ListShowroom"
      });
    },

    imagePreview(url) {
      if (url) {
        this.display.imagePreview = true
        this.display.url = url
      }
    },

    closeModal() {
      this.display.imagePreview = false
      this.display.media = false
    },

    chooseImage(chooseImageType) {
      this.display.media = true
      this.display.chooseImageType = chooseImageType
    },

    getFullImage(path) {
      let dev = path.split('/')[0]
      if (dev == 'DEVELOPMENT') {
        return Helper.getFullImage(path);
      } else return path
    },

    getNameFromUrl(url) {
      return url.split('/').pop()
    },

    existedMediaCallback(media) {
      this.data.single.media = media
      this.body.thumbnailUrl = media.url
      this.closeModal()
    },

    existedMultiMediaCallback(media) {
      this.data.multiple.media = media
      this.body.mediaId = []
      media.forEach((value) => {
        this.body.mediaId.push(parseInt(value.id));
      });
      this.closeModal()
    },
    submitCreateShowroom() {
      let validatedMessage = this.validateBody(this.body)
      if (validatedMessage == "ok") {
        this.isCreating = true
        this.createShowroom()
      } else {
        this.$toasted.show(validatedMessage)
      }
    },
    createShowroom() {
      this.body.countryId = parseInt(this.models.country.id)
      this.body.provinceId = parseInt(this.models.province.id)
      this.body.districtId = parseInt(this.models.district.id)
      this.body.lat = parseFloat(this.body.lat)
      this.body.lng = parseFloat(this.body.lng)
      Service.createShowroom(this.body).then((response) => {
        this.isCreating = false
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.createShowroom()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.resetBody()
          this.$toasted.show("Advertisement has been created.")
        }
      });
    },
    validateBody(data) {
      if (!data.thumbnailUrl) {
        return "Thumbnail cannot be empty!"
      } else if (data.mediaId.length == 0) {
        return "Image cannot be empty!"
      } else if (!data.name) {
        return "Name cannot be empty!"
      } else if (!data.phone) {
        return "Phone  cannot be empty!"
      } else if (!data.description) {
        return "Description cannot be empty!"
      } else if (!data.workingDays) {
        return "Working days cannot be empty!"
      } else if (!data.openingHours) {
        return "Opening hours  cannot be empty!"
      } else if (!data.closingHours) {
        return "Closing hours cannot be empty!"
      } else if (!data.houseNo) {
        return "House No cannot be empty!"
      } else if (!data.street) {
        return "Street cannot be empty!"
      } else if (!this.models.country) {
        return "Country cannot be empty!"
      } else if (!this.models.province) {
        return "Province cannot be empty!"
      } else if (!this.models.district) {
        return "District cannot be empty!"
      } else if (!data.status) {
        return "Status cannot be empty!"
      } else {
        return "ok"
      }
    },

    resetBody() {
      this.body = {
        name: "",
        phone: "",
        description: "",
        thumbnailUrl: "",
        workingDays: "",
        openingHours: "",
        closingHours: "",
        lat: 0,
        lng: 0,
        houseNo: "",
        street: "",
        countryId: this.body.countryId,
        provinceId: this.body.provinceId,
        districtId: this.body.districtId,
        mediaId: [],
        status: "active",
      }
      this.data.single.media = ""
      this.data.multiple.media = []
    }
  },
};