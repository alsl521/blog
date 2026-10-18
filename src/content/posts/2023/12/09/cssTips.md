---
title: "CSS--内容居中"
published: 2023-12-09T10:56:44+08:00
description: "CSS小知识总结"
tags: ["前端", "CSS"]
category: "前端/CSS"
draft: false
pinned: false
author: "alsl521"
lang: "zh_CN"
comment: false
---
## 1.1文本水平对齐

<strong style="color:#ff0000;font-size: 22px;">text-align: center;</strong>

## 1.2文本居中对齐

<strong style="color:#ff0000;font-size: 22px;">对于单行文字：让height 等于line-height ，可以实现文字垂直居中。</strong>

<strong style="color:#ff0000;font-size: 22px;">vertical-align 作用：用于指定同一行元素之间，或 表格单元格 内文字的
垂直对齐方式。</strong>

<strong style="color:#ff0000;font-size: 22px;">如何让子元素，在父亲中 水平居中：</strong>

- 若子元素为块元素，给父元素加上： margin:0 auto; 。
- 若子元素为块元素，display: inline-block;转换为行内元素，再给父元素加上： text-align:center
- 若子元素为行内元素、行内块元素，给父元素加上： text-align:center 。

<strong style="color:#ff0000;font-size: 22px;">如何让子元素，在父亲中 垂直居中：</strong>

- 若子元素为块元素，给子元素加上： margin-top ，值为：(父元素content －子元素盒子总高) / 2。

- 若子元素为行内元素、行内块元素：

  让父元素的height = line-height ，每个子元素都加上： vertical-align:middle; 。

- 补充：若想绝对垂直居中，父元素font-size 设置为0 。

<strong style="color:#ff0000;font-size: 22px;">让定位元素的宽充满包含块：</strong>

1. 块宽想与包含块一致，可以给定位元素同时设置 left 和 right 为0 。
2. 高度想与包含块一致， top 和 bottom 设置为 0 。

<strong style="color:#ff0000;font-size: 22px;">让定位元素在包含块中居中：</strong>

- 方案一：

  ```css
  left:0;
  right:0;
  top:0;
  bottom:0;
  margin:auto;
  ```


- 方案二：

  ```css
  left: 50%;
  top: 50%;
  margin-left: 负的宽度一半;
  margin-top: 负的高度一半;
  ```

> 注意：该定位的元素必须设置宽高！！！

<strong style="color:#ff0000;font-size: 22px;">位移配合定位，可实现元素水平垂直居中</strong>

```css
.box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
```

<strong style="color:#ff0000;font-size: 22px;">flex 实现水平垂直居中</strong>

方法一：父容器开启flex 布局，随后使用justify-content 和align-items 实现水平垂直居中

```css
.outer {
    width: 400px;
    height: 400px;
    background-color: #888;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inner {
    width: 100px;
    height: 100px;
    background-color: orange;
}
```

方法二：父容器开启flex 布局，随后子元素margin: auto

```css
.outer {
    width: 400px;
    height: 400px;
    background-color: #888;
    display: flex;
}

.inner {
    width: 100px;
    height: 100px;
    background-color: orange;
    margin: auto;
}
```
