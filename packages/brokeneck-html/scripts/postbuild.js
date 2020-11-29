const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const build = path.join(__dirname, '..', 'build')

const html = fs.readFileSync(path.join(build, 'index.html'), 'utf-8')

const $ = cheerio.load(html)

function prependBasename(tagName, attr) {
  $('html')
    .find(`${tagName}[${attr}]`)
    .filter(function (_, el) {
      // do not replace links to external resources
      return !/^(?:http|\/\/)/.test(el.attribs[attr])
    })
    .attr(attr, (_, value) => `<%= config.basename %>${value}`)
}

prependBasename('script', 'src')
prependBasename('link', 'href')

$('script[id="config"]').html(
  '<%- JSON.stringify(config).replace("^\\"", "").replace("\\"$", "") %>'
)

const output = $.html({ decodeEntities: false })

console.log('## Resulting EJS template ##\n')
console.log(output)

fs.writeFileSync(path.join(build, 'index.ejs'), output)
