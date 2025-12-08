const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const p = new PrismaClient();
  try{
    const c = await p.contract.findFirst();
    if(c) console.log('found_contract', c.id, 'proposalId', c.proposalId);
    else console.log('no_contract');
  }catch(e){console.error(e)}finally{await p.$disconnect();}
})();
