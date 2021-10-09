<template>
	<view class="content">
		个人中心
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			// 如果用户没有登录，跳转到登录界面，下面的代码不执行
			if(!this.$u.utils.isLogin()) return
			console.log(1111)
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	
</style>
