import type { ProfileConfig } from "../types/profileConfig";

export const profileConfig: ProfileConfig = {
	// 头像（主题默认素材，可替换为 public 或 src 下的图片）
	avatar: "assets/images/avatar.avif",

	// 名字
	name: "alsl521",

	// 个人签名
	bio: "记录学习与思考",

	// 链接配置
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/alsl521",
			showName: false,
		},
		{
			name: "RSS",
			icon: "fa7-solid:rss",
			url: "/rss/",
			showName: false,
		},
	],
};
