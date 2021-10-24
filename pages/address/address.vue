<template>
  <view class="container">
    <view class="pd-20 goods-list" v-if="siteList.length == 0">
      <view class="empty">
        <image src="@/static/img/1.png" mode="aspectFit"></image>
        <view class="empty-tips">暂无收货地址，赶紧去添加吧！！</view>
      </view>
    </view>

    <view
      @click="toOrder(res.id)"
      v-else
      class="item"
      v-for="(res, index) in siteList"
      :key="res.id"
    >
      <view class="top">
        <view class="name">{{ res.name }}</view>
        <view class="phone">{{ res.phone }}</view>
				<view class="tag">
					<text :class="{red:res.is_default==1}">{{res.is_default==1 ? '默认' : ''}}</text>
				</view>
      </view>
      <view class="bottom">
        {{ res.province + res.city + res.county + res.address }}
        <u-icon @click="updataAddress" name="edit-pen" :size="30" color="#999999"></u-icon>
      </view>
    </view>
    <view class="addSite" @tap="toAddSite">
      <view class="add">
        <u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>新建收货地址
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      siteList: [],
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    // 网络请求
    async getData() {
      const res = await this.$u.api.getAddress();
      console.log(res);
      this.siteList = res.data;
    },
    // 点击新增地址页面跳转
    toAddSite() {
      uni.navigateTo({
        url: "/pages/address/addAddress",
      });
    },
    // 跳转至地址修改
    updataAddress() {
      uni.navigateTo({
      	url: "/pages/address/putAddress"
      })
    },
    // 地址跳转
    toOrder(id) {
      console.log(id);
      // 先让所有地址变成不是默认（清空默认地址is_default = 0）
      this.siteList.forEach(async (data) => {
        data.is_default = 0;
        if (data.id == id) {
          const params = {
            name: data.name,
            address: data.address,
            phone: data.phone,
            province: data.province,
            city: data.city,
            county: data.county,
            is_default: 1,
          };
          // console.log(params);
          await this.$u.api.putAddress(id, params);
        }
      });
     
    },
  },
};
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
    color: #d2359c;

    .navigator {
      color: #ff0000;
      margin-left: 16rpx;
    }
  }
}

.red-price {
  color: #f0250f;
}

.item {
	padding: 40rpx 20rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				// background-color:rgb(49, 145, 253);
			}
			.red{
				background-color:red
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 80rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: red;
	border-radius: 50rpx;
	font-size: 30rpx;
	.add{
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon{
			margin-right: 10rpx;
		}
	}
}
</style>