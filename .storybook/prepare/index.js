
import './style.pcss';

// OTHERS

// set nuxt process.client
process.client = true;

// add js--visible class for molecules and atoms
const STYLE_CLASSES_JS_VISIBLE = 'js--visible';
document.body.classList.add(STYLE_CLASSES_JS_VISIBLE);
