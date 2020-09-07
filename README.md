<h1 align="center">MangaMaster</h1>
<div align="center">
基于web端的漫画管理系统
</div>
<br/>

[![](https://oss.karasu.cn/MangaMaster/20200907113245.png)](https://karasu.cn/manga)

## 特性

- 自定义标签管理，满足对漫画进行个性化分类整理的需求
- 完善的搜索功能，根据出版时间，不同的标签组合(并集查询，交集查询),漫画名称(中日英模糊查询)，作者名称(中日英模糊查询)准确筛选出满足条件的漫画

## 运行

需先搭建服务端运行环境 [MangaMasterServer](https://github.com/KarasuShing/MangaMasterServer)

```bash
$ git clone https://github.com/KarasuShing/MangaMaster
$ cd MangaMaster
$ npm i
$ npm run serve
```

## TODO

- [x] 漫画录入
- [x] 按 tag 筛选
- [ ] tag 管理(编辑删除)
- [ ] 作者管理(编辑删除)
- [ ] 完善搜索功能
- [ ] 登录验证
- [ ] 实现基于 web 端的漫画阅读器

### 说明

- 项目初衷是对本地漫画资源进行整理，后续将加入的阅读功能也会是基于将漫画资源映射在本地服务器这一前提进行开发
