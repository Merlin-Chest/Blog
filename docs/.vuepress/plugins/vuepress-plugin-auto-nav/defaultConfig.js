var defaultOptions = {
    subNavShow: [],
    ignoreFolders: [],
    deep: 2,
};
function setOptions(options) {
    defaultOptions = options;
}
function getOptions() {
    return defaultOptions || {};
}
export { defaultOptions, setOptions, getOptions };
