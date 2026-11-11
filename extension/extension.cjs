const vscode = require('vscode');

async function pinReferences() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const sourceUri = editor.document.uri;
  const sourcePosition = editor.selection.active;
  const references = await vscode.commands.executeCommand(
    'vscode.executeReferenceProvider',
    sourceUri,
    sourcePosition,
  ) ?? [];
  const target = references.find(({ uri, range }) =>
    uri.toString() !== sourceUri.toString() || !range.contains(sourcePosition)
  ) ?? references[0];
  if (!target) return;

  await vscode.commands.executeCommand('closeReferenceSearch');
  const document = await vscode.workspace.openTextDocument(target.uri);
  const position = target.range.start;
  await vscode.window.showTextDocument(document, {
    preserveFocus: false,
    selection: new vscode.Selection(position, position),
  });
  await vscode.commands.executeCommand('references-view.findReferences');
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('cursorBrains.pinReferences', pinReferences),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
