const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  __internal: {
    engine: {
      binaryPath: require('path').join(
        process.cwd(),
        'node_modules/.prisma/client',
        'query-engine-rhel-openssl-3.0.x'
      )
    }
  }
});

export {prisma} 
