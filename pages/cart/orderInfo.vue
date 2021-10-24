<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.getOrderInfo()
		},
		methods: {
			async getOrderInfo(order_id) {
				const res = await this.$u.api.orderDetails(order_id)
				console.log(res)
			}
		}
	}
</script>

<style>

</style>
