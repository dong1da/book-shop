<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录墨语图书商城</view>
			<input class="u-border-bottom" v-model="email" placeholder="请输入邮箱" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" />
			
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">登录</button>
			<view class="alternative">
				<view class="password" @click="toRegister">注册</view>
				<view class="issue">找回密码</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			email: '',
			password: '',
		}
	},
	onLoad() {
		
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.$u.test.email(this.email) && this.$u.test.rangeLength(this.password, [6, 10])) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods: {
	 	async submit() {
			if(!this.$u.test.email(this.email) || !this.$u.test.rangeLength(this.password, [6, 10])) return
			// 处理登录用的参数
			const params = {
				email: this.email,
				password: this.password
			}
			// 请求api执行登录
			const loginRes = await this.$u.api.authLogin(params)
			// 缓存token
			this.$u.vuex('vuex_token', loginRes.access_token)
			this.$u.toast('登录成功')
			// 请求用户信息
			const userInfo = await this.$u.api.userInfo()
			// 缓存用户信息
			this.$u.vuex('vuex_user', userInfo)
			// console.log(userInfo)
			// 登录之后跳转到来源页
			// 取出缓存中的来源页地址
			const backUrl = uni.getStorageSync('back_url') || 'pages/index/index'
			setTimeout(() => {
				this.$u.route({
					type: 'reLaunch',
					url: backUrl
				})
			}, 1500)
		},
		// 跳转注册页面
		toRegister() {
			this.$u.route({
				type: 'redirect',
				url: 'pages/auth/register'
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.u-border-bottom {
	margin-bottom: 40rpx !important;
}
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			
			.link {
				color: $u-type-warning;
			}
		}
	}
}
</style>
