
const { faker } = require('@faker-js/faker');
let randomphonenum = ()=>{
    let k = true;
    let num;
    while(k){
        let m = Math.floor(Math.random()*10);
        if(m > 5){
             num = m;
            for(let i = 0 ; i < 9;i++){
                let rand = Math.floor(Math.random()*10);
                 num = num*10 + rand;
            }
            k = false;
        }
    }
    return num;
  }
  
  let randomapplication = ()=>{
    let k = true;
    let num = 25;
    
        
    for(let i = 0 ; i < 10;i++){
        let rand = Math.floor(Math.random()*10);
        num = num*10 + rand;
    }
          
    return num;
  }
  
  let randomUser = () => {
      return [
        faker.string.uuid(),
        randomapplication(),
        faker.internet.email(),
        randomphonenum(),  
      ];
    }
  
 let data = [];


 for(let i = 0 ; i < 10;i++){
    data.push(randomUser());
 }

console.log(data);

module.exports = data;

  