
export default {
  props: {
    items: Array, 
    itemSelected: "",
    keyword: String,
  },
  data() {
    return {
      data: {
        itemStored: [],
        items: [],
        isSelected: true,
      }
    };
  },

  components: {},

  created() {
    this.data.itemStored = this.items
    this.data.items  = this.items
    this.searching()
  },
  watch: {
    keyword :function() { 
      this.searching()
    }
  },
  mounted() {
 
  },

  methods: {
    selectionItem(item){
      this.$emit("existed", item);
      this.data.isSelected = false
    },
    searching(){
      if (this.keyword == "") {
        this.data.items = this.data.itemStored
      }else {
        var list = this.data.itemStored.filter((item) => {
          return this.keyword.toLowerCase().split(' ').every(v => item.name.toLowerCase().includes(v));
        });
        this.data.items = list
      }
    }
  }
};
