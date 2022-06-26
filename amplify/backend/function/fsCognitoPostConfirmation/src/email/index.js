const fs = require('fs')
const path = require('path')

const getTemplate = (templateID) => {
  const templateRaw = fs.readFileSync(path.resolve(__dirname, `${templateID}.html`), 'utf8')
  return {
    subject: templateRaw.substring(0, templateRaw.indexOf('\n')),
    body: templateRaw.substring(templateRaw.indexOf('\n') + 1)
  }
}

const templates = {
  accountCreation: getTemplate("accountCreation")
}

const getContent = (templateID, entities) => {
  const result = { ...templates[templateID] };
  const entitiesKeyValuePairs = Object.entries(entities);
  entitiesKeyValuePairs.forEach(([key, value]) => {
    const replacementRegex = new RegExp(`\\[${key}\\]`, 'g');
    result.subject = result.subject.replace(replacementRegex, value);
    result.body = result.body.replace(replacementRegex, value);
  });
  return result;
};

module.exports = { getContent };
