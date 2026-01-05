try {
    console.log('--- Trying main entry ---');
    const main = require('@analogjs/vite-plugin-angular');
    console.log('Main Default:', typeof main.default);
    console.log('Main Angular:', typeof main.angular);

    console.log('--- Trying /plugin entry ---');
    const plugin = require('@analogjs/vite-plugin-angular/plugin');
    console.log('Plugin keys:', Object.keys(plugin));
    console.log('Plugin Angular:', typeof plugin.angular);
} catch (e) {
    console.error(e.message);
}
