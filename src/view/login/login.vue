<template>
<div class="login-background">
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">


      <h2 style="color: #4b97eb;">欢迎登录</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" prefix-icon="el-icon-user" clearable auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>

      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" prefix-icon="el-icon-lock" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>

    <div class="login-handle">
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    </div>
    <el-form-item style="width:100%;">
      <el-button  class="login-button" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
  import { requestLogin } from '@/api/api.js';
  import {Debounce} from '@/utils/index.js'
  //import NProgress from 'nprogress'
  export default {
    components:{},
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
                this.logining = true;
                var loginParams = { account: this.ruleForm2.account, password: this.ruleForm2.checkPass};//普通用户传2
                requestLogin(loginParams).then(data => {
                    this.logining = false;
                    if(data.code == 0){
						let {user} = data.data
                        sessionStorage.setItem('user', JSON.stringify(user));
                        
                        this.$router.push({ path: '/index' });
                        this.$message({
                          message: "登录成功",
                          type: 'success'
                        });
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
	}
  }

</script>

<style lang="scss" >
.login-handle  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color:#4b97eb;
    border-color: #4b97eb;
    }
    .login-handle  .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #4b97eb;
    }
    .login-handle  .el-checkbox.is-bordered.is-checked{
      border-color: #4b97eb;
    }
    .login-handle  .el-checkbox__input.is-focus .el-checkbox__inner{
      border-color:  #4b97eb;
    }
</style>
<style lang="scss" scoped>
.login-background{
    // position: relative;
    width:100%;
    height:100%;
    min-width: 684px;
    min-height: 584px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    // background: url("../assets/bg2.jpg") no-repeat;
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
    box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
    position: absolute;
    top:50%;
    left:50%;
    -webkit-transform:translate(-50%,-50%);
    transform:translate(-50%,-50%);


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
      color: #4b97eb;
    }
    .login-handle{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .remember {
        margin: 0px 0px 35px 0px;
        color:  #4b97eb;
    }
    }
    .login-handle {
      /deep/ .el-checkbox {
        color: #4b97eb;

      }
    }

    .el-form-item__content /deep/ .el-button {
      width: 100%;
      color: #fff;
      background: #4b97eb;
    }
   h2{
     text-align: center;
   }
  }
   .footer{
    position: absolute;
    background: #4b97eb;
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
      color:#4b97eb;

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

// 登录按钮
.login-button{
  width: 100%;
  background-color: #4b97eb;
  color: #fff;
}
</style>
