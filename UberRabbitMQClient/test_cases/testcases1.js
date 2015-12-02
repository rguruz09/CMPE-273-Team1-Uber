var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3005/");



describe("First test", function(){
	it("return home page", function(done){
		server
			.get("/")
			.expect(200)
			.end(function(err, res){
				console.log("Res "+res);
				should(res.status).equal(200);		
				done();
			})	
	});
});


