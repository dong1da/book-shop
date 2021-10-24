<template>
	<view>
		<!-- 地址模块 -->
		<navigator class="dizhi" url="/pages/address/index">
			<view class="dizhi_dizhi">
				{{this.address.province + this.address.city + this.address.county + this.address.address}}
			</view>
			<view class="Telephone">
				<view>
					{{this.address.name}}<span>{{this.address.phone}}</span>
				</view>
			</view>
			<view class="info">
				<u-icon name="arrow-right" color="#c0c4cc" size="28"></u-icon>
			</view>
		</navigator>
		<!-- 商品显示模块 -->
		<view class="commodity" v-for="item in list" :key="item.id">
			<view class="item">
				<view class="item_image">
					<image :src="item.goods.cover_url"></image>
				</view>
				<view class="title">
					<view class="title_item">{{item.goods.title}}</view>
					<view class="price">
						<view class="price_item">
							￥{{item.goods.price}}
							<span>×{{item.num}}</span>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部结算模块 -->
		<view class="bottom">
			<view class="price">
				合计：<span>￥{{Totalprice}}<span>.00</span></span>
			</view>
			<view class="btn">
				<button >提交订单并支付</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [], //商品数据
				address: [], //地址
			};
		},
		onLoad() {
			this.getData()
		},
		computed: {
			Totalprice() {
				let sums = 0
				let sum = 0
				this.list.forEach(item => {
					sum = item.num * item.goods.price
					sums += sum
				})
				return sums
			}
		},
		methods: {
			// 网络请求：订单预览
			async getData() {
				const res = await this.$u.api.preview()
				console.log(res)
				this.list = res.carts
				const data = res.address
				data.forEach(data => {
					// 判断是不是默认地址	is_default = 1
					if(data.is_default === 1) {
						return this.address = data
					}
				})
			}
		}
	}
</script>

<style lang="scss">
page {
	background: #f5f5f5;
}
// 地址模块
.dizhi {
	position: relative;
	background: #fff;
	margin: 20rpx 20rpx 0 20rpx;
	height: 15orpx;
	border-radius: 20rpx;
	padding-left: 20rpx;
	.dizhi_dizhi {
		font-size: 28rpx;
		padding: 10rpx;
		font-weight: 600;
	}
	.Telephone {
		padding: 10rpx;
		color: #9e9e9e;
		span{
			margin-left: 20rpx;
		}
	}
	.info {
		position: absolute;
		top: 50rpx;
		right: 20rpx;
	}
}
// 商品显示模块
.commodity {
	background-color: #fff;
	margin: 20rpx 20rpx 0 20rpx;
	border-radius: 20rpx;
	.item {
		display: flex;
		height: 250rpx;
		.item_image {
			flex: 2;
			image { 
				width: 100%;
				height: 100%;
			}
		}
		.title {
			flex: 5;
			.title_item {
				font-size: 28rpx;
				font-weight: 600;
				margin-top: 20rpx;
			}
			.price {
				margin-top: 130rpx;
				.price_item {
					color: red;
					font-weight: 600;
					font-size: 28rpx;
					span {
						float: right;
						font-weight: 500;
						font-size: 26rpx;
						color: #404040;
						margin-right: 30rpx;
					}
				}
			}
		}
	}
}
// 底部合计模块
.bottom {
	background-color: #fff;
	height: 100rpx;
	line-height: 100rpx;
	position: fixed;
	bottom: 0;
	width: 100%;
	padding-left: 100rpx;
	display: flex;
	.price {
		flex: 1;
		text-align: right;
		font-weight: 600;
		font-size: 26rpx;
		span {
			color: #e81534;
			font-size: 28rpx;
			font-weight: 600;
			span {
				font-size: 20rpx;
				font-weight: 600;
			}
		}
	}
	.btn {
		flex: 1;
		button {
			font-size: 26rpx;
			margin-left: 30rpx;
			border-radius: 40rpx;
			background-color: #e90c21;
			color: #fff;
			width: 250rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin-top: 10rpx;
		}
	}
}
</style>
