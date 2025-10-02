const { PrismaClient } = require('@prisma/client');

// Local SQLite database
const prismaLocal = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

// Production PostgreSQL database  
const prismaProduction = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function migrateData() {
  try {
    console.log('🚀 Starting data migration from local SQLite to production PostgreSQL...');
    
    // 1. Migrate Users
    console.log('👥 Migrating users...');
    const localUsers = await prismaLocal.user.findMany();
    for (const user of localUsers) {
      try {
        await prismaProduction.user.upsert({
          where: { email: user.email },
          update: {
            password: user.password,
            role: user.role
          },
          create: {
            email: user.email,
            password: user.password,
            role: user.role
          }
        });
        console.log(`✅ User migrated: ${user.email}`);
      } catch (error) {
        console.log(`⚠️ User already exists or error: ${user.email}`);
      }
    }
    
    // 2. Migrate Project Config
    console.log('⚙️ Migrating project config...');
    const localConfigs = await prismaLocal.projectConfig.findMany();
    for (const config of localConfigs) {
      try {
        await prismaProduction.projectConfig.create({
          data: {
            twitter_official: config.twitter_official,
            twitter_community: config.twitter_community,
            pump_fun_address: config.pump_fun_address,
            contract_address: config.contract_address,
            dexscreener_pair: config.dexscreener_pair
          }
        });
        console.log('✅ Config migrated');
      } catch (error) {
        console.log('⚠️ Config already exists or error:', error.message);
      }
    }
    
    // 3. Migrate Donations
    console.log('💰 Migrating donations...');
    const localDonations = await prismaLocal.donation.findMany();
    for (const donation of localDonations) {
      try {
        await prismaProduction.donation.create({
          data: {
            tx_hash: donation.tx_hash,
            from_wallet: donation.from_wallet,
            to_wallet: donation.to_wallet,
            amount: donation.amount,
            datetime: donation.datetime,
            bank_reference: donation.bank_reference,
            recipient_org: donation.recipient_org,
            status: donation.status
          }
        });
        console.log(`✅ Donation migrated: ${donation.tx_hash.substring(0, 8)}...`);
      } catch (error) {
        console.log(`⚠️ Donation already exists or error: ${donation.tx_hash.substring(0, 8)}...`);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    
    // Verify migration
    const prodUsers = await prismaProduction.user.count();
    const prodDonations = await prismaProduction.donation.count();
    const prodConfigs = await prismaProduction.projectConfig.count();
    
    console.log('📊 Production database now has:');
    console.log(`   👥 Users: ${prodUsers}`);
    console.log(`   💰 Donations: ${prodDonations}`);
    console.log(`   ⚙️ Configs: ${prodConfigs}`);
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await prismaLocal.$disconnect();
    await prismaProduction.$disconnect();
  }
}

migrateData();
