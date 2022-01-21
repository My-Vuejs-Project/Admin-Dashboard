import Service from '../../../../utils/api/service'

export default {
  name: 'CreateAdminAccount',
  data() {
    return {
      isCreating: false,
      show: false,
      display: {
        modal: {
          formError: false,
          media: false,
        },
        message: {
          responseError: '',
        },
      },
      body: {
        email: '',
        firstName: '',
        lastName: '',
        roleId: '',
        password: '',
      },
      data:{
        roleList: [],
      },
      limit: 10,
    }
  },
  components: {},

  computed: {},

  created() {
    this.getAllRole(this.limit)
  },

  methods: {
    preventNav(event) {
      if (
        !this.body.email ||
        !this.body.firstName ||
        !this.body.lastName ||
        !this.body.roleId ||
        !this.body.password
      )
        return
      event.preventDefault()
      event.returnValue = ''
    },

    goBack() {
      this.$router.push({
        name: 'ListAdminAccount',
      })
    },

    closeModal() {
      this.display.modal.formError = false
      this.display.modal.media = false
    },

    getAllRole(limit) {
      let param = '?status=active&limit=' + limit
      Service.getAllRole(param).then((response) => {
        if (response.statusCode) {
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.getAllRole(limit)
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.data.roleList = response.data
        }
      })
    },

    submitCreateAccountAdmin() {
      let validatedMessage = this.validateBody(this.body)
      if (validatedMessage == 'ok') {
        this.isCreating = true
        this.createAccountAdmin()
      } else {
        this.$toasted.show(validatedMessage)
      }
    },

    validateBody(data) {
      if (!data.firstName) {
        return 'Firstname cannot be empty!'
      } else if (!data.lastName) {
        return 'Lastname cannot be empty!'
      } else if (!data.email) {
        return 'Email cannot be empty!'
      } else if (!data.password) {
        return 'Password cannot be empty!'
      } else if (!data.roleId) {
        return 'Role cannot be empty!'
      } else {
        return 'ok'
      }
    },

    createAccountAdmin() {
      let body = {
        email: this.body.email,
        firstName: this.body.firstName,
        lastName: this.body.lastName,
        password: this.body.password,
        roleId: this.body.roleId,
      }

      Service.createAdminAccount(body).then((response) => {
        this.isCreating = false
        if (response.statusCode) {
          if (response.statusCode == '4410') {
            Service.refreshToken().then((response) => {
              if (response == 'ok') {
                this.createAccountAdmin()
              }
            })
          } else {
            this.$toasted.show(response.message.capitalize())
          }
        } else {
          this.resetBody()
          this.$toasted.show('Account admin has been created.')
        }
      })
    },

    resetBody() {
      this.body = {
        email: '',
        firstName: '',
        lastName: '',
        roleId: '',
        password: '',
      }
    },
  },
}
