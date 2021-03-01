# gio-core

GrowingIO 多个项目共享的核心业务模块及组件

## Modules

核心模块，如 Segment

## Components

### DataPanel

数据管理侧边展示详情


## 开发

本地开发
```
$ cd gio-core/pakcages/components
$ yarn link

$ cd target-project
$ yarn link "@gio-core/components"

...
import DataBoard from '@gio-core/components/data-board'
...

// 取消link

$ cd target-project
$ yarn unlink "@gio-core/components"
$ yarn install --force
```

## 提交修改

1.新建MR 标明前缀 比如：feat:、 docs:、fix:、等
2.review
3.merge

## 发布

1. 新建MR并修改版本号，说明本次发版内容

example:
    版本:0.7.8
    发版内容：
        1.修改了cp服务资源权限更改导致资源权限方法 [mr链接]


2. MR合并后发布新版本


### 命名规范

路径全小写，连字符分隔

## 相关文档

[开发文档-前端-GIOCore](https://growingio.atlassian.net/wiki/spaces/rd/pages/964624526/GIOCore)

[前端公共模块开发指南](https://growingio.atlassian.net/wiki/spaces/FEW/pages/939460506)

[私有NPM仓库使用指南](https://growingio.atlassian.net/wiki/spaces/FEW/pages/887784903/NPM)