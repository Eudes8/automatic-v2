const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const p = new PrismaClient();
  try{
    const client = await p.client.findUnique({where:{id:'test-client'}});
    if(!client){
      console.error('client test-client not found');
      process.exit(1);
    }
    const proposal = await p.proposal.create({data:{clientId:client.id,projectName:'API Contract Test Project '+Date.now(),company:client.company,email:client.email,phone:client.phone,description:'Auto test proposal',projectType:'website',price:50000,timeline:'1 month',features:[],validUntil:new Date(Date.now()+30*24*60*60*1000)}});
    console.log('created_proposal',proposal.id);
    console.log(JSON.stringify({proposalId:proposal.id,clientId:client.id}));
  }catch(e){console.error(e);process.exit(1);}finally{await p.$disconnect();}
})();
