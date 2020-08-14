<template>
    <div class="new-enroll-main">
            <div class="titleSwrap">
				<el-link class="new-enroll-nav" :underline="false" @click="backpage"><i class="el-icon-arrow-left"></i> 返回上一级 </el-link>
				<div>
					<div class="new-enroll-title" v-if="handleType=='add'">
					    新建报名活动
					</div>
					<div class="new-enroll-title" v-else>
					     编辑报名活动
					     <div class="titleRight">
							 <div>
								 <span class="nowState">当前状态:</span>
								 <el-tag
								     :type="tagType=ruleForm.state==1||ruleForm.state==4?'info':(ruleForm.state==2?'primary':(ruleForm.state==3?'success':''))"
								     >
								     {{ ruleForm.state==1?"未发布":(ruleForm.state==4?'已结束':(ruleForm.state==2?'未开始':(ruleForm.state==3?'进行中':''))) }}
								 </el-tag>
							 </div>
							 <el-button type="primary" icon="el-icon-document-copy" class="button-class" size="medium" @click="copyAndAdd" :disabled="!disabledTag">复制并新建活动</el-button>
						 </div>
					</div>
				</div>
				<div style="width: 88px;"></div>
			</div>
           
            <div class="new-enroll-container">
                <div class="new-enroll-container-title">报名信息</div> 
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="100px" class="demo-ruleForm" label-position="left" :status-icon="true">
                    <el-form-item label="报名标题" prop="title">
                        <el-input v-model="ruleForm.title" :disabled="disabledTag" placeholder="例：淘淘考试报名"></el-input>
                    </el-form-item>
                    <el-form-item label="报名时间" required>
                        <el-col :span="11">
                        <el-form-item prop="startTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.startTime" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="startTimeOptions" :disabled="disabledTag"></el-date-picker>
                        </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">至</el-col>
                        <el-col :span="11">
                        <el-form-item prop="endTime">
                            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.endTime" style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="endTimeOptions" :disabled="disabledTag"></el-date-picker>
                        </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
            <div class="new-enroll-container">
                <div class="new-enroll-container-title">报名详细说明</div> 
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-position="left">
                    <el-form-item prop="details">
                        <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="请输入报名详细说明"
                        resize="none"
                        v-model="ruleForm.details"
                        :disabled="disabledTag">
                        </el-input>
                    </el-form-item>
                </el-form>
                
            </div>
            <div class="new-enroll-container" v-for="(item,index) in ruleForm.form" :key="index">
                <div class="new-enroll-container-title form-title">
                    <div>
                        <span>{{item.name}}</span>
                        <el-tooltip content="编辑表格" placement="top" effect="light">
                                <el-link :underline="false" icon="el-icon-edit-outline" type="primary" style="font-size:25px" :disabled="disabledTag" @click="editForm(index)"></el-link>
                        </el-tooltip>
                     </div>
                        
                        <el-tooltip content="删除表格" placement="top" effect="light" v-if="item.type=='table'">
                            <el-link :underline="false" icon="el-icon-remove" type="danger" style="font-size:30px" :disabled="disabledTag" @click="removeForm(index)"></el-link>
                        </el-tooltip>
                    
                </div>
                <div class="new-enroll-container-remarks">{{item.details}}</div>
                <div class="tag-class">已选信息({{item.child.length}})</div>
                <div class="new-enroll-container-item">
                    <div style="width:calc(100% - 340px);max-height: 568px;" >
                        <el-scrollbar style="width:100%;height:100%;">
                            <draggable v-model="item.child" :options="{animation:200,handle:'.dragClass'}">
                                <div v-for="(item,i) in item.child" :key="i" class="baseform-item">
                                    <div class="baseform-item-name baseform-item-o">
                                        <span>{{item.name}}</span>
                                        <el-tag class="baseform-item-name-tag" type="info" effect="dark" v-html="arrFormatter(item.type)" size="mini"></el-tag>
                                    </div>
                                    <el-checkbox class="baseform-item-o" :true-label='1' :false-label='0' v-model="item.required" :disabled="disabledTag||(item.dataKey==='name'||item.dataKey==='phone')">必填</el-checkbox>
                                    <el-link :underline="false" icon="el-icon-edit" class="baseform-item-o" @click="updateFormOption(index,i)" :disabled="disabledTag||(item.dataKey==='name'||item.dataKey==='phone')"></el-link>
                                    <el-link :underline="false" icon="el-icon-document-copy" class="baseform-item-o" @click="copyFormOption(index,i)" :disabled="disabledTag"></el-link>
                                    <el-link :underline="false" icon="el-icon-delete" class="baseform-item-o" @click="removeFormOption(index,i)" :disabled="disabledTag||(item.dataKey==='name'||item.dataKey==='phone')"></el-link>
                                    <el-link :underline="false" icon="el-icon-rank" class="baseform-item-o dragClass" :disabled="disabledTag"></el-link>
                                </div>
                            </draggable>
                        </el-scrollbar>
                    </div>
                    <div class="new-enroll-container-button">
						<div class="shortcut">
							<div class="title-class" >快捷字段</div>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="shortcut(index,shortcutData[0])">身份证</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="shortcut(index,shortcutData[1])">性别</el-button>
								<el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="shortcut(index,shortcutData[2])">年龄</el-button>
								<el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="shortcut(index,shortcutData[3])">婚姻状况</el-button>
								<el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="shortcut(index,shortcutData[4])">手机号码</el-button>
                                <el-button type='primary' v-if="item.type=='base'" icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="shortcut(index,shortcutData[5])">一寸照</el-button>

						</div>
                        <div class="custom">
							<div class="title-class" >自定义字段</div>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'input')">单行文本</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'textarea')">多行文本</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'number')">数字</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'date')">日期</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'time')">时间</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'radio')">单选</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'checkbox')">多选</el-button>
							    <el-button type='primary' icon="el-icon-search" class="button-class" size="medium" :disabled="disabledTag" @click="addFormOption(index,'select')">下拉框</el-button>
						</div>
                    </div>
                </div>
            </div>
            <el-button  type="primary" icon="el-icon-add" class="button-class" size="medium" :disabled="disabledTag" @click="addForm">添加表格</el-button>
            <div class="new-enroll-submit" v-if="handleType=='add'">
                <el-button type="primary" icon="el-icon-search" class="button-class" size="medium" @click="submitForm('preview')">预览</el-button>
                <!-- <el-button type="primary" icon="el-icon-search" class="button-class" size="medium" :disabled="!(handleType=='update'&&ruleForm.state==2)" @click="cancelSubmit">撤销发布</el-button> -->
                <el-button type="success" icon="el-icon-upload2" class="button-class" size="medium" @click="submitForm('release')">发布</el-button>
            </div>
            <div class="new-enroll-submit" v-else>
                <el-button type="primary" icon="el-icon-edit" class="button-class" size="medium" :disabled="ruleForm.state!==2" @click="changeDisabled">修改</el-button>
                <el-button type="primary" icon="el-icon-search" class="button-class" size="medium" :disabled="ruleForm.state!==2" @click="submitForm('otherPreview')">预览</el-button>
                <!-- <el-button type="primary" icon="el-icon-search" class="button-class" size="medium" :disabled="!(handleType=='update'&&ruleForm.state==2)" @click="cancelSubmit">撤销发布</el-button> -->
                <el-button type="success" icon="el-icon-upload2" class="button-class" size="medium" @click="submitForm('submit')" :disabled="ruleForm.state>2||disabledTag">提交</el-button>
            </div>
            <enroll-form ref="enrollform" :tableTitle='tableTitle' :formRule="formRule" @insertData="insertData" @updateData="updateData"></enroll-form>
            <enroll-option ref="enrolloption" @insertOption='insertOption' @updateOption='updateOption'></enroll-option>
            <qr-code ref="qrcode" :imgPath="imgPath"></qr-code>
        </div>
        
</template>
<script>
import enrollForm from '@/components/enroll-form'
import enrollOption from '@/components/enroll-option'
import qrCode from '@/components/qr-code'
import draggable from 'vuedraggable'
import { handleCofirm,Debounce,randomStr } from "@/utils/index"
import { createEnrollment,getSignup } from "@/api/api"
import { makePy } from "@/utils/pinying.js"
let start="",end=""
export default {
    components:{
        enrollForm,
        enrollOption,
        draggable,
        qrCode
    },
    data(){
        return{
            imgPath:"",
            signupId:"",
            disabledTag:true,
            handleType:"",
            tagType:"",
            ruleForm: {
				type:"",
                title: '',
                startTime: '',
                endTime: '',
                details: '',
                state:1,
                form:[
                    {
                        name:"基础信息",
                        details:'',
                        type:"base",
                        child:[//表格填写选项
                            {dataKey:'name',name :'姓名',type :'input',minimumCharacters:'1',maximumCharacters:'20',required:1,childs:[]},
                            {dataKey:'phone',name :'手机号码',type :'phone',minimumCharacters:'11',maximumCharacters:'11',required:1,childs:[]}
                        ]
                    }
                ],
               
            },
            rules: {
                title: [
                    { required: true, message: '请输入报名标题', trigger: 'blur' }
                ],
                startTime: [
                    { required: true, message: '请选择日期', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            formRule:{
                formTitle: [
                    { required: true, message: '请输入报名标题', trigger: 'blur' }
                ],
            },
            tableTitle:[
                { title : "表格名称", name : "name", type : "input" },
                { title : "描述", name : "details", type : "textarea" }
            ],
			shortcutData:[
				{name :'身份证',type :"idCard", minimumCharacters:'',maximumCharacters:20,required:0, childs:[],submitType:"insert"},
				{name :'性别',type :"radio", minimumCharacters:'',maximumCharacters:20,required:0, childs:[{name:"男"},{name:"女"}],submitType:"insert"},
				{name :'年龄',type :"number", minimumCharacters:'',maximumCharacters:20,required:0, childs:[],submitType:"insert"},
				{name :'婚姻状况',type :"radio", minimumCharacters:'',maximumCharacters:20,required:0, childs:[{name:"已婚"},{name:"未婚"}],submitType:"insert"},
                {name :'手机号码',type :"phone", minimumCharacters:11,maximumCharacters:11,required:0, childs:[],submitType:"insert"},
                {name :'一寸照',type :"img", minimumCharacters:'',maximumCharacters:20,required:0, childs:[],submitType:"insert"},
			],
        }
    },
    methods:{
        //回到上一页
        backpage(){
            this.$emit('backPage')
            // this.$router.go(-1);
        },
        //格式化类型
        arrFormatter (type) {
             return type == 'input' ? '单行文本</>' 
             :(type == 'textarea' ? '多行文本</>' 
             :(type == 'number' ? '数字</>'
             :(type == 'radio' ? '单选</>'
             :(type == 'select' ? '下拉框</>'
             :(type == 'checkbox' ? '多选</>'
             :(type == 'date' ? '日期</>'
             :(type == 'time' ? '时间</>'
             :(type == 'img' ? '图片</>'
             :(type == 'idCard' ? '身份证</>'
             :(type == 'phone' ? '手机号码</>'
             :''))))))))));
        },
        //新增填写报名信息表选项
        addFormOption(i,type){
            //console.log(type)
            this.$refs['enrolloption'].form.index=i
            this.$refs['enrolloption'].form.submitType="insert"
            this.$refs['enrolloption'].form.type=type
            this.$refs['enrolloption'].handleShow()
        },
        //更新填写报名信息表选项
        updateFormOption(index,i){
            //console.log(this.ruleForm)
            let para =JSON.parse(JSON.stringify(this.ruleForm.form[index].child[i])) 
            if(!para.childs)
            para.childs=[]
            this.$refs['enrolloption'].form=para
            this.$refs['enrolloption'].form.submitType="update"
            this.$refs['enrolloption'].form.index=index
            this.$refs['enrolloption'].form.itemIndex=i
            this.$refs['enrolloption'].handleShow()
        },
        //复制并新增报名信息表选项
        copyFormOption(index,i){
             let para =JSON.parse(JSON.stringify(this.ruleForm.form[index].child[i])) 
            if(!para.childs)
            para.childs=[]
            this.$refs['enrolloption'].form=para
            this.$refs['enrolloption'].form.submitType="insert"
            this.$refs['enrolloption'].form.index=index
            this.$refs['enrolloption'].handleShow()
        },
        //删除填写报名信息表选项
        removeFormOption(index,i){
            this.ruleForm.form[index].child.splice(i,1)
        },
        //打开新增填写报名信息表弹窗
        addForm(){
            let para ={
                name:"",
                details:'',
                type:"table",
                child:[],
                submitType:"insert"
            }
            this.$refs['enrollform'].form=para
            this.$refs['enrollform'].handleShow() 
        },
        //打开编辑填写报名信息表弹窗
        editForm(i){
            let para =JSON.parse(JSON.stringify(this.ruleForm.form[i])) 
            para.submitType="update"
            this.$refs['enrollform'].form=para
             this.$refs['enrollform'].form.index=i
            this.$refs['enrollform'].handleShow()
        },
        //删除报名信息表
        removeForm(i){
              handleCofirm('确认删除报名信息表吗?','warning').then(_=>{
                 this.ruleForm.form.splice(i,1);
                }).catch(_=>{

                })
             
            
        },
		//快捷字段
		shortcut(index,form1){
			//console.log(form1)
			let form = JSON.parse(JSON.stringify(form1))
			form.index = index
			this.$refs['enrolloption'].form=form
			this.$refs['enrolloption'].submitData()
		},
		
        //新增填写报名信息表
        insertData(para){
            this.ruleForm.form.push(para)
        },
        //更新填写报名信息表
        updateData(para){
            this.$set(this.ruleForm.form, para.index, para)
        },
        //新增填写报名信息表选项
        insertOption(para){
            console.log(para)
            this.ruleForm.form[para.index].child.push(para)
        },
        //更新填写报名信息表选项
        updateOption(para){
            this.$set(this.ruleForm.form[para.index].child, para.itemIndex, para)
        }, 
        copyAndAdd(){
            handleCofirm('确认复制并新建报名吗?','success').then(()=>{
                this.$router.push(
                {
                    path:"/newenroll",
                    query:{
                        type:"add",
                        data:this.ruleForm
                    }
                }
            )
            }).catch(()=>{

            })
            
        },
        changeDisabled(){
            this.disabledTag=false
        },
        //保存报名信息
        submitForm(submitType){
            this.$refs.ruleForm1.validate((valid) => {
                if (valid) {
                        let para = Object.assign({}, this.ruleForm);
                        para.submitType=submitType
                        para.signupId=this.signupId
                        let bool = para.form.some(item=>{
                            return item.child.length==0
                        })
                        if(!bool){
                            let str = ""
                            if( submitType === 'release' ||submitType === 'submit' ){
                                str = '确认保存吗?'
                                let nowDate = new Date();
                                let startTime = new Date(para.startTime)
                                if(startTime.getTime() > nowDate.getTime()){
                                    para.state=2
                                }else{
                                    para.state=3 
                                }
                            }else{
                                str = '确认预览吗?'
                                para.state=1 
                            }
                            handleCofirm(str,'success').then(() => {
                                let user = JSON.parse(sessionStorage.getItem('user'));
                                para.userId = user.id
                                this.$emit('setLoading',{bool:true})
                                for(let i=0;i<para.form.length;i++){
                                    para.form[i].sort=i
                                    for(let j=0;j<para.form[i].child.length;j++){
                                        para.form[i].child[j].sort=j
                                        if(para.form[i].child[j].childs){
                                            for(let k=0;k<para.form[i].child[j].childs.length;k++){
                                                para.form[i].child[j].childs[k].sort=k
                                            }
                                        }
                                    }
                                }
                                // //console.log(para)
                                
                                createEnrollment(para).then(res=>{
                                    if(res.code==0){
                                         this.$emit('setLoading',{bool:false})
                                        if( submitType === 'release' ||submitType === 'submit' ){
                                            this.$notify({
                                                title: '成功',
                                                message: '发布成功',
                                                type: 'success'
                                            });
                                            this.$router.push({path:"/enrollmanage"})
                                        }else{
                                             
                                            //console.log(res)
                                            let { data:{ imgPath, signupId } } = res.data
                                            // //console.log(imgPath)
                                            // //console.log(signupId)
                                            if(imgPath!=="")
                                                this.imgPath=imgPath
                                            if(this.signupId==="")
                                                this.signupId=signupId
                                           this.$refs.qrcode.dialogVisible=true
                                            // //console.log( this.imgPath)
                                            // //console.log( this.signupId)
                                        }
                                        

                                    }
                                }).catch(err=>{

                                })
                                
                            
                            }).catch(()=>{

                            }) 
                        }else{
                                this.$notify({
                                    title: '警告',
                                    message: '表格中至少需要一个填写信息项，请确认',
                                    type: 'warning'
                                });
                        }
                     
                }else{
                    this.$notify({
                        title: '警告',
                        message: '请确认信息填写完整正确',
                        type: 'warning'
                    });
                }
            })
        },
        //获取报名信息
        getEnrollData(id){
            getSignup({id:id}).then(res=>{
                if(res.code==0){
                    res.data.signup.form = res.data.data
                    this.ruleForm = res.data.signup
                    //console.log(this.ruleForm)
                }
            })
        }
    },
    created(){
        let type = this.$route.query.type
        if(type=="update"){
            let enrollId = this.$route.query.id
            this.signupId = enrollId
            this.getEnrollData(enrollId)
            this.disabledTag=true
        }else{
            if(this.$route.query.data&&typeof(this.$route.query.data)=='object'){
                //console.log(typeof(this.$route.query.data))
                delete this.$route.query.data.id
                this.ruleForm=this.$route.query.data
            }
            this.disabledTag=false
        }
        this.handleType = type

    },
    computed:{
    startTimeOptions(){
      // 开始时间
      return{
        disabledDate:(time)=>{
          //今天之前的时间不能作为起始时间
          //结束时间之后的时间不能作为开始时间
          let disabledDate;
          let nowDate = new Date();
          nowDate.setDate(nowDate.getDate()-1);
          if(this.ruleForm.endTime!=""){
              disabledDate = new Date(this.ruleForm.endTime);
              disabledDate.setDate(disabledDate.getDate());
              return time.getTime() < nowDate.getTime()||time.getTime()>disabledDate.getTime();
          }else{
              return time.getTime() < nowDate.getTime()
          }
        }
      }
    },
    endTimeOptions(){
      // 结束时间
      return{
        disabledDate:(time)=>{
          //今天之前的时间不能作为结束时间
          //起始时间之前的时间不能作为结束时间
          let disabledDate
          if(this.ruleForm.startTime!=""){
             let startTime = new Date(this.ruleForm.startTime);
             let now =  new Date()
             if(startTime.getTime()<now.getTime())
                disabledDate = now
             else
                disabledDate = startTime

          }
          else
            disabledDate = new Date();
          disabledDate.setDate(disabledDate.getDate()-1);
          return time.getTime() < disabledDate.getTime();
        }
      }    
    },
  }

}
</script>
<style lang="scss" scoped>
    .new-enroll-main {
        width: 60%;
        min-width: 868px;
        max-width: 1080px;
        margin: 0 auto;
		.titleSwrap{
			display: flex;
			justify-content: space-between;
			position: relative;
		}
        .new-enroll-nav{
            height: 50px;
            line-height: 50px;
        }
        .new-enroll-title{
            // padding: 2%;
            // margin-bottom: 2%;
            // background: #fff;
			line-height: 50px;
            font-size: 21px;
            font-weight: 700;
			.titleRight{
				position: absolute;
				right: 0px;
				top: 0px;
				display: flex;
				align-items: center;
			}
			.nowState{
				color: #6b6868;
				font-size: 15px;
				font-weight: 600;
			}
            .el-tag{
                // margin-left: 50px;
				margin-right: 15px;
            }
            .el-button{
                float: right;
            }
        }
        .new-enroll-container{
            padding: 1%;
            margin-bottom: 1%;
            background: #fff;
            &-title{
                margin-bottom: 20px;
                padding: 2px 0;
                border-left: 4px solid #409EFF;
                text-indent: 20px;
                font-size: 18px;
                font-weight: 700;
            }
            .form-title{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            &-remarks{
               margin-bottom: 20px;
               padding: 2px 0;
               font-size: 14px;
               color: #909399; 
               font-weight: 500;
            }
            &-item{
                display: flex;
                justify-content: space-between;
                min-width: 348px;
                .baseform-item{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    margin-right: 10px;
                    &-name{
                        width: 50%;
                        border: 1px solid #dddfe6;
                        padding: 8px 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        &-tag{
                            width: 60px;
                            text-align: center;
                        }
                        
                    }
                    &-o{
                        margin-right: 10px;
                    }
                }
            }
            &-button{
				position: relative;
				top: -75px;
				
				.shortcut{
					width: 400px;
					margin-bottom: 10px;
					padding: 20px 0;
					border: 1px dotted #dbdbe1;
					.button-class{
					    margin: 10px;
					    height: 40px;
					    width: 110px;
					}
				}
				.custom{
					width: 400px;
					padding: 20px 0;
					border: 1px dotted #dbdbe1;
					.button-class{
					    margin: 10px;
					    height: 40px;
					    width: 110px;
					}
				}
				
                
            }
            .line{
                text-align: center;
            }
            .tag-class{
                font-size: 14px;
                color: #606266;
                font-weight: 700;
                margin:0 0 20px 0;
            }
            .title-class{
                font-weight: 700;
                margin:0 0 10px 10px;
            }
        }
        .new-enroll-submit{
            padding-bottom: 2%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        
    }
    .new-enroll-footer{
            height: 80px;
            background: #fff;
        }
</style>