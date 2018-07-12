const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const loadUtils = require('loader-utils')
const hash = require('hash-sum')
const LRU = require('lru-cache')
const hljs = require('highlight.js')

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
// 定义自定义的块容器
.use(containers)

const cache = LRU({ max: 1000 })

/**
 * html => vue file template
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
function renderVueTemplate(source) {
  const $ = cheerio.load(source, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  });

  const output = {
    style: $.html('style'),
    script: $.html($('script').first())
  };
  let result;

  $('style').remove();
  $('script').remove();

  result = $.html();

  result = result.replace(/:::\s?api\s?([^]+?):::/g, '')
  result = result.replace(/:::\s?demo\s?([^]+?):::/g, (match, p1, offset) => {
    return p1;
  })
  result = result.replace(/```\s?html\s?([^]+?)```/g, (match, p1, offset) => {
    return p1;
  })

  return `<template>\n` +
    `<div class="content">\n`+
    `${result}`+
    `</div>\n` +
    `</template>\n` +
    output.style +
    '\n' +
    output.script;
};

module.exports = function (source) {
  this.cacheable()
  const file = this.resourcePath
  const options = loadUtils.getOptions(this); 
  const key = hash(file + source)
  const cached = cache.get(key)
  
  if (options && options.vueModel) {
    source = renderVueTemplate(source)
    return source
  }
  return source
};