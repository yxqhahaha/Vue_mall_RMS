/*
import Vue from 'vue';
import {Button,
    Form,
    FormItem,
    Input,
    Message,
    Header,
    Container,
    Avatar,
    Submenu,
    MenuItem,
    MenuItemGroup,


} from 'element-ui';
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Header);
Vue.use(Container);
Vue.use(Avatar);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
//  Message需要挂载到全局
Vue.prototype.$message = Message;
*/

// 导入time组件
// import Timeline from './timeline/index.js';
// import TimelineItem from './timeline-item/index.js';

import Vue from 'vue';
import {Message,  MessageBox} from 'element-ui'

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
// Vue.use(Timeline);
// Vue.use(TimelineItem);