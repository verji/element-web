const fs = require('fs');
const path = require('path');

const langFilesDir = path.join(__dirname, 'langFiles');
let allLangs = {};
const files = fs.readdirSync(langFilesDir);

/**
 * Flattens a nested object into a single-level object.
 * @param {Object} obj - The object to be flattened.
 * @param {string} [parentKey=''] - The parent key used for nested properties.
 * @returns {Object} - The flattened object.
 */
function flattenObject(obj, parentKey = '') {
    let flattened = {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName  = parentKey ? `${parentKey}|${key}` : key;

            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(flattened, flattenObject(obj[key], propName));
            } else {
                flattened[propName] = obj[key];
            }
        }
    }
    return flattened;
}

/**
 * Merges translations from multiple languages into a single object.
 *
 * @param {Object} translations - An object containing translations for multiple languages.
 * @returns {Object} - The merged translations object.
 */
function mergeTranslations(translations) {
    const result = {};
    const queue = [];

    for (const [lang, values] of Object.entries(translations)) {
        const langCode = lang.replace('.json', '');
        queue.push({ values, path: [], langCode });
    }

    while (queue.length > 0) {
        const { values, path, langCode } = queue.shift();

        for (const [key, value] of Object.entries(values)) {
            const newPath = [...path, key];

            if (typeof value === 'object' && !Array.isArray(value)) {
                queue.push({ values: value, path: newPath, langCode });
            } else {
                let current = result;
                for (let i = 0; i < newPath.length; i++) {
                    const part = newPath[i];
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }
                current[langCode] = value;
            }
        }
    }

    return result;
}

files.forEach((file) => {
    if (file.endsWith('.json')) {
        const filePath = path.join(langFilesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        allLangs[file] = flattenObject(JSON.parse(fileContent));
    }
});

allLangs = mergeTranslations(allLangs);

fs.writeFileSync('./i18n/verjiTranslations.json', JSON.stringify(allLangs, null, 4), 'utf-8');

// const verjiTranslations = JSON.parse(fs.readFileSync('./i18n/verjiTranslations.json', 'utf-8'));
// console.log("verjiTranslations", verjiTranslations);
console.info('Merged and formatted translations written to ./i18n/verjiTranslations.json');
