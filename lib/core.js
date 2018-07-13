const cheerio = require('cheerio')
const loadUtils = require('loader-utils')
const hljs = require('highlight.js')

// 自定义块
const containers = require('./container')

const REGEXP_DEMO = /:::\s?demo\s?([^]+?):::/g
const REGEXP_TITLE = /([^]*)\n?(```[^]+```)/
const REGEXP_HTML = /[^]+\n?```\s?html\s?([^]+?)```/g

const md = require('markdown-it')({
  html: true,
  // 代码高亮
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
        )
      } catch (__) {}
    }

    return (
      '<pre v-pre class="hljs"><code>' +
      md.utils.escapeHtml(str) +
      '</code></pre>'
    )
  }
})
  // 定义自定义的块容器
  .use(containers)

function getDemoTag(source) {
  let demoTags = source.match(REGEXP_DEMO)
  return demoTags.map(i =>
    i.replace(REGEXP_DEMO, (match, p1, offset) => {
      return p1
    })
  )
}

/**
 * demo tags => vue template html
 * 示例：
 * ::: demo
 * ```html
 *  <button>123</button>
 * ```
 * :::
 * @param {*} source
 */
function getVueTemplateTags(source) {
  let template = getDemoTag(source)

  template = template.map(i => {
    const title = i.match(REGEXP_TITLE)[1]
    i = i.replace(REGEXP_HTML, (match, p1, offset) => {
      const $ = cheerio.load(p1, {
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false
      })

      $('script').remove()

      return (
        `<div class="za-panel">\n` +
        `<div class="za-panel-header"><div class="za-panel-title">${title}</div></div>\n` +
        `<div class="za-panel-body">` +
        $.html() +
        `</div>\n` +
        `</div>\n`
      )
    })

    return i
  })

  return template.join('')
}

/**
 * remove => demo script tags
 * @param {*} source
 */
function getMdDocs(source) {
  const $ = cheerio.load(source, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  })

  const output = {
    style: $.html('style'),
    script: $.html($('script').first())
  }

  $('style').remove()
  $('script')
    .first()
    .remove()

  return md.render($.html())
}

/**
 * html => vue file template
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
function renderToVueTemplate(source) {
  const $ = cheerio.load(source, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  })

  const output = {
    style: $.html('style'),
    script: $.html($('script').first())
  }

  const mdDocs = getMdDocs(source)
  const templateHtml = getVueTemplateTags(source)

  return (
    `<template>\n` +
    `<div>\n` +
    `<div class="zarm-vue-demo">` +
    `${templateHtml}` +
    `</div>` +
    `<div class="zarm-markdown-doc">` +
    `${mdDocs}` +
    `</div>` +
    `</div>\n` +
    `</template>\n` +
    output.style +
    '\n' +
    output.script
  )
}

module.exports = function(source) {
  this.cacheable && this.cacheable()
  const options = Object.assign({}, loadUtils.getOptions(this)) // 获取loader配置的options对象
  // ...
  source = renderToVueTemplate(source)
  // console.log(`mdDocs:\n${source}`)
  return source
}
