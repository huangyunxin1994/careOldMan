<template>
	<div>
		<el-dialog title="身份验证" :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
			<div class="passList">
				<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="120px">
					<p>检测到您未绑定身份证,无法进行登录,请先绑定身份证</p>
					<el-form-item  label="身份证号" prop="idCard">
						<el-input type="text" v-model="ruleForm2.idCard" auto-complete="off" placeholder="身份证号"></el-input>
					</el-form-item>
					
					<el-button type="primary" style="width:100%;" @click.native.prevent="onSubmit" >确定</el-button>
					
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {changePass,updateUser} from '@/api/api.js'
import {IdentityCodeValid} from '@/utils/index.js'

export default {
	data(){
		var validatePass = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请输入新密码'));
			} else {
				if (this.ruleForm2.again !== '') {
					if (value !== this.ruleForm2.again) {
						callback(new Error('两次输入密码不一致!'));
					}else{
						callback();
					} 
				}else{
					callback();
				}
			
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm2.newPassword) {
			callback(new Error('两次输入密码不一致!'));
			} else {
			callback();
			}
		};
		var validateIdCard =(rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入身份证'));
			}else{
				let bool = IdentityCodeValid(value)
				if(!bool){
					callback(new Error('身份证格式错误'));
				}else{
					callback();
				}
				
			}
		}
		return{
			dialogPassVisible:false,
			id:"",
			ruleForm2:{
				newPassword:'',
				again:'',
				idCard:''
			},
			rules2: {
				idCard : [
					{ required: true,validator: validateIdCard, trigger: 'blur' }
				],
				newPassword: [
					{ required: true,validator: validatePass, trigger: 'change' },
					{ required: true,validator: validatePass, trigger: 'blur' }
				],
				again: [
					{ required: true,validator: validatePass2, trigger: 'change' },
					{ required: true,validator: validatePass2, trigger: 'blur' }
				]
			},
		}
	},
	methods:{
		onSubmit(){
			this.$refs.ruleForm2.validate((valid) => {
				if (valid) {
					let param = {
						idCard:this.ruleForm2.idCard,
						id:this.id
					}
					updateUser(param).then((res)=>{
						//console.log(res)
						if(res.code == 0){
							this.$message({
								message: '身份证绑定成功',
								type: 'success'
							});
							this.dialogPassVisible = false
						}else{
							this.$message.error('身份证绑定失败');
							this.dialogPassVisible = false
						}
					})
				}
			})	
		},
		handleClose(){
			this.ruleForm2={
				newPassword:'',
				again:'',
				idCard:''
			},
			this.dialogPassVisible = false
			this.$nextTick(()=>{
                    this.$refs.ruleForm2.clearValidate();
                })
		},
		setShow(id){
			this.id = id
			this.dialogPassVisible = true
		}
	}
}
</script>

<style>
</style>
