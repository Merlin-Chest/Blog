# cheap-source-map

不支持IE8  可以设断点调试，不显示列信息，每个js模块代码用eval()执行，并且在生成的每个模块代码尾部加上注释，如WEBPACK FOOTER；module id（模块在数组中的索引） ；sourceURL（原js路径）。不会生成.map文件: 可以设断点调试，不显示列信息，生成相应的.Map文件，可参考source-map，不包含 loader 的 sourcemap