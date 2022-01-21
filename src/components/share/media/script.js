import Service from "../../../utils/api/service";
import Helper from "../../../utils/global/func";
import { mapState } from "vuex";

export default {
  props: {
    type: String,
    mediaSelected: Array,
    method: {
      type: Function,
    },
  },
  name: "media",
  data() {
    return {
      previewImage: "",
      loading: true,
      uploading: false,
      data: {
        media: [],
        mediaSelected: [],
        pagination: {
          limit: 10,
          page: 1,
          total: 0,
          totalPage: 0,
        },
      },
      fields: {
        mediaId: "",
      },
      display: {
        tab: "server",
      },
      body: {
        image: {
          file: "",
          fileList: [],
        },
        directory: "",
        folder: "",
      },
    };
  },

  components: {},

  created() {
    this.getData(this.data.pagination.limit, this.body.folder);
  },

  watch: {
    "$route.fullPath": function () {
      this.getData(this.data.pagination.limit, this.body.folder);
    },
  },
  mounted() {
    this.mapData();
  },

  computed: {
    ...mapState(["mediaDirectory"]),
  },

  methods: {
    tab(type) {
      this.display.tab = type;
    },

    mapData() {
      this.data.mediaSelected =
        this.mediaSelected && this.mediaSelected.length > 0
          ? this.mediaSelected
          : [];
    },

    closeMedia() {
      this.method();
    },

    filterDirectory() {
      let param = this.body.folder;
      this.getData(10, param);
    },

    getData(pagination, folder) {
      let param = "";

      if (this.body.folder) {
        param = "?folder=" + folder + "&limit=" + this.data.pagination.limit;
      } else {
        param = "?limit=" + pagination;
      }
      Service.getAllMedia(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getData();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.media = response.data;
          this.loading = false;
          this.data.pagination = Helper.calculatePagination(response.meta);
        }
      });
    },

    showMore() {
      this.data.pagination.limit += 20;
      this.getData(this.data.pagination.limit, this.body.folder);
    },

    getFullImage(path) {
      let dev = path.split("/")[0];
      return dev == "DEVELOPMENT" ? Helper.getFullImage(path) : path;
    },

    fileToPath(file) {
      return window.URL.createObjectURL(file);
    },

    deleteItem(index) {
      let id = this.data.media[index].id;

      Service.deleteMedia(id).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.deleteItem();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.media.splice(index, 1);
          this.$toasted.show("Media has been deleted.");
        }
      });
    },

    selectMedia(index) {
      let mediaSelected = this.data.media[index];
      let isExist = this.data.mediaSelected.includes(mediaSelected);
      if (!isExist) {
        if (this.type == "single") {
          this.data.mediaSelected = [];
          this.data.mediaSelected.push(mediaSelected);
        } else {
          this.data.mediaSelected.push(mediaSelected);
        }
      } else {
        this.$toasted.show("This Media is already selected.");
      }
    },

    removeAllMediaSelected() {
      this.data.mediaSelected = [];
    },

    removeMediaSelected(mediaSelectedIndex) {
      this.data.mediaSelected.splice(mediaSelectedIndex, 1);
    },

    chooseImage(e) {
      this.body.image.fileList = e.target.files;
    },

    removeItem(index) {
      var newFileList = Array.from(this.body.image.fileList);
      newFileList.splice(index, 1);

      this.body.image.fileList = newFileList;
    },

    submitMediaSelected() {
      if (this.type == "single") {
        this.$emit("existedMedia", this.data.mediaSelected[0]);
      } else {
        this.$emit("existedMultiMedia", this.data.mediaSelected);
      }
      this.$emit("newMedia", "");
    },

    submitFiles() {
      if (!this.body.directory) {
        document.getElementById("select-directory").style.border =
          "1px solid red";
        this.$toasted.show("Please select directory");
      } else {
        document.getElementById("select-directory").style.border = "";
        this.uploadPresign();
      }
    },

    async uploadPresign() {
      var newFileList = Array.from(this.body.image.fileList);
      let index = 0;
      while (index < newFileList.length) {
        this.uploading = true;
        var file = newFileList[index];

        let body = {
          media: [
            {
              ext: file.type.split("/").pop(),
              type: this.body.directory.toString(),
              filename:
                file.name.split(".")[0].length == 1
                  ? file.name.split(".")[0]
                  : file.name.split(".")[0].replace(/[^a-zA-Z0-9 ]/g, ""),
            },
          ],
        };
        await Service.uploadPresign(body).then((response) => {
          if (response.statusCode) {
            if (response.statusCode == "4410") {
              Service.refreshToken().then((response) => {
                if (response == "ok") {
                  this.uploadPresign();
                }
              });
            } else {
              this.$toasted.show(response.message.capitalize());
            }
          } else {
            this.uploadFile(file, response.data);
          }
        });

        index++;
      }
    },

    async uploadFile(file, presign) {
      if (file) {
        let uploadUrl = presign[0].uploadUrl;
        await Service.uploadMedia(uploadUrl, file, file.type).then(
          (response) => {
            if (response == "ok") {
              this.addMedia(file, presign);
            } else {
              this.$toasted.show("File upload fail!");
            }
          }
        );
      } else {
        this.$toasted.show("File cannot be empty!");
      }
    },

    async addMedia(file, presign) {
      let body = {
        fileName:
          file.name.split(".")[0].length == 1
            ? file.name.split(".")[0]
            : file.name.split(".")[0].replace(/[^a-zA-Z0-9 ]/g, ""),
        url: presign ? presign[0].key : "",
        type: file.type.split("/")[0].split("/")[0],
        folder: this.body.directory.toString(),
        status: "active",
      };
      await Service.addMedia(body);
      this.uploading = false;
      this.display.tab = "server";
      this.getData(this.data.pagination.limit, this.body.folder);
      this.body.image.fileList = [];
      this.body.directory = "";
    },
  },
};
