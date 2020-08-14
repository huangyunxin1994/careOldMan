<template>
  <div class="wrap">
    <el-input
      v-model="input"
      :placeholder="placeholder"
      :disabled="disabled"
      :show-password="showPass"
      clearable>
    </el-input>
  </div>
</template>

<script>
  export default{
    // props:["placeholder","disabled","showPass"],
    // props:[
    //   type:Array,
    //   required:true
    // ]
    data(){
      return{
        input:'',
        placeholder:'',
        disabled:'',
        showPass:'',
      }
    },
    methods:{
      getInput(val){
        console.log(val)
        this.placeholder = val.wtPlaceholder,
        this.disabled = val.wtDisabled,
        this.showPass = val.wtShowPass
      }
    }
  }
</script>

<style>
</style>
