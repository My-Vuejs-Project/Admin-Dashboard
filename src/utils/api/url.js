const baseUrl = process.env.VUE_APP_BASE_URL;
const admin = "admin";
// const client = '/core/api/client'
const v1 = "";
const api = {
  //Login
  login: baseUrl + admin + v1 + "/auth/login",
  getNewToken: baseUrl + admin + "/auth/regenerate-token",

  //presign
  presign: baseUrl + admin + "/upload/presign",

  //Media
  media: baseUrl + admin + "/media",

  //Customer
  customers: baseUrl + admin + v1 + "/customer",
  customerGroups: baseUrl + admin + v1 + "/customer/group",

  //Role
  role: baseUrl + admin + v1 + "/role",

  //Permission
  permission: baseUrl + admin + v1 + "/permission",

  //Admin Account
  adminAccount: baseUrl + admin + v1 + "/account",

  //Advertisement
  advertisement: baseUrl + admin + v1 + "/advertisement",

  //Brand
  brand: baseUrl + admin + v1 + "/brand",

  //Category
  category: baseUrl + admin + v1 + "/category",

  //Stock Status
  stockStatus: baseUrl  + admin + v1 + "/stock-status",

  //Order Status
  orderStatus: baseUrl  + admin + v1 + "/order-status",

  //Option
  option: baseUrl + admin + v1 + "/option",

  //Option
  optionValue: baseUrl + admin + v1 + "/option-value",

  //Coupon
  coupon: baseUrl + admin + v1 + "/coupon",

  //Manufacturer
  manufacturer: baseUrl + admin + v1 + "/manufacturer",

  // Top selection
  topSelection: baseUrl + admin + v1 + "/top-selection",

  // Top selection
  unitOfMeasure: baseUrl + admin + v1 + "/unit-of-measure",

  //Product and Product Discount
  product: baseUrl + admin + v1 + "/product",
  productDiscount: baseUrl + admin + v1 + "/product-discount",

  //Varaint
  varaint: baseUrl + admin + v1 + "/variant",

  //Currency
  currency: baseUrl + admin + v1 + "/currency",

  //Point Exchange & Merchandise
  pointExchange: baseUrl + admin + v1 + "/merchandise/point-exchange",
  merchandise: baseUrl + admin + v1 + "/merchandise",

  //Voucher Theme & Voucher
  voucherTheme: baseUrl + admin + v1 + "/voucher-theme",
  voucher: baseUrl + admin + v1 + "/voucher",

  //Payment Method
  payment: baseUrl + admin + v1 + "/payment/method",

  //Ticket and TicketType
  ticketType: baseUrl + admin + v1 + "/ticket/type",
  serviceTicket: baseUrl + admin + v1 + "/service/ticket",
  academyTicket: baseUrl + admin + v1 + "/academy/ticket",
  trainingTicket: baseUrl + admin + v1 + "/training/ticket",
  //Notification
  notification: baseUrl + admin + v1 + "/notification",

  // Geo Zone
  geoZone: baseUrl + admin + "/geo-zone",
  
  //Zone to Geo Zone
  zoneToGeoZone: baseUrl + admin + "/zone-to-geo-zone",

  // country
  country: baseUrl + admin + "/country",
  // province
  province: baseUrl + admin + "/province",

  // province
  district: baseUrl + admin + "/district",
  //Review
  review: baseUrl + admin + v1 + "/review",

  //Report
  report: baseUrl + admin + v1 + "/report",

  //App Version
  appVersion: baseUrl + admin + v1 + "/app-version",

  //Settings
  setting: baseUrl + admin + v1 + "/setting",

  tutorial: baseUrl + admin + v1 + "/tutorial",

  showroom: baseUrl + admin + v1 + "/showroom",
  // shipping 
  shipping: baseUrl + admin + v1 + "/shipping-courier",
  // Order
  order : baseUrl + admin + v1 + "/order",
  //=================================================================================================
};
export default api;
