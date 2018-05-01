webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ".result-container {\n    padding: 10px;\n}\n\nmat-card {\n    margin-bottom: 10px;\n}\n\nform {\n    width: 100%;\n    margin: 0 5%;\n}\n\nform input {\n    width: 100%;\n    font-size: 22px;\n    padding: 5px 12px;\n    font-family: 'Hind Vadodara', sans-serif !important;\n    border: 0;\n    border-radius: 4px;\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\" class=\"app-toolbar\">\n  <button mat-icon-button (click)=\"snav.toggle()\">\n    <mat-icon>menu</mat-icon>\n  </button>\n\n  <form [formGroup]=\"form\">\n    <input formControlName=\"queryInput\" />\n  </form>\n\n  <button mat-icon-button (click)=\"snav.toggle()\">\n    <mat-icon>account_circle</mat-icon>\n  </button>\n</mat-toolbar>\n\n<mat-sidenav-container class=\"example-sidenav-container\" [style.marginTop.px]=\"mobileQuery.matches ? 0 : 0\">\n  <mat-sidenav #snav [mode]=\"mobileQuery.matches ? 'over' : 'side'\" [fixedInViewport]=\"mobileQuery.matches\" fixedTopGap=\"0\">\n    <mat-nav-list>\n      <a mat-list-item routerLink=\".\">Kaj</a>\n    </mat-nav-list>\n  </mat-sidenav>\n\n  <mat-sidenav-content>\n    <div class=\"result-container\">\n      <p style=\"margin-bottom: 10px\">{{ resultHeaderTitle }}</p>\n      <mat-card (click)=\"play(item)\" *ngFor=\"let item of items\">\n        <img [src]=\"item.snippet.thumbnails.medium.url\" alt=\"\">\n        <div>\n          <h4>{{ item.snippet.title }}</h4>\n        </div>\n      </mat-card>\n    </div>\n  </mat-sidenav-content>\n</mat-sidenav-container>\n\n<div style=\"position: fixed;bottom: 0;width:100%;z-index: 100\">\n  <mat-toolbar color=\"primary\" class=\"info-toolbar\">\n    <h3 style=\"width: 100%;\">\n      {{ info ? info.title : '...' }}\n      <a (click)=\"repeat()\" style=\"float: right;\">\n        <mat-icon style=\"vertical-align: middle;\">replay</mat-icon>\n      </a>\n    </h3>\n  </mat-toolbar>\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_youtube_node__ = __webpack_require__("./node_modules/youtube-node/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_youtube_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_youtube_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_operators__ = __webpack_require__("./node_modules/rxjs/_esm5/operators.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_observable_timer__ = __webpack_require__("./node_modules/rxjs/_esm5/observable/timer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shared_shared_service__ = __webpack_require__("./src/app/shared/shared.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var AppComponent = /** @class */ (function () {
    function AppComponent(http, sharedService, ngZone) {
        this.http = http;
        this.sharedService = sharedService;
        this.ngZone = ngZone;
        this.radixUrl = "http://192.168.0.16:8080";
        this.items = [];
        this.info = { title: null };
        this.mobileQuery = {
            matches: true
        };
        this.form = new __WEBPACK_IMPORTED_MODULE_7__angular_forms__["c" /* FormGroup */]({
            queryInput: new __WEBPACK_IMPORTED_MODULE_7__angular_forms__["b" /* FormControl */]()
        });
        this.youTube = new __WEBPACK_IMPORTED_MODULE_2_youtube_node__();
        this.youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.info.title = "Getting info...";
        var lastQuery = localStorage.getItem('query');
        if (lastQuery) {
            this.info.title = lastQuery;
            this.searchYoutube(this.info.title);
            this.form.get("queryInput").setValue(this.info.title);
        }
        this.sharedService.getInfo().subscribe(function (res) {
            _this.info = res;
            if (!_this.info.title) {
                _this.info.title = "No title info";
            }
        });
        this.form.get("queryInput").valueChanges.pipe(Object(__WEBPACK_IMPORTED_MODULE_4_rxjs_operators__["a" /* debounce */])(function () { return Object(__WEBPACK_IMPORTED_MODULE_5_rxjs_observable_timer__["a" /* timer */])(1000); })).subscribe(function (value) {
            _this.searchYoutube(value);
        });
    };
    AppComponent.prototype.searchYoutube = function (query) {
        var _this = this;
        this.resultHeaderTitle = "Searching...";
        var o = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["a" /* Observable */](function (observer) {
            _this.youTube.search(query.replace(" ", "+"), 50, function (error, result) {
                if (error) {
                    observer.error(error);
                }
                else {
                    observer.next(result.items);
                }
                observer.complete();
            });
        });
        o.subscribe(function (items) {
            _this.ngZone.run(function () {
                _this.items = items;
                _this.items = _this.items.filter(function (i) { return i.id.videoId; }); // filter only videos (not channels in results)
                localStorage.setItem('query', query);
                _this.resultHeaderTitle = "Results:" + _this.items.length;
            });
        });
    };
    AppComponent.prototype.play = function (value) {
        var _this = this;
        this.info.title = "In progress...";
        this.http.get(this.radixUrl + "/youtube?id=" + value.id.videoId, {}).subscribe(function (res) {
            _this.info.title = value.snippet.title;
        }, function (err) { return alert; });
    };
    AppComponent.prototype.repeat = function () {
        console.log("should repeat");
    };
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_6__shared_shared_service__["a" /* SharedService */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgZone */]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__shared_shared_module__ = __webpack_require__("./src/app/shared/shared.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["H" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_5__shared_shared_module__["a" /* SharedModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__("./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_service__ = __webpack_require__("./src/app/shared/shared.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["H" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_common__["a" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["a" /* MatButtonModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MatCheckboxModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["i" /* MatSidenavModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["h" /* MatMenuModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["e" /* MatIconModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["j" /* MatToolbarModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["g" /* MatListModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MatCardModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["d" /* MatFormFieldModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["f" /* MatInputModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["j" /* ReactiveFormsModule */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["a" /* MatButtonModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["c" /* MatCheckboxModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["i" /* MatSidenavModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["h" /* MatMenuModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["e" /* MatIconModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["j" /* MatToolbarModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["g" /* MatListModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MatCardModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["d" /* MatFormFieldModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_material__["f" /* MatInputModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["j" /* ReactiveFormsModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_3__shared_service__["a" /* SharedService */]],
            declarations: []
        })
    ], SharedModule);
    return SharedModule;
}());



/***/ }),

/***/ "./src/app/shared/shared.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SharedService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SharedService = /** @class */ (function () {
    function SharedService(http) {
        this.http = http;
        this.host = "http://192.168.0.16:8080";
    }
    SharedService.prototype.getInfo = function () {
        return this.http.get(this.host);
    };
    SharedService.prototype.play = function () {
        return this.http.get(this.host);
    };
    SharedService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], SharedService);
    return SharedService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_12" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map