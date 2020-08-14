<template>
  <div class="wtbody">
    <el-dialog :title="platformName"  :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" minwidth="500px">
      <div class="contentSwarp">
          <el-form ref="form" label-width="120px" class="content">
            <el-form-item label="下级域名称">
              <el-input v-model="name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="下级域地址">
              <el-input v-model="Ip" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="同步状态">
              <el-input v-model="state" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
      </div>
      <div class="contentSwarp">
          <el-form ref="form" label-width="120px" class="content">
            <el-form-item label="上级域名称">
              <el-input v-model="name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="上级域地址">
              <el-input v-model="Ip" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="同步状态">
              <el-input v-model="state" class="stateInput" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        dialogPassVisible:false,
        checked:false,
        name:'南宁总局',
        state:'同步',
        Ip:'192.168.1',
        platformName:'XXX平台配置'
      }
    },
    methods:{
      // 下载模板
      downloadTemplate(){
        this.dialogPassVisible = false
      },
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

<style scoped lang="scss">
  .wtbody{
    background-color: #ccc !important;
  }
  .handleEquipment{
    // text-align: center;
  }
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

  .contentSwarp{
    box-sizing: border-box;
    padding: 20px;
  }
  .content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: #ccc;
    padding: 10px 0px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  }
  .stateInput{
    // border: 1px solid transparent !important;
  }

  .el-form-item{
    margin-bottom: 0px !important;
    margin-right: 20px !important;
  }
  .el-dialog{
    background-color: #ccc !important;
  }
  .el-dialog__header,.el-dialog--center .el-dialog__body{
    background-color: #ccc !important;
  }
</style>
