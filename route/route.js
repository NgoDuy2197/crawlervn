
let controller = require('../controller/crawlData')
let status = 'Sẵn sàng'
let header = require('../model/header')
let downloadcontent = header
// const { Readable } = require('stream')
module.exports = [
    {  
      method: 'GET',
      path: '/download',
      handler: async (request, reply) => {
        // let stream = fs.createReadStream('./demo.html');
        // let streamData = new Readable().wrap(stream)
        status = 'Đã tải file.'
        return reply.response(downloadcontent)
          .header('Content-Type', 'text/html')
          .header('Content-Disposition', 'attachment; filename= ' + 'duy.html')
      }
    },{
      method: 'GET',
      path: '/status',
      handler: async (request, h) => {
        return ({status:status})
      }
    },{
        method: 'POST',
        path: '/ghifile',
        handler: async (request, reply) => {
          await console.log('get /ghifile')
            //start(url, from,to, filename)
            dataAll = []
            let data = request.payload
            data.urlPre ? tientoLink = data.urlPre : null
            let url = data.url[data.url.length-1] != '/' ? data.url+'/' : data.url
            let downloadcontent = await controller.crawlerTopic(url,data.from,data.to,"./public/"+data.filename)
      
          status = 'Đang tải file.'
          return reply.response(downloadcontent)
            .header('Content-Type', 'text/html')
            .header('Content-Disposition', 'attachment; filename= ' + 'duy.html')
        }
      },{
        method: 'POST',
        path: '/deepcrawler',
        handler: async (request, reply) => {
          await console.log('post /deepcrawler')
            //start(url, from,to, filename)
            dataAll = []
            let data = request.payload
            data.urlPre ? tientoLink = data.urlPre : null
            let url = data.url[data.url.length-1] != '/' ? data.url+'/' : data.url
              start(url,data.from,data.to,"./public/"+data.filename,reply)
      
          // Tra ve ket qua sau 4s
          await (() => { return new Promise(resolve => setTimeout(resolve, 6000)); })();
          status = 'Đang tải file.'
          return reply.response(downloadcontent)
            .header('Content-Type', 'text/html')
            .header('Content-Disposition', 'attachment; filename= ' + 'duy.html')
        }
      },{
      method: 'GET',
      path: '/sample',
      handler: {
        file: {
            path: './html/sample.html',
            confine: false
        }
    }
  },{
    method: 'GET',
    path: '/create',
    handler: {
      file: {
          path: './html/create.html',
          confine: false
      }
  }
  },{
    method: 'GET',
    path: '/deepcrawler',
    handler: {
      file: {
          path: './html/deepcrawler.html',
          confine: false
      }
  }
  },{  
        method: 'GET',
        path: '/public/{file*}',
        handler: {
          directory: { 
            path: './public'
          }
        }
      }
  
  ]