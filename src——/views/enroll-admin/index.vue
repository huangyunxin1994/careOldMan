<template>
    <el-scrollbar style="width:100%;height:100%;">
        <div class="enroll-manage-main">
            <!-- <div class="enroll-manage-nav"> </div> -->
            <div class="enroll-manage-title">
                用户管理
            </div>
            <div class="enroll-manage-container" ref="container">
                <div class="enroll-manage-container-title">用户信息</div> 
                <div class="enroll-manage-container-handle" >
                    <div style="width:40%">
                        <el-input v-model="inputValue" placeholder="请输入要搜索内容"></el-input>
                    </div>
                    <div>
                        <label for="" class="enroll-manage-container-handle-label">是否启用</label>
                        <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResultW">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
					<div class="createUser">
						<el-button type="primary" @click="addUser">新建</el-button>
					</div>
                </div>
                <el-table 
						:data="tables.slice((page-1)*pageSize,page*pageSize)" 
						class="myTable" border stripe highlight-current-row 
						v-loading="listLoading" 
						size="mini"
						:row-style="{height:'20px'}"
						:cell-style="{padding:'0px'}">
                    <el-table-column type="index" width="60" label="序号">
                    </el-table-column>
                    <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
                        <template slot-scope="scope">
                            <div v-if="item.type=='handle'">
								<el-button  type="primary" icon="el-icon-edit" size="small" round @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                                <!-- <el-tooltip v-for="(item,index) in item.button" :key="index" :content="item.name" placement="top">
                                    
                                    <el-button v-else-if="item.type=='check'" type="danger" icon="el-icon-delete" size="small" circle @click="handleCheck(scope.$index, scope.row)"></el-button>
                                </el-tooltip> -->
                            </div>
                            <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                        </template>
                    </el-table-column>
                </el-table>
               <div class="enroll-manage-container-tools">
                   <span class="enroll-manage-container-tools-span"></span> 
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
                <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
                <user-edit ref="userData" @updateMess = "updateMess"></user-edit>
                
            </div>      
        </div>
    </el-scrollbar>
</template>
<script>
import { getUserList , deleteUser } from '@/api/api'
import UserEdit from '@/components/addUser/index.vue'
export default {
    components:{
		UserEdit
    },
    data(){
        return{
            listLoading:false,
            inputValue:"",
            page:1,
            pageSize:20,
            tableTitle:[
                { title : "账号", name : "account", type:"input"},
				{ title : "服务结束日期", name : "expiresTime", type:"input",width:'250'},
				{ title : "联系号码", name : "phone", type:"input",width:'250'},
                { title : "单位名称", name : "username", type:"input",width:'250'},
                { title : "所属区域", name : "areas", type:"input",width:'200' },
               // { title : "报名人数", name : "number", type:"input",width:'110' },
                { title : "是否启用", name : "isEnable", type:"input",width:'150' },
                { title : "操作", type : "handle",button:[],width:'150' }

            ],
            tableData:[],
            tableAllData: [],
            clientHeight:'',
            options:[
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '是'
                }, 
				{
                value: '2',
                label: '否'
                }, 
            ],
            valueW:""
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
		//删除
        handleCheck(index,row){
			// //console.log(row)
			let param = {
				id : row.id
			}
			//console.log(param)
			this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
		//新增用户
		addUser(){
			let val = 1
			// //console.log(val)
			this.$refs.userData.setShow(val)
		},
		// 更新页面
		updateMess(val){
			this.getEnrollData()
		}
    },
    mounted(){
       this.getEnrollData() 
        
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
    .enroll-manage-main {
        width: 80%;
        height: 100%;
        min-width: 868px;
        margin: 0 auto;
        .enroll-manage-nav{
            height: 50px;
            line-height: 50px;
        }
        .enroll-manage-title{
            padding: 1%;
            margin-bottom: 2%;
            background: #fff;
            font-size: 21px;
            font-weight: 700;
        }
        .enroll-manage-container{
            min-height: calc(88% - 119px);
            padding: 2%;
            margin-bottom: 2%;
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
                margin-bottom:2%;
                width:80%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &-label{
                    font-size: 14px;
                    color: #606266;
                    font-weight: 700;
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
	
</style>