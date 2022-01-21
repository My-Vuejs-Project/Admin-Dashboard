import Vue from "vue";
import VueRouter from "vue-router";

import Login from "../views/authorize/login";
import Dashboard from "./../views/dashboard";

import ListCustomerGroup from "./../views/customer/customer-group/list";
import CreateCustomerGroup from "./../views/customer/customer-group/create";
import EditCustomerGroup from "./../views/customer/customer-group/edit";

import ListCustomer from "./../views/customer/list-customer/list";
import EditCustomer from "./../views/customer/list-customer/edit";

import ListRole from "./../views/the-settings/role/list";
import CreateRole from "./../views/the-settings/role/create";
import EditRole from "./../views/the-settings/role/edit";

import ListAdminAccount from "./../views/the-settings/account/list";
import CreateAdminAccount from "./../views/the-settings/account/create";

import Profile from "./../views/the-settings/profile";

import ListAdvertisement from "./../views/advertisement/list";
import CreateAdvertisement from "./../views/advertisement/create";
import EditAdvertisement from "./../views/advertisement/edit";

import ListBrand from "./../views/catalog/brand/list";
import CreateBrand from "./../views/catalog/brand/create";
import EditBrand from "./../views/catalog/brand/edit";

import ListStockStatus from "../views/catalog/stock-status/list";
import CreateStockStatus from "../views/catalog/stock-status/create";
import EditStockStatus from "../views/catalog/stock-status/edit";

import ListOption from "../views/catalog/option/list";
import CreateOption from "../views/catalog/option/create";
import EditOption from "../views/catalog/option/edit";

import CreateOptionValue from "../views/catalog/option-value/create";
import EditOptionValue from "../views/catalog/option-value/edit";

import ListCoupon from "../views/catalog/coupon/list";
import CreateCoupon from "../views/catalog/coupon/create";
import EditCoupon from "../views/catalog/coupon/edit";

import ListManufacturer from "../views/catalog/manufaturer/list";
import CreateManufacturer from "../views/catalog/manufaturer/create";
import EditManufacturer from "../views/catalog/manufaturer/edit";

import ListTopSelection from "../views/catalog/top-selection/list";
import CreateTopSelection from "../views/catalog/top-selection/create";

import ListUnitOfMeasure from "../views/catalog/unit-of-measure/list";
import CreateUnitOfMeasure from "../views/catalog/unit-of-measure/create";
import EditUnitOfMeasure from "../views/catalog/unit-of-measure/edit";

import ListProduct from "../views/catalog/product/list";
import CreateProduct from "../views/catalog/product/create";
import EditProduct from "../views/catalog/product/edit";

import ListProductDiscount from "../views/catalog/product-discount/list";
import CreateProductDiscount from "../views/catalog/product-discount/create";
import EditProductDiscount from "../views/catalog/product-discount/edit";

import ListCategory from "./../views/catalog/category/list";
import CreateCategory from "./../views/catalog/category/create";
import EditCategory from "./../views/catalog/category/edit";

import EditSubcategory from "./../views/catalog/category/subcategory/edit";

import ListPointExchange from "./../views/point/point-exchange/list";

import ListMerchandise from "./../views/point/merchandise/list";
import CreateMerchandise from "./../views/point/merchandise/create";
import EditMerchandise from "./../views/point/merchandise/edit";

import ListVoucherTheme from "./../views/voucher/voucher-theme/list";
import CreateVoucherTheme from "./../views/voucher/voucher-theme/create";
import EditVoucherTheme from "./../views/voucher/voucher-theme/edit";

import ListVoucher from "./../views/voucher/voucher/list";
import CreateVoucher from "./../views/voucher/voucher/create";
import EditVoucher from "./../views/voucher/voucher/edit";

import ListPaymentMethod from "./../views/payment/payment-method/list";
import CreatePaymentMethod from "./../views/payment/payment-method/create";
import EditPaymentMethod from "./../views/payment/payment-method/edit";

import ListCurrency from "./../views/payment/currency/list";
import CreateCurrency from "./../views/payment/currency/create";
import EditCurrency from "./../views/payment/currency/edit";

import ListTicketType from "./../views/ticket/ticket-type/list";
import CreateTicketType from "./../views/ticket/ticket-type/create";
import EditTicketType from "./../views/ticket/ticket-type/edit";

import EditSubTicketType from "./../views/ticket/ticket-type/sub-ticket-type/edit";
import CreateSubTicketType from "./../views/ticket/ticket-type/sub-ticket-type/create";

import ListServiceTicket from "../views/ticket/service-ticket/list";
import EditServiceTicket from "../views/ticket/service-ticket/edit";
import ListAcademyTicket from "../views/ticket/academy-ticket/list";
import EditAcademyTicket from "../views/ticket/academy-ticket/edit";
import ListTrainingTicket from "../views/ticket/training-ticket/list";
import EditTrainingTicket from "../views/ticket/training-ticket/edit";

import ListNotification from "./../views/notification/list";
import CreateNotification from "./../views/notification/create";
import EditNotification from "./../views/notification/edit";

import ListGeoZone from "./../views/address/geo-zone/list";
import CreateGeoZone from "./../views/address/geo-zone/create";
import EditGeoZone from "./../views/address/geo-zone/edit";

import ListZoneToGeoZone from "./../views/address/zone-to-geozone/list";
import CreateZoneToGeoZone from "./../views/address/zone-to-geozone/create";
import EditZoneToGeoZone from "./../views/address/zone-to-geozone/edit";
import ListReview from "../views/review/list";
import EditReview from "../views/review/edit";

import ListReportCustomer from "../views/report/customer";
import ListReportOrder from "../views/report/order";

import ListAppVersion from "../views/the-settings/app-version/list";

import ListSettings from "../views/the-settings/settings/list";

import ListTutorialPlaylist from "../views/tutorial/Tutorial-playlist/list";
import CreateTutorialPlaylist from "../views/tutorial/Tutorial-playlist/create";
import EditTutorialPlaylist from "../views/tutorial/Tutorial-playlist/edit";

import ListTutorialVideo from "../views/tutorial/tutorial-video/list";
import CreateTutorialVideo from "../views/tutorial/tutorial-video/create";
import EditTutorialVideo from "../views/tutorial/tutorial-video/edit";

import ListShowroom from "../views/showroom/list";
import CreateShowroom from "../views/showroom/create";
import EditShowroom from "../views/showroom/edit";

import ListShipping from "../views/shipping/list";
import CreateShipping from "../views/shipping/create";
import EditShipping from "../views/shipping/edit";

import ListOrder from "../views/order/order/list";
import EditOrder from "../views/order/order/edit";

import ListOrderStatus from "../views/order/order-status/list";
import CreateOrderStatus from "../views/order/order-status/create";
import EditOrderStatus from "../views/order/order-status/edit";
// =============================================================

const isLoggedIn = (to, from, next) => {
  if (!Vue.$cookies.get("accessToken")) {
    return router.push({
      name: "login",
    });
  }
  return next();
};

const isNotLoggedIn = (to, from, next) => {
  if (Vue.$cookies.get("accessToken")) {
    return router.push({
      name: "dashboard",
    });
  }
  return next();
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: isNotLoggedIn,
  },
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: isLoggedIn,
  },

  // ==== customer =====
  {
    path: "/customer",
    name: "ListCustomer",
    component: ListCustomer,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/customer/update",
    name: "EditCustomer",
    component: EditCustomer,
    beforeEnter: isLoggedIn,
  },

  //==== customer group =====
  {
    path: "/customer-group",
    name: "ListCustomerGroup",
    component: ListCustomerGroup,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/customer-group/create",
    name: "CreateCustomerGroup",
    component: CreateCustomerGroup,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/customer-group/update",
    name: "EditCustomerGroup",
    component: EditCustomerGroup,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/setting/role-management",
    name: "ListRole",
    component: ListRole,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/setting/role-management/create",
    name: "CreateRole",
    component: CreateRole,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/setting/role-management/update",
    name: "EditRole",
    component: EditRole,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/setting/admin-management",
    name: "ListAdminAccount",
    component: ListAdminAccount,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/setting/admin-management/create",
    name: "CreateAdminAccount",
    component: CreateAdminAccount,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/setting/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/advertisement",
    name: "ListAdvertisement",
    component: ListAdvertisement,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/advertisement/create",
    name: "CreateAdvertisement",
    component: CreateAdvertisement,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/advertisement/update",
    name: "EditAdvertisement",
    component: EditAdvertisement,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/brand",
    name: "ListBrand",
    component: ListBrand,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/brand/create",
    name: "CreateBrand",
    component: CreateBrand,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/brand/update",
    name: "EditBrand",
    component: EditBrand,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/stock-status",
    name: "ListStockStatus",
    component: ListStockStatus,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/stock-status/create",
    name: "CreateStockStatus",
    component: CreateStockStatus,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/stock-status/update",
    name: "EditStockStatus",
    component: EditStockStatus,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/option",
    name: "ListOption",
    component: ListOption,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/option/create",
    name: "CreateOption",
    component: CreateOption,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/option/update",
    name: "EditOption",
    component: EditOption,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/option-value/create",
    name: "CreateOptionValue",
    component: CreateOptionValue,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/option-value/update",
    name: "EditOptionValue",
    component: EditOptionValue,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/coupon",
    name: "ListCoupon",
    component: ListCoupon,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/coupon/create",
    name: "CreateCoupon",
    component: CreateCoupon,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/coupon/update",
    name: "EditCoupon",
    component: EditCoupon,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/manufacturer",
    name: "ListManufacturer",
    component: ListManufacturer,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/manufacturer/create",
    name: "CreateManufacturer",
    component: CreateManufacturer,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/manufacturer/update",
    name: "EditManufacturer",
    component: EditManufacturer,
    beforeEnter: isLoggedIn,
  },

  // Top Selection
  {
    path: "/catalog/top-selection",
    name: "ListTopSelection",
    component: ListTopSelection,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/top-selection/create",
    name: "CreateTopSelection",
    component: CreateTopSelection,
    beforeEnter: isLoggedIn,
  },

  // Unit of Measure
  {
    path: "/catalog/unit-of-measure",
    name: "ListUnitOfMeasure",
    component: ListUnitOfMeasure,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/unit-of-measure/create",
    name: "CreateUnitOfMeasure",
    component: CreateUnitOfMeasure,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/unit-of-measure/update",
    name: "EditUnitOfMeasure",
    component: EditUnitOfMeasure,
    beforeEnter: isLoggedIn,
  },

  // Product
  {
    path: "/catalog/product",
    name: "ListProduct",
    component: ListProduct,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/product/create",
    name: "CreateProduct",
    component: CreateProduct,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/product/update",
    name: "EditProduct",
    component: EditProduct,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/catalog/product-discount",
    name: "ListProductDiscount",
    component: ListProductDiscount,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/product-discount/create",
    name: "CreateProductDiscount",
    component: CreateProductDiscount,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/product-discount/update",
    name: "EditProductDiscount",
    component: EditProductDiscount,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/category",
    name: "ListCategory",
    component: ListCategory,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/category/create",
    name: "CreateCategory",
    component: CreateCategory,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/catalog/category/update",
    name: "EditCategory",
    component: EditCategory,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/category/subcategory/update",
    name: "EditSubcategory",
    component: EditSubcategory,
    beforeEnter: isLoggedIn,
  },

  //========== Point and Merchandise
  {
    path: "/point-and-merchandise/point-exchange",
    name: "ListPointExchange",
    component: ListPointExchange,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/point-and-merchandise/merchandise",
    name: "ListMerchandise",
    component: ListMerchandise,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/point-and-merchandise/merchandise/create",
    name: "CreateMerchandise",
    component: CreateMerchandise,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/point-and-merchandise/merchandise/update",
    name: "EditMerchandise",
    component: EditMerchandise,
    beforeEnter: isLoggedIn,
  },

  //========== Point and Merchandise


  //====== Voucher Theme and Voucher ===========
  {
    path: "/voucher/theme",
    name: "ListVoucherTheme",
    component: ListVoucherTheme,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/voucher/theme/create",
    name: "CreateVoucherTheme",
    component: CreateVoucherTheme,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/voucher/theme/update",
    name: "EditVoucherTheme",
    component: EditVoucherTheme,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/voucher",
    name: "ListVoucher",
    component: ListVoucher,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/voucher/create",
    name: "CreateVoucher",
    component: CreateVoucher,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/voucher/update",
    name: "EditVoucher",
    component: EditVoucher,
    beforeEnter: isLoggedIn,
  },
  //======= Voucher Theme and Voucher =======


  //====== Payment Method and Currency ===========
  {
    path: "/payment/payment-method",
    name: "ListPaymentMethod",
    component: ListPaymentMethod,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/payment/payment-method/create",
    name: "CreatePaymentMethod",
    component: CreatePaymentMethod,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/payment/payment-method/update",
    name: "EditPaymentMethod",
    component: EditPaymentMethod,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/payment/currency",
    name: "ListCurrency",
    component: ListCurrency,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/payment/currency/create",
    name: "CreateCurrency",
    component: CreateCurrency,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/payment/currency/update",
    name: "EditCurrency",
    component: EditCurrency,
    beforeEnter: isLoggedIn,
  },
  //======= Payment Method and Currency =======

  //======== Ticket Type ==============
  {
    path: "/ticket",
    name: "ListTicketType",
    component: ListTicketType,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/ticket/type/create",
    name: "CreateTicketType",
    component: CreateTicketType,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/ticket/type/update",
    name: "EditTicketType",
    component: EditTicketType,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/sub-ticket/type/create",
    name: "CreateSubTicketType",
    component: CreateSubTicketType,
    beforeEnter: isLoggedIn,
  },
  // Ticket
  {
    path: "/sub-ticket/type/update",
    name: "EditSubTicketType",
    component: EditSubTicketType,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/service-ticket",
    name: "ListServiceTicket",
    component: ListServiceTicket,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/service-ticket/view",
    name: "EditServiceTicket",
    component: EditServiceTicket,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/academy-ticket",
    name: "ListAcademyTicket",
    component: ListAcademyTicket,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/academy-ticket/view",
    name: "EditAcademyTicket",
    component: EditAcademyTicket,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/training-ticket",
    name: "ListTrainingTicket",
    component: ListTrainingTicket,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/training-ticket/view",
    name: "EditTrainingTicket",
    component: EditTrainingTicket,
    beforeEnter: isLoggedIn,
  },
  //======== End Ticket =========

  //======== Notification =========
  {
    path: "/notification",
    name: "ListNotification",
    component: ListNotification,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/notification/create",
    name: "CreateNotification",
    component: CreateNotification,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/notification/update",
    name: "EditNotification",
    component: EditNotification,
    beforeEnter: isLoggedIn,
  },

  // Geo zone
  {
    path: "/address/geo-zone",
    name: "ListGeoZone",
    component: ListGeoZone,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/address/geo-zone/create",
    name: "CreateGeoZone",
    component: CreateGeoZone,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/address/geo-zone/update",
    name: "EditGeoZone",
    component: EditGeoZone,
    beforeEnter: isLoggedIn,
  },

  //Zone to geo zone
  {
    path: "/address/zone-to-geo-zone",
    name: "ListZoneToGeoZone",
    component: ListZoneToGeoZone,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/address/zone-to-geo-zone/create",
    name: "CreateZoneToGeoZone",
    component: CreateZoneToGeoZone,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/address/zone-to-geo-zone/update",
    name: "EditZoneToGeoZone",
    component: EditZoneToGeoZone,
  },

  //Review
  {
    path: "/review",
    name: "ListReview",
    component: ListReview,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/review/update",
    name: "EditReview",
    component: EditReview,
    beforeEnter: isLoggedIn,
    props: true,
  },

  // Report
  {
    path: "/report/customer",
    name: "ListReportCustomer",
    component: ListReportCustomer,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/report/order",
    name: "ListReportOrder",
    component: ListReportOrder,
    beforeEnter: isLoggedIn,
  },

  {
    path: "/app-version",
    name: "ListAppVersion",
    component: ListAppVersion,
    beforeEnter: isLoggedIn,
  },

  // Settings
  {
    path: "/settings",
    name: "ListSettings",
    component: ListSettings,
    beforeEnter: isLoggedIn,
  },

  // Tutorial playlist
  {
    path: "/tutorial-playlist",
    name: "ListTutorialPlaylist",
    component: ListTutorialPlaylist,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/tutorial-playlist/create",
    name: "CreateTutorialPlaylist",
    component: CreateTutorialPlaylist,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/tutorial-playlist/edit",
    name: "EditTutorialPlaylist",
    component: EditTutorialPlaylist,
    beforeEnter: isLoggedIn,
  },
  // Tutorial video
  {
    path: "/tutorial-video",
    name: "ListTutorialVideo",
    component: ListTutorialVideo,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/tutorial-video/create",
    name: "CreateTutorialVideo",
    component: CreateTutorialVideo,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/tutorial-video/edit",
    name: "EditTutorialVideo",
    component: EditTutorialVideo,
    beforeEnter: isLoggedIn,
  },

  // Showroom
  {
    path: "/showroom",
    name: "ListShowroom",
    component: ListShowroom,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/showroom/create",
    name: "CreateShowroom",
    component: CreateShowroom,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/showroom/edit",
    name: "EditShowroom",
    component: EditShowroom,
    beforeEnter: isLoggedIn,
  },

  // Shipping
  {
    path: "/shipping",
    name: "ListShipping",
    component: ListShipping,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/shipping/create",
    name: "CreateShipping",
    component: CreateShipping,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/shipping/edit",
    name: "EditShipping",
    component: EditShipping,
    beforeEnter: isLoggedIn,
  },

  // Order
  {
    path: "/order",
    name: "ListOrder",
    component: ListOrder,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/order/edit",
    name: "EditOrder",
    component: EditOrder,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/order-status",
    name: "ListOrderStatus",
    component: ListOrderStatus,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/order-status/create",
    name: "CreateOrderStatus",
    component: CreateOrderStatus,
    beforeEnter: isLoggedIn,
  },
  {
    path: "/order-status/update",
    name: "EditOrderStatus",
    component: EditOrderStatus,
    beforeEnter: isLoggedIn,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
