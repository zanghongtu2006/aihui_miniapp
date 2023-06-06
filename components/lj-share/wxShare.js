export default {
    data() {
        return {
            share: {
                // 转发的标题 （默认标题）
                title: '打工进度条',
                // 默认是当前页面，必须是以‘/’开头的完整路径
                path: '',
                //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，
                //支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
                imageUrl: '',
				parameter: '', // 参数 id=123&name=uniapp
            }
        }
    },
    /*
     在要分享的页面 生命周期中  设计当前页面分享标题
     onLoad() {
         this.share.title = "当前页面分享标题"
         this.share.parameter = "携带的参数"
     },
     */
	// <button open-type="share"> 
    // 发送给朋友
    onShareAppMessage(res) {
        // 来自页面内的按钮的转发
        if (res.from == 'button') {
            console.log("按钮转发--配置");
        }
        // 获取加载的页面
        let pages = getCurrentPages(),
		view = pages[pages.length - 1];// 获取当前页面的对象
		let pam = {
			title: this.share.title,
			path: null,
			imageUrl: this.share.imageUrl,
		};
        pam.path = this.share.path.length ? `/${this.share.path}` : `/${view.route}`;
		this.share.parameter.length ? pam.path = `${pam.path}?${this.share.parameter}`:''
		console.log(pam)
        return pam;
    },
    //分享到朋友圈
    onShareTimeline(res) {
        // 获取加载的页面
        let pages = getCurrentPages(),
		view = pages[pages.length - 1];// 获取当前页面的对象
        console.log("当前页面的对象", view);
        this.share.path = `/${view.route}`;
        return this.share;
    }
}