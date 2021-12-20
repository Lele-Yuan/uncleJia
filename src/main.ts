import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/base.less';
import 'element-plus/theme-chalk/index.css';
import lang from 'element-plus/lib/locale/lang/zh-cn';
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
    ElCheckboxGroup
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
    ElCheckboxGroup
];

window.$message = ElMessage;
window.$loading = ElLoading;

const instance = createApp(App).use(store).use(router)
components.forEach(component => {
    instance!.component(component.name, component);
});
instance.mount('#app')
