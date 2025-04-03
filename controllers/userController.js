const getUser = async (req, res) => {
	// async makes a function return a Promise
	try {
		console.log(req.query); //returns query i.e ?name=rajesh&age=25
		const userInfo = { name: "mayank", age: 22, gender: "Male" }; //an object of various keys and values and req.params.userID returns /asdsad whatever is after slash i.e asdsad
		res.send({ status: 200, data: userInfo, message: "API Success Message" });
		//await db.insert(...); waits for db.insert() to execute completely until then next line or code isn't executed OR The keyword await makes JavaScript wait until that promise settles and returns its result.
	} catch (e) {
		res.send({ status: 500, data: e, message: "API Error Message" }); // We can either use res.render() or res.send().
	}
};
module.exports = { getUser }; //module.exports exports any literal, function or object as a module. getUser is a variable being exported, if we use getUser() we will return the function.
