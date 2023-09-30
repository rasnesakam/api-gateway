import { Request, Response, Router } from "express"
import bodyParser from  "body-parser"
import * as QueryString from "querystring"
import * as appConfig from "../config/appconfig.json"
import fetch from "node-fetch"

const router = Router();
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

interface Resource {
	name: string
	extraParams: string
	extraQueries: string
	headers: any
	body: any
}

interface ResponseBody {
	message: string
	content: any
}

function parseRequest(req:Request): Resource{
	let extraParams = req.params[0];
	let extraQueries = "";
	let queries = Object.entries(req.query);
	if (queries.length > 0){
		for (const [key,value] of queries){
			extraQueries = extraQueries.concat(`${key}=${value}&`);
		}
	}
	return {name:req.params.resource,extraQueries, extraParams, body: req.body, headers: req.headers};
}

function getUrl(resource: Resource){
	let url = (appConfig.resources as any)[resource.name];
	if (resource.extraParams.length > 0)
		url = url.concat(`/${resource.extraParams}`);
	if (resource.extraQueries.length > 0){
		url = url.concat(`?${resource.extraQueries}`);
	}
	return url;
}

function redirect(resource: Resource, method: string, res: Response<ResponseBody>){
	if (!appConfig.resources.hasOwnProperty(resource.name)){
		res.status(404).send({message: "Resource not found",content: null})
		return;
	}
	let url = getUrl(resource);
	fetch(url,{
		method,
		headers: resource.headers,
		body: resource.body
	}).then(response => {
		res.status(response.status).send({message: response.statusText,content: response.json()})
	})
}

router.route("/:resource/*").get(async (req: Request,res: Response) => {
	let resource = parseRequest(req);
	redirect(resource,"GET",res);
});
router.route("/:resource/:extraQuery").post(async (req: Request,res: Response) => {});
router.route("/:resource/:extraQuery").put(async (req: Request,res: Response) => {});
router.route("/:resource/:extraQuery").delete(async (req: Request,res: Response) => {});

export default router;