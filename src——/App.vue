<template>
	<div id="app">
		<transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	}
}

</script>

<style lang="scss">
// @media (min-width: 320px)and(max-width: 359px){
// body{
// font-size: 12.8px;
// }
// }
// @media (min-width: 360px)and(max-width: 374px){
// body{
// font-size: 14.4px;
// }
// }
// @media (min-width: 375px)and(max-width: 385px){
// body{
// font-size: 15px;
// }
// }
// @media (min-width: 386px)and(max-width: 392px) {
// body {
// font-size: 15.44px;
// }
// }
// @media (min-width: 393px)and(max-width: 400px){
// body{
// font-size: 16px;
// }
// }
// @media (min-width: 401px)and(max-width: 414px){
// body{
// font-size: 16.48px;
// }
// }
// @media (min-width: 750px)and(max-width: 799px){
// 	body{
// 	font-size: 30.72px;
// 	}
// }
body {
	margin: 0px;
	padding: 0px;
	/*background: url(assets/bg1.jpg) center !important;
		background-size: cover;*/
	// background: #1F2D3D;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	-webkit-font-smoothing: antialiased;
}

#app {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
}

.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	background: #f2f2f2;
	padding: 10px;
	//border:1px solid #dfe6ec;
	margin: 10px 0px;
	.el-form-item {
		margin-bottom: 10px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>