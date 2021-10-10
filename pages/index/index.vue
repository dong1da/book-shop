<template>
	<view class="content" >
		<u-swiper :list="slides" name="img_url" height="320"></u-swiper>
		<!-- 按要求排序列表 -->
		<view class="u-text-center u-m-t-20 sortTab" >
			<u-tabs :list="sortList" bar-width="80" item-width="180" :current="currentSort" @change="changeSort"></u-tabs>
		</view>
		<!-- 列表展示区 -->
		<u-row gutter="16" class="u-skeleton">
			<u-col span="6" v-for="goods in goodsList.length !== 0 ? goodsList : [{},{},{},{}]">
				<goods-card :goods="goods"></goods-card>
			</u-col>
		</u-row>
		<!-- 骨架屏 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				sortList: [
					{name: '默认'},
					{name: '销量'},
					{name: '推荐'},
					{name: '最新'}
				],
				currentSort: 0, //按要求排序显示列表下标
				slides: [], //轮播图数据
				goodsList: [], //首页商品列表数据
				page: 1, //当前页
				loading: false,
				
			}
		},
		onLoad(option) {
			
			// 获取首页数据
			this.getData()
		},
		methods: {
			// 点击切换筛选条件功能函数
			changeSort(index) {
				this.currentSort = index
				console.log(index)
				// 重置商品数据和分页为空
				this.goods = []
				this.page = 1
				this.getData()
			},
			// 获取首页数据
			async getData() {
				this.loading = true
				const params = { page: this.page }
				// 判断筛选条件
				if(this.currentSort == 1) params.sales = 1
				if(this.currentSort == 2) params.recommend = 1
				if(this.currentSort == 3) params.new = 1
				const res = await this.$u.api.getIndex(params)
				this.loading = false //隐藏骨架屏
				// console.log(res)
				this.slides = res.slides
				this.goodsList = [...this.goodsList, ...res.goods.data]
			}
		},
		// 触底
		onReachBottom() {
			// 重新请求数据，带上分页参数，实现加载更多
			this.page = this.page + 1
			// 重新获取首页数据
			this.getData()
		}
	}
</script>

<style lang="scss" scoped>
// 粘性定位
.sortTab {
	position: sticky;
	top: 80rpx;
	left: 0;
	z-index: 10;
}

</style>
