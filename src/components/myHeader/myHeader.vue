<template>
  <el-row class="wrap">
    <nav  class="nav">
    	<div class="titleSwarp">
    		<i class="titleIcon iconfont icon-caidan"></i><span class="title">关爱老人平台</span>
    	</div>
    	<div class="contentSwarp">
    		<router-link to="/index" >平台管理</router-link>
    		<router-link to="/equipment" >设备管理</router-link>
    	</div>
    	<div class="userSwarp">
			<el-dropdown class="avatar-container" trigger="click">
			  <div>
				<i class="iconfont icon-wo"></i>
				<span class="user-name">你好,小李</span>
			  </div>
			  <el-dropdown-menu slot="dropdown" class="user-dropdown">
				<el-dropdown-item divided @click.native="logout">
				  <span style="display:block;">退出登录</span>
				</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
    	</div>
    </nav>
  </el-row>
</template>

<script>
  export default{
    name:'myHeader',
    components:{

    },
    data(){
      return{

      }
    },
    methods:{
      //退出登录
      logout(){
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
        }).then(() => {
          _this.$router.push('/login');
		  sessionStorage.removeItem('user');
        }).catch(() => {

        });
      }
    },
    mounted(){

    }
  }
</script>

<style scoped="scoped" lang="scss">
  a{
  	color: #dad5d5;
    display: block;
    height: 100%;
  }
  .router-link-active{
     color: #fff;
   }
  .nav{
    width: 100%;
  	height: 60px;
    background-color: #4b97eb;
  	display: flex;
  	justify-content: space-between;
    align-items: center;
  }
  .titleSwarp{
  	width: 20%;
  	box-sizing: border-box;
  	padding-left: 3vw;
  	font-size: 1.5vw;
  	font-weight: 600;
  	color: white;
  	line-height: 60px;
  }
  .titleSwarp .iconfont{
  	font-size: 2vw;
  }
  .titleSwarp  .title{
  	margin-left: 2px;
    position: relative;
    bottom: 0.2vw;
  }
  /* 中间部分 */
  .contentSwarp{
  	width: 50%;
  	display: flex;
    align-items: center;
  	font-size: 1vw;
  	color: #dad5d5;
  	font-weight: 600;
  }
  .contentSwarp>a{
    text-decoration: none;
    margin-right: 6.5vw;
    padding: 0px 0.5vw 0px 0.5vw;
  }
  
  /*右边部分*/
  .userSwarp{
  	width: 20%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    padding-right: 3vw;
  	font-size: 0.7vw;
  	color: white;
  }
  .userSwarp>span{
    cursor: pointer;
  }
  .userSwarp .iconfont{
  	font-size: 1.2vw;
	color: #fff;
  }
  .userSwarp>span{
    padding: 0px 0.5vw 0px 0.5vw;
  }
  .name i{
    color: #fff;
  }
  .user-name{
    color: white;
  }
</style>
