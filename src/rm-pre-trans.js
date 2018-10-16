var cheerio = require('cheerio')
var fs = require('fs')

var dir = process.argv[2]

var files = fs.readdirSync(dir).filter(x => x.endsWith('.html'))

for(var f of files) {
    console.log(f)
    var html = fs.readFileSync(dir + '/' + f, 'utf-8')
    html = handleHtml(html)
    fs.writeFileSync(dir + '/' + f, html)
}

console.log('done..')

function handleHtml(html) {
    
    var $ = cheerio.load(html)
    
    // 删除
    $('script, style, iframe, base').remove()
    
    // 将 <pre> 中的翻译替换成原文
    var $transes = $('pre .notranslate')
    
    for (var i = 0; i < $transes.length; i++) {
        
        var $trans = $transes.eq(i)
        var $ori = $trans.children('.google-src-text')
        $ori.removeClass('google-src-text')
        $ori.addClass('pre-span')
        $ori.remove()
        $trans.replaceWith($ori)
        
    }
    
    // 删掉其余原文
    $('.google-src-text').remove()
    
    
    return $('html').toString()
}
