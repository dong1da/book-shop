<template>
	<view class="cart">
		<!-- 购物车为空显示 -->
		<view v-if="list.length == 0" class="pd-20 goods-list">
			<view  class="empty">
				<image src="@/static/img/emptyCart.jpg" mode="aspectFit"></image>
				<view class="empty-tips">
							空空如也
					<navigator class="navigator" url="/pages/index/index" open-type="switchTab">随便逛逛></navigator>
				</view>
			</view>
		</view>
		
		<view v-else class="c">
			<view class="list"  v-for="item in list" :key='item.id'>
				<view class="l">
					<!-- 列表的复选框 -->
					  <view class="item_info">
					  	<!-- <evan-checkbox class="item" v-model="item.isChecked"></evan-checkbox> -->
							<u-checkbox-group class="item">
								<u-checkbox v-model="item.goods.isChecked" shape="circle" size="44"></u-checkbox>
							</u-checkbox-group>
					  </view>
					  
					<image :src="item.goods.cover_url" mode="" class="img"></image>
				</view>
				<view class="center">
					<view class="name">
						{{item.goods.title}}
					</view>
				<view class="size">
					{{item.goods.description}}
				</view>
			</view>
			<view class="r">
				<!-- 商品小计 -->
				<view class="price">
					<!-- ￥{{item.price*item.count}}元 -->
					￥{{item.goods.sumPrice}}元
					
				</view>
				<view class="update-count">
					<view class="reduce" @tap="reduce(item.id)">
					   -
					</view>
					<view class="cart-count">
						{{item.num}}
					</view>
					<view class="add" @tap="add(item.id)">
						+
					</view>
				</view>
			</view>
			<!-- 删除按钮 -->
			<view class="btn">
				<u-icon @click="deleteCharts(item.id)" name="trash" color="#c8423d" size="44"></u-icon>
			</view>
			
		</view>
		
		</view>
		
		<!-- 底部导航栏 -->
		<view class="tabbar">
			<view class="all">
				<u-checkbox-group>
					<u-checkbox v-model="isAllChecked" shape="circle">全选</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="totalPrice">
				总价:￥{{cartTotalPrice}}元
			</view>
			<view class="submitOrder" @tap="submitOrder">结算</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				// dataList:[]
				sum:0,
			}
		},
		computed: {
				// 全选
				isAllChecked:{
					// list列表--->全选
					get(){
						// 列表中是否都选中了
						return this.list.every(el=>el.goods.isChecked==true)
					},
					// 全选---->list列表
					set(val){
						// console.log(val);
						this.list.forEach(el=>el.goods.isChecked=val)
					}
				},
				// 购物车商品总价
				cartTotalPrice(){
					// 计算list列表中所有选中商品的价格
					var sum=0
					this.list.forEach(el=>{
						el.goods.sumPrice = el.num * el.goods.price
						if(el.goods.isChecked){
							sum = el.goods.sumPrice + sum
						}
					})
					return sum
				}
		
		},
		methods: {
			// 网络请求购物车列表
			async getDate(){
				const res = await this.$u.api.cartsGoods()
				let data = res.data
				data.forEach(data => {
					// 自己添加的判断是否选中的条件
					data.goods.isChecked = false
					// 自己添加总价格的变量
					data.goods.sumPrice = data.goods.price
				})
				// console.log(data);
				
				this.list = data
				// console.log(this.list);
			},
			// 购物车商品删除
			async deleteCharts(id){
				// console.log(id);
				await this.$u.api.deleteCarts(id)
				// 删除商品提示
				uni.showToast({
					title:'移除成功！',
					icon:'none'
				})
				// 删除完成商品之后重新请求购物车商品数据
				this.getDate()
			},
			// 增加商品数量
			add(id) {
				
					this.list.forEach(async el=>{
					if(el.id == id){
						if(el.num >= 1){
							el.num ++
							// 数量改变，请求到接口
							await this.$u.api.putCarts(id,el.num)
							// 商品小计价格也要改变
							el.goods.sumPrice = el.num * el.goods.price
						}else{
							uni.showToast({
								title:'库存不足哦~',
								icon:'none'
							})
						}
					}					
				})			
			},
			// 减少商品数量
			reduce(id) {
					this.list.forEach(async el=>{
					if(el.id==id){
						if(el.num > 1){
							el.num--
							// 数量改变，请求到接口
							await this.$u.api.putCarts(id,el.num)
							// 商品小计价格也要改变
							el.goods.sumPrice = el.num * el.goods.price
						}else{
							uni.showToast({
								title:'至少购买一件商品哦',
								icon:'none'
							})
						}
					}				
				})		
			},
			
			// 提交购物车订单
			submitOrder(){
				
				// 判断是否选择购物车商品
				var bol=this.list.every(el=>el.goods.isChecked==false)
				
				// 列表中未选中提示……
				if(bol){
					uni.showToast({
						title:'请选择商品',
						icon:'none'
					})
				}else{
					// 提交选中的订单列表
					// 存储购物车id
					const listId = []
					this.list.forEach(async el=>{
						if(el.goods.isChecked){
							listId.push(el.id)
							// console.log(listId);
							const params = {
								cart_ids:listId
							}
						// 网络请求：选中
						await this.$u.api.checked(params)
						// 跳转到订单页
						uni.navigateTo({
							url:"/pages/cart/order"
						})
						}
					})
				}
				
			}
		},
		// onLoad() {
		// 	// 调用网络请求函数
		// 	this.getDate()
		// }
		// 页面显示生命周期函数
		onShow() {
			// 调用网络请求函数
			this.getDate()
		}
	}
</script>

<style lang="scss" scoped>
	
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;
	
			image {
				width: 240rpx;
				height: 160rpx;
				margin-bottom: 30rpx;
			}
	
			.empty-tips {
				display: flex;
				font-size: 28rpx;
				color: #D2359C;
	
				.navigator {
					color: #FF0000;
					margin-left: 16rpx;
				}
			}
		}
	
		.red-price {
			color: #F0250F;
		}
	
		.pd-20 {
			box-sizing: border-box;
		}
	
	
	page {
		background: #f5f5f5;
	}
	.cart {
		// background: #f1e8e7;
	}

	.c {
		margin: 20rpx;
	}
	// 居中显示
	@mixin textCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.list{
		position: relative;
		height: 220rpx;
		background: #FFFFFF;
		box-shadow: 0 8rpx 16rpx 0 rgba(83,66,49,0.08);
		border-radius: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 20rpx 0;
		.l{
			display: flex;
			.item_info{
				.item{
					line-height: 220rpx;
					height: 220rpx;
				}
			}
			.img{
				width: 160rpx;
				height: 220rpx;
				background-color: pink;
				border-radius: 8%;
			}
		}
		.center{
			width: 200rpx;
			.name{
				font-size: 30rpx;
				color: #3E3E3E;
				letter-spacing: 1.86rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.size{
				font-size: 22rpx;
				margin-top: 20rpx;
				color: #8D8D8D;
				letter-spacing: 1.57rpx;
			}
			.count{
				font-size: 22rpx;
				color: #8D8D8D;
				letter-spacing: 1.57rpx;
			}
		}
		.r{
			.price{
				margin-top: 50rpx;
				font-size: 32rpx;
				color: red;
				letter-spacing: 0;
				margin-left: 40rpx;
			}
			// 加减数量
			.update-count{
				margin-top: 40rpx;
				display: flex;
				.reduce{
					width: 40rpx;
					height: 40rpx;
					background: #F1ECE7;
					border-radius: 21.6rpx;
					border-radius: 21.6rpx;
					color: #979797;
				    @include textCenter;
					font-size: 50rpx;
				}
				.add{
					width: 40rpx;
					height: 40rpx;
					background: #F1ECE7;
					border-radius: 21.6rpx;
					border-radius: 21.6rpx;
					color: #979797;
					@include textCenter;
					font-size: 40rpx;
				}
				.cart-count{
					width: 72rpx;
					height: 40rpx;
					background: #F1ECE7;
					border-radius: 21.6rpx;
					border-radius: 21.6rpx;
					margin-left: 18rpx;
					margin-right: 18rpx;
					text-align: center;
					line-height: 40rpx;
				}
			}
		}
		.btn{
			position: absolute;
			top: 20rpx;
			right: 20rpx;
		}
		
	}


	// 底部导航
	.tabbar {
		width: 100%;
		height: 100rpx;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		position: fixed;
		// #ifndef H5
		bottom: 0px;
		// #endif
		// #ifdef H5
		bottom: 100rpx;
		// #endif
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-radius: 8% 8%;
		.all {
			font-size: 32rpx;
			color: #3E3E3E;
			letter-spacing: 2.29rpx;
			display: flex;
		}

		.totalPrice {
			font-size: 32rpx;
			color: #3E3E3E;
			letter-spacing: 2.29rpx;
			color:red;
		}

		.submitOrder {
			width: 160rpx;
			border-radius: 30rpx;
			height: 60rpx;
			background: #ff0000;
			font-size: 28rpx;
			color: #FFFFFF;
			letter-spacing: 2.57rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>