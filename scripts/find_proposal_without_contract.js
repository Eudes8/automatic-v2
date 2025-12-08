const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const p = new PrismaClient();
  try{
    const proposals = await p.proposal.findMany({where:{}, take:50});
    for(const prop of proposals){
      const c = await p.contract.findUnique({where:{proposalId:prop.id}});
      if(!c){
        console.log('free_proposal', prop.id);
        console.log(JSON.stringify(prop));
        await p.$disconnect();
        return;
      }
    }
    console.log('no_free_proposal');
  }catch(e){console.error(e)}finally{await p.$disconnect();}
})();
