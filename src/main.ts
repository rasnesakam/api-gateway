import express from "express";
import router from "./controller/ResourceController";

function main(){
	const app = express();
	const port = 3000;
	app.use('/',router);
	app.listen(port,() => {
		console.log(`listening on ${port}`)
	})
}
main();