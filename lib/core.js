const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio');
const hash = require('hash-sum')
const LRU = require('lru-cache')
const hljs = require('highlight.js')

// markdown-it 插件
const anchor = require('markdown-it-anchor')

// 自定义块
const containers = require('./container')

const md = require('markdown-it')({
  html: true,
  // 代码高亮
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>'
      } catch (__) {}
    }

    return '<pre v-pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})
  // 使用 anchor 插件为标题元素添加锚点
  // .use(anchor, {
  //   permalink: true,
  //   permalinkBefore: true,
  //   permalinkSymbol: '#'
  // })
  // 定义自定义的块容器
  .use(containers)

const cache = LRU({ max: 1000 })

/**
 * html => vue file template
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
const renderVueTemplate = function(html) {
  var $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  });

  var output = {
    style: $.html('style'),
    // get only the first script child. Causes issues if multiple script files in page.
    script: $.html($('script').first())
  };
  var result;

  $('style').remove();
  $('script').remove();

  result =
    `<template>\n` +
    `<div class="content">\n`+
    $.html()+
    `</div>\n` +
    `</template>\n` +
    output.style +
    '\n' +
    output.script;

  return result;
};

module.exports = function (source) {
  const file = this.resourcePath
  const key = hash(file + source)
  const cached = cache.get(key)

  source = source.replace(/:::\s?(demo|api)\s?([^]+?):::/g, '')

  // 重新模式下构建时使用缓存以提高性能
  if (cached && (/\?vue/.test(this.resourceQuery))) {
    return cached
  }
  source = md.render(source)
  
  const html = renderVueTemplate(source)
  console.log(html)
  cache.set(key, html)
  return html
}