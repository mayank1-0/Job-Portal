var createError = require("http-errors");
var express = require("express");
var path = require("path"); //path module is imported and stored in 'path' variable
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressLayouts = require("express-ejs-layouts"); //importing express-ejs-layouts.
var session = require("express-session");
var methodOverride = require('method-override');
require("dotenv").config();

var indexRouter = require("./routes/index"); //imports ./routes/index module here, in app.js ------ DONE!
var usersRouter = require("./routes/users"); //imports ./routes/users module here, in app.js
var dashboardRouter = require("./routes/dashboard"); //imports ./routes/users module here, in app.js
var applicationRouter = require("./routes/applications");
var openingRoute = require("./routes/openings");
var publicURLRouter = require("./routes/publicURL");

const db = require("./db/models/index");

var app = express(); //an instance of express is created 'app'

app.use(methodOverride('_method'));

app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: "XCR3rsasa%RDHHH",
		cookie: {},
	})
);

app.set("views", path.join(__dirname, "views")); //Here, 'views' is the application's views for which we provide the directory path. Here, 'app.set()' sets the property or
// application's views to the path 'path.join(__dirname, 'views')' i.e /myapp3/views. Here __dirname is the directory in which the currently executing script resides.

app.set("view engine", "ejs"); //sets the property 'view engine' to 'ejs'. 'view engine' means whatever extension we assign to files in 'views' folder. Sets files in ./views to ejs files

app.use(expressLayouts); //enables us to use Layouts.

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //any static files are found in public folder. _dirname should be joined to 'public'.

app.use(function (req, res, next) {
	res.set("Cache-Control", "private, no-cache, no-store, must-revalidate"); //means browser will not store data in cache(history) i.e when we press back or forward button in browser, it will not take us to previous page.
	next();
});

app.use("/", indexRouter); //means whenever we write localhost:3000/ in browser, indexRouter is run ---- DONE!
app.use("/users", usersRouter); //means whenever we write localhost:3000/users in browser, usersRouter is run -- DONE!
app.use("/users", dashboardRouter); //means whenever we write localhost:3000/users/dashboard in browser, dashboardRouter is run
app.use("/applications", applicationRouter);
app.use("/openings", openingRoute);
app.use("/join-us", publicURLRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404)); //whenever a route, etc fails an 404 error will be created and error.ejs will be rendered.
});

db.sequelize.sync({});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app; //make 'app' object available for imports in other files
