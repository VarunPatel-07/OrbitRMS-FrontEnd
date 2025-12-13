declare module 'vite-plugin-eslint' {
  import { PluginOption } from 'vite';
  const plugin: () => PluginOption;
  export default plugin;
}
