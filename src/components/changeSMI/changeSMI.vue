<template>
  <div>
    <el-dialog title="修改SIM卡"  :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
    	<div class="handleEquipment">
        <el-form ref="form" label-width="80px">
          <el-form-item label="SIM卡号码">
            <el-input v-model="phone"></el-input>
          </el-form-item>
        </el-form>
    	</div>
      <div class="btnWrap">
        <!-- <el-button type="primary" @click="downloadTemplate">下载模板</el-button> -->
        <el-button type="primary" @click="importTemplate">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        dialogPassVisible:false,
        checked:false,
        phone:'',
      }
    },
    methods:{
      // 下载模板
      downloadTemplate(){
        this.dialogPassVisible = false
      },
      //获取sim数据
      getSimNumber(val){
        this.dialogPassVisible = true
        this.phone = val
      },
      importTemplate(){
         this.$confirm('确认提交吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit("updateEquip",this.phone)
          this.dialogPassVisible = false
        }).catch(() => {
                   
        });
        
      },
      handleClose(){
        this.dialogPassVisible = false
      }
    },
    mounted(){

    },
  }
</script>

<style scoped lang="scss">

  .handleContent{
    text-indent: 2em;
  }
  .constraintImport{
    padding: 10px 0px;
  }
  .btnWrap{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
