<template>
	<view class="u-wrap">
		<!-- 搜索框 -->
		<view class="u-search-box">
			<u-search @custom="search" @clear="clearSearch" placeholder="输入商品名称" v-model="keyword"></u-search>
		</view>
		<view class="u-menu-wrap">
			<!-- 左侧 -->
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<block v-for="(item,index) in categories" :key="index">
					<view v-for="(c,ci) in item.children" :key="ci" class="u-tab-item" :class="[current == c.id ? 'u-tab-item-active' : '']"
					 :data-current="c.id" @tap.stop="swichMenu(c.id)">
						<text class="u-line-1">{{c.name}}</text>
					</view>
				</block>
			</scroll-view>
			<block >
				<!-- 右侧 -->
				<scroll-view @scrolltolower="scrollEvent" scroll-y class="right-box">
					<view class="page-view">
						<!-- 分类列表 -->
						<view class="u-text-center u-m-t-30">
							<u-tabs :list="cate" bar-width="60" item-width="120" :current="currentIndex"
								@change="change"></u-tabs>
						</view>
						<view class="class-item">
							<view class="item-container u-p-b-40 u-p-t-40">
								<navigator 
									class="thumb-box" 
									v-for="(goods, goodsIndex) in goodsList" 
									:key="goodsIndex"
									:url="'/pages/goods/goodsItem?id=' + goods.id">
									<image class="item-menu-image" :src="goods.cover_url" mode=""></image>
									<view class="item-menu-name">{{goods.title}}</view>
								</navigator>
								
								<!-- 内容为空显示 -->
								<view v-if="goodsList.length == 0" class="u-flex-1 u-p-t-80 u-p-b-80">
									<u-empty text="暂无数据" mode="list"></u-empty>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categories: [], // 左侧tab数据
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				goodsList:[], // 右侧商品数据
				current:0, // 默认索引
				keyword:'', // 搜索
				page:1, // 页
				isLast:false, // 是否是最后一页
				// 标签数据
				cate: [{
						name: '默认'
					},
					{
						name: '销量'
					},
					{
						name: '推荐'
					},
					{
						name: '最新'
					}
				],
				// 分类标签默认索引号
				currentIndex: 0,
 			}
		},
		onLoad() {
			this.getDate()
		},
		methods: {
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 请求商品分类数据
			async getDate(){
				const params = {
					// 页
					page:this.page,
					// 标题搜索
					title:this.keyword
				}
				// 判断是否有分类ID
				if(this.current) params.category_id = this.current
				
				// 增加排序条件
				if(this.currentIndex == 1) params.sales = 1
				if(this.currentIndex == 2) params.recommend = 1
				if(this.currentIndex == 3) params.new = 1
				
				const res = await this.$u.api.goodsList(params)
				this.categories = res.categories
				this.goodsList = [...this.goodsList,...res.goods.data]
				this.isLast = res.goods.next_page_url ? false : true
				// console.log(res);
			},
			// 点击左边的栏目切换
			async swichMenu(cid) {
				if(cid == this.current) return ;
				this.current = cid;
				this.page = 1
				this.goodsList = []
				this.getDate()
			},
			// 搜索商品点击事件
			search(){
				// 调用网络请求分类函数
				this.page = 1
				this.goodsList = []
				this.getDate()
			},
			// 商品搜索框清空事件
			clearSearch(){
				this.page = 1
				this.goodsList = []
				this.keyword = ''
				this.getDate()
			},
			// 右侧商品滚动触底事件,加载下一页
			scrollEvent(){
				if(this.isLast) return
				// 重新首页分类请求数据 页面加1
				this.page = this.page + 1
				// 调用网络请求首页数据函数
				this.getDate()
			},
			// 分类标签点击事件
			change(index) {
				this.currentIndex = index
				// 先清空商品数据和页数
				this.goodsList = []
				this.page = 1
				// 调用网络请求首页数据函数
				this.getDate()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
		
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: 500;
		font-size: 22rpx;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		color: #000;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
	
	.thumb-box {
		width: 50%;
		display: flex;
		box-shadow: 0 8rpx 8rpx 0 rgba(0,0,0,.1);
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}
	
	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
