const SHEET_ID = '1u9R9HECueXqQYNUQ1Sq7QV2_ejf2HAEoV_Dc9z0Mwt8';
const SHEET_GIDS = [
  { gid: '0', person: 'Hardik' },
  { gid: '1786929306', person: 'Aditya' },
];

function parseNumber(val) {
  if (!val || val === '' || val === '0') return 0;
  // Remove $, commas, and extra whitespace
  const cleaned = String(val).replace(/[$,\s]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseRow(row, sheetPerson) {
  if (!row || row.length < 11) return null;

  const client = (row[0] || '').trim();
  if (!client || client === 'Client') return null;

  const clientOf = (row[1] || '').trim().toUpperCase();
  const month = (row[2] || '').trim();
  const personUtilized = parseNumber(row[3]);
  const costWithoutAdmin = parseNumber(row[4]);
  const clientRevenue = parseNumber(row[5]);
  const costWithAdmin = parseNumber(row[6]);
  const revInINR = parseNumber(row[7]);
  const difference = parseNumber(row[8]);
  const revUSD = parseNumber(row[9]);
  const percent = parseNumber(row[10]);

  // Filter out obviously bad data (billions in client revenue column)
  // These appear in the original sheet as formatting artifacts
  if (clientRevenue > 1000000) {
    // use 0 for clientRevenue if it looks corrupted
  }

  return {
    client,
    clientOf,
    month,
    personUtilized,
    costWithoutAdmin,
    clientRevenue,
    costWithAdmin,
    revInINR,
    difference,
    revUSD,
    percent,
    sheetPerson,
    id: `${client}-${month}-${sheetPerson}`,
    raw: {
      personUtilized: row[3] ? row[3].trim() : '',
      costWithoutAdmin: row[4] ? row[4].trim() : '',
      clientRevenue: row[5] ? row[5].trim() : '',
      costWithAdmin: row[6] ? row[6].trim() : '',
      revInINR: row[7] ? row[7].trim() : '',
      difference: row[8] ? row[8].trim() : '',
      revUSD: row[9] ? row[9].trim() : '',
      percent: row[10] ? String(row[10]).trim() : '',
    }
  };
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
        if (char === '\r') i++;
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export async function fetchSheetData() {
  const allData = [];

  for (const sheet of SHEET_GIDS) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${sheet.gid}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch sheet ${sheet.person}: ${response.status}`);

      const text = await response.text();
      const rows = parseCSV(text);

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const parsed = parseRow(rows[i], sheet.person);
        if (parsed) {
          allData.push(parsed);
        }
      }
    } catch (error) {
      console.error(`Error fetching sheet for ${sheet.person}:`, error);
      throw error;
    }
  }

  return allData;
}

export function exportToCSV(data, filename = 'financial_data.csv') {
  const headers = [
    'Client',
    'Client of',
    'Month',
    'Person utilized',
    'cost(without admin)',
    'Client revenue',
    'cost(with admin)',
    'Rev in INR',
    'Difference',
    'Rev $',
    'PerCent %',
    'Sheet Source'
  ];
  const rows = data.map(d => [
    d.client,
    d.clientOf,
    d.month,
    d.personUtilized,
    d.costWithoutAdmin,
    d.clientRevenue,
    d.costWithAdmin,
    d.revInINR,
    d.difference,
    d.revUSD,
    d.percent,
    d.sheetPerson,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
