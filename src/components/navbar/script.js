import Service from './../../utils/api/service'
import Menusidebar from './../sidebar'

export default {
  name: 'navbar',
  data(){
    return{
      display:{
        modal:{
          profile: false,
          sidebar: false,
          logout:false
        }
      }
    }
  },
  components: { 
    Menusidebar
  },
  created(){

  },
  methods: {
    popup(type){
      if(type == "profile"){
        this.display.modal.profile = true
      }else if(type == 'sidebar'){
        this.display.modal.sidebar = true
      }
      else{
        this.display.modal.profile = false
        this.display.modal.sidebar = false
      }
    },
    closemodel(){
      this.display.modal.profile = false
      this.display.modal.sidebar = false
    },
    logout(){
      this.display.modal.logout = false
      Service.logout()
    },
  }
}