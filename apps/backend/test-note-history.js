const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testNoteHistory() {
  try {
    console.log('Testing note history functionality...');
    
    // Check if note_history table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'note_history'
      );
    `;
    
    console.log('Note history table exists:', tableExists[0].exists);
    
    if (tableExists[0].exists) {
      // Check table structure
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'note_history'
        ORDER BY ordinal_position;
      `;
      
      console.log('\nTable structure:');
      columns.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
      // Check if there are any existing records
      const count = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM note_history;
      `;
      
      console.log(`\nTotal records in note_history: ${count[0].count}`);
    }
    
  } catch (error) {
    console.error('Error testing note history:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testNoteHistory();
