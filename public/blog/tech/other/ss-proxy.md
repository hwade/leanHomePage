# SOCKS5之免费高效翻墙策略

> 此文参考了微信公众号[编程派](http://codingpy.com)、[掘金博文](http://blog.xuanzhangjiong.xyz)和[Archlinux](https://wiki.archlinux.org/index.php/Shadowsocks_)，如有侵权请联系[作者](http://h_wade.leanapp.cn?about.md)

- [Shadowsocks](#shadowsocks)

- [服务器端设置](#server-setting)

- [客户端设置](#guest-setting)（我不想那么麻烦，你直接告诉我怎么用就好）
	- [IOS](#ios-setting)
	- [Android](#android-setting)
	- [Windows PC](#windows-setting)
	- [Mac PC](#mac-setting)
	- [Linux PC](#linux-setting)


![致人民的胜利](http://ac-qjxlvvnf.clouddn.com/7b3eec0cd70fc362.jpg)
题图: 推翻柏林墙

<h3 id="shadowsocks">Shadowsocks</h3>

[Shadowsocks](https://wuu.wikipedia.org/wiki/Shadowsocks)（中文名称：影梭）是一只开源个```SOCKS```代理软件，用来突破网络审查。可以运行在Windows、OS X、Linux、移动设备和路由器（```OpenWrt```等）等多种平台上。

- 运行原理

![ss图](http://ac-qjxlvvnf.clouddn.com/66399901208db4ae.png)

此技术采用```SOCKS5```协议，以[通道方式](http://baike.baidu.com/view/3561891.htm)经由本地端口```1080```穿过防火墙，允许防火墙后面的人通过一个IP地址访问网络。[客户端](#客户端设置)需要用指定密码、加密方式、端口号来连接[服务器](#服务器端设置)。连接成功后，客户端会自动加密并转发流量到服务器，服务器用同样个加密方式拿流量回传给客户端，以此实现代理上网。

- 关于项目

由于```shadowsocks```既稳定又不易被屏蔽，为墙内人民带来无与伦比的幸福，不久便受到了墙内高度关注，所以作者在2015年8月份被有关部门请去喝茶，出于保护墙内人民免受巨人的伤害，这个项目已经从```github```中下架。


<h3 id="server-setting">服务器端设置</h3>

为了搭建服务器端的```shadowsocks```，我们必须去租用一台服务器，而且站点必须在国外，否则都在墙内没法翻到墙外。这里推荐使用[亚马逊AWS](http://aws.amazon.com/cn/free/)（并不是在打广告，还有其他免费可用的服务器[Koding](http://www.koding.com/)和[Heroku](https://www.heroku.com/)，请移步[编程派](http://codingpy.com/article/climb-the-gfw-the-geek-way/)），只要每个月不超过15G流量，并且不要开通其他增值服务，就可以享用12个月的免费服务。

- 申请步骤
	- 点击[AWS亚马逊](http://aws.amazon.com/cn/free/)，并注册一个账号，可以用亚马逊购物平台的账号。
	- 绑定信用卡，国内的信用卡大多数都可以，然后会有来自美国的一通验证电话，只要记住通过内容最后几个数字验证码就行了，英文差到数字都听不懂的我也没办法了。
	- 验证通过后，亚马逊会在你注册的信用卡上扣除1-2美元，会在3周左右返还的放心。
	- 选择东京节点，大家都说好！创建一个```EC2```实例，选择```Ubuntu Server 14.04 LTS```，其他全部默认，万一超出免费范围！
![ec2|left](http://ac-qjxlvvnf.clouddn.com/62adde9c6a2d2a94.jpg)
![ec2|left](http://ac-qjxlvvnf.clouddn.com/bdac9b4756b08a58.jpg)
	- 创建完```EC2```实例会需要保存一份```ssh```密钥，注意只能下载一次！然后执行下面命令修改文件权限以防被修改，```<amazon.pem>```为你的密钥名。
```
$ chmod 400 <amazon.pem>
```
	- 从客户端远程登录到服务器端。```<ubuntu>```为服务器默认的用户名（有的是```user```），```<remote_ip>```为你服务器节点的ip地址（windows用户可以使用[Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)）。
```
$ ssh -i <amazon.pem> <ubuntu>@<remote_ip>
```

- <div id="server-setting-second"></div>登录之后按照下面步骤安装```shadowsocks```（Linux debian通用)。

```
$ sudo -s	//首先获取管理员权限
$ apt-get update	//更新你的源，确保库中有你需要的安装包
$ apt-get install python-pip python-m2crypto	//安装包管理工具pip
$ pip install shadowsocks	//安装ss
```
- <div id="ss-setting"></div>创建ss配置文件，配置```shadowsocks```. （[vi使用方法](http://baike.baidu.com/link?url=dmTmnfm6QasXRq9J2fFExroI2cCnYOM6qBETeKX5jPl8Lga0-gXFaWTeGjjjBuFAUnInYHG_QFzzos7YIBpdva)）

```
$ vi /etc/shadowsocks.json
```
```
// 单用户配置
{
	"server":"<AWS页面中的公共ip地址>",
	"server_port":<自定义的服务器端口（注意不要和常规端口冲突）>,
	"local_address":"127.0.0.1",
	"local_port":1080,
	"password":"<自定义代理密码>",
	"timeout":300,
	"method":"aes-256-cfb",
	"fast_open":false,
	"workers":1
}
```
```
// 多用户多端口配置
{
	"server":"<AWS页面中的公共ip地址>",
	"local_address":"127.0.0.1",
	"local_port":1080,
	"port_password":{
		"<自定义端口号1>": "<自定义代理密码1>",
		"<自定义端口号2>": "<自定义代理密码2>",
		"<自定义端口号3>": "<自定义代理密码3>"
	},
	"timeout":30,
	"method":"aes-256-cfb",
	"fast_open":false,
	"workers":1
}
```
属性 | 含义
----- | -------
server | 服务端监听地址(IPv4或IPv6)
server_port | 服务端端口，一般为443，可自定义为8989等非常用端口
local_address | 本地监听地址，缺省为127.0.0.1
local_port | 本地监听端口，一般为1080
password | 用以加密的密匙
timeout | 超时时间（秒）
method | 加密方法有"bf-cfb","aes-256-cfb","des-cfb","rc4"。"rc4"加密速度很快，但是不安全，默认的是一种不安全的加密，此处首推aes-256-cfb
fast_open | 是否启用[TCP-Fast-Open](https://github.com/clowwindy/shadowsocks/wiki/TCP-Fast-Open)
wokers | worker数量，如果不理解含义请不要改

- 在```config.json```文件所在目录启动服务器

```
$ cd /etc/shadowsocks/
$ ssserver	// 第一种方法当前目录启动
$ ssserver -c /etc/shadowsocks.json -d start	//第二种方法后台启动
```

- 上面步骤已经设置好```shadowsocks```的服务器端了，但是还需要在亚马逊AWS的管理界面开启入站端口才能连接上EC2实例中的```shadowsocks```服务。
	- 打开运行实例，向右滚动表格，最后一项安全组点击进入
![ec2-img](http://ac-qjxlvvnf.clouddn.com/78fa9be7488a1230.jpg)
	- 点击【入站】里面默认存在```ssh```端口给用户远程登录到AWS服务器
![ec2-img](http://ac-qjxlvvnf.clouddn.com/bb074844d8ac35c9.jpg)
	- 点击【编辑】，添加刚在服务器端自定义的服务器端口```server_port```，保存即可完成设置
![ec2-img](http://ac-qjxlvvnf.clouddn.com/ec38e583b1468f38.jpg)



<h3 id="guest-setting">客户端设置</h3>

以下设置已经包含了测试账号，可以试用一段时间，在填写时建议直接复制以防填错。同时太多人使用可能也会影响网速，所以尽量不要传播。

- <div id="ios-setting"></div>IOS设备
	- 打开【设置－通用－VPN】，点击【添加 VPN 配置】，从上到下选择和填写：
```
类型  			PPTP
描述	  		内测 VPN
服务器			45.78.6.48
账户  			vpn
密码	  		tM2zEsXx
```
<div style="width:30%">![ios-img|left](http://ac-qjxlvvnf.clouddn.com/f83ac2c48c822171.jpg)</div>
	- 配置完成后，打开/关闭只需在设置－VPN 里操作，当屏幕上方出现 VPN 字样说明连接成功。

- <div id="android-setting"></div>Android 设备
	- 下载并安装[影梭](http://ac-qjxlvvnf.clouddn.com/912b2c48dee0106e.apk)
```
配置名称			内测VPN
服务器	  		45.78.6.48
远程端口			8899
本地端口			1080
密码	    		YzA2NGIzM2
加密方法			AES-256-CFB
```
	- 填完如下图，点击右上角圆形图标，搞定！
<div style="width:30%">![android-img|left](http://ac-qjxlvvnf.clouddn.com/d7c071afee8d2ddc.jpg)</div>

- <div id="mac-setting"></div>Mac 电脑
	- 下载安装[shadowsocks_mac](http://ac-qjxlvvnf.clouddn.com/383c9a14bc105943.dmg)
	- 弹出【服务器设定】后点击【+】增加服务器
```
地址   		45.78.6.48 : 8899
加密   		aes-256-cfb
备注   		内测 VPN 
密码   		YzA2NGIzM2
```
	- 填完如下图，点击确定
<div style="width:60%">![mac-img|left](http://ac-qjxlvvnf.clouddn.com/71881dbd9472fd2a.jpg)</div>
	- 屏幕上方的小飞机图标就是翻墙的开关，选择【自动代理模式】，点击【从 GFWList 更新 PAC】，搞定！
提醒：请务必确保服务器的【内测 VPN】前边是打勾的。
<div style="width:60%">![mac-img|left](http://ac-qjxlvvnf.clouddn.com/2950dc8feacfbb9f.jpg)</div>

- <div id="windows-setting"></div>Windows 电脑
	- 下载[shadowsocks_win](http://pan.baidu.com/s/1qXz7wRU)并解压，双击运行```Shadowsocks.exe```
	- 弹出【编辑服务器】，填写
```
服务器 IP 			45.78.6.48
服务器端口			8899
密码	      		YzA2NGIzM2
加密	      		aes-256-cfb
备注      			内测 VPN
代理端口  			1080
```
	- 点击【确定】，右下角状态栏出现的小飞机就是翻墙的开关
<div style="width:60%">![mac-img|left](http://ac-qjxlvvnf.clouddn.com/1479237959a04c82.jpg)</div>
<div style="width:60%">![mac-img|left](http://ac-qjxlvvnf.clouddn.com/1dc486ad34865aa1.png)</div>
	- 右击选择【启用系统代理】，搞定！
<div style="width:60%">![mac-img|left](http://ac-qjxlvvnf.clouddn.com/8a1d4802a2dbefe9.jpg)</div>

- <div id="linux-setting"></div>Linux 电脑
	- 按照[服务器配置文档](#server-setting-second)第二步一样来安装配置```linux```客户端
	- 运行客户端```shadowsocks```，监听本地端口```127.0.0.1:1080```
```
$ sslocal -c /etc/shadowsocks/config.json
$ sslocal -s 服务器地址 -p 服务器端口 -l 本地端端口 -k 密码 -m 加密方法	// 若无法成功加载时才执行手动加载
```
	- 因为```shadowsocks```采用```SOCKS5```协议进行通讯，在本地端无法直接使用```http```代理，所以可以采用安装[chrome浏览器插件](https://github.com/FelisCatus/SwitchyOmega/releases/download/v2.3.17/SwitchyOmega.crx)的方法监听1080端口（详情请看[github-switchyOmega](https://github.com/FelisCatus/SwitchyOmega/releases)和[插件使用教程](https://github.com/FelisCatus/SwitchyOmega)）
	- 若上述方法成功请忽略这一步。使用```privoxy```将```SOCKS```代理转换成```http```代理。先编辑```privoxy```配置文件```/etc/privoxy/config```（不要漏下1080后面的点，```listen-address  127.0.0.1:8118```已存在文档中)
```
forward-socks5   /               127.0.0.1:1080 .
listen-address  127.0.0.1:8118	// 文档中并未注释，不要重复填写，否则会抛出异常 
```
	- 重启服务应用更改
```
$ /etc/init.d/privoxy restart
```
	- 假设转化后的```http```代理为```127.0.0.1:8118```，则在终端中启动
```
$ chromium %U --proxy-server=127.0.0.1:8118
```


