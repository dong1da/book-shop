const install = (Vue, vm) => {
	
	/**
	 * 是否登录
	 */ 
	const isLogin = () => {
		// 如果没有token就跳转到登录页面
		const token = vm.vuex_token
		if(!token) {
			// 来自那个页面
			const currentPage = getCurrentPages().pop()
			// 获取页面路径和请求参数
			const {options, route} = currentPage  //假设options里面id=1
			// 获取参数的key
			const optionsKeys = Object.keys(options) //['id']
			let params = ''
			if(optionsKeys.length !== 0) {
				params = optionsKeys.reduce((pre, current) => {
					// pre + current + '=' + options[current] + '&'
					return `${pre}${current}=${options[current]}&` 
				}, '?').slice(0, -1)
			}
			// console.log(params)
			// console.log(currentPages.route)
			// 缓存当前页地址
			uni.setStorageSync('back_url', route + params)  //临时缓存	
			vm.$u.toast('请先登录')
			setTimeout(() => {
				vm.$u.route({
					type: 'redirectTo',
					url: 'pages/auth/login'
				})
			}, 1500)
			return false
		}
		return true
	}
	
	/**
	 * 更新用户信息，更新vuex_user
	 */ 
	const updateUser = async () => {
		// 请求用户信息
		const userInfo = await vm.$u.api.userInfo()
		// 更新vuex_user
		vm.$u.vuex('vuex_user', userInfo)
	}
	vm.$u.utils ={
		isLogin,
		updateUser
	}
}

export default {
	install
}