const path = 'http://localhost';
// const path = 'http://weixin.shidanli.com';
const product_manager = ':8088/scoremanager';
const product_view = 'http://114.215.97.217:8081/scoremanager_ui';
const Common = {
    base_url : path + product_manager,
    img_url : product_view,
    getQueryString : function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    },
    localQuery : function (_that, name) {
        let value = '';
        if (!this.isEmpty(_that) &&
            !this.isEmpty(_that.props) &&
            !this.isEmpty(_that.props.location) &&
            !this.isEmpty(_that.props.location.query)) {
            value = _that.props.location.query[name];
        }
        if (this.isEmpty(value)) {
            value = this.getQueryString(name);
        }
        return value;
    },
    /**
     * 判断是不是空的或者undefined
     * @param obj
     * @returns {boolean}
     */

    isNull : function (obj) {
        return obj === null || typeof obj === 'undefined' || obj === undefined;
    },
    isEmpty : function (obj) {
        return this.isNull(obj) || obj === '';
    },

};
export default Common