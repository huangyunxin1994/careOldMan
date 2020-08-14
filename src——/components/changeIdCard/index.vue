<template>
	<div>
		<el-dialog title="修改身份证号" :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
			<div class="passList">
				<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="120px">
					<el-form-item  label="账号" prop="account">
					<el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="请输入账号" :disabled="flag"></el-input>
					</el-form-item>
					<el-form-item  label="旧身份证号" prop="idCard">
					<el-input type="text" v-model="ruleForm2.idCard" auto-complete="off" placeholder="请输入身份证号"></el-input>
					</el-form-item>
					<el-form-item  label="新身份证号" prop="newIdCard">
					<el-input type="text" v-model="ruleForm2.newIdCard" auto-complete="off" placeholder="请输入身份证号"></el-input>
					</el-form-item>
					<el-form-item  label="再输入一次" prop="again">
					<el-input type="text" v-model="ruleForm2.again" auto-complete="off" placeholder="请再次身份证号"></el-input>
					</el-form-item>
					
					<el-button type="primary" style="width:100%;" @click.native.prevent="onSubmit" :loading="loading" >确定</el-button>
					
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {updateUser,vaildIdCard} from '@/api/api.js'
import {IdentityCodeValid,Debounce} from '@/utils/index.js'
export default {
	data(){
		var validatePass = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请输入新身份证号'));
			} else {
				if (this.ruleForm2.again !== '') {
					if (value !== this.ruleForm2.again) {
						callback(new Error('两次输入身份证号不一致!'));
					}else{
						let bool = IdentityCodeValid(value)
						if(!bool){
							callback(new Error('身份证格式错误'));
						}else{
							callback();
						}
					} 
				}else{
					let bool = IdentityCodeValid(value)
					if(!bool){
						callback(new Error('身份证格式错误'));
					}else{
						callback();
					}
				}
			
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
			callback(new Error('请再次输入身份证号'));
			} else if (value !== this.ruleForm2.newIdCard) {
				callback(new Error('两次输入身份证号不一致!'));
			} else {
			let bool = IdentityCodeValid(value)
				if(!bool){
					callback(new Error('身份证格式错误'));
				}else{
					callback();
				}
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
		};
		var validateAccount = (rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入账号'));
			}else{
				callback();
			}
		};
		return{
			loading:false,
			flag:false,
			dialogPassVisible:false,
			ruleForm2:{
				account:'',
				newIdCard:'',
				again:'',
				idCard:''
			},
			rules2: {
				idCard : [
					{ required: true,validator: validateIdCard, trigger: 'blur' }
				],
				newIdCard: [
					{ required: true,validator: validatePass, trigger: 'change' },
					{ required: true,validator: validatePass, trigger: 'blur' }
				],
				again: [
					{ required: true,validator: validatePass2, trigger: 'change' },
					{ required: true,validator: validatePass2, trigger: 'blur' }
				],
				account:[
					{ required: true,validator: validateAccount, trigger: 'blur' }
				]
			},
			// account:'',
		}
	},
	methods:{
		onSubmit:Debounce (function(){
			// console.log("修改身份证号")
			this.loading=true
			 this.$refs.ruleForm2.validate((valid) => {
				 
					if (valid) {
						let para = Object.assign({}, this.ruleForm2);
						vaildIdCard({idCard: this.ruleForm2.idCard,account:this.ruleForm2.account}).then(res=>{
							if(res.code==0){
								// console.log(para)
								let para2 = {}
								para2.id = para.id;
								para2.idCard = para.newIdCard;
								updateUser(para2).then((res)=>{
									//console.log(res)
									if(res.code == 0){
										this.$message({
											message: '身份证号修改成功,3秒后退出系统，请重新登录',
											type: 'success'
										});
										this.ruleForm2={
											newIdCard:'',
											again:'',
											idCard:''
										},
										this.dialogPassVisible = false
										this.loading=false
										setTimeout(_=>{
											this.$router.push({path:"/login"})
										},3000)
										
									}else{
										this.$message.error('身份证号修改失败');
										this.loading=false
									}
								}).catch((res)=>{
									this.$message.error('身份证号修改失败');
									this.loading=false
								})
							}else{
							  	this.$notify({
                                    title: '警告',
                                    message: '账号或身份证号验证错误',
                                    type: 'warning'
								});
								this.loading=false
							}
						})
						
					}else{
						this.loading=false
					}
			 })
			
		},300),
		handleClose(){
			this.ruleForm2={
				account:'',
				newIdCard:'',
				again:'',
				idCard:''
			},
			this.dialogPassVisible = false
			this.$nextTick(()=>{
                    this.$refs.ruleForm2.clearValidate();
                })
		},
		setShow(val,id,flag){
			this.flag =flag
			this.ruleForm2.id = id
			this.ruleForm2.account = val
			this.dialogPassVisible = true
		}
	}
}
</script>

<style>
</style>
