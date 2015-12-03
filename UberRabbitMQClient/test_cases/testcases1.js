var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3000/");



describe("Check for home page", function(){
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
//
//describe("checking rider login", function(){
//	it("test signin", function(done){
//		server
//			.post("/checkRiderLogin")
//			.send({ email: 'deepika@gmail.com', password : '12345'})
//			.expect(200)
//			.end(function(err, res){
//				console.log("Login success "+res);
//				should(res.status).equal(200);		
//				done();
//			})	
//	});
//});
//
//describe("checking Driver login", function(){
//	it("test signin", function(done){
//		server
//			.post("/checkRiderLogin")
//			.send({ email: 'deepika@gmail.com', password : '12345'})
//			.expect(200)
//			.end(function(err, res){
//				console.log("Login success "+res);
//				should(res.status).equal(200);		
//				done();
//			})	
//	});
//});
////describe("First test", function(){
////	it("return home page", function(done){
////		server
////			.get("/")
////			.expect(200)
////			.end(function(err, res){
////				console.log("Res "+res);
////				should(res.status).equal(200);		
////				done();
////			})	
////	});
////});
////
////describe("First test", function(){
////	it("return home page", function(done){
////		server
////			.get("/")
////			.expect(200)
////			.end(function(err, res){
////				console.log("Res "+res);
////				should(res.status).equal(200);		
////				done();
////			})	
////	});
////});
////
////describe("First test", function(){
////	it("return home page", function(done){
////		server
////			.get("/")
////			.expect(200)
////			.end(function(err, res){
////				console.log("Res "+res);
////				should(res.status).equal(200);		
////				done();
////			})	
////	});
////});
////
////describe("First test", function(){
////	it("return home page", function(done){
////		server
////			.get("/")
////			.expect(200)
////			.end(function(err, res){
////				console.log("Res "+res);
////				should(res.status).equal(200);		
////				done();
////			})	
////	});
////});
//
describe("check user login", function(){
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
describe("Check customer login", function(){
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
describe("get drivers", function(){
	it("return home page", function(done){
		server
			.get("/")
			.expect(200)
			.end(function(err, res){
				console.log("Res "+res.code);
				should(res.status).equal(200);		
				done();
			})	
	});
});