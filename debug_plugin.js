try {
    const pkg = require('@analogjs/vite-plugin-angular');
    console.log('Keys:', Object.keys(pkg));
    console.log('Type of angular:', typeof pkg.angular);
    console.log('Type of default:', typeof pkg.default);
    console.log('Pkg:', pkg);
} catch (e) {
    console.error(e);
}
