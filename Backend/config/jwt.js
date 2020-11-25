const jwt = require('jsonwebtoken');
const serverJWT = "6QOXVy/E$@;`Z$*.}Jjm4RZb5iQutn<1rZg(I9RE:p#&BLZ[&Ri<:]+bh]b/V?*";


function PotpisiToken(JSONobjekat)
{
    return jwt.sign(JSONobjekat, serverJWT);
}


function ProveriToken(req, res, next)
{
  const authString = req.headers['authorization'];
	if (typeof authString === 'string' && authString.indexOf(' ') > -1) 
	{
	  const authArray = authString.split(' ');
	  const token = authArray[1];

	  jwt.verify(token, serverJWT, (err, decoded) => 
	  {
			if(err) 
				res.send({success: false});
			else 
			{
				req.decoded = decoded;
				next();
			}
	  });
	}
	else
		res.send({success: false});
}


module.exports.PotpisiToken = PotpisiToken;
module.exports.ProveriToken = ProveriToken;