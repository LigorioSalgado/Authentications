const jwt = require("jsonwebtoken");
const User = require('./models/Users');


const SECRET_KEY = "gnYaG1cokvZfeOUgXJAtHaVJqmlfBID7vLcG5NDu"

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};


const createToken = ({ email, first_name , _id}) => {

	const exp = new Date().addDays(1).getTime();

	const payload = {
		_id,
		email,
		first_name,
		exp
	};

	return jwt.sign(payload, SECRET_KEY);

};


const verifyToken = async (req,res,next) => {
try{
	const Authorization = req.get("Authorization");
	if (Authorization) {
		const token = Authorization.replace("JWT ", "");
		const payload = jwt.verify(token, SECRET_KEY);
		const user =  await User.findById(payload._id)
		if(!user) res.status(401).json({message:"User not found"});
		req.user = user
		next();

	}else{
		res.status(401).json({message:"Authorization header not provided"})
	}
}catch(e){
	res.status(401).json({message:"JWT invalid"})
}

}


module.exports = {
	createToken,
	verifyToken
}


