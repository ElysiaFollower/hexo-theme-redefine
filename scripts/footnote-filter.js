// use markdown-it only to render markdown syntax in footnote's content
// https://github.com/markdown-it/markdown-it

'use strict';

const md = require('markdown-it')({
  html: true
});

/**
 * Footnote renderer
 * Find Footnote and only render them
 * @param {string} text - the HTML after previous render 
 * @returns {string} - the HTML with footnotes rendered
 */
const FootnotesRenderer = (text) => {
  if (!text) {
    return text;
  }

  const footnotes = [];// records of all footnotes we find
  // use RegExp to find our target
  const reFootnoteContent = /\[\^(\d+)\]:\s*([\S\s]+?)(?=\[\^(?:\d+)\]|\n\n|$|<\/p>|<br>)/g; // 在遇到下一个[^2]或双换行或$或</p>或<br>的时候停止匹配 ;pattern example: [^1]: This is the first footnote.
  const reInlineFootnote = /\[\^(\d+)\]\((.+?)\)/g; //pattern example: [^1](https://example.com)
  const reFootnoteIndex = /\[\^(\d+)\]/g; // pattern example: [^1]

  // --- 1. collect data(footnote's reference content) ---
  // remove all the inline and reference footnote's content and generate footnotes at the bottom together at final
  let processedText = text;

  processedText = processedText.replace(reInlineFootnote, (match, index, content) => {
    footnotes.push({ index, content });
    return `[^${index}]`;
  });

  processedText = processedText.replace(reFootnoteContent, (match, index, content) => {
    footnotes.push({ index, content });
    return ''; // just remove
  });

  if (footnotes.length === 0) {
    return text;
  }

  // --- 2. build index map ---
  const indexMap = footnotes.reduce((map, note) => {
    if (map[note.index]) {
      hexo.log.warn(`Duplicate footnote index: ${note.index}`);
    }
    map[note.index] = note;
    return map;
  }, {});
  
  // --- 3. replace footnote with HTML ---
  // [^1] mark will be replaced with HTML
  let footnoteIdCounters = {};
  processedText = processedText.replace(reFootnoteIndex, (match, index) => {
    const footNote = indexMap[index];
    if (!footNote) {
      hexo.log.warn(`Invalid footnote index: ${index}`);
      return match;//do not change it
    }
    if (footnoteIdCounters[index] === undefined){
      footnoteIdCounters[index] = 0;
    }
    else{
      footnoteIdCounters[index]++;
    }
    const uniqueId = `${index}_${footnoteIdCounters[index]}`
    return `<sup id="fnref:${uniqueId}"><a href="javascript:void(0);" rel="footnote" onclick="footnote_rememberSource('${index}', '${uniqueId}'); footnote_jumpToAnchor('fn:${index}')">[${index}]</a></sup>`;
  });

  // --- 4. generate references list ---
  footnotes.sort((a, b) => a.index - b.index); // ascending order

  const listHtml = footnotes.map(footNote => {
    const content = md.renderInline(footNote.content.trim());// since the content may contain some markdown syntax, so we use markdown-it to render it 
    return  `<li id="fn:${footNote.index}">${content}`+
              `<a href="javascript:void(0);" onclick="footnote_returnToSource('${footNote.index}')"> ↩</a>`+
            `</li>`;
  }).join('');

  //get final result
  return processedText + 
         `<section class="footnotes">` +
          //`<hr class="footnotes-sep">` +
          `<ol class="footnotes-list">${listHtml}</ol>` +
         `</section>`;
};


// use 'before_post_render' hook, ensure it process a markdown text rather than a html text
hexo.extend.filter.register('after_post_render', (data) => {
  if (data.layout === 'post' || data.layout === 'page') {
    data.content = FootnotesRenderer(data.content);
  }
  return data;
}, 9);