let project_folder="dist";
let source_folder="#src";
let path ={
build:{
    html:project_folder+"/",
    css:project_folder+"/css/",
    js:project_folder+"/js/",
    img:project_folder+"/img/",
    fonts:project_folder+"/fonts/",
},
src:{
    html:[source_folder+ "/*.html","!"+source_folder+"/_*.html"],
    css:source_folder+"/scss/style.scss",
    js:source_folder+"/js/script.js",
    img:source_folder+"/img/**/*.{jpg,png,gif,jpeg}",
    fonts:source_folder+"/fonts/*.ttf",
},
watch:{
    html:source_folder+ "/**/*.html",
    css:source_folder+"/scss/**/*.scss",
    js:source_folder+"/js/**/*.js",
    img:source_folder+"/img/**/*.{jpg,png,gif}",
},
clean:"./"+project_folder+"/"
}
let {src,dest}=require('gulp'),
gulp=require('gulp'),
browsersync=require("browser-sync").create(),
fileinclude=require("gulp-file-include"),
scss=require('gulp-sass')(require('sass')),
autoprefixer=require("gulp-autoprefixer"),
rename=require("gulp-rename"),
uglify=require("gulp-uglify-es").default,
imagemin=require("gulp-imagemin"),
ttf2woff=require("gulp-ttf2woff"),
ttf2woff2=require("gulp-ttf2woff2");
function browserSync1(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
         },
        port: 3000,
        notify: false
    });
}
function html(){
return src(path.src.html)
.pipe(fileinclude())
.pipe(dest(path.build.html))
.pipe(browsersync.stream())
}
function css(){
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle:"expanded"
        })
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist:["last 2 versions"],
            cascade:false
        })
    )
    .pipe(
        rename({
            extname:"min.css"
        })
    )
.pipe(dest(path.build.css))
.pipe(browsersync.stream())
}
function js(){
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
        uglify()
    )
    .pipe(
        rename({
            extname:"min.js"
        })
    ) 
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
    }
    function image(){
        return src(path.src.img)
        .pipe(
            imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
    }
        function fonts() {
            src(path.src.fonts)
            .pipe(ttf2woff())
            .pipe(dest(path.build.fonts));
            return src(path.src.fonts)
            .pipe(ttf2woff2())
            .pipe(dest(path.build.fonts));
        }
let build=gulp.series(gulp.parallel(css,html,js,image,fonts));
let watch=gulp.parallel(build,browserSync1);
exports.fonts=fonts;
exports.image=image;
exports.js=js;
exports.css=css;
exports.html=html;
exports.build=build;
exports.watch=watch;
exports.default=watch;