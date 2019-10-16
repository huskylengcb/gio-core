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
```

## 发布

升级版本

```
lerna version --amend --no-git-tag-version
```

合并版本更新到最新的 commit
```
git commit -a --amend --no-edit // gcan!
```

发布
```
lerna publish from-package
```

### 命名规范

路径全小写，连字符分隔

## 相关文档

[开发文档-前端-GIOCore](https://growingio.atlassian.net/wiki/spaces/rd/pages/964624526/GIOCore)

[前端公共模块开发指南](https://growingio.atlassian.net/wiki/spaces/FEW/pages/939460506)

[私有NPM仓库使用指南](https://growingio.atlassian.net/wiki/spaces/FEW/pages/887784903/NPM)