<template>
	<view>
		<view class="content">
				<u-form :model="form" ref="uForm" :error-type="errorType">
					<u-form-item label="昵称" prop="name">
						<u-input v-model="form.name" />
					</u-form-item>
				</u-form>
				<u-button @click="submit">提交</u-button>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorType: ['message'],  //校验错误提示方式
				form: {
					name: ''
				},
				rules: {
					name: [
						{ 
							required: true, 
							message: '请输入昵称', 
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change','blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.chinese(value);
							},
							message: '用户昵称必须是汉字',
							// 触发器可以同时用blur和change
							trigger: ['change','blur'],
						},
						// 校验用户是否已存在
					]
				}
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			this.form.name = this.vuex_user.name
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(async (valid) => {
					if(valid) {
						console.log(this.form)
						// 跟新用户信息
					  const res = await	this.$u.api.userInfoUpdate(this.form)
						// 刷新用户信息, 更新vuex_user
						this.$u.utils.updateUser()
						this.$u.toast('更新成功')
					} else {
						console.log('验证失败')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content {
	padding: 0 20rpx;
}
</style>
