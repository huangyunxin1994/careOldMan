<template>
  <div class="batchImport">
    <el-dialog title="批量导入" :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
    	<!-- <p class="title">批量导入</p> -->
      <div class="handleEquipment">
        <p class="handleTitle">说明:</p>
        <p class="handleContent" style="line-height: 25px;">请先下载模板，在模板内填写必要信息，确认无误后，导入模板文件即可。</p>
        <!-- <p class="constraintImport">
          <el-checkbox v-model="checked"  class="remember">强制导入</el-checkbox>
        </p> -->
    	</div>
      <div class="btnWrap">
        <el-link type="primary" href="http://192.168.1.9:8083/equipment/download" download="">下载模板</el-link>
        <el-button type="primary" @click="importTemplate">导入</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { downloadModal } from '@/api/api'
  export default {
    data(){
      return{
        dialogPassVisible:false,
        checked:false
      }
    },
    methods:{
      importTemplate(){
        this.dialogPassVisible = false
      },
      handleClose(){
        this.dialogPassVisible = false
      }
    },
    mounted(){

    },
  }
</script>

<style lang="scss">
  .batchImport /deep/.el-dialog--center .el-dialog__body{
    text-align: initial;
    padding: 0px 25px 30px !important;
  }
</style>
<style scoped lang="scss">

  .title{
    font-weight: 600;
    font-size: 17px;
    text-align: center;
  }
  .btnWrap{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
