export default function (name) {
  return import(`./${name}/index.js`).then(module => module.default);
}
