const sheets = new Sheets({
   key: '1J-UuARS1ZgsRa1w6KXsnk5G_aDJf6zmYsI0-T0PORlc'
    })

sheets.getData(data => {
  
    console.log(data)
})
