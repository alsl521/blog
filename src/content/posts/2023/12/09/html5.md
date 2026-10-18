---
title: "HTML+CSS--HTML5"
published: 2023-12-09T10:56:02+08:00
description: "HTML5简单学习"
tags: ["前端", "HTML", "HTML5"]
category: "前端"
draft: false
pinned: false
author: "alsl521"
lang: "zh_CN"
comment: false
---
### 一、HTML5简介

#### 1.什么是HTML5

- HTML5 是新一代的 HTML 标准，2014年10月由万维网联盟（ W3C ）完成标准制定。
- 官网地址：
  - W3C 提供： https://www.w3.org/TR/html/index.html
  - WHATWG 提供： https://whatwg-cn.github.io/html/multipage
- HTML5 在狭义上是指新一代的 HTML 标准，在广义上是指：整个前端。

#### 2.HTML5 优势

1. 针对JavaScript ，新增了很多可操作的接口。
2. 新增了一些语义化标签、全局属性。
3. 新增了多媒体标签，可以很好的替代flash 。
4. 更加侧重语义化，对于SEO 更友好。
5. 可移植性好，可以大量应用在移动设备上。

#### 3.HTML5兼容性

- 支持： Chrome 、Safari 、Opera 、Firefox 等主流浏览器。

> IE 浏览器必须是9 及以上版本才支持HTML5 ，且IE9 仅支持部分HTML5 新特性。

### 二、新增语义化标签

#### 1.新增布局标签

| 标签名  | 语义                                                         | 单/双标签 |
| ------- | ------------------------------------------------------------ | --------- |
| header  | 整个页面，或部分区域的头部                                   | 双        |
| footer  | 整个页面，或部分区域的底部                                   | 双        |
| nav     | 导航                                                         | 双        |
| article | 文章、帖子、杂志、新闻、博客、评论等。                       | 双        |
| section | 页面中的某段文字，或文章中的某段文字（里面文字通常里面会包含标题）。 | 双        |
| aside   | 侧边栏                                                       | 双        |
| main    | 文档的主要内容 ( WHATWG 没有语义， IE 不支持)，几乎不用。    | 双        |
| hgroup  | 包裹连续的标题，如文章主标题、副标题的组合 （ W3C 将其删除） | 双        |

关于article 和section ：

> 1. artical 里面可以有多个section 。
> 2. section 强调的是分段或分块，如果你想将一块内容分成几段的时候，可使用section 元素。
> 3. article 比section 更强调独立性，一块内容如果比较独立、比较完整，应该使用article 元素。

`新增布局标签.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>01_新增布局标签</title>
</head>
<body>
<!-- 头部 -->
<header class="page-header">
    <h1>尚品汇</h1>
</header>
<hr>
<!-- 主导航 -->
<nav>
    <a href="#">首页</a>
    <a href="#">订单</a>
    <a href="#">购物车</a>
    <a href="#">我的</a>
</nav>
<!-- 主要内容 -->
<div class="page-content">
    <!-- 侧边栏导航 -->
    <aside style="float: right;">
        <nav>
            <ul>
                <li><a href="#">秒杀专区</a></li>
                <li><a href="#">会员专区</a></li>
                <li><a href="#">领取优惠券</a></li>
                <li><a href="#">品牌专区</a></li>
            </ul>
        </nav>
    </aside>
    <!-- 文章 -->
    <article>
        <h2>《如何一夜暴富》</h2>
        <section>
            <h3>第一种方式：通过做梦</h3>
            <p>你要这么做梦：xxxxxxxxxxxxxxxxxxxxxxx</p>
        </section>
        <section>
            <h3>第二种方式：通过买彩票</h3>
            <p>你要这么买彩票：xxxxxxxxxxxxxxxxxxxxxxx</p>
        </section>
        <section>
            <h3>第三种方式：通过学习前端</h3>
            <p>你要来到尚硅谷学前端：xxxxxxxxxxxxxxxxxxxxxxx</p>
        </section>
    </article>
</div>
<hr>
<footer>
    <nav>
        <a href="#">友情链接1</a>
        <a href="#">友情链接2</a>
        <a href="#">友情链接3</a>
        <a href="#">友情链接4</a>
    </nav>
</footer>
</body>
</html>
```

#### 2.新增状态标签

##### 2.1meter 标签

- 语义：定义已知范围内的标量测量。也被称为 gauge （尺度），双标签，例如：电量、磁盘用量等。
- 常用属性如下：

| 属性    | 值   | 描述       |
| ------- | ---- | ---------- |
| high    | 数值 | 规定高值   |
| low     | 数值 | 规定低值   |
| max     | 数值 | 规定最大值 |
| min     | 数值 | 规定最小值 |
| optimum | 数值 | 规定最优值 |
| value   | 数值 | 规定当前值 |

##### 2.2progress 标签

- 语义：显示某个任务完成的进度的指示器，一般用于表示进度条，双标签，例如：工作完成进度等。
- 常用属性如下：

| 属性  | 值   | 描述         |
| ----- | ---- | ------------ |
| max   | 数值 | 规定目标值。 |
| value | 数值 | 规定当前值。 |

`meta元信息.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>02_新增状态标签</title>
    <style>
        progress {
            width: 50px;
        }
    </style>
</head>
<body>
<span>手机电量：</span>
<meter max="100" min="0" value="90" low="10" high="20" optimum="90"></meter>
<br>
<span>当前进度：</span>
<progress max="100" value="20"></progress>
</body>
</html>
```

#### 3.新增列表标签

| 标签名   | 语义                                        | 单/双标签 |
| -------- | ------------------------------------------- | --------- |
| datalist | 用于搜索框的关键字提示                      | 双        |
| details  | 用于展示问题和答案，或对专有名词进行解释    | 双        |
| summary  | 写在 details 的里面，用于指定问题或专有名词 | 双        |

`meta元信息.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>03_新增列表标签</title>
</head>
<body>
<form action="#">
    <input type="text" list="mydata">
    <button>搜索</button>
</form>
<datalist id="mydata">
    <option value="周杰伦">周杰伦</option>
    <option value="周冬雨">周冬雨</option>
    <option value="马冬梅">马冬梅</option>
    <option value="温兆伦">温兆伦</option>
</datalist>
<hr>
<details>
    <summary>如何一夜暴富？</summary>
    <p>来到尚硅谷学习前端</p>
</details>
</body>
</html>
```

#### 4.新增文本标签

##### 4.1文本注音

| 标签名 | 语义                            | 单/双标签 |
| ------ | ------------------------------- | --------- |
| ruby   | 包裹需要注音的文字              | 双        |
| rt     | 写注音， rt 标签写在ruby 的里面 | 双        |

##### 4.2文本标记

| 标签名 | 语义 | 单/双标签 |
| ------ | ---- | --------- |
| mark   | 标记 | 双        |

> 注意： W3C 建议 mark 用于标记搜索结果中的关键字。

`meta元信息.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>04_新增文本标签</title>
</head>
<body>
<ruby>
    <span>魑魅魍魉</span>
    <rt>chī mèi wǎng liǎng</rt>
</ruby>
<hr>
<div>
    <ruby>
        <span>魑</span>
        <rt>chī</rt>
    </ruby>
    <ruby>
        <span>魅</span>
        <rt>mèi</rt>
    </ruby>
</div>
<hr>
<p>Lorem ipsum
    <mark>dolor</mark>
    sit amet consectetur adipisicing elit. Laboriosam, nemo?
</p>
</body>
</html>
```

### 三、新增表单功能

#### 1.表单控件新增属性

| 属性名       | 功能                                                         |
| ------------ | ------------------------------------------------------------ |
| placeholder  | 提示文字（注意：不是默认值， value 是默认值），适用于文字输入类的表单控件。 |
| required     | 表示该输入项必填， 适用于除按钮外其他表单控件。              |
| autofocus    | 自动获取焦点，适用于所有表单控件。                           |
| autocomplete | 自动完成，可以设置为on 或off ，适用于文字输入类的表单控件。<br/>注意：密码输入框、多行输入框不可用。 |
| pattern      | 填写正则表达式，适用于文本输入类表单控件。<br/>注意：多行输入不可用，且空的输入框不会验证，往往与 required 配合。 |

`meta元信息.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>01_新增的表单控件属性</title>
</head>
<body>
<form action="">
    账号：<input
        type="text"
        name="account"
        placeholder="请输入账号"
        required
        autofocus
        autocomplete="on"
        pattern="\w{6}"
>
    <br>
    密码：<input type="password" name="pwd" placeholder="请输入密码" required pattern="\w{6}">
    <br>
    性别：
    <input type="radio" value="male" name="gender" required>男
    <input type="radio" value="female" name="gender">女
    <br>
    爱好：
    <input type="checkbox" value="smoke" name="hobby">抽烟
    <input type="checkbox" value="drink" name="hobby" required>喝酒
    <input type="checkbox" value="perm" name="hobby">烫头
    <br>
    其他：<textarea name="other" placeholder="请输入密码" required pattern="\w{6}"></textarea>
    <br>
    <button>提交</button>
</form>
</body>
</html>
```

#### 2.input 新增属性值

| 属性名         | 功能                                                         |
| -------------- | ------------------------------------------------------------ |
| email          | 邮箱类型的输入框，表单提交时会验证格式，输入为空则不验证格式。 |
| url            | url 类型的输入框，表单提交时会验证格式，输入为空则不验证格式。 |
| number         | 数字类型的输入框，表单提交时会验证格式，输入为空则不验证格式。 |
| search         | 搜索类型的输入框，表单提交时不会验证格式。                   |
| tel            | 电话类型的输入框，表单提交时不会验证格式，在移动端使用时，会唤起数字键盘。 |
| range          | 范围选择框，默认值为50 ，表单提交时不会验证格式。            |
| color          | 颜色选择框，默认值为黑色，表单提交时不会验证格式。           |
| date           | 日期选择框，默认值为空，表单提交时不会验证格式。             |
| month          | 月份选择框，默认值为空，表单提交时不会验证格式。             |
| week           | 周选择框，默认值为空，表单提交时不会验证格式。               |
| time           | 时间选择框，默认值为空，表单提交时不会验证格式。             |
| datetime-local | 日期+时间选择框，默认值为空，表单提交时不会验证格式。        |

`新增的type属性值.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>02_input新增的type属性值</title>
</head>
<body>
<form action="" novalidate>
    邮箱：<input type="email" required name="email">

    <!-- url：<input type="url" required name="url"> -->

    <!-- 数值：<input type="number" required name="number" step="2" max="80" min="20"> -->

    <!-- 搜索：<input type="search" required name="keyword"> -->

    <!-- 电话：<input type="tel" required name="phone"> -->

    <!-- 光照强度：<input type="range" name="range" max="80" min="20" value="22"> -->

    <!-- 颜色：<input type="color" name="color"> -->

    <!-- 日期：<input type="date" required name="date"> -->

    <!-- 月份：<input type="month" required name="month"> -->

    <!-- 周：<input type="week" required name="week"> -->

    <!-- 时间：<input type="time" required name="time"> -->

    <!-- 日期+时间：<input type="datetime-local" required name="time2"> -->

    <br>
    <button>提交</button>
</form>
</body>
</html>
```

#### 3.form 标签新增属性

| 属性名     | 功能                                                      |
| ---------- | --------------------------------------------------------- |
| novalidate | 如果给form 标签设置了该属性，表单提交的时候不再进行验证。 |

`新增的form属性值.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>02_input新增的type属性值</title>
</head>
<body>
<form action="" novalidate>
    <button>提交</button>
</form>
</body>
</html>
```

### 四、新增多媒体标签

#### 1.视频标签

`<video>`标签用来定义视频，它是双标签。

| 属性     | 值                     | 描述                                                         |
| -------- | ---------------------- | ------------------------------------------------------------ |
| src      | URL地址                | 视频地址                                                     |
| width    | 像素值                 | 设置视频播放器的宽度                                         |
| height   | 像素值                 | 设置视频播放器的高度                                         |
| controls | -                      | 向用户显示视频控件（比如播放/暂停按钮）                      |
| muted    | -                      | 视频静音                                                     |
| autoplay | -                      | 视频自动播放                                                 |
| loop     | -                      | 循环播放                                                     |
| poster   | URL地址                | 视频封面                                                     |
| preload  | auto / metadata / none | 视频预加载，如果使用autoplay ，则忽略该属性。<br/>none : 不预加载视频。<br/>metadata : 仅预先获取视频的元数据（例如长度）。<br/>auto : 可以下载整个视频文件，即使用户不希望使用它。 |

`新增视频标签.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>01_新增视频标签</title>
    <style>
        video {
            width: 600px;
        }
    </style>
</head>
<body>
<video src="./小电影.mp4" controls muted loop poster="./封面.png" preload="auto"></video>
</body>
</html>
```

#### 2.音频标签

`<audio>`标签用来定义音频，它是双标签。

| 属性     | 值                     | 描述                                                         |
| -------- | ---------------------- | ------------------------------------------------------------ |
| src      | URL地址                | 音频地址                                                     |
| controls | -                      | 向用户显示音频控件（比如播放/暂停按钮）                      |
| autoplay | -                      | 音频自动播放                                                 |
| muted    | -                      | 音频静音                                                     |
| loop     | -                      | 循环播放                                                     |
| preload  | auto / metadata / none | 音频预加载，如果使用autoplay ，则忽略该属性。<br/>none : 不预加载音频。<br/>metadata : 仅预先获取音频的元数据（例如长度）。<br/>auto : 可以下载整个音频文件，即使用户不希望使用它。 |

`新增音频标签.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>02_新增音频标签</title>
    <style>
        audio {
            width: 600px;
            /* height: 500px; */
            border: 1px solid black;
        }
    </style>
</head>
<body>
<audio src="./小曲.mp3" controls loop preload="metadata"></audio>
</body>
</html>
```

`音频案例.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>03_音频案例</title>
    <style>
        audio {
            width: 600px;
        }

        .mask {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.727);
        }

        .dialog {
            position: absolute;
            width: 400px;
            height: 400px;
            background-color: green;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            font-size: 40px;
            text-align: center;
            line-height: 400px;
        }

        span {
            border: 1px solid white;
            color: white;
            cursor: pointer;
        }
    </style>
</head>
<body>
<audio id="music" src="./小曲.mp3" controls></audio>
<div class="mask" id="mask">
    <div class="dialog">
        <span>点我登录</span>
        <span onclick="go()">随便听听</span>
    </div>
</div>

<script>
    function go() {
        music.play()
        mask.style.display = 'none'
    }
</script>
</body>
</html>
```

### 五、新增全局属性（了解）

| 属性名          | 功能                                                         |
| --------------- | ------------------------------------------------------------ |
| contenteditable | 表示元素是否可被用户编辑，可选值如下：<br/>true ：可编辑<br/>false ：不可编辑 |
| draggable       | 表示元素可以被拖动，可选值如下：<br/>true ：可拖动<br/>false ：不可拖动 |
| hidden          | 隐藏元素                                                     |
| spellcheck      | 规定是否对元素进行拼写和语法检查，可选值如下：<br/>true ：检查<br/>false ：不检查 |
| contextmenu     | 规定元素的上下文菜单，在用户鼠标右键点击元素时显示。         |
| data-*          | 用于存储页面的私有定制数据。                                 |

`新增的全局属性.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>新增的全局属性</title>
    <style>
        div {
            width: 600px;
            height: 200px;
            border: 1px solid black;
            font-size: 20px;
            margin-bottom: 10px;
        }

        .box1 {
            background-color: skyblue;
        }

        .box2 {
            background-color: green;
        }
    </style>
</head>
<body>
<div class="box1" spellcheck="true" contenteditable="true">Lorem ipsum dolor sit amet.</div>
<div class="box2" draggable="true" hidden data-a="1" data-b="2" data-c="3">Lorem ipsum dolor sit amet.</div>
<h1>hello</h1>

</body>
</html>
```

### 六、HTML5兼容性处理

- 添加元信息，让浏览器处于最优渲染模式。

  ```html
  <!--设置IE总是使用最新的文档模式进行渲染-->
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <!--优先使用 webkit ( Chromium ) 内核进行渲染, 针对360等壳浏览器-->
  <meta name="renderer" content="webkit">
  ```

- 使用html5shiv 让低版本浏览器认识H5 的语义化标签。

  `新增的全局属性.html`

  ```html
  <!--[if lt ie 9]>
  <script src="../sources/js/html5shiv.js"></script>
  <![endif]-->
  ```

  ```html
  html5shiv.js
  /*! HTML5 Shiv pre3.5 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
    Uncompressed source: https://github.com/aFarkas/html5shiv  */
  (function (a, b) {
      function h(a, b) {
          var c = a.createElement("p"),
              d = a.getElementsByTagName("head")[0] || a.documentElement;
          return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
      }
  
      function i() {
          var a = l.elements;
          return typeof a == "string" ? a.split(" ") : a
      }
  
      function j(a) {
          var b = {},
              c = a.createElement,
              f = a.createDocumentFragment,
              g = f();
          a.createElement = function (a) {
              l.shivMethods || c(a);
              var f;
              return b[a] ? f = b[a].cloneNode() : e.test(a) ? f = (b[a] = c(a)).cloneNode() : f = c(a), f.canHaveChildren &&
                  !d.test(a) ? g.appendChild(f) : f
          }, a.createDocumentFragment = Function("h,f",
              "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + i().join().replace(
                  /\w+/g,
                  function (a) {
                      return b[a] = c(a), g.createElement(a), 'c("' + a + '")'
                  }) + ");return n}")(l, g)
      }
  
      function k(a) {
          var b;
          return a.documentShived ? a : (l.shivCSS && !f && (b = !!h(a,
              "article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}"
          )), g || (b = !j(a)), b && (a.documentShived = b), a)
      }
  
      function p(a) {
          var b, c = a.getElementsByTagName("*"),
              d = c.length,
              e = RegExp("^(?:" + i().join("|") + ")$", "i"),
              f = [];
          while (d--) b = c[d], e.test(b.nodeName) && f.push(b.applyElement(q(b)));
          return f
      }
  
      function q(a) {
          var b, c = a.attributes,
              d = c.length,
              e = a.ownerDocument.createElement(n + ":" + a.nodeName);
          while (d--) b = c[d], b.specified && e.setAttribute(b.nodeName, b.nodeValue);
          return e.style.cssText = a.style.cssText, e
      }
  
      function r(a) {
          var b, c = a.split("{"),
              d = c.length,
              e = RegExp("(^|[\\s,>+~])(" + i().join("|") + ")(?=[[\\s,>+~#.:]|$)", "gi"),
              f = "$1" + n + "\\:$2";
          while (d--) b = c[d] = c[d].split("}"), b[b.length - 1] = b[b.length - 1].replace(e, f), c[d] = b.join("}");
          return c.join("{")
      }
  
      function s(a) {
          var b = a.length;
          while (b--) a[b].removeNode()
      }
  
      function t(a) {
          var b, c, d = a.namespaces,
              e = a.parentWindow;
          return !o || a.printShived ? a : (typeof d[n] == "undefined" && d.add(n), e.attachEvent("onbeforeprint",
              function () {
                  var d, e, f, g = a.styleSheets,
                      i = [],
                      j = g.length,
                      k = Array(j);
                  while (j--) k[j] = g[j];
                  while (f = k.pop())
                      if (!f.disabled && m.test(f.media)) {
                          for (d = f.imports, j = 0, e = d.length; j < e; j++) k.push(d[j]);
                          try {
                              i.push(f.cssText)
                          } catch (l) {}
                      } i = r(i.reverse().join("")), c = p(a), b = h(a, i)
              }), e.attachEvent("onafterprint", function () {
              s(c), b.removeNode(!0)
          }), a.printShived = !0, a)
      }
      var c = a.html5 || {},
          d = /^<|^(?:button|form|map|select|textarea|object|iframe)$/i,
          e =
          /^<|^(?:a|b|button|code|div|fieldset|form|h1|h2|h3|h4|h5|h6|i|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul)$/i,
          f, g;
      (function () {
          var c = b.createElement("a");
          c.innerHTML = "<xyz></xyz>", f = "hidden" in c, f && typeof injectElementWithStyles == "function" &&
              injectElementWithStyles("#modernizr{}", function (b) {
                  b.hidden = !0, f = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle).display ==
                      "none"
              }), g = c.childNodes.length == 1 || function () {
                  try {
                      b.createElement("a")
                  } catch (a) {
                      return !0
                  }
                  var c = b.createDocumentFragment();
                  return typeof c.cloneNode == "undefined" || typeof c.createDocumentFragment == "undefined" ||
                      typeof c.createElement == "undefined"
              }()
      })();
      var l = {
          elements: c.elements ||
              "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
          shivCSS: c.shivCSS !== !1,
          shivMethods: c.shivMethods !== !1,
          type: "default",
          shivDocument: k
      };
      a.html5 = l, k(b);
      var m = /^$|\b(?:all|print)\b/,
          n = "html5shiv",
          o = !g && function () {
              var c = b.documentElement;
              return typeof b.namespaces != "undefined" && typeof b.parentWindow != "undefined" && typeof c.applyElement !=
                  "undefined" && typeof c.removeNode != "undefined" && typeof a.attachEvent != "undefined"
          }();
      l.type += " print", l.shivPrint = t, t(b)
  })(this, document)
  ```


- 扩展

  > lt 小于
  > lte 小于等于
  > gt 大于
  > gte 大于等于
  > ! 逻辑非

- 示例：

  ```html
  <!--[if IE 8]>仅IE8可见<![endif]-->
  <!--[if gt IE 8]>仅IE8以上可见<![endif]—>
  <!--[if lt IE 8]>仅IE8以下可见<![endif]—>
  <!--[if gte IE 8]>IE8及以上可见<![endif]—>
  <!--[if lte IE 8]>IE8及以下可见<![endif]—>
  <!--[if !IE 8]>非IE8的IE可见<![endif]-->
  ```

`兼容性处理.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>兼容性处理</title>
    <!-- 让IE浏览器处于一个最优的渲染模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- 针对一些国产的“双核”浏览器的设置，让浏览器优先使用webkit内核去渲染网页 -->
    <meta name="render" content="webkit">
    <!--[if lt ie 9]>
    <script src="./html5shiv.js"></script>
    <![endif]-->
    <style>
        header {
            background-color: orange;
        }

        footer {
            height: 100px;
            line-height: 100px;
            text-align: center;
            background-color: green;
        }
    </style>
</head>
<body>
<!-- 头部 -->
<header class="page-header">
    <h1>尚品汇</h1>
</header>
<hr>
<!-- 主导航 -->
<nav>
    <a href="#">首页</a>
    <a href="#">订单</a>
    <a href="#">购物车</a>
    <a href="#">我的</a>
</nav>
<!-- 主要内容 -->
<div class="page-content">
    <!-- 侧边栏导航 -->
    <aside style="float: right;">
        <nav>
            <ul>
                <li><a href="#">秒杀专区</a></li>
                <li><a href="#">会员专区</a></li>
                <li><a href="#">领取优惠券</a></li>
                <li><a href="#">品牌专区</a></li>
            </ul>
        </nav>
    </aside>
    <!-- 文章 -->
    <article>
        <h2>《如何一夜暴富》</h2>
        <section>
            <h3>第一种方式：通过做梦</h3>
            <p>你要这么做梦：xxxxxxxxxxxxxxxxxxxxxxx</p>
        </section>
        <section>
            <h3>第二种方式：通过买彩票</h3>
            <p>你要这么买彩票：xxxxxxxxxxxxxxxxxxxxxxx</p>
        </section>
        <section>
            <h3>第三种方式：通过学习前端</h3>
            <p>你要来到尚硅谷学前端：xxxxxxxxxxxxxxxxxxxxxxx</p>
        </section>
    </article>
</div>
<hr>
<!-- 页脚 -->
<footer>
    <nav>
        <a href="#">友情链接1</a>
        <a href="#">友情链接2</a>
        <a href="#">友情链接3</a>
        <a href="#">友情链接4</a>
    </nav>
</footer>
</body>
</html>
```
