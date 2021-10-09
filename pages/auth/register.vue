<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎注册墨语图书商城</view>
			<input class="u-border-bottom" v-model="name" placeholder="请输入昵称" />
			<input class="u-border-bottom" v-model="email" placeholder="请输入邮箱" />
			<input class="u-border-bottom" type="password" v-model="password" placeholder="请输入密码" />
			<input class="u-border-bottom" type="password" v-model="password_confirmation" placeholder="请确认密码" />
			<button @tap="submit" :style="[inputStyle]" class="getCaptcha">注册</button>
			<view class="alternative">
				<view class="password">已有账号</view>
				<view class="issue">帮助</view>
			</view>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: '',
			email: '',
			password: '',
			password_confirmation: ''
		}
	},
	onLoad() {
		// // 请求用户信息
		// const infoRes = await this.$u.api.userInfo()
		// console.log(infoRes)
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.$u.test.chinese(this.name) && this.$u.test.email(this.email) 
			&& this.$u.test.rangeLength(this.password, [6,12]) && this.$u.test.rangeLength(this.password_confirmation, [6,12])) {
				style.color = "#fff";
				style.backgroundColor = this.$u.color['warning'];
			}
			return style;
		}
	},
	methods: {
	  async	submit() {
			// 表单验证
			const isEqual = this.password === this.password_confirmation
			if(!this.$u.test.chinese(this.name) || !this.$u.test.email(this.email) || !this.$u.test.rangeLength(this.password, [6,12]) || !isEqual) return
			// 准备提交参数
			const params = {
				name: this.name,
				email: this.email,
				password: this.password,
				password_confirmation: this.password_confirmation
			}
			// 请求api，执行注册
			const resRegister = await this.$u.api.authRegister(params)
			this.$u.toast('注册成功')
			// 注册成功后跳转至登录页
			setTimeout(() => {
				this.$u.route({
					type: 'redirect',
					url: 'pages/auth/login'
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.uni-input-placeholder {
	font-size: 28rpx;
}
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
}
</style>
