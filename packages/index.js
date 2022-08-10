import JButton from './button';

const components = [
    JButton
]
const install = (Vue) => {
    components.forEach(component => {
        Vue.use(component);
    })
}

export default {
    install,
    ...components
}
