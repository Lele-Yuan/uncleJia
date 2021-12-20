/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
interface Window {
  $message: any;
  $loading: any;
  showOpenFilePicker: any;
  showSaveFilePicker: any;
}