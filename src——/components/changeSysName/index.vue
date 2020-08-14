<template>
	<div>
		<el-dialog title="修改平台名称" :visible.sync="dialogPassVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
			<div class="passList">
				<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="120px">
					<el-form-item  label="平台名称" prop="platformName">
					<el-input type="text" v-model="ruleForm2.platformName" auto-complete="off" placeholder="请输入平台名称" ></el-input>
					</el-form-item>
					
					<el-button type="primary" style="width:100%;" @click.native.prevent="onSubmit" :loading="loading" >确定</el-button>
					
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {updatePlatform,vaildIdCard} from '@/api/api.js'
import {IdentityCodeValid,Debounce} from '@/utils/index.js'
export default {
	data(){
		var validateplatformName = (rule, value, callback) => {
			if(value ===''){
				callback(new Error('请输入平台名称'));
			}else{
				callback();
			}
		};
		return{
			loading:false,
			flag:false,
			dialogPassVisible:false,
			ruleForm2:{
				platformName:'',
			},
			rules2: {
				platformName:[
					{ required: true,validator: validateplatformName, trigger: 'blur' }
				]
			},
			// platformName:'',
		}
	},
	methods:{
		onSubmit:Debounce (function(){
			// console.log("修改平台名称")
			this.loading=true
			 this.$refs.ruleForm2.validate((valid) => {
					if (valid) {
						let para = Object.assign({}, this.ruleForm2);
						// console.log(para)
						updatePlatform(para).then((res)=>{
							//console.log(res)
							if(res.code == 0){
								this.$message({
									message: '平台名称修改成功',
									type: 'success'
								});
								sessionStorage.setItem('sysName',JSON.stringify(this.ruleForm2) );
								this.ruleForm2={
									platformName:""
								},
								 
								this.dialogPassVisible = false
								this.loading=false
								this.$emit("changeSysName")
								
							}else{
								this.$message.error('平台名称修改失败');
								this.loading=false
							}
						}).catch((res)=>{
							this.$message.error('平台名称修改失败');
							this.loading=false
						})
					}else{
						this.loading=false
					}
			 })
			
		},300),
		handleClose(){
			this.ruleForm2={
				platformName:""
			},
			this.dialogPassVisible = false
			this.$nextTick(()=>{
                    this.$refs.ruleForm2.clearValidate();
                })
		},
		setShow(val,id){
			this.ruleForm2.id = id
			this.ruleForm2.platformName = val
			this.dialogPassVisible = true
		}
	}
}
</script>

<style>
</style>
