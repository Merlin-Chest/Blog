# cheap-module-source-map

不支持IE8  可以设断点调试，不显示列信息，每个js模块代码用eval()执行，并且在生成的每个模块代码尾部加上注释，如WEBPACK FOOTER；module id（模块在数组中的索引） ；sourceURL（原js路径）。不会生成.map文件: 不包含列信息，同时 loader 的 sourcemap 也被简化为只包含对应行的。最终的 sourcemap 只有一份，它是 webpack 对 loader 生成的 sourcemap 进行简化，然后再次生成的。