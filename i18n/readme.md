# mergeLanguages.js

The `mergeLanguages.js` script is a utility script used in this project to merge multiple language files into a single JSON file. This is useful for managing translations in our next version of Element-Web.

## How it works

The script works by reading all the language files in the `langFiles` directory. Each file is expected to be a JSON file containing key-value pairs where the key is a string in English and the value is the translated string.

The script then flattens each language file into a single-level object using the `flattenObject` function. This function takes a nested object and returns a new object where each key is a concatenation of the original nested keys, separated by '|'.

After all the language files have been flattened, the script merges them into a single object using the `mergeTranslations` function. This function takes an object where each key is a language code and the value is the flattened translations for that language. It returns a new object where each key is a string in English and the value is an object containing the translations for that string in all languages.

Finally, the script writes the merged translations to a file named `verjiTranslations.json`.

## How to run

To run the script before build, add a prestart script to `package.json`: 
`"prestart": "node ./i18n/mergeLanguages.js",`

You also need to make sure that Element-Web knows to look for `verjiTranslations.json`. To do this, add the following to `element-web\config.json`:
`    "custom_translations_url": "https://client.verji.local/i18n/verjiTranslations.json",`

```