
    module.exports.crawlerTopic = async (url, pageFrom, pageTo,filename)=>{
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
              let a = $('article blockquote')
              a = await a[0].children
              for(let ii=0; ii<a.length; ii++) {
                try{
                  if(a[ii].type == 'tag' && (a[ii].name == 'img' || a[ii].name == 'gif' || a[ii].name == 'video')){
                    await tongSo++
                    // console.log((!dataAll.includes(a[ii].attribs.src)))
                    if (await !dataAll.includes(a[ii].attribs.src)){
                      await dataAll.push(a[ii].attribs.src)
                      await dataImg.push(`<div class='divImage' style='width:25%;float:left;'><img id='image${id}' onClick="imageClick('#image${id++}')" style='max-width: 100%;max-height: 100%;' src="${a[ii].attribs.src}"></img></div>`)
                    }else {
                      await countTrung++
                      await dataAll.push(a[ii].attribs.src)
                    }
                  }
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