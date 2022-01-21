import url from "../../../utils/api/url";
import Service from "../../../utils/api/service";
import Helper from "../../../utils/global/func";
import XLSX from "xlsx";
import moment from "moment";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  name: "ListReportOrderDownload",
  data() {
    return {
      table: {
        name: "",
        headers: [],
        body: [],
      },
      isGenerating: false,
      isExporting: false,
      isGenerated: false,
      body: {
        fullName: "",
        paymentMethodId: "",
        orderStatus: "",
        minPrice: "",
        maxPrice: "",
        startDate: "",
        endDate: "",
      },
      data: {
        customerList: [],
        paymentMethods: [],
        orderStatus: [],
      },
      boxsearch: {
        key: "",
        results: [],
        focused: false,
        loading: false,
      },
    };
  },
  components: { Multiselect, DatePicker },
  created() {
    this.getCustomer();
    this.getAllPayment();
    this.getOrderStatus();
  },
  methods: {
    getCustomer() {
      Service.getCustomers("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getCustomer();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.customerList = response.data;
        }
      });
    },

    getAllPayment() {
      Service.getAllPayment("").then((response) => {
        if (response.statusCode) {
          this.$toasted.show(response.message.capitalize());
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getAllPayment();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.paymentMethods = response.data;
        }
      });
    },

    getOrderStatus() {
      Service.getAllOrderStatus("").then((response) => {
        if (response.statusCode) {
          if (response.statusCode == "4410") {
            Service.refreshToken().then((response) => {
              if (response == "ok") {
                this.getOrderStatus();
              }
            });
          } else {
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          this.data.orderStatus = response.data;
        }
      });
    },

    getFullImage(path) {
      return Helper.getFullImage(path);
    },

    checkParamSign(param) {
      return param.includes("?") ? "&" : "?";
    },

    generateReport(type) {
      if (type == "export") this.isExporting = true;
      else this.isGenerating = true;

      let token = this.$cookies.get("accessToken");
      let header = {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
      };

      let param = "/order/download";
      let body = this.body;
      if (body.fullName) {
        param =
          param + this.checkParamSign(param) + "fullName=" + body.fullName;
      }
      if (body.paymentMethodId) {
        param =
          param +
          this.checkParamSign(param) +
          "paymentMethodId=" +
          body.paymentMethodId;
      }
      if (body.orderStatus) {
        param =
          param +
          this.checkParamSign(param) +
          "orderStatusId=" +
          body.orderStatus;
      }
      if (body.minPrice) {
        param =
          param + this.checkParamSign(param) + "minPrice=" + body.minPrice;
      }
      if (body.maxPrice) {
        param =
          param + this.checkParamSign(param) + "maxPrice=" + body.maxPrice;
      }
      if (body.startDate) {
        param =
          param + this.checkParamSign(param) + "startDate=" + body.startDate;
      }
      if (body.endDate) {
        param = param + this.checkParamSign(param) + "endDate=" + body.endDate;
      }

      this.$axios({
        url: url.report + param,
        method: "GET",
        headers: header.headers,
        responseType: "blob", // important
      }).then((response) => {
        this.isGenerated = true;
        if (response.statusCode) {
          if (response.statusCode === "403") {
            this.isGenerated = false;
            this.$toasted.show(response.message.capitalize());
          }
        } else {
          const blobfile = new Blob([response.data]);

          if (type == "export") {
            this.isExporting = false;
            this.exportFile(blobfile);
          } else {
            this.isGenerating = false;
            this.readFileToTable(blobfile);
          }
        }
      });
    },

    exportFile(blobfile) {
      const url = window.URL.createObjectURL(blobfile);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    },

    readFileToTable(blobfile) {
      if (this.table.headers.length > 0 || this.table.body.length > 0) {
        this.table.headers.length = 0;
        this.table.body.length = 0;
      }

      let headers = this.table.headers;
      let body = this.table.body;

      var reader = new FileReader();
      reader.addEventListener("loadend", function(e) {
        var results,
          data = e.target.result,
          fixedData = fixdata(data),
          workbook = XLSX.read(btoa(fixedData), { type: "base64" }),
          firstSheetName = workbook.SheetNames[0],
          worksheet = workbook.Sheets[firstSheetName];

        let header = get_header_row(worksheet);
        results = XLSX.utils.sheet_to_json(worksheet);
        let result = results;

        headers.push.apply(headers, header);
        body.push.apply(body, result);
      });
      reader.readAsArrayBuffer(blobfile);

      function get_header_row(sheet) {
        var headers = [],
          range = XLSX.utils.decode_range(sheet["!ref"]);
        var C,
          R = range.s.r; /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) {
          /* walk every column in the range */
          var cell =
            sheet[
              XLSX.utils.encode_cell({ c: C, r: R })
            ]; /* find the cell in the first row */
          var hdr = "UNKNOWN " + C; // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        return headers;
      }

      function fixdata(data) {
        var o = "",
          l = 0,
          w = 10240;
        for (; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(
            null,
            new Uint8Array(data.slice(l * w, l * w + w))
          );
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));

        return o;
      }
    },

    ExcelDateToJSDate(serial) {
      var utc_days = Math.floor(serial - 25569);
      var utc_value = utc_days * 86400;
      var date_info = new Date(utc_value * 1000);

      var fractional_day = serial - Math.floor(serial) + 0.0000001;

      var total_seconds = Math.floor(86400 * fractional_day);

      var seconds = total_seconds % 60;

      total_seconds -= seconds;

      var hours = Math.floor(total_seconds / (60 * 60));
      var minutes = Math.floor(total_seconds / 60) % 60;

      let date = new Date(
        date_info.getFullYear(),
        date_info.getMonth(),
        date_info.getDate(),
        hours,
        minutes,
        seconds
      );
      return moment(date).format("DD-MMM-YYYY h:mm A");
    },

    nullValue(string) {
      if (string == "") {
        string = "N/A";
      }
      return string;
    },

    handlemouseup: function() {
      this.boxsearch.focused = false;
    },
  },

  beforeMount() {
    document.body.addEventListener("mouseup", this.handlemouseup);
  },
  beforeDestroy() {
    document.body.removeEventListener("mouseup", this.handlemouseup);
  },
};
