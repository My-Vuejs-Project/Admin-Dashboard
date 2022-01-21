import axios from "axios";
import VueCookies from "vue-cookies";
import api from "./url";

const service = {};

service.headers = function () {
  let user = VueCookies.get("accessToken");
  if (user) {
    let header = {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + user,
      },
    };
    return header;
  } else {
    service.logout();
  }
};

service.headerWithoutToken = function () {
  let header = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return header;
};

service.validateError = function (error) {
  let httpCode = error.response.status;
  switch (httpCode) {
    case 401:
      if (error.response.data.statusCode == "4410") {
        return error.response.data;
      } else {
        service.logout();
      }
      break;
    default:
      return error.response.data;
  }
};

service.logout = function () {
  VueCookies.remove("accountId");
  VueCookies.remove("accessToken");
  VueCookies.remove("refreshToken");
  location.reload();
};

service.refreshToken = async function () {
  var body = {
    refreshToken: VueCookies.get("refreshToken"),
  };
  return await axios
    .post(api.getNewToken, body, service.headerWithoutToken())
    .then((response) => {
      VueCookies.set("accessToken", response.data.data.access_token);
      VueCookies.set("refreshToken", response.data.data.refresh_token);
      return "ok";
    })
    .catch(function () {
      service.logout();
    });
};

//login
service.login = async function (body) {
  return await axios
    .post(api.login, body, service.headerWithoutToken())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//end login


//Media
service.getAllMedia = async function (folder) {
  return await axios
    .get(api.media + folder, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.addMedia = async function (body) {
  return await axios
    .post(api.media, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteMedia = async function (id) {
  return await axios
    .delete(api.media + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getMediaDirectory = async function () {
  return await axios
    .get(api.media + "/directory", service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Media



//presign
service.uploadPresign = async function (body) {
  return await axios
    .post(api.presign, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.uploadMedia = async function (uploadUrl, formData, fileType) {
  return await axios
    .put(uploadUrl, formData, {
      headers: {
        "Content-Type": fileType,
      },
    })
    .then(() => {
      return "ok";
    })
    .catch(function (error) {
      return console.log(error);
    });
};
//end presign


//Customer and Customer Group
service.getCustomers = async function (params) {
  return await axios
    .get(api.customers + params, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateCustomer = async function (id, body) {
  return await axios
    .put(api.customers + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.getCustomerGroups = async function (params) {
  return await axios
    .get(api.customerGroups + params, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getCustomerGroupDetail = async function (param) {
  return await axios
    .get(api.customerGroups + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createCustomerGroup = async function (body) {
  return await axios
    .post(api.customerGroups, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateCustomerGroup = async function (id, body) {
  return await axios
    .put(api.customerGroups + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteCustomerGroup = async function (id) {
  return await axios
    .delete(api.customerGroups + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Customer and Customer Group


//Role Management
service.getAllRole = async function (params) {
  return await axios
    .get(api.role + params, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAdminRole = async function (params) {
  return await axios
    .get(api.role + "/" + params, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createRole = async function (body) {
  return await axios
    .post(api.role, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateRole = async function (id, body) {
  return await axios
    .put(api.role + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteRole = async function (id) {
  return await axios
    .delete(api.role + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Role Management


//Permissions
service.getListPermissions = async function () {
  return await axios
    .get(api.permission, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Permission



//Profile Info
service.getAccountDetail = async function() {
  return await axios
    .get(api.adminAccount + "/profile", service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function(error) {
      return service.validateError(error);
    });
};
service.updateProfile = async function(body) {
  return await axios
    .put(api.adminAccount + "/profile/", body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function(error) {
      return service.validateError(error);
    });
};
service.updateEmail = async function(id, body) {
  return await axios
    .put(api.adminAccount + "/email/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function(error) {
      return service.validateError(error);
    });
};
service.changePassword = async function(body) {
  return await axios
    .put(api.adminAccount + "/change-password/", body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function(error) {
      return service.validateError(error);
    });
};

//End Profile Info



//Admin Account Management
service.getAllAdminAccounts = async function () {
  return await axios
    .get(api.adminAccount, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createAdminAccount = async function (body) {
  return await axios
    .post(api.adminAccount, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateAdminAccount = async function (id, body) {
  return await axios
    .put(api.adminAccount + "/status/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteAdminAccount = async function (id) {
  return await axios
    .delete(api.adminAccount + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Admin Account Management


//Advertisement Management
service.getAllAdvertisements = async function (param) {
  return await axios
    .get(api.advertisement + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAdvertisementDetail = async function (param) {
  return await axios
    .get(api.advertisement + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createAdvertisement = async function (body) {
  return await axios
    .post(api.advertisement, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateAdvertisement = async function (id, body) {
  return await axios
    .put(api.advertisement + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteAdvertisement = async function (id) {
  return await axios
    .delete(api.advertisement + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Admin Account Management


//Brand Management
service.getAllBrands = async function (param) {
  return await axios
    .get(api.brand + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getBrandDetail = async function (param) {
  return await axios
    .get(api.brand + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createBrand = async function (body) {
  return await axios
    .post(api.brand, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateBrand = async function (id, body) {
  return await axios
    .put(api.brand + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteBrand = async function (id) {
  return await axios
    .delete(api.brand + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Brand Management


//Categories Management
service.getAllCategories = async function (param) {
  return await axios
    .get(api.category + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getCategoryDetail = async function (param) {
  return await axios
    .get(api.category + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createCategory = async function (body) {
  return await axios
    .post(api.category, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateCategory = async function (id, body) {
  return await axios
    .put(api.category + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteCategory = async function (id) {
  return await axios
    .delete(api.category + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Categories Management


//Stock Status Management
service.getAllStockStatus = async function (param) {
  return await axios
    .get(api.stockStatus + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getStockStatusDetail = async function (param) {
  return await axios
    .get(api.stockStatus + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createStockStatus = async function (body) {
  return await axios
    .post(api.stockStatus, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateStockStatus = async function (id, body) {
  return await axios
    .put(api.stockStatus + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteStockStatus = async function (id) {
  return await axios
    .delete(api.stockStatus + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Stock Status Management



//Option Management
service.getAllOption = async function (param) {
  return await axios
    .get(api.option + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getOptionDetail = async function (param) {
  return await axios
    .get(api.option + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createOption = async function (body) {
  return await axios
    .post(api.option, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateOption = async function (id, body) {
  return await axios
    .put(api.option + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteOption = async function (id) {
  return await axios
    .delete(api.option + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Option Management



//Option Value Management
service.getAllOptionValue = async function (param) {
  return await axios
    .get(api.optionValue + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getOptionValueDetail = async function (param) {
  return await axios
    .get(api.optionValue + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createOptionValue = async function (body) {
  return await axios
    .post(api.optionValue, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateOptionValue = async function (id, body) {
  return await axios
    .put(api.optionValue + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteOptionValue = async function (id) {
  return await axios
    .delete(api.optionValue + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Option Value Management




//Coupon Management
service.getAllCoupons = async function (param) {
  return await axios
    .get(api.coupon + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getCouponDetail = async function (param) {
  return await axios
    .get(api.coupon + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createCoupon = async function (body) {
  return await axios
    .post(api.coupon, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateCoupon = async function (id, body) {
  return await axios
    .put(api.coupon + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteCoupon = async function (id) {
  return await axios
    .delete(api.coupon + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Coupon Management




//Manufacturers Management
service.getAllManufacturers = async function (param) {
  return await axios
    .get(api.manufacturer + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getManufacturerDetail = async function (param) {
  return await axios
    .get(api.manufacturer + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createManufacturer = async function (body) {
  return await axios
    .post(api.manufacturer, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateManufacturer = async function (id, body) {
  return await axios
    .put(api.manufacturer + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteManufacturer = async function (id) {
  return await axios
    .delete(api.manufacturer + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Manufacturers Management



//Top Selection Management
service.getAllTopSelection = async function (param) {
  return await axios
    .get(api.topSelection + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getTopSelectionDetail = async function (param) {
  return await axios
    .get(api.topSelection + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createTopSelection = async function (body) {
  return await axios
    .post(api.topSelection, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateTopSelection = async function (id, body) {
  return await axios
    .put(api.topSelection + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteTopSelection = async function (id) {
  return await axios
    .delete(api.topSelection + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Top Selection Management




//Unit of Measure Management
service.getAllUnitOfMeasure = async function (param) {
  return await axios
    .get(api.unitOfMeasure + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getUnitOfMeasureDetail = async function (param) {
  return await axios
    .get(api.unitOfMeasure + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createUnitOfMeasure = async function (body) {
  return await axios
    .post(api.unitOfMeasure, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateUnitOfMeasure = async function (id, body) {
  return await axios
    .put(api.unitOfMeasure + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteUnitOfMeasure = async function (id) {
  return await axios
    .delete(api.unitOfMeasure + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Unit of Measure Management




//Product Management
service.getAllProducts = async function (param) {
  return await axios
    .get(api.product + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getProductDetail = async function (param) {
  return await axios
    .get(api.product + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createProduct = async function (body) {
  return await axios
    .post(api.product, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateProduct = async function (id, body) {
  return await axios
    .put(api.product + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteProduct = async function (id) {
  return await axios
    .delete(api.product + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Products Management




//Product Discount Management
service.getAllProductDiscounts = async function (param) {
  return await axios
    .get(api.productDiscount + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getProductDiscountDetail = async function (param) {
  return await axios
    .get(api.productDiscount + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createProductDiscount = async function (body) {
  return await axios
    .post(api.productDiscount, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateProductDiscount = async function (id, body) {
  return await axios
    .put(api.productDiscount + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteProductDiscount = async function (id) {
  return await axios
    .delete(api.productDiscount + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Products Discount Management



//Product Variant Management
service.getAllProductVariants = async function (param) {
  return await axios
    .get(api.varaint + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getProductVariantDetail = async function (param) {
  return await axios
    .get(api.varaint + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createProductVariant = async function (body) {
  return await axios
    .post(api.varaint, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateProductVaraint = async function (id, body) {
  return await axios
    .put(api.varaint + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteProductVariant = async function (id) {
  return await axios
    .delete(api.varaint + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
// End Product Variant Management



//Currency Management
service.getAllCurrency = async function (param) {
  return await axios
    .get(api.currency + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getCurrencyDetail = async function (param) {
  return await axios
    .get(api.currency + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createCurrency = async function (body) {
  return await axios
    .post(api.currency, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateCurrency = async function (id, body) {
  return await axios
    .put(api.currency + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteCurrency = async function (id) {
  return await axios
    .delete(api.currency + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Currency Management


//Order Status Management
service.getAllOrderStatus = async function (param) {
  return await axios
    .get(api.orderStatus + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getOrderStatusDetail = async function (param) {
  return await axios
    .get(api.orderStatus + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createOrderStatus = async function (body) {
  return await axios
    .post(api.orderStatus, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateOrderStatus = async function (id, body) {
  return await axios
    .put(api.orderStatus + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteOrderStatus = async function (id) {
  return await axios
    .delete(api.orderStatus + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Order Status Management



//Point Exchange Merchandise Management
service.getAllPointExchange = async function (param) {
  return await axios
    .get(api.pointExchange + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getPointExchangeDetail = async function (param) {
  return await axios
    .get(api.pointExchange + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updatePointExchange = async function (id, body) {
  return await axios
    .put(api.pointExchange + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Point Exchange Merchandise Management



//Merchandise Management
service.getAllMerchandise = async function (param) {
  return await axios
    .get(api.merchandise + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getMerchandiseDetail = async function (param) {
  return await axios
    .get(api.merchandise + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createMerchandise = async function (body) {
  return await axios
    .post(api.merchandise, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateMerchandise = async function (id, body) {
  return await axios
    .put(api.merchandise + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteMerchandise = async function (id) {
  return await axios
    .delete(api.merchandise + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Merchandise Management



//Voucher Theme and Voucher
service.getAllVoucherTheme = async function (param) {
  return await axios
    .get(api.voucherTheme + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getVoucherThemeDetail = async function (param) {
  return await axios
    .get(api.voucherTheme + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createVoucherTheme = async function (body) {
  return await axios
    .post(api.voucherTheme, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateVoucherTheme = async function (id, body) {
  return await axios
    .put(api.voucherTheme + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteVoucherTheme = async function (id) {
  return await axios
    .delete(api.voucherTheme + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.getAllVoucher = async function (param) {
  return await axios
    .get(api.voucher + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getVoucherDetail = async function (param) {
  return await axios
    .get(api.voucher + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.sendVoucher = async function(param, body) {
  return await axios
    .post(api.voucher + param, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function(error) {
      return service.validateError(error);
    });
};
service.createVoucher = async function (body) {
  return await axios
    .post(api.voucher, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateVoucher = async function (id, body) {
  return await axios
    .put(api.voucher + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteVoucher = async function (id) {
  return await axios
    .delete(api.voucher + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//Voucher Theme and Voucher



//Payment Method Management
service.getAllPayment = async function (param) {
  return await axios
    .get(api.payment + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getPaymentMethodDetail = async function (param) {
  return await axios
    .get(api.payment + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createPaymentMethod = async function (body) {
  return await axios
    .post(api.payment, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updatePaymentMethod = async function (id, body) {
  return await axios
    .put(api.payment + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deletePaymentMethod = async function (id) {
  return await axios
    .delete(api.payment + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Payment Method Management



//Notification Management
service.getAllNotification = async function (param) {
  return await axios
    .get(api.notification + "/schedule" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getNotificationDetail = async function (param) {
  return await axios
    .get(api.notification + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createScheduleNotification = async function (body) {
  return await axios
    .post(api.notification + "/schedule", body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createNotification = async function (body) {
  return await axios
    .post(api.notification + "/push-notification", body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateNotification = async function (id, body) {
  return await axios
    .put(api.notification + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateNotificationSchedule = async function (id, body) {
  return await axios
    .put(api.notification + "/schedule/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteNotification = async function (id) {
  return await axios
    .delete(api.notification + "/schedule/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Notification Management

//Ticket Type Management
service.getAllTicketType = async function (param) {
  return await axios
    .get(api.ticketType + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAllParentTicket = async function () {
  return await axios
    .get(api.ticketType + "/parent", service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getTicketTypeDetail = async function (param) {
  return await axios
    .get(api.ticketType + "/detail/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createTicketType = async function (body) {
  return await axios
    .post(api.ticketType, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateTicketType = async function (id, body) {
  return await axios
    .put(api.ticketType + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteTicketType = async function (id) {
  return await axios
    .delete(api.ticketType + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};


// Showroom
service.getAllShowroom = async function (param) {
  return await axios
    .get(api.showroom + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};


service.createShowroom = async function (body) {
  return await axios
    .post(api.showroom, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};


service.deleteShowroom = async function (id) {
  return await axios
    .delete(api.showroom + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAllServiceTicket = async function (param) {
  return await axios
    .get(api.serviceTicket + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getServiceTicketDetail = async function (param) {
  return await axios
    .get(api.serviceTicket + "/detail/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
}; 
service.updateServiceTicket = async function (id, body) {
  return await axios
    .put(api.serviceTicket + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAllAcademyTicket = async function (param) {
  return await axios
    .get(api.academyTicket + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAcademyTicketDetail = async function (param) {
  return await axios
    .get(api.academyTicket + "/detail/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
}; 
service.updateAcademyTicket = async function (id, body) {
  return await axios
    .put(api.academyTicket + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getAllTrainingTicket = async function (param) {
  return await axios
    .get(api.trainingTicket + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getTrainingTicketDetail = async function (param) {
  return await axios
    .get(api.trainingTicket + "/detail/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
}; 
//End Ticket Type Management

//Geo Zone Management

service.getAllGeoZone = async function (param) {
  return await axios
    .get(api.geoZone + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getGeoZoneDetail = async function (param) {
  return await axios
    .get(api.geoZone + "/" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createGeoZone = async function (body) {
  return await axios
    .post(api.geoZone, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateGeoZone = async function (id, body) {
  return await axios
    .put(api.geoZone + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.deleteGeoZone = async function (id) {
  return await axios
    .delete(api.geoZone + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Geo Zone Management

//Zone To Geo Zone Management

service.getAllZoneToGeoZone = async function (param) {
  return await axios
    .get(api.zoneToGeoZone + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.getCountry = async function () {
  return await axios
    .get(api.country, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.getProvince = async function (param) {
  return await axios
    .get(api.province + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getDistrict = async function (param) {
  return await axios
    .get(api.district + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};


service.createZoneToGeoZone = async function (body) {
  return await axios
    .post(api.zoneToGeoZone, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteZoneToGeoZone = async function (id) {
  return await axios
    .delete(api.zoneToGeoZone + "/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Geo Zone Management


//Reviews Management
service.getAllReview = async function (param) {
  return await axios
    .get(api.review + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getReviewDetail = async function (body) {
  return await axios
    .get(api.review, {
      headers: service.headers().headers,
      params: body,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateReview = async function (body) {
  return await axios
    .put(api.review, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteReview = async function (body) {
  return await axios
    .delete(api.review, {
      headers: service.headers().headers,
      data: body
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
//End Reviews Management



//App Version Management
service.getAllAppVersion = async function () {
  return await axios
    .get(api.appVersion, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateAppVersion = async function (id, body) {
  return await axios
    .put(api.appVersion + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};



//Settings Management
service.getAllSetting = async function () {
  return await axios
    .get(api.setting, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateSetting = async function (id, body) {
  return await axios
    .put(api.setting + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};



// Tutorial Playlist
service.getTypeTutorialPlaylist = async function () {
  return await axios
    .get(api.tutorial + "/playlist", service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getTutorialPlaylistByType = async function (param) {
  return await axios
    .get(api.tutorial + "/playlist" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createTutorialPlaylist = async function (body) {
  return await axios
    .post(api.tutorial + "/playlist", body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteTutorialPlaylist = async function (id) {
  return await axios
    .delete(api.tutorial + "/playlist/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.getTutorialPlaylistDetail = async function (id) {
  return await axios
    .get(api.tutorial + "/playlist/" + id, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.updateTutorialPlaylist = async function (id, body) {
  return await axios
    .put(api.tutorial + "/playlist/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
// Tutorial Video
service.getTutorialVideo = async function (param) {
  return await axios
    .get(api.tutorial + "/video" + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.createTutorialVideo = async function (body) {
  return await axios
    .post(api.tutorial + "/video", body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.deleteTutorialVideo = async function (id) {
  return await axios
    .delete(api.tutorial + "/video/" + id, {
      headers: service.headers().headers,
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getTutorialVideoDetail = async function (id) {
  return await axios
    .get(api.tutorial + "/video/" + id, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateTutorialVideo = async function (id, body) {
  return await axios
    .put(api.tutorial + "/video/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
// Shipping

service.getAllShipping = async function (param) {
  return await axios
    .get(api.shipping + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.createShipping = async function (body) {
  return await axios
    .post(api.shipping, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.deleteShipping = async function (id) {
  return await axios
    .delete(api.shipping + "/" + id, {
      headers: service.headers().headers,
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getShowroomDetail = async function (id) {
  return await axios
    .get(api.showroom + "/" + id, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getShippingDetail = async function (id) {
  return await axios
    .get(api.shipping + "/" + id, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.updateShowroom = async function (id, body) {
  return await axios
    .put(api.showroom + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateShipping = async function (id, body) {
  return await axios
    .put(api.shipping + "/" + id, body, service.headers())

    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
// Get place
service.getStreetAddressFrom = async function (location) {
  return await axios
    .get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
      location.lat +
      "," +
      location.lng + "&key=AIzaSyAoICXqGkchKOAwsgZePC1D36JQmhcybHA")
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

// Dashboard
service.getReportUserGraphData = async function () {
  return await axios
    .get(api.report + "/user-register-graph-data", service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.getPaymentGraphData = async function () {
  return await axios
    .get(api.report + "/payment-graph-data", service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
// Order
service.getAllOrder = async function (param) {
  return await axios
    .get(api.order + param, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};

service.getOrderDetail = async function (id) {
  return await axios
    .get(api.order + "/" + id, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
service.updateOrder = async function (id, body) {
  return await axios
    .put(api.order + "/" + id, body, service.headers())
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return service.validateError(error);
    });
};
// =====================================================================================

export default service;