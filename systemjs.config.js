(function(global) {
    var map = {
        'app': 'js/app',
        'rxjs': 'js/vendor/rxjs',
        '@angular': 'js/vendor/@angular',
        'socket.io-client': 'js/vendor/socket.io-client'
    };

    var packages = {
        'app': { main: 'boot.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'socket.io-client': { main: 'socket.io.js', defaultExtension: 'js' },
        //'socket.io-parser': { main: 'index.js', defaultExtension: 'js' },
        '@angular/common': { main: 'index.js', defaultExtension: 'js' },
        '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
        '@angular/core': { main: 'index.js', defaultExtension: 'js' },
        '@angular/http': { main: 'index.js', defaultExtension: 'js' },
        '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
        '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
        '@angular/router': { main: 'index.js', defaultExtension: 'js' },
        '@angular/testing': { main: 'index.js', defaultExtension: 'js' },
        '@angular/upgrade': { main: 'index.js', defaultExtension: 'js' },
        '@angular/forms': { main: 'index.js', defaultExtension: 'js' }
    };

    var config = {
        map: map,
        packages: packages
    };

    System.config(config);
}(this));