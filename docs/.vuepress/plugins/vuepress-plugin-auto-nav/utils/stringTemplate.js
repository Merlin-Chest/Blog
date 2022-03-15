var commonTop = function (config) { return "---\ntitle: " + config.title + "\n---\n## \u8BE5\u7AE0\u8282\u5305\u542B\u4EE5\u4E0B\u5185\u5BB9"; };
var READMETemplate = function (config, title) {
    if (config['files'].length === 0 && config['folders'].length === 0)
        return '';
    return commonTop({ title: title }) + "\n  \n  " + config['files'].map(function (item) { return "\n- [".concat(item.replace('.md', ''), "](").concat(item, ")\n\n  "); }).join('') + config['folders'].map(function (item) {
        var itemsTemplate = item.items.map(function (child) { return "\n- [".concat(child.replace('.md', ''), "](").concat(item.link + '/' + child, ")\n\n  "); }).join('');
        return "\n#### [".concat(item.title, "\u4E13\u9898](").concat(item.link, ")\n    ") + itemsTemplate;
    }).join('');
};
export default {
    READMETemplate: READMETemplate
};
