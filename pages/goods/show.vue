<template>
	<view class="item">
		<!-- 图片区域 -->
		<view class="img">
			<image :src="goodsInfo.cover_url"></image>
		</view>
		<!-- 标题 -->
		<view class="top2">
				<view class="title u-line-2">{{goodsInfo.title}}</view>
				<view class="title_price u-flex u-row-between">
					<view class="price u-skeleton-rect">￥{{goodsInfo.price}}</view>
					<view class="sales u-skeleton-rect">销量：{{goodsInfo.sales}}</view>
				</view>
		</view>
		<!-- 分类列表 -->
		<view class="u-text-center u-m-t-20 catergoriesSkite">
			<u-tabs :list="categories" bar-width="100" item-width="240" :current="current"
				@change="change"></u-tabs>
		</view>
		<!-- 商品详情 -->
		<view v-if="current == 0" class="details">
			<view class="u-p-b-80">
				<!-- <rich-text :nodes="goodsInfo.details"></rich-text> -->
				<u-parse :html="goodsInfo.details"></u-parse>
			</view>
		</view>
		<!-- 商品评论 -->
		<view v-if="current == 1">
			<view class="comment" v-for="(res, index) in commentList" :key="index">
				<view class="left"><image :src="res.user.avatar_url" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.user.avatar_url.name }}</view>
					</view>
					<view class="content">{{ res.content }}</view>
					<view class="bottom">
						{{ res.created_at }}
					</view>
				</view>
			</view>
		</view>
		<!-- 推荐商品 -->
		<view v-if="current == 2" class="u-p-b-80">
			<u-row gutter="16">
				<u-col span="6" v-for="(goods,index) in goodsList" :key='index'>
					<goods-card :goods="goods"></goods-card>	
				</u-col>
			</u-row>
		</view>
		<!-- 底部导航栏 -->
		<view class="navigation">
			<view class="left">
				<view class="item u-text-center" @click="collect">
					<block v-if="isCollect === 0">
						<u-icon name="star" :size="40"></u-icon>
						<view class="text u-line-1" >收藏</view>
					</block>
					<block v-else>
						<u-icon name="star-fill" :size="40" color="red"></u-icon>
						<view class="text u-line-1" style="color: red;" >已收藏</view>
					</block>
				</view>
				<view class="item car" @click="toCart">
					<u-badge class="car-num" :count="cartCount" type="error" :offset="[-3, -6]"></u-badge>
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<view class="cart btn u-line-1" @click="addCart">加入购物车</view>
				<view class="buy btn u-line-1" >立即购买</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsId: null, //进入详情页时传入的商品id				
				commentList:[], // 商品评论		
				goodsInfo:{},	// 商品详情	
				goodsList:[],	// 商品推荐
				// 分类标签
				categories: [{
						name: '商品详情'
					},
					{
						name: '商品评论',
						count:0
					},
					{
						name: '推荐商品'
					}
				],				
				current: 0,	// 分类标签默认索引号
				isCollect:0, // 收藏按钮两种状态		
				cartCount:0, // 购物车数量
				
			}
		},
		// option对象 可以拿到传递过来的参数
		onLoad(option) {
			// console.log(option);
			this.goodsId = option.id
			this.getData() // 商品数据
			this.getCartCount() // 购物车数量
		},
		methods: {
			// 网络请求
			async getData(){
				const res = await this.$u.api.getGoods(this.goodsId)
				this.commentList = res.goods.comments
				this.goodsInfo = res.goods
				this.categories[1].count = res.goods.comments.length
				this.goodsList = res.like_goods
				this.isCollect = res.goods.is_collect
				// console.log(res);
			},
			// 分类标签切换事件
			change(index){
				this.current = index
			},
			// 点击收藏商品事件
			async collect(){
				// 请求收藏api
				await this.$u.api.Collects(this.goodsId)
				// 收藏成功之后，提示信息，并改变按钮的状态
				if(this.isCollect === 0){
					this.$u.toast('收藏成功！！')
					this.isCollect = 1
				}else{
					this.$u.toast('取消收藏！！')
					this.isCollect = 0
				}
			},
			// 点击加入购物车事件
			async addCart(){
				const params = {
					goods_id:this.goodsId
				}
				await this.$u.api.carts(params)
				// 提示消息
				this.$u.toast('添加成功！')
				// 调用购物车数量函数
				this.getCartCount()
			},
			// 获取购物车数量的事件
			async getCartCount(){
				const token = this.vuex_token
				if(token){
					const res = await this.$u.api.cartsList()
					this.cartCount = res.data.length
				}
			},
			// 点击购物车跳转到购物车页面事件
			toCart(){
				this.$u.route({
					type:'switchTab',
					url:'pages/cart/cart'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		.img{
			text-align: center;
			width: 100%;
			height: 440rpx;
			image{
				width: 60%;
				height: 100%;
			}
		}
		.top2{
			margin: 0 60rpx;
			.title{
				margin: 20rpx 0 20rpx 0;
				font-size: 32rpx;
				font-weight: 600;
			}
			.title_price{
				.price{
					// color: pink;
					color: red;
					font-weight: 600;
					font-size: 32rpx;
				}
				.sales{
					color: #888;
				}
			}
		}
		.details{
			padding-bottom: 120rpx;
		}
		.comment {
			display: flex;
			padding: 30rpx;
			.left {
				image {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					background-color: #f2f2f2;
				}
			}
			.right {
				flex: 1;
				padding-left: 20rpx;
				font-size: 30rpx;
				.top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;
					.name {
						color: #5677fc;
					}
					.like {
						display: flex;
						align-items: center;
						color: #9a9a9a;
						font-size: 26rpx;
						.num {
							margin-right: 4rpx;
							color: #9a9a9a;
						}
					}
					.highlight {
						color: #5677fc;
						.num {
							color: #5677fc;
						}
					}
				}
				.content {
					margin-bottom: 10rpx;
				}
				.reply-box {
					background-color: rgb(242, 242, 242);
					border-radius: 12rpx;
					.item {
						padding: 20rpx;
						border-bottom: solid 2rpx $u-border-color;
						.username {
							font-size: 24rpx;
							color: #999999;
						}
					}
					.all-reply {
						padding: 20rpx;
						display: flex;
						color: #5677fc;
						align-items: center;
						.more {
							margin-left: 6rpx;
						}
					}
				}
				.bottom {
					margin-top: 20rpx;
					display: flex;
					font-size: 24rpx;
					color: #9a9a9a;
					.reply {
						color: #5677fc;
						margin-left: 10rpx;
					}
				}
			}
		}
		.navigation {
			position: fixed;
			bottom: 0;
			width: 100%;
			justify-content: center;
			display: flex;
			margin-top: 100rpx;
			border: solid 2rpx #f2f2f2;
			background-color: #ffffff;
			padding: 16rpx 0;
			.left {
				display: flex;
				flex: 3;
				font-size: 20rpx;
				margin-left: 20rpx;
				.item {
					margin: 0 30rpx;
					&.car {
						text-align: center;
						position: relative;
						.car-num {
							position: absolute;
							top: -10rpx;
							right: -10rpx;
						}
					}
				}
			}
			.right {
				flex: 2;
				text-align: center;
				display: flex;
				margin-right: 20rpx;
				font-size: 28rpx;
				align-items: center;
				.btn {
					line-height: 66rpx;
					padding: 0 30rpx;
					border-radius: 36rpx;
					color: #ffffff;
				}
				.cart {
					background-color: #ed3f14;
					margin-right: 30rpx;
				}
				.buy {
					background-color: #ff7900;
				}
			}
		}
	}
	.catergoriesSkite {
		position: sticky;
		top: 86rpx;
		left: 0;
		z-index: 10;
	}
</style>
