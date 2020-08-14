<template>
<el-scrollbar style="width:100%;height:calc(100% - 77px);">
	<section  class="main-container">
		<div  class="main-container-row">
			<el-row :gutter="20">
				<el-col :xs="24" :sm="10" :md="10" :lg="10" :xl="10">
					<div class="main-container-item">
						<div class="usermessage">
							<h3><i class="iconfont">&#xe62b;</i> 欢迎您, {{sysUserName}}</h3>
							<span v-if="isManage!==1&&expiresTime!=''">服务到期时间:  {{expiresTime}}</span>
						</div>
						<div  class="userhandle">
							<div class="userhandle-item" @click="setSysName" v-if="isManage>=1">
								<i class="el-icon-postcard"></i>
								<span >修改平台名称</span>
							</div>
							<div class="userhandle-item" @click="setIdCard">
								<i class="el-icon-user"></i>
								<span >修改校验身份证</span>
							</div>
							<div class="userhandle-item" @click="setPass">
								<i class="el-icon-lock"></i>
								<span>修改密码</span>
							</div>
							
						</div>
					</div>
				</el-col>
				<el-col :xs="12" :sm="7" :md="7" :lg="7" :xl="7">
					<div  class="main-container-item" @click="newEnroll">
						<div class="main-container-item-top new-enroll">
							<p class="new-enroll-title">新建报名</p>
							<p class="new-enroll-tip">自定义报名信息</p>
							<i class="iconfont">&#xe636;</i>
						</div>
						<div class="main-container-item-bottom">
							新建报名
						</div>
					</div>
				</el-col>
				<el-col :xs="12" :sm="7" :md="7" :lg="7" :xl="7">
					<div  class="main-container-item" @click="enrollManage">
						<div class="main-container-item-top enroll-manage">
							<p class="enroll-manage-title">报名管理与审核</p>
							<p class="enroll-manage-tip">
								报名活动管理<br/>报名人员审核
							</p>
							<i class="iconfont">&#xe642;</i>
						</div>
						<div class="main-container-item-bottom">
							报名管理与审核
						</div>
					</div>
				</el-col>
				<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
					<div class="enroll-contain">
						<el-row :gutter="20">
							<div class="enroll-contain-title">
							<span>最近添加</span> 
							</div>
							<el-col  v-if="tableAllData.length===0" class="no-message">
								<span>还没有创建报名</span>
								<el-link :underline="false" type="primary" icon="el-icon-circle-plus-outline" @click="newEnroll">创建一个试一试 ?</el-link>
							</el-col>
						
							
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6"  v-for="item in tableAllData" :key="item.id" v-else>
								
								<div  class="enroll-contain-item" @click="handleCheck(item.id)">
									<div>
										<strong>{{item.title}}</strong>
										<el-tag
											:type="tagType=item.state==1||item.state==4?'info':(item.state==2?'primary':(item.state==3?'success':''))"
											>
											{{ item.state==1?"未发布":(item.state==4?'已结束':(item.state==2?'未开始':(item.state==3?'进行中':''))) }}
										</el-tag>
									</div>
									<div>
										<i class="el-icon-timer"></i>
										<span>{{item.startTime.replace(/-/g,"/")}} ~ {{item.endTime.replace(/-/g,"/")}}</span>
									</div>
									<div ><span>创建时间:{{item.createTime.substring(0,11).replace(/-/g,"/")}}</span></div>
									<div>
										<el-tooltip class="item" effect="dark" content="详情" placement="top">
										<i class="el-icon-tickets" @click.stop="handleCheck(item.id)"></i>
										</el-tooltip>
										<el-tooltip class="item" effect="dark" content="编辑" placement="top">
										<i class="el-icon-edit-outline" @click.stop="handleEdit(item.id)"></i>
											</el-tooltip>
										<el-tooltip class="item" effect="dark" content="二维码" placement="top">
											<i class="iconfont" @click.stop="showQrCode(item.qrCode)">&#xe606; </i>
										</el-tooltip>
									</div>
								</div>
							</el-col>
						</el-row>
					</div>
				</el-col>
				<el-col :span="10">
					
				</el-col>
				
				<el-col :span="7">
					
				</el-col>
				<el-col :span="7">
					
				</el-col>
			</el-row>
		</div>
		<div style="width:70%;margin:0 auto">
			<el-row :gutter="20">
				
				
			</el-row>
		</div>
		 <div class="footer">
      <span class="footer-message">© 2019-2020 中科华宸创新科技研发中心.</span> 
      <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45010302002241">
        <img src="../assets/gongan.png" style="float:left;"/>
        <span>桂公网安备 45010302002241号</span >
      </a>
      <a target="_blank" href="http://beian.miit.gov.cn/">桂ICP备20002998号-1</a>
      
    </div>
		
	</section>
	<qr-code ref="qrcode" :imgPath="imgPath"></qr-code>
	<change-passworld ref="changePass"></change-passworld>
	<change-id-card ref="changeIdCard"></change-id-card>
	<change-sys-name ref="changeSysName" @changeSysName="changeSysName"></change-sys-name>
</el-scrollbar>
</template>

<script>
	import changePassworld from '../components/changePass/index.vue'
	import changeIdCard from '../components/changeIdCard/index.vue'
	import changeSysName from '../components/changeSysName/index.vue'
	import qrCode from '@/components/qr-code'
	import "@/assets/iconfonts/iconfont.css"
	import { selectSigup } from '@/api/api'
	export default {
		components:{
			qrCode,
			changePassworld,
			changeIdCard,
			changeSysName
		},
		data(){
			return{
				tableAllData:[],
				imgPath:"",
				sysUserName:"",
				isManage:"",
				expiresTime:"",
				userid:"",
				account:"",
				sysName:"",
				sysId:""
			}
		},
		methods:{
			newEnroll(){
				this.$router.push(
					{
						path:"/newenroll",
						query:{
							type:"add"
						}
					}
				)
			},
			enrollManage(){
				this.$router.push({path:"/enrollmanage"})
			},
			getEnroll(){
				selectSigup({userId:this.userid}).then(res=>{
					if(res.code==0){
						if(res.data.data.length>4){
							this.tableAllData=res.data.data.slice(0,4)
						}else{
							this.tableAllData=res.data.data
						}
						console.log(this.tableAllData)
					}else{
						this.$notify({
							title: '错误',
							message: res.msg,
							type: 'error'
						}); 
					}
				}).catch(err=>{
					this.listLoading=false
						this.$notify({
							title: '错误',
							message: err.msg,
							type: 'error'
						}); 
				})
			},
			
			handleCheck(id){
				this.$router.push(
					{
						path:"/enrollcheck",
						query:{
							id:id
						}
					}
				) 
			},
			handleEdit(id){
				this.$router.push(
					{
						path:"/editenroll",
						query:{
							id:id,
							type:"update"
						}
					}
				)
			},
			showQrCode(code){
				this.imgPath=code
				this.$refs.qrcode.dialogVisible=true
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
		mounted(){
			let user = sessionStorage.getItem('user');
			var sysName = sessionStorage.getItem('sysName');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.username || '';
				this.expiresTime = user.expiresTime || '';
				this.account = user.account || '';
				this.isManage = user.isManage
				this.userid = user.id;
			}
			if(sysName){
				sysName = JSON.parse(sysName);
				this.sysName = sysName.platformName || '报名系统';
				this.sysId = sysName.id || '';
			}
			this.getEnroll()
		}
	}
</script>
<style >
.el-scrollbar__view{
	width: 100%;
	height: 100%;
}
</style>
<style scoped lang="scss">
body{
	font-size: 24px;
}
@media  (max-width: 768px) {
	.main-container-row{
		width:90%;
		.main-container-item{
				.el-icon-s-tools,.iconfont{
					font-size: 4em;
				}
				.new-enroll-title{
					font-size: 1.5em;
				}
				.new-enroll-tip{
					font-size: 1em;
				}
				.enroll-manage-title{
					font-size: 1.5em;
				}
				.enroll-manage-tip{
					font-size: 1em;
				}
				.main-container-item-bottom{
					font-size: 1em;
					font-weight: 600;
				}
				.usermessage{
					padding: 1em;
					h3{
						font-size: 1.5em;
						.iconfont{
							font-size: 1.5em;
						}
					}
					span{
						font-size: 0.8em;
					}
				}
				.userhandle-item{
					margin: 1em;
					i{
						font-size: 1.5em;
					}
					span{
						font-size: 0.8em;
						color:#909399;
					}
					
				}
		}
	}
	
}
@media  (min-width: 768px) {
	.main-container-row{
		width:90%;
		.main-container-item{
				.el-icon-s-tools,.iconfont{
					font-size: 4em;
				}
				.new-enroll-title{
					font-size: 1.5em;
				}
				.new-enroll-tip{
					font-size: 1em;
				}
				.enroll-manage-title{
					font-size: 1.5em;
				}
				.enroll-manage-tip{
					font-size: 1em;
				}
				.main-container-item-bottom{
					font-size: 1em;
					font-weight: 600;
				}
				.usermessage{
					padding: 1em;
					h3{
						font-size: 1.5em;
						.iconfont{
							font-size: 1.5em;
						}
					}
					span{
						font-size: 0.8em;
					}
				}
				.userhandle-item{
					margin: 0.5em;
					i{
						font-size: 1.5em;
					}
					span{
						font-size: 0.8em;
						color:#909399;
					}
				}
		}
	}
}
@media  (min-width: 992px) {
	.main-container-row{
		width:80%;
	}
	
}
@media  (min-width: 1200px) {
	.main-container-row{
		width:70%;
	}
	
}

.main-container{
	width: 100%;
	height: 100%;
	&-row{
		margin: 0 auto;
	}
	&-item{
		width: 100%;
		height: 250px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		-moz-box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		border-radius: 5px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		margin-top: 2em;
		display: flex;
		flex-direction: column;
		cursor: pointer;
		overflow: hidden;
		.usermessage{
			padding: 2vw;
			box-sizing: border-box;
			color: #3e8ef7;
    		background-color: rgba(217, 233, 255, .8);height:70%;
			h3{
				display: flex;
				align-items: center;
				.iconfont{
					margin-right: 0.5em;
				}
			}
			span{
				
				color: #526069;
			}
		}
		.userhandle{
			height: 30%;
			display: flex;
			justify-content: center;
			align-items: center;
			&-item{
				
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				i{
					margin-bottom: 0.5em;
					color: #E6A23C;
				}
				span{
					color: #303133;
					font-weight: 600;
				}
			}
			&-item:hover{
				span{
					color: #C0C4CC;
					font-weight: 600;
				}
			}
		}
		&-top{
			height: 70%;
			color: #fff;
			padding: 0 20px
		}
		&-bottom{
			width: 100%;
			height: 30%;
			display: flex;
			justify-content: center;
			align-items: center;
			color: rgb(102, 102, 102);
		}
		.new-enroll{
			position: relative;
			background: -webkit-linear-gradient(90deg, rgba(0, 255, 255, 1) 0%, rgba(2, 167, 240, 1) 100%);
			background: -moz-linear-gradient(0deg, rgba(0, 255, 255, 1) 0%, rgba(2, 167, 240, 1) 100%);
			background: linear-gradient(0deg, rgba(0, 255, 255, 1) 0%, rgba(2, 167, 240, 1) 100%);
			&-title{
			  font-weight: 600;
			}
			.iconfont{
			position: absolute;
			right: 2%;
			bottom: 2%;
			}
		}
		.enroll-manage{
			position: relative;
			background: -webkit-linear-gradient(0deg, rgba(194, 128, 255, 1) 0%, rgba(2, 167, 240, 1) 100%);
			background: -moz-linear-gradient(90deg, rgba(194, 128, 255, 1) 0%, rgba(2, 167, 240, 1) 100%);
			background: linear-gradient(90deg, rgba(194, 128, 255, 1) 0%, rgba(2, 167, 240, 1) 100%);
			&-title{
			  font-weight: 600;
			}
			.iconfont{
			position: absolute;
			right: 2%;
			bottom: 2%;
			}
		}
	}
	.enroll-contain{
		width: 100%;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		-moz-box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
		border-radius: 5px;
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		margin-top: 2em;
		padding: 1vw;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		&-title{
			width: 100px;
			color: #3e8ef7;
			padding-bottom: 1em;
			margin-left: 10px;
			margin-bottom: 1em;
			border-bottom: 2px solid #3e8ef7;
			text-align: center;
			box-sizing: border-box;
		}
		.no-message{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			span{
				color: #a3afb7;
				margin-bottom: 2em;
			}
		}
		&-item{
			position: relative;
			height: 220px;
			width: 100%;
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
			-webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
			-moz-box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
			border-radius: 5px;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			border-left: 5px solid #3e8ef7;
			margin: 1em 0;
			padding:1em;
			box-sizing: border-box;
			cursor: pointer;
			div{
				margin-bottom: 1em;
			}
			div:first-child{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			div:nth-child(2),:nth-child(3){

				font-size: 14px;
				color: #a3afb7;
			}
			.creattime{
				position: absolute;
				left: 1em;
				bottom:2em;
				height: 28px;
				line-height:28px;
				font-size: 14px;
				color: #a3afb7;
			}
			div:last-child{
				position: absolute;
				right: 0.6em;
				bottom:1em;
				margin-bottom: 0;
				font-size: 24px;
				color:#a3afb7;
				i{
					cursor: pointer;
				}
				i:hover{
					color:#C0C4CC
				}
				.iconfont{
					font-size: 24px;
				}
			}
		}
		&-item:hover{
			box-shadow: 0 2px 4px rgba(83, 168, 255, .62), 0 0 6px rgba(83, 168, 255, .44);
			-webkit-box-shadow: 0 2px 4px rgba(83, 168, 255, .62), 0 0 6px rgba(83, 168, 255, .44);
			-moz-box-shadow: 0 2px 4px rgba(83, 168, 255, .62), 0 0 6px rgba(83, 168, 255, .44);
		}
	}
	  .footer{
    position: fixed;
    background: #fff;
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
      color:#76838f;
      padding: 0 10px;
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
      color:#606266;
      
    }
  }
	
}
</style>