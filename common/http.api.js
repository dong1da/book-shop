// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
// let indexUrl = '/api/index';

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 定义api属性
	vm.$u.api = {}
	// 首页
	vm.$u.api.getIndex = (params = {}) => vm.$u.get('/api/index', params);
	
	// 认证相关
	vm.$u.api.authLogin = params => vm.$u.post('/api/auth/login', params);	//登录
	vm.$u.api.authRegister = params => vm.$u.post('/api/auth/register', params);	//注册
	vm.$u.api.authLoginOut = () => vm.$u.post('/api/auth/logout');	//退出登录
	vm.$u.api.authOssToken = () => vm.$u.get('/api/auth/oss/token');	//获取oss token
	
	// 商品相关的
	vm.$u.api.getGoods = id => vm.$u.get(`/api/goods/${id}`) // 商品详情数据
	vm.$u.api.Collects = id => vm.$u.post(`/api/collects/goods/${id}`) // 商品收藏
	vm.$u.api.goodsList = (params) => vm.$u.get('/api/goods',params); // 商品分类
	
	// 用户相关的
	vm.$u.api.userInfo = () => vm.$u.get('/api/user')  //用户详情
	vm.$u.api.userInfoUpdate = params => vm.$u.put('/api/user', params)  //修改用户信息更新昵称
	vm.$u.api.userAvatar = params => vm.$u.patch('/api/user/avatar', params)  //修改用户信息更新头像
	
	// 购物车相关的
	vm.$u.api.cartsAdd = (params) => vm.$u.post('/api/carts',params); // 添加到购物车
	vm.$u.api.cartsList = () => vm.$u.get('/api/carts'); // 请求到购物车 
	
	// 订单相关的
	
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	// vm.$u.api = {
	// 	getIndex,
	// };
}

export default {
	install
}