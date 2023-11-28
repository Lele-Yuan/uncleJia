import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/base.less';
import 'element-plus/theme-chalk/index.css';
import lang from 'element-plus/lib/locale/lang/zh-cn';
import UncleJia from '@unclejia/components';
import '@unclejia/components/lib/style.css';
import {
    ElButton,
    ElButtonGroup,
    ElLink,
    ElDialog,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElCheckbox,
    ElTag,
    ElForm,
    ElFormItem,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElTabs,
    ElTabPane,
    ElTooltip,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElMessage,
    ElLoading,
    ElMenu,
    ElMenuItemGroup,
    ElMenuItem,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElDatePicker,
    ElUpload,
    ElPopover,
    ElTree,
    ElCheckboxGroup,
    ElSlider
} from 'element-plus';
const components = [
    ElButton,
    ElButtonGroup,
    ElLink,
    ElDialog,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElOption,
    ElRadio,
    ElRadioGroup,
    ElCheckbox,
    ElTag,
    ElForm,
    ElFormItem,
    ElTable,
    ElTableColumn,
    ElPagination,
    ElTabs,
    ElTabPane,
    ElTooltip,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElMenu,
    ElMenuItemGroup,
    ElMenuItem,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElDatePicker,
    ElUpload,
    ElPopover,
    ElTree,
    ElCheckboxGroup,
    ElSlider
];

window.$message = ElMessage;
window.$loading = ElLoading;

import widget from '../packages'

const instance = createApp(App).use(store).use(router).use(widget).use(UncleJia);
components.forEach(component => {
    instance!.component(component.name, component);
});
instance.mount('#app')
