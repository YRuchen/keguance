// useMarkdown.ts
import { nextTick } from 'vue'
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-bash.js'
import 'prismjs/plugins/toolbar/prism-toolbar.css'
import 'prismjs/plugins/toolbar/prism-toolbar.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'

export function useMarkdown() {
  const md = new MarkdownIt({
    html: true, // 允许 HTML 标签
    highlight: (str: string, lang: string) => {
      if (lang && Prism.languages[lang]) {
        return `<pre class="language-${lang}"><code>${Prism.highlight(
          str,
          Prism.languages[lang],
          lang,
        )}</code></pre>`
      }
      return `<pre class="language-text"><code>${md.utils.escapeHtml(str)}</code></pre>`
    },
  })

  /**
   * 渲染 Markdown 为 HTML 并执行
   * @param text Markdown 文本
   * @returns HTML 字符串
   */
  const renderMarkdown = (text: string) => {
    const html = md.render(text)
    nextTick(() => {
      Prism.highlightAll()
    })
    return html
  }

  return {
    renderMarkdown,
  }
}
