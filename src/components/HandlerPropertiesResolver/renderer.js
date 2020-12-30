const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// add custom here
const customRenderers = {};

const renderers = {
  DefaultView: () => import(/* webpackChunkName: "handlers-resolver" */'./Default/View.vue'),
  DefaultEdit: () => import(/* webpackChunkName: "handlers-resolver" */'./Default/Edit.vue'),
  ...customRenderers,
};

export default function getRenderer(type, handlerId) {
  const customName = `${capitalize(handlerId)}${capitalize(type)}`;
  const defaultName = `Default${capitalize(type)}`;

  const customIsExist = Object.keys(renderers).includes(customName);

  return customIsExist ? renderers[customName] : renderers[defaultName];
}
