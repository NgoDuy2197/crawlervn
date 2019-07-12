const good = require('good');
const https = require('https');
var net = require('net');
// var fs = require('fs');
const { Readable } = require('stream');
const axios = require('axios');
const Hapi = require('@hapi/hapi');

// var Crawler = require("js-crawler");
var Crawler = require("crawler");
var url = require('url');
let count = 0
let countPage = 0
let maxConnect = 100
let dataAll = []
let countHienTai = 0
let id = 0
let countTrung = 0
let tongSo = 0
let status = 'Sẵn sàng'
let tientoLink = 'https://thiendia.com/diendan/'

// create a server with a host and port
// var server = new hapi.Server(process.argv[2] || process.env.PORT, '0.0.0.0');

	const server = Hapi.server({
		port: process.env.PORT || 8001,
		host: '0.0.0.0'
	});

let header = `<head><style>
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 10px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}</style></head>
<button id="myBtn">Open Modal</button>
<!-- The Modal -->
<div id="myModal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>
      <img id='modalImage' src="" alt="" style="width: 100%;">
    </p>
  </div>
</div>
<script>
// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal 
btn.onclick = function() {
modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
modal.style.display = "none";
}
}
const imageClick = (id) => {
let src = $(id).attr('src')
$('#modalImage').attr('src',src)
modal.style.display = "block";
}
</script>
<script
src="https://code.jquery.com/jquery-3.4.1.js"
integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
crossorigin="anonymous"></script>`
let downloadcontent = header

server.register(require('inert'));
server.register(require('hapi-response-time'))
//GET status

server.route({
  method: 'GET',
  path: '/status',
  handler: async (request, h) => {
    return ({status:status})
  }
})
//ghi file data
server.route({
  method: 'POST',
  path: '/ghifile',
  handler: async (request, reply) => {
    await console.log('get /ghifile')
      //start(url, from,to, filename)
      dataAll = []
      let data = request.payload
      data.urlPre ? tientoLink = data.urlPre : null
      let url = data.url[data.url.length-1] != '/' ? data.url+'/' : data.url
        start(url,data.from,data.to,"./public/"+data.filename,reply)
      let timecountdown = data.timecountdown
    // Tra ve ket qua sau 4s
    await (() => { return new Promise(resolve => setTimeout(resolve, timecountdown)); })();
    status = 'Đang tải file.'
    return reply.response(downloadcontent)
      .header('Content-Type', 'text/html')
      .header('Content-Disposition', 'attachment; filename= ' + 'demo.html')
  }
});
                                                          //PAGE
//INDEX 
    server.route({
      method: 'GET',
      path: '/',
      handler: {
        file: {
            path: './index.html',
            confine: false
        }
    }
  });
//SAMPLE 
    server.route({
      method: 'GET',
      path: '/sample',
      handler: {
        file: {
            path: './sample.html',
            confine: false
        }
    }
  });
  //CREATE 
      server.route({
        method: 'GET',
        path: '/create',
        handler: {
          file: {
              path: './create.html',
              confine: false
          }
      }
    });
    //FORM 
      //   server.route({
      //     method: 'GET',
      //     path: '/form',
      //     handler: {
      //       file: {
      //           path: './form.html',
      //           confine: false
      //       }
      //   }
      // });
      //FILE 
      server.route({  
        method: 'GET',
        path: '/public/{file*}',
        handler: {
          directory: { 
            path: './public'
          }
        }
      })
      //Download 
      server.route({  
        method: 'GET',
        path: '/download',
        handler: async (request, reply) => {
          // let stream = fs.createReadStream('./demo.html');
          // let streamData = new Readable().wrap(stream)
          status = 'Đã tải file.'
          return reply.response(downloadcontent)
            .header('Content-Type', 'text/html')
            .header('Content-Disposition', 'attachment; filename= ' + 'demo.html')
        }
      })

    
    // Queue just one URL, with default callback
    const start = async (url, pageFrom, pageTo,filename)=>{
      var crawlerImage = new Crawler({
        maxConnections : maxConnect,
        // This will be called for each crawled page
        callback : async function (error, result, done) {
          try{
            status = 'Chưa xong'
            await console.log('get image')
              let $ = result.$
              await addItem($).then((count)=>{
                console.log('Added ' + count + ' items')
              })
          }catch(e){}
        }
      });
      var c = new Crawler({
          maxConnections : maxConnect,
          // This will be called for each crawled page
          callback : async function (error, result, done) {
            try{
              status = 'Chưa xong'
            await console.log('get link')
              let $ = result.$
              let data = []
              try {
                // await console.log('Page ' + countPage++)
                $('h3 a.PreviewTooltip').each(async function(index, a) {
                  try{await data.push(`${tientoLink}${a.attribs.href}`)}catch(e){}
                });
                data.forEach( async (item) => {
                  try{await crawlerImage.queue(item)}catch(e){}
                })
      
                await countHienTai++
                // if(await (countHienTai == pageTo)) return ({message: 'DONE'})
              }
              catch(err) {
                console.log(err.message)
              }
            }catch(e){}
          }
      });
      const addItem = async ($) => {
        try{
          // await console.log('additem')
          let dataImg = []
          return new Promise(async (resolve, no) => {
            let a = $('img')
            // a = await a[0].children
            for(let ii=0; ii<a.length; ii++) {
              try{
                // if(a[ii].type == 'tag' && (a[ii].name == 'img' || a[ii].name == 'gif' || a[ii].name == 'video')){
                  await tongSo++
                  // console.log((!dataAll.includes(a[ii].attribs.src)))
                  if (await !dataAll.includes(a[ii].attribs.src)){
                    await dataAll.push(a[ii].attribs.src)
                    await dataImg.push(`<div class='divImage' style='width:25%;float:left;'><img id='image${id}' onClick="imageClick('#image${id++}')" style='max-width: 100%;max-height: 100%;' src="${a[ii].attribs.src}"></img></div>`)
                  }else {
                    await countTrung++
                    await dataAll.push(a[ii].attribs.src)
                  }
                // }
              }catch(e){}
            }
            status = 'Chưa xong'
            await console.log('ghifile')
            downloadcontent +=await  dataImg.toString()
                // await fs.appendFileSync(filename,dataImg,'utf8',function (err) {
                //   //Kiểm tra nếu có lỗi thì xuất ra lỗi
                //   if(err)
                //       throw err;
                //   else //nếu không thì hiển thị nội dung ghi file thành công
                //       {
                //         // console.log('Ghi file thanh cong!');
                //       }
                // });
            // console.log(`Tong: ${tongSo} - Trung: ${countTrung}`)
              status = 'Có thể tải xuống'
              await console.log('---- Done -----')
              // await console.log(header)
          })
        }catch(e){}
      }
        //CHECK FILE EXIST
        countHienTai = 0
        count = 0
        downloadcontent = header

        
        // if(await fs.existsSync(filename)){
        //   await fs.unlinkSync(filename)
        // }
        // else{
        // } 
        // let header = '<head><style>.divImage{width: 25%;float:left;} .divImage:active{width: 100%;float:left;}</style></head>'
        // await fs.appendFileSync(filename,header,'utf8',function (err) {
        //   //Kiểm tra nếu có lỗi thì xuất ra lỗi
        //   if(err)
        //       throw err;
        //   else //nếu không thì hiển thị nội dung ghi file thành công
        //       {
        //         // console.log('Ghi file thanh cong!');
        //       }
        // })

        status = 'Bắt đầu tạo file'
        await console.log('---- Start ----')
        
        // await console.log(header)
        await c.queue(url);
        count = pageFrom>=1 ? pageFrom : 1
          for (count = 1; count <= pageTo; count++) {
            try{
              await c.queue(`${url}page-${count+1}`);
            }catch(e){}
          }
        // await console.log('- dataAll -'+dataAll)
    }
// set up logging
const good_options = {
    ops: {
        interval: 1000
    },
    reporters: {
      myConsoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
      }, {
          module: 'good-console'
      }, 'stdout'],
    }
  };
  
const init = async () => {
  try {
    await server.register([{
      plugin: good,
      options: good_options
    }]);
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

init();
