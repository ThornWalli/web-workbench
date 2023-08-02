export function getDisk (name) {
  return import(`./${name}/index.js`).then(module => module.default);
}
