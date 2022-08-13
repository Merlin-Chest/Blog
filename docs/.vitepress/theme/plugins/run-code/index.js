import { html_encode } from './utils/html-transform'
function CodeRunPlugin(md) {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const { content, info } = tokens[idx];
    if (info === 'js' || info.toLocaleLowerCase() === 'javascript') {
      return "<RunCode type=" + info + "><pre>" + html_encode(content) + "</pre></RunCode>"
    } else if (info === 'html') {
      return "<RunCode type=" + info + "><pre>" + html_encode(content) + "</pre></RunCode>"
    } else {
      return fence(tokens, idx, options, env, self);
    }
  }
}

export default CodeRunPlugin
