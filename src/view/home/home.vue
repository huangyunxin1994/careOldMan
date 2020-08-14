<template>
  <div class="wrap">
    <wt-header></wt-header>
        <div class="enroll-manage-main">
            <div class="enroll-manage-container" ref="container">
                <div class="enroll-manage-container-handle" >
                    <div class="selectLeft">
                      <div class="selectItem">
                          <el-input v-model="inputValue" placeholder="请输入要搜索内容" style="width: 20vw;"></el-input>
                      </div>
                      <div class="selectItem">
                          <label for="" class="enroll-manage-container-handle-label">状态</label>
                          <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResultW">
                              <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              width='10vw'
                              :value="item.value">
                              </el-option>
                          </el-select>
                      </div>
                    </div>
                    <div class="selectItem1">
                      <el-button type="primary" >新增</el-button>
                      <el-button type="danger" @click="deletePlatform" :disabled="this.sels.length===0">删除</el-button>
                    </div>
                </div>
                <el-table
                    :data="tables.slice((page-1)*pageSize,page*pageSize)"
                    border stripe highlight-current-row
                    size="mini" v-loading="listLoading"
                    @selection-change="selsChange"
                    @select="select" @select-all="selectAll"
                    class="myTable" ref="table"
                    height="calc(100vh - 255px)"
                    :row-key="getRowKeys">
                     <el-table-column type="selection" width="55" :reserve-selection="true">
                     </el-table-column>
                     <el-table-column type="index" width="60" label="序号">
                     </el-table-column>
                     <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false" show-overflow-tooltip>
                         <template slot-scope="scope">
                             <div v-if="item.type=='handle'" align="center">
                               <el-button  type="primary" icon="el-icon-search" size="small" round @click="searchPlatform(scope.$index, scope.row)">查看</el-button>

                             </div>
                             <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                         </template>
                     </el-table-column>

                 </el-table>
                 <div class="foot">
                   <div></div>
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
                   						:total="tables.length" >
                        </el-pagination>
                   </div>
                 </div>
            </div>
        </div>
    <!-- </el-scrollbar> -->
    <dialog-platform ref="dialogPlatform"></dialog-platform>
  </div>
</template>

<script>
  // import WtInput from '../../components/input.vue'
  import WtHeader from '@/components/myHeader/myHeader.vue'
  import DialogPlatform from '@/components/dialogPlatform/dialogPlatform.vue'
  export default{
    name:'home',
    components:{
      WtHeader,
      DialogPlatform
    },
    data(){
      return{
        listLoading:false,
        sels:[],
            inputValue:"",
            page:1,
            pageSize:20,
            tableTitle:[
                { title : "平台名称", name : "name", type:"input",minwidth:'150'},
                { title : "状态", name : "state", type:"input",minwidth:'120'},
                { title : "查看级联配置", type : "handle",button:[],width:'120' }
            ],
            //0正常 1异常
            tableData:[
              {
                name:'南宁总局',
                state:'0'
              },
              {
                name:'西乡塘分局',
                state:'1'
              },
              {
                name:'永宁分局',
                state:'1'
              },
              {
                name:'哈哈哈',
                state:'0'
              },
              {
                name:'梧州总局',
                state:'1'
              },
              {
                name:'青秀分局',
                state:'0'
              }
              // {
              //   name:'阿打算是',
              //   state:'1'
              // },
              // {
              //   name:'南宁群总局',
              //   state:'1'
              // },{
              //   name:'阿斯蒂芬',
              //   state:'0'
              // },
              // {
              //   name:'南宁总阿斯顿发生局',
              //   state:'1'
              // },{
              //   name:'维权群翁',
              //   state:'0'
              // },
              // {
              //   name:'南宁购物网点总局',
              //   state:'1'
              // }
            ],
            tableAllData: [],
            clientHeight:'',
            options:[
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '正常'
                },
        		{
                value: '0',
                label: '异常'
                },
            ],
            valueW:"",
            platformName:'sss',
      }
    },
    methods:{
      //回到上一页
      backpage(){
          this.$router.go(-1);
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
          else if(name == 'state')
            return value == 0 ? '<span style="color:#f79898;font-weight:bold">异常</span>' :( value == 1 ? '<span style="color:rgb(112, 182, 3);font-weight:bold">正常</span>' : '');
          else
           return value;
      },
      handleCurrentChange(val){
         this.page = val;
      },
      handleSizeChange(val){
      	this.pageSize = val
      },
      getEnrollData(){
          this.listLoading=true
          getUserList().then(res=>{
              if(res.code==0){
                  this.listLoading=false
                  //console.log(res)
                  this.tableAllData=res.data.data
                  this.tableData=this.tableAllData
              }else{
                  this.listLoading=false
                 this.$notify({
                      title: '错误',
                      message: res.msg,
                      type: 'error'
                  });
              }
          }).catch(err=>{
              this.listLoading=false
              this.$notify({
                      title: '错误',
                      message: err.msg,
                      type: 'error'
                  });
          })
          //this.tableData = JSON.parse(JSON.stringify(this.tableAllData))
      },
      changeResultW(val){
          //console.log(this.valueW)
          this.tableData = this.tableAllData.filter(item=>{
              return String(item.isEnable).indexOf(val) > -1
          })
      },
      //修改
      handleEdit(index,row){
      	// //console.log(row)
      	this.$refs.userData.setShow(row)
      },
      // 批量选中
      selsChange(sels){
          this.sels = sels
      },
      select(selection, row){
         if (selection.length > 1) {

                let del_row = selection.shift();

                // console.log('把数组的第一个元素从其中删除后', selection);

                this.$refs.table.toggleRowSelection(del_row, false);
                // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）

            }
      },
      selectAll(selection) {

          // 选择项大于2时

          if (selection.length > 1) {

              selection.length = 1;

          }

      },
      getRowKeys(row) {
          return row.name;
      },
      //删除
      handleCheck(index,row){
      	let param = {
      		id : row.id
      	}
      	//console.log(param)
      	this.$confirm('此操作将永久删除该平台, 是否继续?', '提示', {
      	  confirmButtonText: '确定',
      	  cancelButtonText: '取消',
      	  type: 'warning'
      	}).then(() => {
      	  deleteUser(param).then((res)=>{
      		  if(res.code == 0){
      			  this.$message({
      				type: 'success',
      				message: '删除成功!'
      			  });
      			  this.getEnrollData()
      		  }else{
      			  this.$message.error('删除失败');
      		  }
      	  }).catch((res)=>{
      		  this.$message.error('删除失败');
      	  })

      	}).catch(() => {
      	});
      },
      deletePlatform(){
        const h = this.$createElement;
          this.$msgbox({
            title: '警告',
            message: h('p', null, [
              h('span', null, '确认删除此平台吗？'),
              // h('i', { style: 'color: teal' }, 'VNode')
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = '删除中...';
                setTimeout(() => {
                  done();
                  setTimeout(() => {
                    instance.confirmButtonLoading = false;
                  }, 300);
                }, 3000);
              } else {
                done();
              }
            }
          }).then(action => {
            this.$message({
              type: 'info',
              message: 'action: ' + action
            });
          });
      },
      //新增用户
      addUser(){
      	let val = 1
      	// //console.log(val)
      	this.$refs.userData.setShow(val)
      },
      // 更新页面
      updateMess(val){
      	this.getEnrollData()
      },
      //将tabledata的值传给tableAllData(到真正对接时就不用)
      getTableAllData(){
        this.tableAllData = this.tableData
      },
      //查看级联配置
      searchPlatform(index,row){
        this.$refs.dialogPlatform.dialogPassVisible = true
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
  .enroll-manage-main {
      width: calc(100vw - 40px);
      // height: 100%;
      margin: 20px auto;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      .enroll-manage-nav{
          height: 50px;
          line-height: 50px;
      }
      .enroll-manage-container{
          padding: 20px;
          background: #fff;
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
                margin-right: 20px;
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
  	.myTable{
  		th{
  			padding: 0 !important;
  			height: 15px;
  			line-height: 15px;
  		}
  		td{
  			padding: 0 !important;
  			height: 15px;
  			line-height: 15px;
  		}
  		tr{
  			height: 15px !important;
  		}
  	}
  }
  .enroll-manage-footer{
      position: fixed;
      bottom: 0;
      width: 100%;
          height: 80px;
          background: #fff;
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
