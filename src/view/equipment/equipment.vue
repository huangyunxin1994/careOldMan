<template>
  <div class="wrap">
    <wt-header></wt-header>
    <div class="main">
      <div class="contentLeft">
        <my-tree @getPlatformData="getPlatformData"></my-tree>
      </div>
          <div class="enroll-manage-main">
              <div class="enroll-manage-container" ref="container">
                  <div class="enroll-manage-container-handle" >
                    <div class="selectLeft">
                      <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw; margin-right: 20px;"></el-input>
                      <div class="selectItem">
                          <label for="" class="enroll-manage-container-handle-label">设备状态</label>
                          <el-select v-model="valueW" style="width: 10vw;" filterable placeholder="请选择" @change="changeResultW">
                              <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                              </el-option>
                          </el-select>
                      </div>
                    </div>
                    <div class="selectItem" >
                      <el-button type="primary" @click="syncEquipment">开始同步设备</el-button>
                      <el-button type="primary" @click="importMess">批量导入信息</el-button>
                    </div>
                  </div>
                  <el-table
                      :data="tables"
                      border stripe highlight-current-row
                      size="mini" v-loading="listLoading"
                      @selection-change="selsChange"
                      class="myTable" ref="table"
                      height="calc(100vh - 260px)"
                      :row-key="getRowKeys">
                       <el-table-column type="selection" width="55" :reserve-selection="true">
                       </el-table-column>
                       <el-table-column type="index" width="60" label="序号">
                       </el-table-column>
                       <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false" show-overflow-tooltip>
                           <template slot-scope="scope">
                               <div v-if="item.type=='handle'" align="center">
                                 <el-button  type="primary" icon="el-icon-edit" size="small" round @click="changeSMI(scope.$index, scope.row)">修改</el-button>

                               </div>
                               <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                           </template>
                       </el-table-column>

                   </el-table>
                   <div class="foot">
                     <el-button type="danger"  :disabled="this.asels.length===0">批量删除</el-button>
                     <div class="enroll-check-container-tools">
                         <span class="enroll-check-container-tools-span"></span>
                         <el-pagination
                     						background
                     						layout="total, sizes, prev, pager, next, jumper"
                     						@current-change="handleCurrentChange"
                     						@size-change="handleSizeChange"
                     						:current-page="page"
                     						:page-sizes="[10, 15, 20, 25]"
                     						:page-size="pageSize"
                     						:total="count" >
                          </el-pagination>
                     </div>
                   </div>
              </div>
          </div>
    </div>
    <dialog-batch ref="batchMess" :platformId="platformId"></dialog-batch>
    <dialog-smi ref="changeSmi" @updateEquip="updateEquip" ></dialog-smi>
  </div>
</template>

<script>
  import WtHeader from '@/components/myHeader/myHeader.vue'
  import dialogBatch from '@/components/dialogBatchMess/dialogBatchMess.vue'
  import dialogSmi from '@/components/changeSMI/changeSMI.vue'
  import myTree from '@/components/tree/tree_.vue'
  import { getEquipment, updateEquipment, downloadModal, synchronization } from '@/api/api'
  export default {
    name:'home',
    components:{
      WtHeader,
      dialogBatch,
      dialogSmi,
      myTree
    },
    data(){
      return{
        equipmentSearch:'',
        listLoading:false,
        asels:"",//用来存放选中的值
        inputValue:"",
        page:1,
        disableda:true,
        pageSize:10,
		count:0,
        tableTitle:[
            { title : "设备编号", name : "code", type:"input",width:"200"},
            { title : "设备状态", name : "equipmentState", type:"input",width:'100'},
            { title : "关联人员", name : "name", type:"input",minwidth:'150'},
            { title : "所属平台", name : "platformName", type:"input",minwidth:'150'},
            { title : "注册时间", name : "addTime", type:"input",width:'150'},
            { title : "SIM卡号码", name : "phone", type:"input",width:'150'},
            { title : "操作", type : "handle",button:[],width:'100' }
        ],
        tableData:[],
        tableAllData: [],
        clientHeight:'',
        platformId:"",
        options:[
            {
				value: '',
				label: '全部'
            },
            {
				value: '1',
				label: '在线'
            },
			{
				value: '2',
				label: '离线'
            },
			{
				value: '3',
				label: '预警'
			}
        ],
        valueW:"",
        uCode:"",

      }
    },
    methods:{
      getEquipment(){
        getEquipment().then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
      },
      getPlatformData(id){
        this.platformId = id
        getEquipment({platformId:id}).then(res=>{
           this.tableData = res.data.data
          this.tableAllData = res.data.data
        }).catch(err=>{
          console.log(err)
        })
      },
      //性别显示转换
      formatSex: function (row, column) {
                //console.log(column.property)
                if(column.property=="sex")
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '';
                else
                return row[column.property]
      },
      arrFormatter (value,name) {
           if(name=='sex')
           return value == 1 ? '男' : value == 0 ? '女' : '';
          else if(name=='multiplexMark')
           return value == 1 ? '是' : value == 0 ? '否' : '';
          else if(name=='isEnable')
           return value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">是</span>' :( value == 2 ? '<span style="color:#909399;font-weight:bold">否</span>' : ( value == 3 ? '<span style="color:#67C23A;font-weight:bold">进行中</span>' : ( value == 4 ? '<span style="color:#909399;font-weight:bold">已结束</span>' : '')));
          else if(name=='equipmentState')
           return value == 2 ? '<span style="color:#f79898;font-weight:bold">离线</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">在线</span>' : ( value == 3 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">预警</span>' : ''));
          else
           return value;

      },
	  //当前页
      handleCurrentChange(val){
         this.page = val;
		 let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize
		 }
		 getEquipment(param).then(res=>{
		   this.tableData = res.data.data
		   this.tableAllData = res.data.data
		   this.count = res.data.count
		 }).catch(err=>{
		   console.log(err)
		 })
      },
	  //页数大小
      handleSizeChange(val){
      	this.pageSize = val
		let param = {
			 currentPage:this.page,
			 pageSize:this.pageSize
		}
		getEquipment(param).then(res=>{
		  this.tableData = res.data.data
		  this.tableAllData = res.data.data
		  this.count = res.data.count
		}).catch(err=>{
		  console.log(err)
		})
      },
      changeResultW(val){
          this.tableData = this.tableAllData.filter(item=>{
              return String(item.equipmentState).indexOf(val) > -1
          })
      },
      //同步设备
      syncEquipment(){
        this.$confirm('是否开始同步设备列表?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            synchronization().then(res=>{
              if(res.code==0){
                 this.$message({
                  type: 'success',
                  message: '同步成功!'
                });
              }else{
                 this.$message({
                  type: 'error',
                  message: '同步失败!'
                });
              }

            }).catch(err=>{
                this.$message({
                  type: 'error',
                  message: '同步失败!'
                });
            })
           
          }).catch(() => {
          });
      },
      //批量导入
      importMess(){
        if(this.platformId!=""){
          this.$refs.batchMess.dialogPassVisible = true
        }else{
          this.$message({
              type: 'warning',
              message: '请选择平台后再继续'
            });
        }
        
      },
      /****** 修改SIM卡 start ******/
      changeSMI(index,row){
        this.uCode = row.code
        this.$refs.changeSmi.getSimNumber(row.phone)
      },
      updateEquip(phone){
        updateEquipment({code:this.uCode,phone:phone}).then(res=>{
          if(res.code == 0){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.tableData[this.tableData.findIndex(i => i.code == this.uCode)].phone = phone
            this.uCode = ""
          }else{
            this.$message({
              message: '修改失败',
              type: 'error'
            });
            this.uCode = ""
          }

        }).catch(err=>{
          this.$message({
              message: '修改失败',
              type: 'error'
            });
        })
      },
      /****** 修改SIM卡 end ******/
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
      //选中批量值
      selsChange(sels){
        this.asels = sels
      },
      getRowKeys(row) {
          return row.code;
      },
      //删除批量
      deleteFileOrDirectory(){
        var ids= this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
          console.log(ids)
          this.$confirm('此操作将删除选中项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              console.log("删除成功")
          }).catch(()=>{
              console.log("删除失败")
          })
      },
      //将tabledata的值传给tableAllData(到真正对接时就不用)
      getTableAllData(){
        getEquipment().then(res=>{
		  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
          console.log(res)
          this.tableData = res.data.data
          this.tableAllData = res.data.data
		  this.count = res.data.count
        }).catch(err=>{
          console.log(err)
        })
        // this.tableAllData = this.tableData
      }
    },
    mounted(){
      this.getTableAllData()
    },
    computed:{
      tables:function(){
        var search=this.inputValue;
        if(search){
             let arr = []
            this.tableTitle.forEach(e => {
                if(e.name)
                arr.push(e.name)
            });
          return  this.tableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
                    return String(arr).indexOf(key)>-1&&String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData
      }
    },
  }
</script>

<style lang="scss" scoped>
  /deep/.el-table--mini td{
    padding: 0px;
  }
  .main{
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px;
  }
  .contentLeft{
    width: 200px;
    min-width: 200px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    box-sizing: border-box;
    height: calc(100vh - 100px);
    padding: 0.5vw;
    overflow: hidden;
    margin-right: 20px;
    overflow: hidden;
  }
  .enroll-manage-main {
      height: calc(100vh - 100px);
      width: calc(100vw - 260px);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      .enroll-manage-container{
        box-sizing: border-box;
        padding: 20px;
          &-title{
              margin-bottom: 20px;
              padding: 2px 0;
              border-left: 4px solid #409EFF;
              text-indent: 20px;
              font-size: 18px;
              font-weight: 700;
          }
          &-handle{
              margin-bottom:20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              &-label{
                  font-size: 0.8vw;
                  color: #606266;
                  font-weight: 700;
              }
              .selectItem{
                display: flex;
                align-items: center;
                justify-content: flex-start;
              }
          }
          &-tools{
              display: flex;
              justify-content: space-between;
              align-items: center;
              &-span{
                 font-size: 14px;
                  color: #606266;
                  font-weight: 700;
              }
          }
      }
  }
  .selectLeft{
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .foot{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
