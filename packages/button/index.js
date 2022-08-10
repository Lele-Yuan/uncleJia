import JButton from './button.vue';

JButton.install = (App) => {
	App.component(JButton.name, JButton);
};

export default JButton;