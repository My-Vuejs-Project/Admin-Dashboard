import { VueTelInput } from 'vue-tel-input'

export default {
    name: "register",
    data() {
        return {
            phone: {
                number: '',
                valid: false,
                country: undefined,
                formattedNumber:''
              },
            form :{
                register: true,
                verify: false
            }
        }
    },
    components:{
        VueTelInput
    },
    created(){

    },
    mounted(){

    },
    methods: {
        routerLink(){
            this.$router.push({name : 'login'});
        },
        onInput(formattedNumber, { number, valid, country }) {
            this.phone.number = number.international;
            this.phone.valid = valid;
            this.phone.country = country && country.name;

            const formattedNumbers = this.phone.number.replace(/\s/g, '')
            this.phone.formattedNumber = formattedNumbers;
        },
        goverify(){
            this.form.register = !this.form.register
            this.form.verify = !this.form.verify
        }
    }

}