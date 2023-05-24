import * as vscode from "vscode";

export default function () {
  let options: vscode.InputBoxOptions = {
    prompt: "Insert bearer token from https://huggingface.co",
  };
  vscode.commands
    .executeCommand("vscode.open", vscode.Uri.parse("https://huggingface.co/settings/tokens"))
    .then(() => vscode.window.showInputBox(options))
    .then((value) => {
      if(!value){
        return;
      }
      vscode.workspace
        .getConfiguration("argcoder")
        .update("bearertoken", value, vscode.ConfigurationTarget.Global);
    });
}
