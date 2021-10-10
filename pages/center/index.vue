<template>
	<view>
		<view class="u-flex user-box u-p-t-20 u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<!-- 头像上传组件 -->
				<view class="u-m-r-10 avatar-body">
					<oss-upload></oss-upload>
				</view>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{vuex_user.name}}</view>
				<view class="u-font-14 u-tips-color">邮箱：{{vuex_user.email}}</view>
			</view>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="个人信息" @click="toBaseInfo"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="个人订单"></u-cell-item>
				<u-cell-item icon="star" title="商品收藏"></u-cell-item>
				<u-cell-item icon="map" title="收货地址"></u-cell-item>
				
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="reload" title="退出登录" @click="loginOut"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true
			}
		},
		onLoad() {
			// 如果用户没有登录，跳转到登录界面，下面的代码不执行
			if(!this.$u.utils.isLogin()) return
			console.log(1111)
		},
		methods: {
			// 跳转至个人信息页面
			toBaseInfo() {
				this.$u.route({
					url: 'pages/center/baseInfo'
				})
			},
			// 退出登录
		  async	loginOut() {
				// 请求api，退出登录
				await this.$u.api.authLoginOut()
				this.$u.toast('退出成功')
				setTimeout(() => {
					// 清除缓存的token和用户信息，即vuex中的信息
					this.$u.vuex('vuex_token', null)
					this.$u.vuex('vuex_user', {})
					
					// 跳转至首页
					this.$u.route({
						type: 'reLaunch',
						url: 'pages/index/index'
					})
				}, 1500)
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
.avatar-body {
	width: 70px;
	height: 70px;
}
</style>