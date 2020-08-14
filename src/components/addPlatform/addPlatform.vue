<template>
  <div class="wtbody">
    <el-dialog title="新建平台"  :visible.sync="dialogVisible" center :append-to-body='true' :before-close="handleClose" :lock-scroll="false" :close-on-click-modal="false" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      	<el-form-item label="平台ip" prop="ip">
      		<el-input v-model="form.ip"></el-input>
      	</el-form-item>
      	<el-form-item label="平台名称" prop="name">
      		<el-input v-model="form.name"></el-input>
      	</el-form-item>
      	<el-form-item label="消息队列" prop="queue">
      		<el-input v-model="form.queue"></el-input>
      	</el-form-item>
      </el-form>
	  <div class="btnWrap">
		  <el-button type="primary" @click="cancelBtn">取消</el-button>
		  <el-button type="primary" @click="onSubmit">立即创建</el-button>
	  </div>
    </el-dialog>
  </div>
</template>

<script>
  import { addPlatform } from '@/api/api'
  import {Debounce} from '@/utils/index.js'
  export default{
    data(){
		var validateIP = (rule, value, callback) => {
			if(value === ''){
				callback(new Error('请输入IP'));
			}else{
				callback();
			}
		}
		var validateQueue = (rule, value, callback) => {
			if(value === ''){
				callback(new Error('请输入消息队列'));
			}else{
				callback();
			}
		}
		var validateName = (rule, value, callback) => {
			if(value === ''){
				callback(new Error('请输入平台名称'));
			}else{
				callback();
			}
		}
		return{
			dialogVisible:false,
			form: {
			  name: '',
			  ip: '',
			  queue: ''
			},
			rules:{
			  ip:[
				{ required: true,validator: validateIP, trigger: 'blur' }
			  ],
			  queue:[
				{ required: true,validator: validateQueue, trigger: 'blur' }
			  ],
			  name:[
				{ required: true,validator: validateName, trigger: 'blur' }
			  ]
			}
      }
    },
    methods:{
      // 下载模板
      
		handleClose(){
			this.dialogVisible = false
			this.form = {
				name: '',
				ip: '',
				queue: ''
			}
			this.$nextTick(()=>{
                 this.$refs.form.clearValidate();
            })
		},
		onSubmit:Debounce (function(){
			 this.$refs.form.validate((valid) => {
					if (valid) {
						let data = this.form
						this.$confirm('确认添加新平台吗?', '提示', {
						          confirmButtonText: '确定',
						          cancelButtonText: '取消',
						          type: 'warning'
						        }).then(() => {
								  addPlatform(data).then((res)=>{
								  	console.log(res)
									this.$message({
									  type: 'success',
									  message: '添加成功!'
									});
									this.$emit('refreshPlatform',1)
								  }).catch((err)=>{
									  this.$message.error('添加失败');
								  })
						        }).catch(() => {
						          this.$message({
						            type: 'info',
						            message: '已取消添加'
						          });          
						        });
						this.cancelBtn()
					}
			 })
			
		},300),
		cancelBtn(){
			this.dialogVisible = false
			this.form = {
				name: '',
				ip: '',
				queue: ''
			}
			this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
		}
    },
    mounted(){

    },
  }
</script>

<style scoped lang="scss">
  .btnWrap{
	  display: flex;
	  align-items: center;
	  justify-content: flex-end;
  }
</style>
