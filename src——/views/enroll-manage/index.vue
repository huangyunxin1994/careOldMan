<template>
    <el-scrollbar style="width:100%;height:calc(100% - 17px);" :vertical="true">
        <div class="enroll-manage-main">
			<div class="titleSwrap">
				<div><el-link class="enroll-manage-nav" :underline="false" @click="backpage"><i class="el-icon-arrow-left"></i> 返回上一级 </el-link></div>
				<div class="enroll-manage-title">
				    报名管理与审核
				</div>
				<div class="titleRight" style="width: 88px;"></div>
			</div>
            <div class="enroll-manage-container" ref="container">
                <div class="enroll-manage-container-title">报名活动管理</div> 
                <div class="enroll-manage-container-handle" >
                    <div style="width:40%">
                        <el-input v-model="inputValue" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        <label for="" class="enroll-manage-container-handle-label">报名状态</label>
                        <el-select v-model="valueW" filterable placeholder="请选择" @change="changeResultW">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <el-table :data="tables.slice((page-1)*pageSize,page*pageSize)" border stripe highlight-current-row size="mini" v-loading="listLoading" >
                    <el-table-column type="index" width="60" label="序号">
                    </el-table-column>
                    <el-table-column v-for="(item,index) in tableTitle" :key="index" :prop="item.name" :label="item.title" :width="item.width" :min-width="item.minwidth" :sortable="item.type!='button'&&item.type!='handle'?true:false">
                        <template slot-scope="scope">
                            <div v-if="item.type=='handle'">
                                <!-- <el-tooltip v-for="(item,index) in item.button" :key="index" :content="item.name" placement="top">
                                    
                                </el-tooltip> -->
								<el-button type="primary" icon="el-icon-search" size="small" round @click="handleEdit(scope.$index, scope.row)">查看/修改</el-button>
								<el-button type="primary" icon="el-icon-s-check" size="small" round @click="handleCheck(scope.$index, scope.row)">审核</el-button> 
                                <el-button type="primary"  size="small" round @click="handleQrCode(scope.$index, scope.row)"><i class="iconfont" style="font-size: 12px">&#xe606; </i> 二维码</el-button>
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
                
                
            </div>      
        </div>
        <qr-code ref="qrcode" :imgPath="imgPath"></qr-code>
    </el-scrollbar>
</template>
<script>
import "@/assets/iconfonts/iconfont.css"
import qrCode from '@/components/qr-code'
import { selectSigup } from '@/api/api'
export default {
    components:{
        qrCode
    },
    data(){
        return{
            imgPath:"",
            dialogVisible:false,
            listLoading:false,
            inputValue:"",
            page:1,
            pageSize:20,
            tableTitle:[
                { title : "报名活动名称", name : "title", type:"input"},
                { title : "报名起始时间", name : "startTime", type:"input",width:'130'},
                { title : "报名结束时间", name : "endTime", type:"input",width:'130' },
               // { title : "报名人数", name : "number", type:"input",width:'110' },
                { title : "状态", name : "state", type:"input",width:'80' },
                { title : "操作", type : "handle",button:[],width:'320' }

            ],
            tableData:[],
            tableAllData: [],
            clientHeight:'',
            options:[
                {
                value: '',
                label: '全部'
                }, {
                value: '2',
                label: '未开始'
                }, {
                value: '3',
                label: '进行中'
                }, {
                value: '4',
                label: '已结束'
                },
            ],
            valueW:""
        }
    },
    methods:{
        //回到上一页
        backpage(){
            this.$router.push({path:"/main"})
        },
        //性别显示转换
        formatSex: function (row, column) {
                //   console.log(column.property)
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
            else if(name=='state')
             return value == 1 ? '<span style="color:#909399;font-weight:bold">未发布</span>' :( value == 2 ? '<span style="color:#409EFF;font-weight:bold">未开始</span>' : ( value == 3 ? '<span style="color:#67C23A;font-weight:bold">进行中</span>' : ( value == 4 ? '<span style="color:#909399;font-weight:bold">已结束</span>' : '')));
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
            let user = JSON.parse(sessionStorage.getItem('user'));
            selectSigup({userId:user.id}).then(res=>{
                if(res.code==0){
                    this.listLoading=false
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
            // console.log(this.valueW)
            this.tableData = this.tableAllData.filter(item=>{
                return String(item.state).indexOf(val) > -1
            })
        },
        handleEdit(index,row){
            this.$router.push(
                {
                    path:"/editenroll",
                    query:{
                        id:row.id,
                        type:"update"
                    }
                }
            )
        },
        handleCheck(index,row){
            this.$router.push(
                {
                    path:"/enrollcheck",
                    query:{
                        id:row.id
                    }
                }
            ) 
        },
        handleQrCode(index,row){
            this.imgPath=row.qrCode
            this.$refs.qrcode.dialogVisible=true
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
<style>
	/* .el-table__body-wrapper{
		min-height:480px !important
	} */
</style>
<style lang="scss" scoped>
    .enroll-manage-main {
        width: 80%;
        height: 100%;
        min-width: 868px;
        margin: 0 auto;
		.titleSwrap{
			display: flex;
			justify-content:space-between;
		}
        .enroll-manage-nav{
            height: 50px;
            line-height: 50px;
        }
        .enroll-manage-title{
            // padding: 2%;
            // margin-bottom: 2%;
            // background: #fff;
			line-height: 50px;
            font-size: 21px;
            font-weight: 700;
        }
        .enroll-manage-container{
            min-height: 88%;
            padding: 2%;
            background: #fff;
            &-title{
                margin-bottom: 1%;
                padding: 2px 0;
                border-left: 4px solid #409EFF;
                text-indent: 20px;
                font-size: 18px;
                font-weight: 700;
            }
            &-handle{
                margin-bottom:1%;
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
    }
    .enroll-manage-footer{
        position: fixed;
        bottom: 0;
        width: 100%;
            height: 80px;
            background: #fff;
        }
</style>