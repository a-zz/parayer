const PROXY_CONFIG = [
	{
		context: ["/_info", "/_usrauth", "/_data", "/_uuid", "/_test" ],
		target: "http://localhost:3000",
		secure: false
	}
]

module.exports = PROXY_CONFIG;