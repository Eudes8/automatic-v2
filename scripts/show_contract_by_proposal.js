const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const p = new PrismaClient();
  try{
    const c = await p.contract.findFirst({where:{proposalId:'cmiu6g7c400008jw32xehn7m5'}});
    console.log(JSON.stringify(c, null, 2));
  }catch(e){console.error(e)}finally{await p.$disconnect();}
})();
