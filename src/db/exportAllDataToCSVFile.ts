import fs from 'node:fs'

import { db } from './index'
import { transactions } from './schema'

async function exportAllDataToCSVFile() {
  const result = await db.select().from(transactions)

  const file = fs.createWriteStream('all_transactions.csv')

  result.map(item => {
    file.write(item)
  })
}