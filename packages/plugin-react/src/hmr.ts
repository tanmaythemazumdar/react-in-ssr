export const wrapHMR = (code: string): string => {
  const result = `import { createSignatureFunctionForTransform, register } from '/refresh.js';

const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;

window.$RefreshReg$ = (type, id) => {
  // Note module.id is webpack-specific, this may vary in other bundlers
  register(type, id);
}
window.$RefreshSig$ = createSignatureFunctionForTransform;

if (!window.$RefreshReg$) {
  throw new Error('React refresh preamble was not loaded. Something is wrong.');
}


${code}
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
`

  return result
}
