<template>
	<el-row class="container">
		<div :span="24" class="header">
			<div class="logo logo-width">
				<i class="iconfont logo-icon"  @click="returnIndex">&#xe66e;</i>
				<span class="logo-title">{{sysName}}</span>
			</div>
			<div class="userinfo">
				<el-dropdown trigger="click">
					<i class="el-icon-s-tools setIcon el-dropdown-link"></i>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="setSysName" v-if="isManage===1">平台名称设置</el-dropdown-item>
						<el-dropdown-item @click.native="setIdCard">校验身份证修改</el-dropdown-item>
						<el-dropdown-item @click.native="setPass">密码修改</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<span class=" userinfo-inner"> <span>欢迎您</span> {{sysUserName}}</span>
			</div>
		</div>
		<el-col :span="24" class="main">
			<section class="content-container">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
			</section>
		</el-col>
		<el-col :span="24" class="footer">
			
		</el-col>
		<change-passworld ref="changePass"></change-passworld>
		<change-id-card ref="changeIdCard"></change-id-card>
		<change-sys-name ref="changeSysName" @changeSysName="changeSysName"></change-sys-name>
	</el-row>
</template>

<script>
	import changePassworld from '../components/changePass/index.vue'
	import changeIdCard from '../components/changeIdCard/index.vue'
	import changeSysName from '../components/changeSysName/index.vue'
	import { changePass } from '@/api/api'
	export default {
		components:{
			changePassworld,
			changeIdCard,
			changeSysName
		},
		data() {
			return {
				id:"",
				isManage:"",
				sysName:'',
				sysId:"",
				collapsed:false,
				sysUserName: '',
				expiresTime:'',//服务到期时间
				sysUserAvatar: '',
				account:'',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			//退出登录
			logout () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					let type1 = sessionStorage.getItem('type')
					type1 = JSON.parse(type1)
					if(type1 == 1){
						sessionStorage.removeItem('type');
						sessionStorage.removeItem('user');
						_this.$router.push('/userLogin');
					}else{
						sessionStorage.removeItem('type');
						sessionStorage.removeItem('user');
						_this.$router.push('/login');
					}
				}).catch(() => {

				});
			},
			//返回首页
			returnIndex(){
				this.$router.replace({ path: '/' })
				// console.log("路由跳转")
			},
			//设置密码
			setPass(){
				this.$refs.changePass.setShow(this.account,true)
			},
			//设置身份证
			setIdCard(){
				this.$refs.changeIdCard.setShow(this.account,this.id,true)
			},
			setSysName(){
				this.$refs.changeSysName.setShow(this.sysName,this.sysId)
			},
			changeSysName(){
				let platform =  JSON.parse(sessionStorage.getItem('sysName'));
				this.sysName = platform.platformName
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			var sysName = sessionStorage.getItem('sysName');
			if (user) {
				user = JSON.parse(user);
				console.log(user)
				this.sysUserName = user.username || '';
				this.expiresTime = user.expiresTime || '';
				this.sysUserAvatar = user.avatar || '';
				this.account = user.account || '';
				this.isManage = user.isManage
				this.id = user.id;
			}
			if(sysName){
				sysName = JSON.parse(sysName);
				this.sysName = sysName.platformName || '报名系统';
				this.sysId = sysName.id || '';
			}
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			background: $color-lightblue;
			color:#fff;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.userinfo {
				// text-align: right;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				margin-right: 35px;
				float: right;
				.time{
					margin-right: 20px;
				}
				.setIcon{
					color: #fff;
					font-size: 30px;
					margin-right: 20px;
					cursor: pointer;
					display: flex;
					align-items: center;
				}
				.userinfo-inner {
					font-size: 15px;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			
			.logo {
				//width:230px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.logo-icon{
					cursor: pointer;
					margin:0 15px;
					font-size: 24px;
					// font-size: 25px;
					background-color: #dcdbdb;
					padding: 5px;
					box-sizing: border-box;
					border-radius: 10px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
				}
				.logo-icon:hover{
					// background-color: #C0CCDA;
					background-color: #dcdbdb;
					border-radius: 10px;
					box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .4);
				}
				.logo-title{
					font-size: 22px;
					font-weight: 700;
				}
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			background-color: rgba(242, 242, 242, 1);
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow: hidden;

				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					height: 100%;
					
					box-sizing: border-box;
				}
			}
		}
		// .footer {
		// 	height: 40px;
		// 	line-height: 80px;
		// 	background: $color-lightblue;
		// 	color:#fff;
		// }
	}
</style>