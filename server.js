var bodyParser   = require("body-parser"),
methodOverride   = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose         = require("mongoose"),
express          = require("express"),
app              = express();

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default:Date.now}
});


var blog = mongoose	.model("Blog", blogSchema);

//RESTFUL ROUTES
//INDEX ROUTE
app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	blog.find({},function(err,blogs){
		if(err){
			console.log("Error")
		} else {
			res.render("index",{blogs:blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
	blog.create(req.body.blog, function(err, newb){
		if(err){
			console.log(err);
		} else {
			res.redirect("/blogs")
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	blog.findById(req.params.id,function(err,fblog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: fblog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	blog.findById(req.params.id, function(err, fblog){
		if(err){
			console.log(err);
		} else {
			res.render("edit", {blog: fblog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(5005,function(req,res){
	console.log("BLOG!");
});