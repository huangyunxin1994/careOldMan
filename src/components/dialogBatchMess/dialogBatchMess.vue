<template>
  <div class="batchImport">
    <el-dialog title="" :visible.sync="dialogPassVisible" center :before-close="handleClose" :lock-scroll="false"  width="500px">
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
        <el-upload
        ref="upload"
        class="upload-demo"
        action=""
        :show-file-list="false"
        :http-request="httpRequest"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="1"
        accept="application/vnd.openxmlformats-    
        officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        :auto-upload="false">
        <el-button type="primary">导入</el-button>
        </el-upload>
        
      </div>
      
      </el-dialog>
     <el-dialog
        :title="title"
        :visible.sync="centerDialogVisible"
        width="500px"
        :show-close="false" :close-on-click-modal="false"
        center>
         <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" v-show="showflag" :color="customColor"></el-progress>
            <div v-show="repeatList.length>0" class="repeat-list">
              <div v-for="item in repeatList" :key="item.code"  class="repeat-list-item">
                <span>第{{item.uploadInterval}}行</span>
                <span>设备编号重复</span>
                <span>设备编号：{{item.code}}</span>
              </div>
             
            </div>
           <div class="btnWrap2" v-show="repeatList.length>0">
              <el-button type="primary" @click="nextToImport" v-show="!nexted">强制导入全部数据</el-button>
              <el-button type="primary" @click="centerDialogVisible = false" >结束</el-button>
            </div>
         
        </el-dialog>
  </div>
</template>

<script>
  import { downloadModal,ImportExcel,forceImport } from '@/api/api'
  export default {
    props:{
      platformId:String
    },
    data(){
      return{
        centerDialogVisible:false,
        dialogPassVisible:false,
        checked:false,
        showflag:false,
        percentage:0,
        customColor:"#409EFF",
        timeName:null,
        repeatList:[],
        equipmentList:[],
        title:'正在导入',
        nexted:false,
        list:{},
      }
    },
    methods:{
      httpRequest(param) {
        this.dialogPassVisible =false
        this.centerDialogVisible=true
        this.showflag=true
        this.timeName = setInterval(_=>{
          this.percentage++
        },100)
        setTimeout(_=>{
          console.log(this.percentage)
          clearInterval(this.timeName)
          console.log(param)
          let fileObj = param.file // 相当于input里取得的files
          let fd = new FormData()// FormData 对象
          fd.append('multipartFile ', fileObj)// 文件对象
          fd.append('platformId', this.platformId)
          ImportExcel(fd).then(res=>{
                if(res.code == 0){
                    this.percentage=100
                    this.customColor="#67C23A"
                    this.title = "导入成功"
                     this.$message({
                        type: 'success',
                        message: '导入成功'
                      });
                }else{
                  // res.data = JSON.parse(res.data)
                  // console.log( res.data )
                  this.title='导入中止'
                   this.customColor="#E6A23C"
                  this.repeatList = res.data.List.repeatList
                  this.list = res.data.List
                }
            }).catch(err=>{

          })
        },6000)
          
        
        
       
      },
      nextToImport(){
         this.title='正在导入'
        this.nexted = true
        this.customColor="#409EFF"
        let timeName = setInterval(_=>{
          this.percentage++
        },100)
        setTimeout(_=>{
          console.log(this.percentage)
          clearInterval(timeName)
          this.list.platformId = this.platformId
         
          forceImport(this.list).then(res=>{
            this.percentage=100
            if(res.code == 0){
              this.title = "导入成功"
              this.customColor="#67C23A"
              this.$message({
                  type: 'success',
                  message: '导入成功'
                });
            }else{
               this.title = "导入失败"
               this.customColor="#F56C6C"
                this.$message({
                  type: 'error',
                  message: '导入失败'
                });
                
            }
          }).catch(err=>{
            this.percentage=100
            this.title = "导入失败"
             this.customColor="#F56C6C"
             this.$message({
                  type: 'error',
                  message: '导入失败'
                });
          })
        },3500)
        
      },
      importTemplate(){
        this.dialogPassVisible = false
      },
      handleClose(){
        this.dialogPassVisible = false
      },
       //上传文件时处理方法  
        handleChange(file, fileList){
            this.fileTemp = file.raw;
            if(this.fileTemp){
                if((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') 
                    || (this.fileTemp.type == 'application/vnd.ms-excel')){
                      this.$refs.upload.submit();
                    
                } else {
                    this.$message({
                        type:'warning',
                        message:'附件格式错误，请删除后重新上传！'
                    })
                }
            } else {
                this.$message({
                    type:'warning',
                    message:'请上传附件！'
                })
            }
        },
        //超出最大上传文件数量时的处理方法
        handleExceed(){
            this.$message({
                type:'warning',
                message:'超出最大上传文件数量的限制！'
            })
            return;
        },
        //移除文件的操作方法
        handleRemove(file,fileList){
            this.fileTemp = null
        },
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
  .btnWrap2{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .repeat-list{
    margin: 20px 0;
    border: 1px solid #d7dae2;
    padding: 5px;
    border-radius: 5px;
    &-item{
      display: flex;
    align-items: center;
    justify-content: space-around;
    }
  }
</style>
