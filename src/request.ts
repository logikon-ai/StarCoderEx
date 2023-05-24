import fetch, { FetchError, Response } from "node-fetch";
import * as vscode from "vscode";
import updatetoken from "./updatetoken";

export default async (input: string): Promise<string | null> =>{
	console.log(`Input: ${input}`);
	let promise: Promise<Response>;
	try{
	promise = fetch(`${vscode.workspace.getConfiguration("argcoder").get("apiurl")}`,
		{
			// eslint-disable-next-line @typescript-eslint/naming-convention
			headers: { authorization: `Bearer ${vscode.workspace.getConfiguration("argcoder").get("bearertoken")}`, "content-type": "application/json" },
			method: "POST",
			body: JSON.stringify({inputs: input, parameters: {max_new_tokens: 800, num_beams: 3}}),
		});
	let response = await promise;
	if(response.status !== 200){
		console.log(`Response: ${response.statusText}`);
		if(response.status === 400){
		vscode.window.showErrorMessage(`Bearer invalid!`);
		// vscode.workspace.getConfiguration("argcoder").update("bearertoken", "", vscode.ConfigurationTarget.Global);
		// updatetoken();
		return null;
		}else {
			vscode.window.showWarningMessage("Service turned off right now. Try later!");
			updatetoken();
		}
	}
	let output = ((await response.json()) as ResponseModel[])[0].generated_text;
	console.log(`Output: ${output.length}`);
	return output;
	}catch(exception: any)
	{
		if(exception instanceof FetchError)
			{
				vscode.window.showErrorMessage(exception.message);
			}
		return null;
	}
};