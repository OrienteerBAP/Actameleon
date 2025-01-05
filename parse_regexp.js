import fs from 'fs';
import path from 'path';

const mdFilePath = 'src/assets/fools.md';
const jsonFilePath = 'src/assets/fools.json';

function parseMarkdownToJSON(mdContent) {
  const lines = mdContent.split('\n');
  const jsonResult = {
    playTitle: '',
    author: '',
    description: '',
    acts: []
  };

  function unescapeMarkdown(text) {
    return text
      .replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1'); // Unescape common markdown characters
  }

  let currentAct = null;
  let currentScene = null;
  let actNumber = 1;
  let sceneNumber = 1;
  let lastActor = null;

  lines.forEach(line => {
    line = unescapeMarkdown(line.trim());
    if(line.startsWith('# ')) {
        if (currentAct) {
            if (currentScene) {
              currentAct.scenes.push(currentScene);
            }
            jsonResult.acts.push(currentAct);
            currentScene = null;
        }
        currentAct = {
            actTitle: line.replace('# ', ''),
            actNumber: actNumber++,
            scenes: []
        };
        currentScene = null;
        lastActor = null;
    }
    else if (line.startsWith('## ')) {
        if (currentScene) {
            currentAct.scenes.push(currentScene);
        }
        currentScene = {
            sceneTitle: line.replace('## ', ''),
            sceneNumber: sceneNumber++,
            setting: null,
            lines: []
        };
        lastActor = null;
    }
    else if (currentAct && currentScene && line.length > 0) {         
        const lineMatch = line.match(/\*\*(.*?)\*\*\s*(?:\*\(?(.*?)\)?\*\s*)?\.?\s*(.*)/);
        const settingMatch = line.match(/\*(.*)\*/);
        if (lineMatch) {
            const actor = lineMatch[1];
            const setting = lineMatch[2] || null;
            const text = lineMatch[3];
            currentScene.lines.push({ actor, setting, text });
            lastActor = actor;
        } else if (settingMatch && currentScene.lines.length > 0) {
            const setting = settingMatch[1];
            currentScene.lines.push({ setting });
        } else {
            if (currentScene.lines.length === 0) {
                currentScene.setting = currentScene.setting ? `${currentScene.setting}\n${line}` : line;
            } else {
                currentScene.lines.push({ actor : lastActor , text: line });
            }
        }
    } else {
        console.log(`Ignored line: ${line}`);
    }

  });

  if (currentScene) {
    currentAct.scenes.push(currentScene);
  }
  if (currentAct) {
    jsonResult.acts.push(currentAct);
  }

  return jsonResult;
}

// Get command-line arguments
const args = process.argv.slice(2);
const inputFilePath = args[0] || mdFilePath;
const outputFilePath = args[1] || jsonFilePath;

console.log(`Reading from ${inputFilePath} and writing to ${outputFilePath}`);

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file from disk: ${err}`);
  } else {
    const jsonData = parseMarkdownToJSON(data);
    fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(`Error writing JSON to file: ${err}`);
      } else {
        console.log(`JSON data has been written to ${outputFilePath}`);
      }
    });
  }
});
