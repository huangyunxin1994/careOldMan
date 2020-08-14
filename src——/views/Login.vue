<template>
<div class="login-background">
  <!-- <img class='login-img' > -->
  <div class='login-logo'>
    <div class="logo" >
      <i class="iconfont">&#xe62b;</i>
    </div>
    <h1 class="title">{{platFormName}}</h1>
    
  </div>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    
    
      <h2>欢迎登录</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
  
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码" @keyup.enter.native="handleSubmit2"></el-input>
      </el-form-item>
  
    <div class="login-handle">
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-link :underline="false"  class="remember" @click="changePass">忘记密码?</el-link>
    </div>
    <el-form-item style="width:100%;">
      <el-button  class="login-button" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
    <change-passworld ref="changePass"></change-passworld>
	<verify-idcard ref="verifyId" ></verify-idcard>
  </el-form>
  <div class="footer">
      <span class="footer-message">© 2019-2020 中科华宸创新科技研发中心.</span> 
      <!-- <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010302002241">
        <img src="../assets/gongan.png" style="float:left;"/>
        <span>桂公网安备 45010302002241号</span >
      </a> -->
      <a target="_blank" href="http://beian.miit.gov.cn/">桂ICP备20002998号-2</a>
      
    </div>
</div>
</template>

<script>
  import { requestLogin,getPlatForm } from '../api/api';
  import changePassworld from '../components/changePass/index.vue'
  import verifyIdcard from '../components/verify-IDCard/index.vue'
  import {Debounce} from '@/utils/index.js'
  //import NProgress from 'nprogress'
  export default {
    components:{
      changePassworld,
	  verifyIdcard
    },
    data() {
      return {
        platFormName:"",
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
        },
        checked: true
      };
    },
    methods: {
      changePass(){
        this.$refs.changePass.setShow(this.ruleForm2.account)
      },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2: Debounce(function() {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
            if (valid) {
              //_this.$router.replace('/table');
                this.logining = true;
                //NProgress.start();
                var loginParams = { account: this.ruleForm2.account, password: this.ruleForm2.checkPass ,type:2};//普通用户传2
                requestLogin(loginParams).then(data => {
                    this.logining = false;
                    if(data.code == 0){
                        let { msg, code, user } = data.data;
                        let type = data.data.type
                        let boolId = user.hasOwnProperty("idCard"); 
                        if(boolId == false){//判断身份证号是否存在，如果存在就直接登录，如果不存在，需要绑定身份证号
                          this.$refs.verifyId.setShow(user.id)
                        }else{
                          sessionStorage.setItem('user', JSON.stringify(user));
                          sessionStorage.setItem('type', JSON.stringify(type));
                          
                          this.$router.push({ path: '/' });
                          this.$message({
                            message: "登录成功",
                            type: 'success'
                          });
                        }
                    }else{
                        this.$message({
                          message: data.msg,
                          type: 'error'
                        });
                    }
              });
          } else {
              return false;
          }
        });
        if(_this.checked == true){
          // console.log("checked == true");
          _this.setCookie(_this.ruleForm2.account,_this.ruleForm2.checkPass,7)
        }else{
          // console.log("清空Cookie");
          _this.clearCookie();
        }
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
	  //设置cookie
	  setCookie(c_name, c_pwd, exdays){
		var exdate = new Date(); //获取时间
	    exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
	    //字符串拼接cookie
	    window.document.cookie =
			"userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
		window.document.cookie =
			"userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
	  },
	  //读取cookie
	  getCookie(){
		if(document.cookie.length > 0){
			var arr = document.cookie.split("; "); //这里显示的格式需要切割一下自己可输出看下
			// console.log(arr)
			for (var i = 0; i < arr.length; i++) {
			  var arr2 = arr[i].split("="); //再次切割
			  //判断查找相对应的值
			  if (arr2[0] == "userName") {
				this.ruleForm2.account = arr2[1]; //保存到保存数据的地方
			  } else if (arr2[0] == "userPwd") {
				this.ruleForm2.checkPass = arr2[1];
			  }
			}
		}
	  },
	  clearCookie: function() {
		this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
	  },
    },
	mounted() {
    this.getCookie()
    this.getPlatformName()
	}
  }

</script>

<style lang="scss" >
.login-handle  .el-checkbox__input.is-checked .el-checkbox__inner, .login-handle .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color:#303133;
    border-color: #303133;
    }
    .login-handle  .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #303133;
    }
    .login-handle  .el-checkbox.is-bordered.is-checked{
      border-color: #303133;
    }
    .login-handle  .el-checkbox__input.is-focus .el-checkbox__inner{
      border-color:  #303133;
    }
</style>
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
    .login-handle{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .remember {
        margin: 0px 0px 35px 0px;
        color:  #303133;
    }
    }
    .login-handle {
      /deep/ .el-checkbox {
        color:  #303133;
        
      }
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