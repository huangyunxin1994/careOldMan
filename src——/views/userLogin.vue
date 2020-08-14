<template>
	<div class="login-background">
  <!-- <img class='login-img' > -->
  <div class='login-logo'>
    <div class="logo" >
      <i class="iconfont">&#xe62b;</i>
    </div>
    <h1 class="title">{{platFormName}}管理端</h1>
    
  </div>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    
    
      <h2>欢迎登录</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
  
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
    <el-form-item style="width:100%;">
      <el-button  class="login-button" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
    <change-passworld ref="changePass"></change-passworld>
	<verify-idcard ref="verifyId" ></verify-idcard>
  </el-form>
  <div class="footer">
      <span class="footer-message">© 2019-2020 中科华宸创新科技研发中心.</span> 
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010302002241">
        <img src="../assets/gongan.png" style="float:left;"/>
        <span>桂公网安备 45010302002241号</span >
      </a>
      <a target="_blank" href="http://beian.miit.gov.cn/">桂ICP备20002998号-1</a>
      
    </div>
</div>	
</template>

<script>
	import { requestLogin,getPlatForm } from '../api/api';
	  import {Debounce} from '@/utils/index.js'
	export default {
		data(){
			return{
				platFormName:"",
				logining:false,
				ruleForm2:{
					account:'huachen2020',
					checkPass:'password'
				},
				rules2:{
					account:[
						{
							required:true,
							message:'请输入账号',
							trigger:'blur'
						}
					],
					checkPass:[
						{
							required:true,
							message:'请输入密码',
							trigger:'blur'
						}
					],
				},
				checked:true
			}
		},
		methods:{
			// changePass(){
			//   // this.$refs.changePass.setShow()
			//   console.log("修改密码")
			// },
			handleSubmit:Debounce(function(){
				let _this = this;
				this.$refs.ruleForm2.validate((valid)=>{
					if(valid){
						//_this.$router.replace('/table');
						this.logining = true;
						//NProgress.start();
						var loginParams = { account: this.ruleForm2.account, password: this.ruleForm2.checkPass , type:1};//管理员登录传1
						requestLogin(loginParams).then(data => {
							// console.log(data)
						  this.logining = false;
						  //NProgress.done();
						  let { code, msg} = data
						  if (code != 0) {
						    this.$message({
						      message: msg,
						      type: 'error'
						    });
						  } else {
							let { user } = data.data;
						  	let type = data.data.type
						    sessionStorage.setItem('user', JSON.stringify(user));
							sessionStorage.setItem('type', JSON.stringify(type));
						    this.$router.push({ path: '/userAdmin' });
							this.$message({
							  message: "登录成功",
							  type: 'success'
							});
						  }
						});
					}
				})
			},300),
			//获取平台名称
			getPlatformName(){
				getPlatForm().then(res=>{
				if(res.code==0){
					sessionStorage.setItem('sysName', JSON.stringify(res.data.data[0]));
					this.platFormName = res.data.data[0].platformName
				}
				}).catch(err=>{
				console.log(err)
				})
			},
		},
		mounted(){
			this.getPlatformName()
		}
	}
</script>

<style lang="scss" scoped>
.login-background{
  position: relative;
    width:100%;
    height:100%;
    min-width: 684px;
    min-height: 584px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; 
    background: url("../assets/bg2.jpg") no-repeat;
     background-size: cover;
     -webkit-background-size: cover;
     -o-background-size: cover;
     background-position: top center;
    z-index:0;
  
  .login-logo{
     position: absolute;
     top: 20px;
     left: 30px;
     color: #fff;
     display: flex;
     justify-content: space-between;
     align-items: center;
     z-index: 2;
    .logo{
      margin-right: 30px;
      i{
        color: #E6A23C;
         font-size: 48px;
      }
    }
  }
  
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    // min-width: 250px;
    // max-width: 350px;
    width: 35vh;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    // box-shadow: 0 0 25px #cac6c6;
    z-index: 2;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    } 
    
    .el-form-item__content /deep/ .el-button {
      width: 100%;
      color: #fff;
      background: #303133;
    } 
   h2{
     text-align: center;
   }
  }
   .footer{
    position: absolute;
    background: #303133;
    opacity: 0.8;
    padding: 20px;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    z-index: 2;
    &-message,a{
      font-size: 14px;
      font-weight: 500;
      color:#fff;
      padding: 0 10px;
      border-right: 2px solid #fff;
    }
    a:last-child{
      border:none
    }
    a{
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    a:hover{
      color:#C0C4CC;
      
    }
  }
}
.login-background:after{
  content:"";
  width:100%;
  height:100%;
  position:absolute;
  left:0;
  top:0;
  background:inherit;
  filter:blur(2px);
  z-index:0;
}
</style>
</style>
