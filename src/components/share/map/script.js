import Service from "../../../utils/api/service";
// import Helper from "../../../utils/global/func";

export default {
  props: {
    location: Object,
  },
  name: "Map",
  data() {
    return {
      map: {
        isOpenMap: false,
        center: "",
        locPlaces: "",
        existingPlace: null,
        isLoading: false
      }
    }
  },
  components: {},
  created() {
    this.getCurrentLocation()
  },
  mounted() {

  },

  methods: {
    initMarker(loc) {
      this.map.existingPlace = loc;
    },
    addLocationMarker() {
      if (this.map.existingPlace) {
        const marker = {
          lat: this.map.existingPlace.geometry.location.lat(),
          lng: this.map.existingPlace.geometry.location.lng()
        };
        this.map.center = marker
        this.map.coordinates = marker
        this.map.existingPlace = null
      }
    },
    getCurrentLocation(isCurrentLocation = false) {
      this.map.center ? this.map.isLoading = true : this.map.isOpenMap = true
      navigator.geolocation.getCurrentPosition(res => {
        this.map.center ? this.map.isLoading = false : this.map.isOpenMap = false
        this.map.center = {
          lat: this.location && !isCurrentLocation ? this.location.lat : res.coords.latitude,
          lng: this.location && !isCurrentLocation ? this.location.lng : res.coords.longitude
        };
        this.map.coordinates = this.map.center
      });
    },
    updateCoordinates(location) {
      this.map.coordinates = {
        lat: location.latLng.lat(),
        lng: location.latLng.lng(),
      };
    },
    getStreetAddressFrom() {
      Service.getStreetAddressFrom(this.map.coordinates).then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
        } else {
          this.map.locPlaces = response.results[0]
          this.$emit("existedLocPlaces", response.results[0]);
        }
      });
    },
  }
};
