---
title: "机器学习"
published: 2023-12-09T11:50:01+08:00
description: "机器学习 简单学习"
tags: ["机器学习", "Python"]
category: "机器学习"
draft: false
pinned: false
author: "alsl521"
lang: "zh_CN"
comment: false
---
# 2 预备知识

## 2.1. 数据操作

我们介绍n维数组，也称为张量（tensor）

![image-20230718095317947](./MachineLearning/image-20230718095317947.webp)![image-20230718095355503](./MachineLearning/image-20230718095355503.webp)

**创建数组**

![image-20230718095510084](./MachineLearning/image-20230718095510084.webp)

**访问元素**

可以按照自己的需求任意访问

![image-20230718095549235](./MachineLearning/image-20230718095549235.webp)

![image-20230718095602323](./MachineLearning/image-20230718095602323.webp)

张量表示一个由数值组成的数组，这个数组可能有多个维度。 具有一个轴的张量对应数学上的向量（vector）； 具有两个轴的张量对应数学上的矩阵（matrix）；
具有两个轴以上的张量没有特殊的数学名称。

可以通过张量的`shape`属性来访问张量（沿每个轴的长度）的*形状*
。要想改变一个张量的形状而不改变元素数量和元素值，可以调用reshape函数。虽然张量的形状发生了改变，但其元素值并没有变。
注意，通过改变张量的形状，张量的大小不会改变。

对于任意具有相同形状的张量，常⻅的标准算术运算符（+、-、*、/和`**`（`**`运算符是求幂运算））都可以被升级为按元素运算。我们可以在同⼀形状的任意两个张量上调⽤按元素操作。

在某些情况下，即使形状不同，我们仍然可以通过调⽤⼴播机制（broadcasting mechanism）来执⾏按元素操作。这种机制的⼯作⽅式如下：

1. 通过适当复制元素来扩展⼀个或两个数组，以便在转换之后，两个张量具有相同的形状；
2. 对⽣成的数组执⾏按元素操作。

## 2.2. 数据预处理

为了处理缺失的数据，典型的方法包括插值法和删除法， 其中插值法用一个替代值弥补缺失值，而删除法则直接忽略缺失值。

对于inputs中的类别值或离散值，我们将“NaN”视为一个类别。

```python
inputs = inputs.fillna(inputs.mean()) #将数值类型用平均值填充
inputs = pd.get_dummies(inputs, dummy_na=True) #将文本内容按照类别分类
```

![image-20230718113201331](./MachineLearning/image-20230718113201331.webp)![image-20230718113222966](./MachineLearning/image-20230718113222966.webp)

## 2.3. 线性代数

![image-20230718114138899](./MachineLearning/image-20230718114138899.webp)![image-20230718114210230](./MachineLearning/image-20230718114210230.webp)

![image-20230718114331041](./MachineLearning/image-20230718114331041.webp)![image-20230718114349892](./MachineLearning/image-20230718114349892.webp)

![image-20230718114436926](./MachineLearning/image-20230718114436926.webp)![image-20230718114447497](./MachineLearning/image-20230718114447497.webp)

![image-20230718114815388](./MachineLearning/image-20230718114815388.webp)![image-20230718114929677](./MachineLearning/image-20230718114929677.webp)

![image-20230718211940190](./MachineLearning/image-20230718211940190.webp)![image-20230718212031991](./MachineLearning/image-20230718212031991.webp)

![image-20230718212057671](./MachineLearning/image-20230718212057671.webp)

## 2.4 矩阵计算

![image-20230718215206494](./MachineLearning/image-20230718215206494.webp)![image-20230718215333557](./MachineLearning/image-20230718215333557.webp)

![image-20230718215344699](./MachineLearning/image-20230718215344699.webp)![image-20230718215459102](./MachineLearning/image-20230718215459102.webp)

![image-20230718215655743](./MachineLearning/image-20230718215655743.webp)![image-20230718215723143](./MachineLearning/image-20230718215723143.webp)

![image-20230718215758970](./MachineLearning/image-20230718215758970.webp)![image-20230718215841361](./MachineLearning/image-20230718215841361.webp)

![image-20230718220052061](./MachineLearning/image-20230718220052061.webp)

## 2.5 自动求导

![image-20230719092732473](./MachineLearning/image-20230719092732473.webp)![image-20230719093024611](./MachineLearning/image-20230719093024611.webp)

![image-20230719093232349](./MachineLearning/image-20230719093232349.webp)![image-20230719093445137](./MachineLearning/image-20230719093445137.webp)

![image-20230719093611759](./MachineLearning/image-20230719093611759.webp)![image-20230719093632034](./MachineLearning/image-20230719093632034.webp)

![image-20230718212057671](./MachineLearning/image-20230719093650706.webp)

# 3. 线性神经网络

## 3.1 线性回归

![image-20230719100441778](./MachineLearning/image-20230719100441778.webp)![image-20230719100456525](./MachineLearning/image-20230719100456525.webp)

![image-20230719100514806](./MachineLearning/image-20230719100514806.webp)

### 优化方法

![image-20230719100728046](./MachineLearning/image-20230719100728046.webp)![image-20230719101108218](./MachineLearning/image-20230719101108218.webp)

学习率与批量都应当适当，不能太大或太小

在机器学习的[上下文](https://baike.baidu.com/item/上下文/2884376?fromModule=lemma_inlink)
中，超参数是在开始学习过程之前设置值的参数，而不是通过训练得到的参数数据。通常情况下，需要对超参数进行优化，给学习机选择一组最优超参数，以提高学习的性能和效果。

## 3.4. softmax回归

softmax回归和线性回归一样也是将输入特征与权重做线性叠加，但是softmax回归的输出值个数等于标签中的类别数

![image-20230719110230215](./MachineLearning/image-20230719110230215.webp)
![image-20230719110858768](./MachineLearning/image-20230719110858768.webp)

![image-20230719110437470](./MachineLearning/image-20230719110437470.webp)
![image-20230719110451386](./MachineLearning/image-20230719110451386.webp)
![image-20230719110502882](./MachineLearning/image-20230719110502882.webp)

![image-20230719110733103](./MachineLearning/image-20230719110733103.webp)

# 4. 多层感知机

## 4.1. 多层感知机

![image-20230719150417297](./MachineLearning/image-20230719150417297.webp)
![image-20230719150545912](./MachineLearning/image-20230719150545912.webp)

![image-20230719150906953](./MachineLearning/image-20230719150906953.webp)
![image-20230719150919170](./MachineLearning/image-20230719150919170.webp)

![image-20230719151201077](./MachineLearning/image-20230719151201077.webp)

![image-20230719151640329](./MachineLearning/image-20230719151640329.webp)
![image-20230719151757327](./MachineLearning/image-20230719151757327.webp)

![image-20230719153011110](./MachineLearning/image-20230719153011110.webp)
![image-20230719153020892](./MachineLearning/image-20230719153020892.webp)
![image-20230719153033915](./MachineLearning/image-20230719153033915.webp)

![image-20230719153515440](./MachineLearning/image-20230719153515440.webp)
![image-20230719153527949](./MachineLearning/image-20230719153527949.webp)

## 4.4. 模型选择、欠拟合和过拟合

训练误差：模型在训练数据上的误差
泛化误差：模型在新数据上的误差

![image-20230719160702475](./MachineLearning/image-20230719160702475.webp)<img "/blog/posts-assets/2023/12/09/MachineLearning/image-20230719160702475.webp" alt="image-20230719160702475" style="zoom:50%;" />

训练数据集：训练模型参数
验证数据集：选择模型超参数
非大数据集上通常使用k折交叉验证

![image-20230719162021447](./MachineLearning/image-20230719162021447.webp)
![image-20230719162042137](./MachineLearning/image-20230719162042137.webp)

![image-20230719162118138](./MachineLearning/image-20230719162118138.webp)
![image-20230719162143608](./MachineLearning/image-20230719162143608.webp)

模型容量应当在泛化误差最低点是最好的

时序序列应保证时间连续性，不能从中间切开

## 4.5. 权重衰减

![image-20230719191948193](./MachineLearning/image-20230719191948193.webp)
![image-20230719192516593](./MachineLearning/image-20230719192516593.webp)

![image-20230719192601536](./MachineLearning/image-20230719192601536.webp)

## 4.6. 暂退法（Dropout）

![image-20230719195247252](./MachineLearning/image-20230719195247252.webp)
![image-20230719195036807](./MachineLearning/image-20230719195036807.webp)

Dropout和正则化都是为了防止过拟合。

## 4.8. 数值稳定性和模型初始化

![image-20230719202458607](./MachineLearning/image-20230719202458607.webp)
![image-20230719203356742](./MachineLearning/image-20230719203356742.webp)

![image-20230719203842750](./MachineLearning/image-20230719203842750.webp)
![image-20230719203852028](./MachineLearning/image-20230719203852028.webp)
![image-20230719203909237](./MachineLearning/image-20230719203909237.webp)

![image-20230719205210732](./MachineLearning/image-20230719205210732.webp)

**激活函数（Activation Function）**是一种添加到人工神经网络中的函数，旨在帮助网络学习数据中的复杂模式。类似于人类大脑中基于神经元的模型，激活函数最终决定了要发射给下一个神经元的内容，
通常是用在隐藏层中。

# 6. 卷积神经网络

![image-20230720100746613](./MachineLearning/image-20230720100746613.webp)



i,j是输出的宽高维度，k , l是输入的宽高维度；对下标做一定的变化，k = i + a , l = j + b ，v是w的重新索引v ， 这里的索引a和b覆盖了正偏移和负偏移，对于隐藏表示中任意给定位置（i,j）处的像素值[H]_{i,j} ，通过对x中以（i,j）为中心的像素进行加权求和得到，权重为v_{i,j,a,b} ；


![image-20230720100826680](./MachineLearning/image-20230720100826680.webp)
![image-20230720100839811](./MachineLearning/image-20230720100839811.webp)

原则一：x的变换，会引起v的变化，故解决方案是把（i，j）去掉，只剩a、b纬度

卷积操作

![no_padding_no_strides](./MachineLearning/no_padding_no_strides.gif)

![image-20230720103226301](./MachineLearning/image-20230720103226301.webp)![image-20230720103232248](./MachineLearning/image-20230720103232248.webp)

![image-20230720103406407](./MachineLearning/image-20230720103406407.webp)
![image-20230720103504347](./MachineLearning/image-20230720103504347.webp)

## 6.3. 填充和步幅

![padding_strides](./MachineLearning/padding_strides.gif)

![image-20230720110239052](./MachineLearning/image-20230720110239052.webp)
![image-20230720110313082](./MachineLearning/image-20230720110313082.webp)

![image-20230720110352045](./MachineLearning/image-20230720110352045.webp)
![image-20230720110743912](./MachineLearning/image-20230720110743912.webp)

![image-20230720110637482](./MachineLearning/image-20230720110637482.webp)
![image-20230720110652824](./MachineLearning/image-20230720110652824.webp)

![image-20230720111158955](./MachineLearning/image-20230720111158955.webp)

## 6.4. 多输入多输出通道

![image-20230720141905115](./MachineLearning/image-20230720141905115.webp)
![image-20230720141950559](./MachineLearning/image-20230720141950559.webp)

![image-20230720142026430](./MachineLearning/image-20230720142026430.webp)
![image-20230720142046022](./MachineLearning/image-20230720142046022.webp)

![image-20230720142548459](./MachineLearning/image-20230720142548459.webp)
![image-20230720142640495](./MachineLearning/image-20230720142640495.webp)

## 6.5. 汇聚层（池化层）

![image-20230720144834781](./MachineLearning/image-20230720144834781.webp)

与卷积层类似，汇聚层运算符由一个固定形状的窗口组成，该窗口根据其步幅大小在输入的所有区域上滑动，为固定形状窗口（有时称为
*汇聚窗口*）遍历的每个位置计算一个输出。 然而，不同于卷积层中的输入与卷积核之间的互相关计算，汇聚层不包含参数。
相反，池运算是确定性的，我们通常计算汇聚窗口中所有元素的最大值或平均值。这些操作分别称为*最大汇聚层*（maximum pooling）和
*平均汇聚层*（average pooling）。

![image-20230720145419790](./MachineLearning/image-20230720145419790.webp)

![image-20230720145318773](./MachineLearning/image-20230720145318773.webp)
![image-20230720145346993](./MachineLearning/image-20230720145346993.webp)

## 6.6. 卷积神经网络（LeNet）

![image-20230720151818638](./MachineLearning/image-20230720151818638.webp)

# 7. 现代卷积神经网络

## 7.1. 深度卷积神经网络（AlexNet）

![image-20230720162053727](./MachineLearning/image-20230720162053727.webp)

## 7.2. 使用块的网络（VGG）

![image-20230720192051469](./MachineLearning/image-20230720192051469.webp)

更大、更深，将卷积层封装成块

![image-20230720193103591](./MachineLearning/image-20230720193103591.webp)

## 7.3. 网络中的网络（NiN）

![image-20230720194349962](./MachineLearning/image-20230720194349962.webp)

![image-20230718212057671](./MachineLearning/image-20230720194556345.webp)
![image-20230720194616068](./MachineLearning/image-20230720194616068.webp)

![image-20230718212057671](./MachineLearning/image-20230720194801385.webp)

## 7.4. 含并行连结的网络（GoogLeNet）

![image-20230718212057671](./MachineLearning/image-20230720200955774.webp)
![image-20230718212057671](./MachineLearning/image-20230720201052178.webp)

蓝色用来提取空间信息，白色获取通道信息

## 7.5. 批量规范化

![image-20230720204219499](./MachineLearning/image-20230720204219499.webp)
![image-20230720204248017](./MachineLearning/image-20230720204248017.webp)

![image-20230720204716433](./MachineLearning/image-20230720204716433.webp)
![image-20230720204809735](./MachineLearning/image-20230720204809735.webp)

## 7.6. 残差网络（ResNet）

![image-20230720211733678](./MachineLearning/image-20230720211733678.webp)
![image-20230720212001144](./MachineLearning/image-20230720212001144.webp)

![image-20230720212027514](./MachineLearning/image-20230720212027514.webp)

# 13. 计算机视觉

## 13.1. 图像增广

![image-20230721093542172](./MachineLearning/image-20230721093542172.webp)

左右翻转可以，但上下翻转并不总是可行的。

![image-20230721093808772](./MachineLearning/image-20230721093808772.webp)

## 13.2. 微调

将以训练好的模型采用另一个数据集重新训练，这时因为有了先验经验，故只需要将参数微调。

![image-20230721101519474](./MachineLearning/image-20230721101519474.webp)
![image-20230721101837711](./MachineLearning/image-20230721101837711.webp)

![image-20230721101943331](./MachineLearning/image-20230721101943331.webp)
![image-20230721101954074](./MachineLearning/image-20230721101954074.webp)

![image-20230721102025360](./MachineLearning/image-20230721102025360.webp)

## 13.3. 目标检测和边界框

![image-20230721141831313](./MachineLearning/image-20230721141831313.webp)

![image-20230721144231691](./MachineLearning/image-20230721144231691.webp)

基于锚框预测真实的范围，而锚框的提出则是被预先提出的，会出现很多。

![image-20230721144541723](./MachineLearning/image-20230721144541723.webp)
![image-20230721144605871](./MachineLearning/image-20230721144605871.webp)
![image-20230721144637378](./MachineLearning/image-20230721144637378.webp)

![image-20230721145216320](./MachineLearning/image-20230721145216320.webp)
![image-20230721145225804](./MachineLearning/image-20230721145225804.webp)

## 13.8. 区域卷积神经网络（R-CNN）系列

![image-20230721153544659](./MachineLearning/image-20230721153544659.webp)
![image-20230721153600232](./MachineLearning/image-20230721153600232.webp)

![image-20230721153612991](./MachineLearning/image-20230721153612991.webp)
![image-20230721153636475](./MachineLearning/image-20230721153636475.webp)

Faster R-CNN：先进行预检测，随后再精检测

![image-20230721155246654](./MachineLearning/image-20230721155246654.webp)
![image-20230721155305890](./MachineLearning/image-20230721155305890.webp)

![image-20230721155328725](./MachineLearning/image-20230721155328725.webp)

## 13.9. 语义分割和数据集

![image-20230721195145079](./MachineLearning/image-20230721195145079.webp)

## 13.10. 转置卷积

![image-20230721203812220](./MachineLearning/image-20230721203812220.webp)
![image-20230721203828948](./MachineLearning/image-20230721203828948.webp)

![image-20230721210115813](./MachineLearning/image-20230721210115813.webp)
![image-20230721210131493](./MachineLearning/image-20230721210131493.webp)

![image-20230721210142607](./MachineLearning/image-20230721210142607.webp)
![image-20230721210157363](./MachineLearning/image-20230721210157363.webp)

![image-20230721210503933](./MachineLearning/image-20230721210503933.webp)
![image-20230721210513460](./MachineLearning/image-20230721210513460.webp)

## 13.11. 全卷积网络

![image-20230721211044535](./MachineLearning/image-20230721211044535.webp)

# 8. 循环神经网络

## 8.1. 序列模型

![image-20230722102415161](./MachineLearning/image-20230722102415161.webp)
![image-20230722102432151](./MachineLearning/image-20230722102432151.webp)

![image-20230722102952625](./MachineLearning/image-20230722102952625.webp)

![image-20230722103010092](./MachineLearning/image-20230722103010092.webp)
![image-20230722103025175](./MachineLearning/image-20230722103025175.webp)

## 8.3. 语言模型和数据集

![image-20230722115210149](./MachineLearning/image-20230722115210149.webp)
![image-20230722115220793](./MachineLearning/image-20230722115220793.webp)

![image-20230722115242851](./MachineLearning/image-20230722115242851.webp)

## 8.4. 循环神经网络

不建议使用RNN

![image-20230722132216055](./MachineLearning/image-20230722132216055.webp)
![image-20230722132335961](./MachineLearning/image-20230722132335961.webp)

Whh存储的就是隐变量的权重值，从而预测下一个的值

![image-20230722132937557](./MachineLearning/image-20230722132937557.webp)
![image-20230722133130562](./MachineLearning/image-20230722133130562.webp)

![image-20230722133215698](./MachineLearning/image-20230722133215698.webp)
![image-20230722133223334](./MachineLearning/image-20230722133223334.webp)

# 9. 现代循环神经网络

## 9.1. 门控循环单元（GRU）

![image-20230722150037087](./MachineLearning/image-20230722150037087.webp)
![image-20230722150056740](./MachineLearning/image-20230722150056740.webp)

使用sigmoid作为隐藏函数进行计算，通过该方法控制是否记忆，记忆多长时间的隐状态

![image-20230722150617240](./MachineLearning/image-20230722150617240.webp)
![image-20230718212057671](./MachineLearning/image-20230722150617240.webp)

![image-20230722150707340](./MachineLearning/image-20230722150707340.webp)

## 9.2. 长短期记忆网络（LSTM）

![image-20230722153505487](./MachineLearning/image-20230722153505487.webp)
![image-20230722153519850](./MachineLearning/image-20230722153519850.webp)

![image-20230722153606307](./MachineLearning/image-20230722153606307.webp)
![image-20230722153617159](./MachineLearning/image-20230722153617159.webp)
![image-20230722153631773](./MachineLearning/image-20230722153631773.webp)

![image-20230722153659551](./MachineLearning/image-20230722153659551.webp)

LSTM的状态包含两个，分别表示长期记忆和短期记忆，两者互相独立。

## 9.3. 深度循环神经网络

![image-20230722160602509](./MachineLearning/image-20230722160602509.webp)

## 9.4. 双向循环神经网络

![image-20230722160723950](./MachineLearning/image-20230722160723950.webp)
![image-20230722160752683](./MachineLearning/image-20230722160752683.webp)

![image-20230722160829826](./MachineLearning/image-20230722160829826.webp)
![image-20230722160856547](./MachineLearning/image-20230722160856547.webp)

有两个隐藏层，向前向后两个隐藏层，然后计算完合并，两个方向的含义同时出现。

主要作用是对句子进行操作。例如结合上下文翻译、识别语句等等，但是不能用来预测未来。

## 9.6. 编码器-解码器架构

![image-20230722175908184](./MachineLearning/image-20230722175908184.webp)
![image-20230722175921449](./MachineLearning/image-20230722175921449.webp)

编码：提取特征

解码：输出结果

![image-20230722180017796](./MachineLearning/image-20230722180017796.webp)

## 9.7. 序列到序列学习（seq2seq）

![image-20230722183409490](./MachineLearning/image-20230722183409490.webp)
![image-20230722183419684](./MachineLearning/image-20230722183419684.webp)

![image-20230722183516923](./MachineLearning/image-20230722183516923.webp)
![image-20230722183525690](./MachineLearning/image-20230722183525690.webp)

## 9.8. 束搜索

![image-20230722190937781](./MachineLearning/image-20230722190937781.webp)
![image-20230722191025883](./MachineLearning/image-20230722191025883.webp)

![image-20230722192753130](./MachineLearning/image-20230722192753130.webp)

# 10. 注意力机制

## 10.6. 自注意力和位置编码

![image-20230722214511389](./MachineLearning/image-20230722214511389.webp)
![image-20230722214524122](./MachineLearning/image-20230722214524122.webp)

![image-20230722214544977](./MachineLearning/image-20230722214544977.webp)
![image-20230722214607607](./MachineLearning/image-20230722214607607.webp)

## 10.7. Transformer

![image-20230723101011486](./MachineLearning/image-20230723101011486.webp)

![image-20230723101401128](./MachineLearning/image-20230723101401128.webp)

![image-20230723103124705](./MachineLearning/image-20230723103124705.webp)

![image-20230723103138772](./MachineLearning/image-20230723103138772.webp)

![image-20230723103214933](./MachineLearning/image-20230723103214933.webp)

等价于全连接层。

![image-20230723103231254](./MachineLearning/image-20230723103231254.webp)

![image-20230723103245352](./MachineLearning/image-20230723103245352.webp)

![image-20230723103257393](./MachineLearning/image-20230723103257393.webp)

![image-20230723103307682](./MachineLearning/image-20230723103307682.webp)

# 11. 优化算法

![image-20230723131401682](./MachineLearning/image-20230723131401682.webp)
![image-20230723131434128](./MachineLearning/image-20230723131434128.webp)

但最好的还是全局最小。凸优化则是一个特例。

![image-20230723131604945](./MachineLearning/image-20230723131604945.webp)
![image-20230723131621807](./MachineLearning/image-20230723131621807.webp)

![image-20230723131924887](./MachineLearning/image-20230723131924887.webp)
![image-20230723131934348](./MachineLearning/image-20230723131934348.webp)

![image-20230723131953439](./MachineLearning/image-20230723131953439.webp)
![image-20230723132011958](./MachineLearning/image-20230723132011958.webp)

随机梯度是一种近似，可以极大地减少梯度的运算，减小开销。

![image-20230723132302143](./MachineLearning/image-20230723132302143.webp)

随机采样子集，用一批子集的平均值作为梯度的平均值，减少运算量。

![image-20230723132613482](./MachineLearning/image-20230723132613482.webp)

用冲量代替梯度。

![image-20230723132640710](./MachineLearning/image-20230723132640710.webp)
![image-20230718212057671](./MachineLearning/image-20230723133235819.webp)

![image-20230723133448102](./MachineLearning/image-20230723133448102.webp)
