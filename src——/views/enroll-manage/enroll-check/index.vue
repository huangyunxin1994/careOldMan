<template>
    <el-scrollbar style="width:100%;height:calc(100% - 17px);" :vertical="true">
        <div class="enroll-check-main">
            <el-link class="enroll-check-nav" :underline="false" @click="backpage"><i class="el-icon-arrow-left"></i> 返回上一级 </el-link>
            <div class="enroll-check-container" ref="container">
                <div class="enroll-check-container-title">
                    <div>
                        <span>{{enrollData.title}}</span>
                        <el-tag
                            :type="tagType=enrollData.state==1||enrollData.state==4?'info':(enrollData.state==2?'primary':(enrollData.state==3?'success':''))"
                            >
                            {{ enrollData.state==1?"未发布":(enrollData.state==4?'已结束':(enrollData.state==2?'未开始':(enrollData.state==3?'进行中':''))) }}
                        </el-tag>
                    </div>
                    
                    <div>
                        <el-button type="primary" icon="el-icon-printer" size="medium"  @click="exportToExcel()">导出</el-button>
                        <!-- <el-button type="primary" size="medium"  @click="handleQrCode()"><i class="iconfont">&#xe606; </i>查看小程序二维码</el-button> -->
                    </div>
                </div> 
                <div class="enroll-check-container-handle" >
                    <div class="enroll-check-container-handle-left">
                        <el-input v-model="inputValue" placeholder="请输入内容"  style="width:30%" ></el-input>
                        <div  style="margin-left:20px;">
                            <label for="" class="enroll-check-container-handle-label">审核状态</label>
                            <el-select v-model="titlePara.reviewState" filterable placeholder="请选择" style="width:50%"  @change="selectByTerm">
                                <el-option
                                v-for="item in optionsC"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div >
                        <label for="" class="enroll-check-container-handle-label">是否确认已读</label>
                        <el-select v-model="titlePara.readNot" filterable placeholder="请选择"  style="width:50%" @change="selectByTerm">
                            <el-option
                            v-for="item in optionsW"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </div>
                    </div>
                    <div >
                        <el-button type="primary" size="medium" @click="checkEnroll('2')">通过</el-button>
                        <el-button type="danger" size="medium" @click="checkEnroll('3')">拒绝</el-button>
                    </div>
                </div>
                <div class="enroll-check-container-handle" >
                    <div class="enroll-check-container-handle-left1">
                        <div class="enroll-check-container-handle-left1-date-picker">
                            <label for="" class="enroll-check-container-handle-label" style="width:120px" >报名时间段</label>
                        
                            <el-date-picker type="date" placeholder="选择日期" v-model="startTime" style="width:50%" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="startTimeOptions" @change="selectByTerm"></el-date-picker>                   
                            <span  style="margin:0 20px ;">至</span>
                            <el-date-picker type="date" placeholder="选择日期" v-model="endTime"  style="width:50%" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="endTimeOptions" @change="selectByTerm"></el-date-picker>
                            
                        </div>
                        
                    </div>
                    <div >
                            <el-button type="primary" size="medium" @click="chooseField">设置字段</el-button>
                            <el-button type="primary" size="medium" @click="chooseTerm">更多筛选项</el-button>
                            <el-button type="primary" size="medium" @click="selectAllData" :disabled="tableData.length===tableAllData.length">清空查询条件</el-button>
                        </div>
                    
                </div>
                <el-table :data="tableData.slice((page-1)*pageSize,page*pageSize)" border stripe highlight-current-row size="mini" v-loading="listLoading" @selection-change="selsChange" class="myTable" ref="table" :row-key="getRowKeys">
                    <el-table-column type="selection" width="55" :reserve-selection="true">
                    </el-table-column>
                    <el-table-column type="index" width="60" label="序号">
                    </el-table-column>
                    <el-table-column v-for="(item,index) in showTableTitle" :fixed="item.fixed" :key="index" :prop="item.name" :label="item.title" :min-width="item.width"  :sortable="item.type!='button'&&item.type!='handle'?true:false" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-link v-if="item.name==='name'" type="success" :underline="false" v-html="arrFormatter(scope.row[item.name],item.name)" @click="selectDetails(scope.$index, scope.row)"></el-link>
                            <p v-else :formatter="formatSex" v-html="arrFormatter(scope.row[item.name],item.name)"></p>
                        </template>
                    </el-table-column>
                    
                </el-table>
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
						:total="tableData.length" >
                    </el-pagination>
               </div>
                <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
                
                
            </div>      
        </div>
        <more-term :showTableTitle="showTableTitle" :titlePara="titlePara" ref="moreTerm" @selectByTerm="selectByTerm" @clearChoose="clearChoose"></more-term>
        <show-field :tableTitle="tableTitle" :showTableTitle="showTableTitle" ref="showField" @showField="showField"></show-field>
        <review-enroll  ref="reviewEnroll" @getSignupPerson="getSignupPerson"></review-enroll>
        <qr-code ref="qrcode" :imgPath="imgPath"></qr-code>
    </el-scrollbar>
</template>
<script>
import { getOrganData } from '@/api/api'
import { getSignup,getSignupPerson,getPersonDetial } from "@/api/api"
import { getByteLen } from "@/utils/index.js"
import moreTerm from '@/components/more-term'
import showField from '@/components/show-field'
import reviewEnroll from '@/components/review-enroll'
import qrCode from '@/components/qr-code'
import "@/assets/iconfonts/iconfont.css"
export default {
    components:{
        moreTerm,
        showField,
        reviewEnroll,
        qrCode
    },
    data(){
        return{
            imgPath:"",
            tagType:"",
            enrollId:'',
            isIndeterminate:false,//对el-checkbox控制不完整的全选状态
            checkAll:false,//对el-checkbox控制全选状态
            startTime:"",
            endTime:"",
            enrollData:{},
            sels:[],
            listLoading:false,
            inputValue:"",
            page:1,
            pageSize:20,
            id:"",
            tableTitle:[],
            showTableTitle:[],
            titlePara:{},
            inittTitlePara:{},
            tableData:[],
            tableAllData: [],
            
            clientHeight:'',
            optionsC:[
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '未审核'
                }, {
                value: '2',
                label: '已通过'
                }, {
                value: '3',
                label: '未通过'
                }
            ],
            optionsW:[
                {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '未读'
                }, {
                value: '2',
                label: '已读'
                }
            ],
            valueC:"",
            valueW:""
        }
    },
    methods:{
        //回到上一页
        backpage(){
            this.$router.go(-1);
        },
        selsChange: function (sels) {
                this.sels = sels;
        },
        getRowKeys(row) {
   		    return row.personId;
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
            if(name == 'name')
                return '<span style="font-weight:bold">'+value+'</span>'
            if(name=='readNot')
             return value == 1 ? '<span style="color:#F56C6C;font-weight:bold">未读</span>' : value == 2 ? '<span style="color:#67C23A;font-weight:bold">已读</span>' :'';
            else if(name=='reviewState')
             return value == 1 ? '<span style="color:#F56C6C;font-weight:bold">未审核</span>' :( value == 2 ? '<span style="color:#67C23A;font-weight:bold">已通过</span>' : ( value == 3 ? '<span style="color:#909399;font-weight:bold">未通过</span>' : ''));
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
        async getEnrollPersonData(id){
            let tableTitle=[]
            let titlePara={}
            await getSignup({id:id}).then(res=>{
                if(res.code==0){
                    res.data.signup.form = res.data.data
                    this.enrollData = res.data.signup
                    this.imgPath = res.data.signup.qrCode
                    let para = res.data.data.filter(item=>{
                        return item.type=='base'
                    })
                    
                    for(let i=0;i<para[0].child.length;i++){
                        let temp = para[0].child[i]
                        if(temp.type!="img"){
                            let paras ={}
                            paras.title=temp.name;
                            paras.name=temp.dataKey;
                            paras.type=temp.type
                            if(temp.childs)
                            paras.childs=temp.childs
                            paras.width=180
                            tableTitle.push(paras)
                            if(temp.type!="select"&&temp.type!="radio"&&temp.type!="checkbox"){
                                if(temp.type=="number"||temp.type=="phone")
                                   titlePara[temp.dataKey]={opType:temp.type,value:[{sNum:"",eNum:"",type:"1"}]}
                                else if(temp.type=="date")
                                    titlePara[temp.dataKey]={opType:temp.type,value:[{sdate:"",edate:""}] }
                                else
                                   titlePara[temp.dataKey]={opType:temp.type,value:[{value:""}] }
                            } 
                            else if(temp.type=="checkbox"){
                                titlePara[temp.dataKey]={opType:temp.type,type:"1",value:[]}
                            }
                            else {
                                titlePara[temp.dataKey]={opType:temp.type,value:[]}
                            }
                                
                        }
                    }
                    let paras = {title:"报名日期",name:"submitTime",type:"date",width:120}
                    let paras1 = {title:"审核状态",name:"reviewState",type:"input",width:120}
                    let paras2 ={title:"是否已读",name:"readNot",type:"input",width:120} 
                    tableTitle.push(paras)  
                    tableTitle.push(paras1)  
                    tableTitle.push(paras2)
                     titlePara.submitTime=""
                    titlePara.reviewState=""
                    titlePara.readNot=""
                    this.tableTitle=tableTitle
                    this.showTableTitle=tableTitle
                    this.titlePara=titlePara
                    this.inittTitlePara = JSON.parse(JSON.stringify(titlePara))
                    
                }
            })
            this.$nextTick(()=>{
                this.$refs.table.doLayout()
            }) 
            await this.getSignupPerson()
                       
        },
        async getSignupPerson(){
            this.sels=[]
            let id = this.enrollId
            await getSignupPerson({id:id}).then(res=>{
                if(res.code==0){
                    let arr = []
                    for(let i=0;i<res.data.data.length;i++){
                        let formArr =  res.data.data[i]
                        let para = JSON.parse(formArr.registrationInformation).form[0].submitData[0]
                        let keyArr = []
                        JSON.parse(formArr.registrationInformation).form[0].child.filter(i =>{
                           if(i.type==='img') {
                               keyArr.push(i.dataKey)
                           }
                        })
                        Object.keys(para).forEach(key=>{
                            
                            if(String(keyArr).indexOf(key) > -1){
                                delete para[key]
                            }
                            if(Array.isArray(para[key]) ){
                            let str=""
                            for(let i=0;i<para[key].length;i++){
                                if(str==""){
                                    str+=para[key][i]
                                }else{
                                    str+=","+para[key][i]
                                }
                            }
                            para[key]=str
                            }
                            
                            
                        })            
                        para.personId = formArr.id
                        para.reviewState = formArr.reviewState
                        para.readNot = formArr.readNot
                        para.submitTime = formArr.submitTime.substring(0,10)
                        // for( let i =0;i< 20;i++)
						arr.push(para)
                    }
                    this.tableAllData=arr
                    this.tableData=arr
                }

            }).catch(err=>{
            })   
        },
        //选择筛选条件
        chooseTerm(){
            this.$refs.moreTerm.handleShow()
        },
        
        //清空选择
        clearChoose(){
             this.titlePara = JSON.parse(JSON.stringify(this.inittTitlePara)) 
        },
        chooseField(){
            this.$refs.showField.handleShow()
        },
        //配置显示字段
        showField(arr){
            let str = JSON.stringify(arr)
            this.showTableTitle = this.tableTitle.filter(item=>{
                return str.indexOf(item.name)>-1
            })
            this.selectByTerm()
            this.$nextTick(()=>{
                            this.$refs.table.doLayout()
                        }) 
        },
        //查看所有数据，清空条件
        selectAllData(){
            this.inputValue=""
            this.titlePara = JSON.parse(JSON.stringify(this.inittTitlePara)) 
            this.tableData=this.tableAllData
        },
        //条件查询
        selectByTerm(){
            let keys = Object.keys(this.titlePara);
            let vals = Object.values(this.titlePara);
            var search=this.inputValue;
            this.tableData = this.tableAllData.filter(item=>{
                let boolArr = []
                 let submitTime =  item.submitTime
                if(this.startTime!=""&&this.startTime!=null&&this.endTime!=""&&this.endTime!=null){
                    if(this.compareDate(submitTime,this.startTime)&&this.compareDate(this.endTime,submitTime)){
                        boolArr.push(true)
                    }else{
                        boolArr.push(false)
                    }
                }else{
                    boolArr.push(true)
                }
                if(search){
                    let arr = []
                    this.showTableTitle.forEach(i => {
                        arr.push(i.name)
                    });
                   let bool =  Object.keys(item).some(function(key){
                        return String(arr).indexOf(key)>-1&&String(item[key]).toLowerCase().indexOf(search) > -1
                    })
                    boolArr.push(bool)
                }else{
                     boolArr.push(true)
                }
                for(let i=0;i<keys.length;i++){
                    let bool = false
                    if(Object.prototype.toString.call(vals[i]) !="[object String]"){
                         let arr = vals[i].value
                        if(vals[i].opType==='number'||vals[i].opType==='phone'){
                            for(let j = 0; j < arr.length; j++){
                                if(arr[j].type==='1'){
                                    if(arr[j].sNum!==""){
                                        if( String(item[keys[i]])===arr[j].sNum){
                                            bool=true;
                                            break
                                        }  
                                    }else{
                                        bool=true;
                                        break
                                    }
                                     
                                }else{
                                    if(arr[j].sNum!==""&&arr[j].eNum!==""){
                                        //  console.log(keys[i],parseInt(item[keys[i]]),parseInt(arr[j].sNum),parseInt(arr[j].eNum),parseInt(item[keys[i]])>=parseInt(arr[j].sNum),parseInt(item[keys[i]])<=parseInt(arr[j].eNum))
                                        if(parseInt(item[keys[i]])>=parseInt(arr[j].sNum)&&parseInt(item[keys[i]])<=parseInt(arr[j].eNum)){
                                            bool=true;
                                            break 
                                        }
                                    }else{
                                        bool=true;
                                        break
                                    }
                                    
                                }
                                //  bool=true;
                            } 
                            boolArr.push(bool)
                        }else if(vals[i].opType==='checkbox'){
                            if(arr.length>0){
                                                                    /* 与 需满足每一个筛选条件返回true */
                                if(vals[i].type==='2'){
                                    for(let j = 0; j < arr.length; j++){
                                        // console.log(String(item[keys[i]]),arr[j],String(item[keys[i]]).indexOf(arr[j]))
                                        if( String(item[keys[i]]).indexOf(arr[j]) === -1){
                                            bool=false;
                                            break
                                        }else{
                                            bool=true;
                                        }      
                                    }
                                    
                                }else{                                    /* 或 满足其中一个筛选条件返回true */
                                    for(let j = 0; j < arr.length; j++){
                                        if( String(item[keys[i]]).indexOf(arr[j]) > -1){
                                            bool=true;
                                            break
                                        }      
                                    }
                                }
                            }else{
                                bool=true;
                            }
                            boolArr.push(bool)
                        }else if(vals[i].opType==='date'){
                            for(let j = 0; j < arr.length; j++){
                                
                                if( this.compareDate(String(item[keys[i]]),arr[j].sdate)&&this.compareDate(arr[j].edate,String(item[keys[i]]))){
                                    bool=true;
                                    break
                                }      
                            }
                            boolArr.push(bool)
                        }else if(vals[i].opType==='radio'||vals[i].opType==='select'){
                            if(arr.length>0){
                                for(let j=0;j<arr.length;j++){
                                    if( String(item[keys[i]]).indexOf(arr[j]) > -1){
                                        bool=true
                                        break
                                    }     
                                }
                            }
                            else{
                            bool=true 
                            }
                            boolArr.push(bool)
                        }else{
                            for(let j=0;j<arr.length;j++){
                                if( String(item[keys[i]]).indexOf(arr[j].value) > -1){
                                    bool=true
                                    break
                                }     
                            }
                            boolArr.push(bool)
                        }
                    }else{
                        if( String(item[keys[i]]).indexOf(vals[i]) > -1){
                            bool=true
                        }
                        boolArr.push(bool)
                    }
                }
                let flag = boolArr.some(k=>{
                    return k==false
                })
                if(!flag){
                    return item
                }
            })
        },
        // handleQrCode(){
        //     this.$refs.qrcode.dialogVisible=true
        // },
        //excel数据导出
        exportToExcel() {
            if(this.tableAllData.length>0){
                 require.ensure([], () => {
                    const {
                        export_json_to_excel
                    } = require('@/export/Export2Excel');
                    const tHeader = [] // 对应表格输出的中文title
                    const filterVal = [] // 对应表格输出的数据
                    this.showTableTitle.forEach(val => {
                    tHeader.push(val.title)
                    filterVal.push(val.name)
                    })
                    const list = this.tableAllData;
                    const tHeaders = []
                    const datas = []
                    const sheetNames = []
                    tHeaders.push(tHeader)
                    datas.push(this.formatJson(filterVal, list))
                    sheetNames.push('sheet1')
                    export_json_to_excel(tHeaders, datas, sheetNames, `${this.enrollData.title}-人员资料`);
                })
            }else{
                this.$notify({
                    title: '警告',
                    message: '没有数据可以导出',
                    type: 'warning'
                });
            }
           
        },
        formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                        if(j=='reviewState')
                            return v[j] == 1 ? '未审核' :( v[j] == 2 ? '已通过' : ( v[j] == 3 ? '未通过' : ''));
                        else if(j=='readNot')
                            return v[j] == 1 ? '未读' : v[j] == 2 ? '已读' :'';
                        else
                            return v[j]
                    }
                ))
            },
        compareDate(dateTime1,dateTime2)
        {
            if(dateTime1==''||dateTime2==''){
                return true;
            }console.log(dateTime1,dateTime2)
            var formatDate1 = new Date(dateTime1)
            var formatDate2 = new Date(dateTime2)
            console.log()
            if(formatDate1 >=formatDate2)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        //点击某行跳转报名详情
        selectDetails(index,row){
            this.$router.push(
                {
                    path:"/enrolldetails",
                    query:{
                        id:row.personId
                    }
                }
            ) 
        
        },
        checkEnroll(val){
            // console.log(this.enrollData)
            if(this.enrollData.state>3){
                if(this.sels.length>0){
                    let sels = JSON.parse(JSON.stringify(this.sels))
                    sels = sels.filter(i=>{
                        return i.reviewState=="1"
                    })
                    if(sels.length > 0){
                         this.$refs.reviewEnroll.sels = sels
                        this.$refs.reviewEnroll.replyMessage = ""
                        this.$refs.reviewEnroll.reviewFlag = val
                        this.$refs.reviewEnroll.centerDialogVisible = true
                    }else{
                        this.$notify({
                            title: '警告',
                            message: '没有可审核的记录，请确认',
                            type: 'warning'
                        });
                    }
                   
                }else{
                    this.$notify({
                            title: '警告',
                            message: '请先勾选需要审核的记录',
                            type: 'warning'
                        });
                }
            }else{
                this.$notify({
                            title: '警告',
                            message: '报名还未结束，无法审核',
                            type: 'warning'
                        });
            }
            
            
        },
        
    },
    mounted(){
        let id =  this.$route.query.id
        this.enrollId = id
       this.getEnrollPersonData(id)
      
        
    },
    watch:{
        inputValue:{
            handler(){
                this.selectByTerm()     
            }
        }
    },
    computed:{
        startTimeOptions(){
            // 开始时间
            return{
                disabledDate:(time)=>{
                    //结束时间之后的时间不能作为开始时间
                    let disabledDate;
                    if(this.endTime!=""){
                        disabledDate = new Date(this.endTime);
                        disabledDate.setDate(disabledDate.getDate()-1);
                        return time.getTime()>disabledDate.getTime();
                    }
                }
            }
        },
        endTimeOptions(){
            // 结束时间
            return{
                disabledDate:(time)=>{
                    //起始时间之前的时间不能作为结束时间
                    let disabledDate
                    if(this.startTime!=""){
                            disabledDate = new Date(this.startTime);
                            disabledDate.setDate(disabledDate.getDate()-1);
                            return time.getTime() < disabledDate.getTime();
                    }
                   
                }
            }    
        },
    }
    
}
</script>

<style lang="scss" scoped>
    .enroll-check-main {
        width: 80%;
        height: 100%;
        min-width: 868px;
        margin: 0 auto;
        .enroll-check-nav{
            height: 50px;
            line-height: 50px;
        }
        .enroll-check-title{
            padding: 2%;
            margin-bottom: 2%;
            background: #fff;
            font-size: 21px;
            font-weight: 700;
        }
        .enroll-check-container{
            min-height: calc(94% - 80px);
            padding: 2%;
            margin-bottom: 2%;
            background: #fff;
            &-title{
                margin-bottom: 15px;
                padding: 2px 0 2px 20px;
                border-left: 4px solid #409EFF;
                font-size: 18px;
                font-weight: 700;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-tag{
                    margin-left: 50px;
                }
                .iconfont{
                    font-size: 12px !important;
                }
            }
            &-handle{
                margin-bottom:1%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                &-label{
                    font-size: 14px;
                    color: #606266;
                    font-weight: 700;
                }
                &-left{
                    width: 78%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center; 
                }
                &-left1{
                    width: 55%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center; 
                    &-date-picker{
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center; 
                    } 
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
    .enroll-check-footer{
        position: fixed;
        bottom: 0;
        width: 100%;
            height: 80px;
            background: #fff;
        }
		
</style>