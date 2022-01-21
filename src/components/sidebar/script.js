import { mapState } from "vuex";

export default {
  name: "the-sidebar",
  data() {
    return {
      display: {
        menu: "dashboard",
      },
      menu_list: [],
      menus: [
        {
          name: "Dashboard",
          title: "DASHBOARD",
          routeName: "dashboard",
          icon: "fas fa-tachometer-alt",
        },
        {
          name: "Customer",
          title: "CUSTOMER",
          routeName: "ListCustomer",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Customer Group",
          title: "CUSTOMER_GROUP",
          routeName: "ListCustomerGroup",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Advertisement",
          title: "ADVERTISEMENT",
          routeName: "ListAdvertisement",
          icon: "fas fa-bullhorn",
        },
        {
          name: "Brand",
          title: "BRAND",
          routeName: "ListBrand",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Category",
          title: "CATEGORY",
          routeName: "ListCategory",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Coupon",
          title: "COUPON",
          routeName: "ListCoupon",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Manufacturers",
          title: "MANUFACTURER",
          routeName: "ListManufacturer",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Options",
          title: "OPTION",
          routeName: "ListOption",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Product",
          title: "PRODUCT",
          routeName: "ListProduct",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Product Discount",
          title: "PRODUCT_DISCOUNT",
          routeName: "ListProductDiscount",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Stock Status",
          title: "STOCK_STATUS",
          routeName: "ListStockStatus",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Top Selection",
          title: "TOP_SELECTION",
          routeName: "ListTopSelection",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Unit of Measurement",
          title: "UNIT_OF_MEASURE",
          routeName: "ListUnitOfMeasure",
          icon: "fas fa-angle-double-right",
        },
        
        {
          name: "Order",
          title: "ORDER",
          routeName: "ListOrder",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Order Status",
          title: "ORDER_STATUS",
          routeName: "ListOrderStatus",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Merchanside",
          title: "MERCHANDISE",
        },
        {
          name: "Voucher",
          title: "VOUCHER",
          routeName: "ListVoucher",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Voucher Theme",
          title: "VOUCHER_THEME",
          routeName: "ListVoucherTheme",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Currency",
          title: "CURRENCY",
          routeName: "ListCurrency",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Payment Method",
          title: "PAYMENT_METHOD",
          routeName: "ListPaymentMethod",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Notification",
          routeName: "ListNotification",
          title: "NOTIFICATION",
          icon: "far fa-bell",
        },
        {
          name: "Geo Zone",
          title: "GEO_ZONE",
          routeName: "ListGeoZone",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Zone to Geo Zone",
          title: "ZONE_TO_GEO_ZONE",
          routeName: "ListZoneToGeoZone",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Ticket Type",
          title: "TICKET_TYPE",
        },
        {
          name: "Ticket",
          title: "TICKET",
        },
        {
          name: "Tutorial Playlist",
          title: "TUTORIAL_PLAYLIST",
          routeName: "ListTutorialPlaylist",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Tutorial Video",
          title: "TUTORIAL_VIDEO",
          routeName: "ListTutorialVideo",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Shipping courier",
          routeName: "ListShipping",
          title: "SHIPPING_COURIER",
          icon: "fa fa-shopping-cart",
        },
        {
          name: "Showroom",
          routeName: "ListShowroom",
          title: "SHOWROOM",
          icon: "fas fa-store-alt",
        },
        {
          name: "Review",
          routeName: "ListReview",
          title: "REVIEW",
          icon: "far fa-edit",
        },
        {
          name: "Report",
          routeName: "ListReportOrder",
          title: "REPORT",
          icon: "fas fa-file-contract",
        },
        {
          name: "Admin Accounts",
          title: "ADMIN_ACCOUNT",
          routeName: "ListAdminAccount",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "Role Management",
          title: "ADMIN_ROLE",
          routeName: "ListRole",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "System Settings",
          title: "SETTING",
          routeName: "ListSettings",
          icon: "fas fa-angle-double-right",
        },
        {
          name: "App Version",
          title: "APP_VERSION",
          routeName: "ListAppVersion",
          icon: "fas fa-angle-double-right",
        },
      ],
    };
  },
  components: {},
  created() {},

  computed: mapState(["accountInfo"]),

  watch: {
    "$store.state.accountInfo": function() {
      this.getPermission();
    },
  },

  methods: {
    getPermission() {
      if (this.$store.state.accountInfo) {
        let permissions = this.$store.state.accountInfo.role.permissionGroups;

        const menu = this.menus;

        let permission = [];

        // ========= FILTER EVERY PERMISSION THAT GET FROM API TO COMPARE WITH MENU STORED IN STATE ============
        let mainMenu = menu.filter(function(menu) {
          return permissions.some(function(el) {
            if (menu.title === el.groupName) {
              permission.push(el);
            }
            return menu.title === el.groupName;
          });
        });

        // ========= CHECK IF THE PERMISSION HAVE SUB MENU ============
        let customerChildren = [];
        let catalogChildren = [];
        let merchandiseChildren = [];
        let voucherChildren = [];
        let paymentChildren = [];
        let addressChildren = [];
        let ticketChildren = [];
        let tutorialChildren = [];
        let orderChildren = [];
        let settingChildren = [];

        mainMenu.find((item, index) => {
          //check if mainMenu have sub menu of CUSTOMER AND CUSTOMER GROUP. Then store in it one array (customerChildren)
          if (item.title == "CUSTOMER" || item.title == "CUSTOMER_GROUP") {
            customerChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group CATALOG then store in it one array (catalogChildren)
          else if (
            item.title == "BRAND" ||
            item.title == "CATEGORY" ||
            item.title == "COUPON" ||
            item.title == "MANUFACTURER" ||
            item.title == "OPTION" ||
            item.title == "PRODUCT" ||
            item.title == "PRODUCT_DISCOUNT" ||
            item.title == "STOCK_STATUS" ||
            item.title == "TOP_SELECTION" ||
            item.title == "UNIT_OF_MEASURE"
          ) {
            catalogChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group ORDER then store in it one array (orderChildren)
          else if (item.title == "ORDER" || item.title == "ORDER_STATUS") {
            orderChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group POINT AND MERCHANDISE then store in it one array (merchandiseChildren)
          else if (item.title == "MERCHANDISE") {
            // create new array as Point and Merchandise have seperate table in Admin Dashboard but stay under one permission group
            let children = [
              {
                name: "Merchandise",
                title: "MERCHANDISE",
                routeName: "ListMerchandise",
                icon: "fas fa-angle-double-right",
              },
              {
                name: "Point Exchange",
                title: "POINT_EXCHANGE",
                routeName: "ListPointExchange",
                icon: "fas fa-angle-double-right",
              },
            ];

            merchandiseChildren = children;
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group VOUCHER then store in it one array (voucherChildren)
          else if (item.title == "VOUCHER" || item.title == "VOUCHER_THEME") {
            voucherChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group PAYMENT then store in it one array (paymentChildren)
          else if (item.title == "CURRENCY" || item.title == "PAYMENT_METHOD") {
            paymentChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group ADDRESS then store in it one array (addressChildren)
          else if (
            item.title == "GEO_ZONE" ||
            item.title == "ZONE_TO_GEO_ZONE"
          ) {
            addressChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group TICKET then store in it one array (ticketChildren)
          else if (item.title == "TICKET_TYPE" || item.title == "TICKET") {
            //create new sub menu
            let children = [
              {
                name: "Ticket Type",
                title: "TICKET_TYPE",
                routeName: "ListTicketType",
                icon: "fas fa-angle-double-right",
              },
              {
                name: "Service",
                title: "SERVICE",
                routeName: "ListServiceTicket",
                icon: "fas fa-angle-double-right",
              },
              {
                name: "Academy",
                title: "ACADEMY",
                routeName: "ListAcademyTicket",
                icon: "fas fa-angle-double-right",
              },
              {
                name: "Training",
                title: "TRAINING",
                routeName: "ListTrainingTicket",
                icon: "fas fa-angle-double-right",
              },
            ];

            ticketChildren = children;
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group TUTORIAL then store in it one array (tutorialChildren)
          else if (
            item.title == "TUTORIAL_PLAYLIST" ||
            item.title == "TUTORIAL_VIDEO"
          ) {
            tutorialChildren.push(item);
            mainMenu[index].hidden = true;
          }

          //check sub menu of permission group SETTING then store in it one array (settingChildren)
          else if (
            item.title == "ADMIN_ACCOUNT" ||
            item.title == "ADMIN_ROLE" || 
            item.title == "APP_VERSION"||
            item.title == "SETTING"
          ) {
            settingChildren.push(item);
            mainMenu[index].hidden = true;
          }
        });

        // ========= ADD SUB-MENU UNDER MAIN MENU ============
        // Customer
        if (customerChildren.length > 0) {
          let obj = {
            name: "Customer",
            routeName: "",
            title: "Customer",
            icon: "fas fa-user-friends",
            dropdown: false,
            children: customerChildren,
          };
          // reorder the main menu
          mainMenu.splice(1, 0, obj);
        }

        // Catalog
        if (catalogChildren.length > 0) {
          let obj = {
            name: "Catalog",
            routeName: "",
            title: "Catalog",
            icon: "fas fa-tags",
            dropdown: false,
            children: catalogChildren,
          };
          mainMenu.splice(5, 0, obj);
        }

        // Order
        if (orderChildren.length > 0) {
          let obj = {
            name: "Order",
            routeName: "",
            title: "Order",
            icon: "fa fa-cart-plus",
            dropdown: false,
            children: orderChildren,
          };
          mainMenu.splice(6, 0, obj);
        }

        // Point and Merchandise
        if (merchandiseChildren.length > 0) {
          let obj = {
            name: "Point & Merchandise",
            routeName: "",
            title: "Point & Merchandise",
            icon: "fas fa-star",
            dropdown: false,
            children: merchandiseChildren,
          };
          mainMenu.splice(7, 0, obj);
        }

        // Voucher
        if (voucherChildren.length > 0) {
          let obj = {
            name: "Voucher",
            routeName: "",
            title: "Voucher",
            icon: "fas fa-percent",
            dropdown: false,
            children: voucherChildren,
          };
          mainMenu.splice(8, 0, obj);
        }

        // Payment
        if (paymentChildren.length > 0) {
          let obj = {
            name: "Payment",
            routeName: "",
            title: "Payment",
            icon: "fas fa-money-check",
            dropdown: false,
            children: paymentChildren,
          };
          mainMenu.splice(9, 0, obj);
        }

        // Ticket
        if (ticketChildren.length > 0) {
          let obj = {
            name: "Ticket",
            routeName: "",
            title: "Ticket",
            icon: "fas fa-ticket-alt",
            dropdown: false,
            children: ticketChildren,
          };
          mainMenu.splice(28, 0, obj);
        }

        // Tutorial
        if (tutorialChildren.length > 0) {
          let obj = {
            name: "Tutorial",
            routeName: "",
            title: "Tutorial",
            icon: "fa fa-video",
            dropdown: false,
            children: tutorialChildren,
          };
          mainMenu.splice(29, 0, obj);
        }

        // Address
        if (addressChildren.length > 0) {
          let obj = {
            name: "Address",
            routeName: "",
            title: "Address",
            icon: "fa fa-map-marker",
            dropdown: false,
            children: addressChildren,
          };
          mainMenu.splice(30, 0, obj);
        }

        // Setting
        if (settingChildren.length > 0) {
          // add new object (PROFILE) to sub menu of SETTING
          let profile = {
            name: "Profile",
            title: "ADMIN_ACCOUNT",
            routeName: "Profile",
            icon: "fas fa-angle-double-right",
          };

          settingChildren.unshift(profile);

          let obj = {
            name: "Setting",
            routeName: "",
            title: "Setting",
            icon: "fas fa-cog",
            dropdown: false,
            children: settingChildren,
          };
          mainMenu.push(obj);
        }

        // ========= STORE FINAL MENU TO LOCAL STATE AND VUEX ============
        this.menu_list = mainMenu;
        this.$store.dispatch("storePermission", permissions);
      }
    },

    dorpDown(index) {
      let item = this.menu_list[index];
      item.dropdown = !item.dropdown;
    },
  },
};
