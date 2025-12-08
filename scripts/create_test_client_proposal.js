const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const prisma = new PrismaClient();
  try{
    let client = await prisma.client.findFirst();
    if(!client){
      client = await prisma.client.create({data:{email:'test-client@local',passwordHash:'',company:'Test Co',contactName:'Test',phone:'0000000000',country:'FR'}});
      console.log('created_client', client.id);
    }else{
      console.log('found_client', client.id);
    }

    let proposal = await prisma.proposal.findFirst();
    if(!proposal){
      proposal = await prisma.proposal.create({data:{clientId:client.id,projectName:'Test Project',company:'Test Co',email:client.email,phone:client.phone,description:'Test description',projectType:'website',price:10000,timeline:'2 weeks',features:[],validUntil:new Date(Date.now()+30*24*60*60*1000)}});
      console.log('created_proposal', proposal.id);
    }else{
      console.log('found_proposal', proposal.id);
    }

    console.log(JSON.stringify({clientId: client.id, proposalId: proposal.id}));
  }catch(e){
    console.error(e);
    process.exit(1);
  }finally{
    await prisma.$disconnect();
  }
})();
