var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var del = require("del");
var delEmpty = require("delete-empty");

var clientOptions = {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "public/js/app"
};

var appDev = "app";
var appProd = "public/js/app";
var appVendor = "public/js/vendor";

var vendorPackages = ["@angular", "core-js", "rxjs", "systemjs", "zone.js", "es6-shim", "reflect-metadata", "socket.io-client", "socket.io-parser"];

gulp.task("clean", function() {
    del("public/**/*");
});

gulp.task("copy-assets", function() {
    gulp.src([
            "systemjs.config.js"
        ])
        .pipe(gulp.dest("public"));

    gulp.src([
            "css/**/*.css"
        ])
        .pipe(gulp.dest("public/css"));

    return gulp.src([
            appDev + "/**/*.{html,css}"
        ])
        .pipe(gulp.dest(appProd));
});

gulp.task("delete-empty", function() {
    delEmpty("public", () => {});
});

gulp.task("vendor", function() {
    for (var package in vendorPackages) {
        gulp.src("node_modules/" + vendorPackages[package] + "/**")
            .pipe(gulp.dest(appVendor + "/" + vendorPackages[package]));
    }
});

gulp.task("lint", function() {
    gulp.src([
            "typings/index.d.ts",
            "server.ts",
            "models/**/*.ts",
            "routes/**/*.ts",
            "data/**/*.ts"
        ], { base: "./" })
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report());
});

gulp.task("ts-compile-server", function() {
    return gulp.src([
            "typings/index.d.ts",
            "server.ts",
            "models/**/*.ts",
            "routes/**/*.ts",
            "data/**/*.ts"
        ], { base: "./" })
        .pipe(ts())
        .js.pipe(gulp.dest("./"));
});

gulp.task("ts-compile-client", function() {
    return gulp.src([appDev + "/**/*.ts", "typings/index.d.ts"])
        .pipe(ts(clientOptions))
        .js.pipe(gulp.dest(appProd));
});

gulp.task("ts-compile", ["ts-compile-server", "ts-compile-client"]);

gulp.task("build-project", ["ts-compile", "copy-assets", "vendor"]);