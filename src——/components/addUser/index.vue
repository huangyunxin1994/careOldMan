<template>
	<div>
		<el-dialog title="用户编辑" 
			:visible.sync="dialogPassVisible" 
			center 
			:append-to-body='true' 
			:before-close="handleClose" 
			:lock-scroll="false" 
			:close-on-click-modal="false" width="685px">
			<div class="passList">
				<el-form  :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="140px">
					<el-form-item label="账号" prop="account">
					    <el-input v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
					    <el-input v-model="ruleForm2.password" auto-complete="off" placeholder="请输入密码" ></el-input>
					</el-form-item>
					<el-form-item label="是否启用" >
					    <el-radio-group v-model="ruleForm2.isEnable">
					      <el-radio :label='1'>是</el-radio>
					      <el-radio :label='2'>否</el-radio>
					    </el-radio-group>
					  </el-form-item>
					<el-form-item label="服务结束日期" prop="expiresTime">
					    <!-- <el-input v-model="ruleForm2.endTime" placeholder="请输入联系号码" ></el-input>	 -->
						<el-date-picker
						      v-model="ruleForm2.expiresTime"
						      type="date"
							  align="right"
							  format="yyyy-MM-dd" 
							  value-format="yyyy-MM-dd"
						      placeholder="选择服务结束日期"
							  :picker-options="startTimeOptions">
						    </el-date-picker>
					</el-form-item>
					<el-form-item label="联系号码" prop="phone">
					    <el-input v-model="ruleForm2.phone" placeholder="请输入联系号码 例:010-XXXXXXXX或XXXXXXXXXXX" ></el-input>
					</el-form-item>
					<el-form-item label="单位名称" prop="username">
					    <el-input v-model="ruleForm2.username" placeholder="请输入单位名称" ></el-input>
					</el-form-item>
					<el-form-item label="所属区域" prop="areas">
					    <el-input v-model="ruleForm2.areas" placeholder="请输入所属区域" ></el-input>
					</el-form-item>
					<el-form-item>
					    <el-button type="primary" v-if="state == 1" class="btn" @click="addSubmit" size="medium" >创建</el-button>
					    <el-button type="primary" class="btn" v-else @click="changeSubmit">修改</el-button>
					  </el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {addUser,updateUser,getUserName} from '@/api/api.js'
import {IdentityCodeValid , parseTime} from '@/utils/index.js'

export default {
	data(){
		var validateAccount =(rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入账号'));
			}else if(value != this.account){
				getUserName({idCard:value}).then(res=>{
					if(res.code==0){
						if(res.data.data.length == 0){
							callback();
						}else{
							callback(new Error('账号已经存在'));
						}
					}
				})
			}else{
				callback();
			}
		}
		var validatePassword =(rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入密码'));
			}else{
				callback();
			}
		}
		var validateUsername =(rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入单位名称'));
			}else{
				callback();
			}
		}
		var validateAreas =(rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入所属区域'));
			}else{
				callback();
			}
		}
		var validatePhone = (rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入联系号码'));
			}else{
				callback();
			}
		}
		var validateEndTime = (rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入结束日期'));
			}else{
				callback();
			}
		}
		return{
			dialogPassVisible:false,
			getClick:true,//创建按钮是否可以点击
			haveName:false,//账号是否存在
			account:"",
			ruleForm2:{
				account:'',
				areas:'',
				createTime:'',
				expiresTime:'',
				phone:'',
				id:'',
				idCard:'',
				isEnable:1,
				isManage:'',
				password:'',
				username:''
			},
			state:0,
			ifExist:'',
			rules2: {
				account:[
					{ required: true,validator: validateAccount, trigger: 'blur' }
				],
				password:[
					// { required: true,validator: validatePassword, trigger: 'change' },
					{ required: true,validator: validatePassword, trigger: 'blur' }
				],
				username:[
					{ required: true,validator: validateUsername, trigger: 'blur' }
				],
				areas:[
					{ required: true,validator: validateAreas, trigger: 'blur' }
				],
				phone:[
					{ required: true,validator: validatePhone, trigger: 'blur' },
					{ message: "请输入正确的号码", trigger: "blur" },
					{
						// pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/||/^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,6})?$/,
						// pattern:/^[0-9]*$/||
						pattern:/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/,
						// pattern:/^[\d\-]+$/,
						message: "请输入正确的号码"
					}
				],
				expiresTime:[
					{ required: true,validator: validateEndTime, trigger: 'blur' }
				]
			},
		}
	},
	methods:{
		handleClose(){
			this.ruleForm2={
				account:'',
				areas:'',
				createTime:'',
				expiresTime:'',
				phone:'',
				id:'',
				isEnable:1,
				isManage:'',
				password:'',
				username:''
			},
			this.dialogPassVisible = false
			 this.$nextTick(()=>{
			                    this.$refs.ruleForm2.clearValidate();
			                })
		},
		setShow(val){
			this.dialogPassVisible = true
			if(val == 1){
				this.state = val
			}else{
				//console.log(val)
				this.state = val
				this.account=val.account
				this.ruleForm2.account = val.account
				this.ruleForm2.areas = val.areas
				this.ruleForm2.createTime = val.createTime
				this.ruleForm2.id = val.id
				this.ruleForm2.isEnable = val.isEnable
				this.ruleForm2.phone = val.phone
				this.ruleForm2.expiresTime = val.expiresTime
				this.ruleForm2.isManage = val.isManage
				this.ruleForm2.password = val.password
				this.ruleForm2.username = val.username
			}
		},
		//添加用户
		addSubmit(){
			this.$refs.ruleForm2.validate((valid) => {
				if (valid) {
					let time = parseTime(new Date(),'{y}-{m}-{d}')
					let param = {
						account:this.ruleForm2.account,
						password:this.ruleForm2.password,
						isEnable:this.ruleForm2.isEnable,
						username:this.ruleForm2.username,
						phone:this.ruleForm2.phone,
						expiresTime:this.ruleForm2.expiresTime,
						areas:this.ruleForm2.areas,
						createTime:time,
						isManage:2
					}
					addUser(param).then((res)=>{
						if(res.code == 0){
							this.$message({
							  message: '添加成功',
							  type: 'success'
							});
							this.$emit("updateMess",1)
						}else{
							this.$message.error('添加失败');
						}
					}).catch((res)=>{	
						this.$message.error('添加失败');
					})
					this.dialogPassVisible = false
				}
			})
			
		},
		//修改用户
		changeSubmit(){
			this.$refs.ruleForm2.validate((valid) => {
				if (valid) {
					let param = {
						account:this.ruleForm2.account,
						areas:this.ruleForm2.areas,
						createTime:this.ruleForm2.createTime,
						id:this.ruleForm2.id,
						phone:this.ruleForm2.phone,
						expiresTime:this.ruleForm2.expiresTime,
						isEnable:this.ruleForm2.isEnable,
						isManage:this.ruleForm2.isManage,
						password:this.ruleForm2.password,
						username:this.ruleForm2.username
					}
					updateUser(param).then((res)=>{
						if(res.code == 0){
							this.$message({
							  message: '修改成功',
							  type: 'success'
							});
							this.$emit("updateMess",1)
						}else{
							this.$message.error('修改失败');
						}
					}).catch((res)=>{
						this.$message.error('修改失败');
					})
					this.dialogPassVisible = false
				}
			})
		}
	},
	computed:{
	  startTimeOptions(){
	    // 开始时间
	    return{
	      disabledDate:(time)=>{
	        //今天之前的时间不能作为起始时间
	        let disabledDate;
	        let nowDate = new Date();
	        nowDate.setDate(nowDate.getDate()-1);
	       return time.getTime() < nowDate.getTime()
	      }
	    }
	  }
	}
}
</script>

<style scoped lang="scss">
	.btn{
		width: 200px;
	}
</style>
