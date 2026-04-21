export type WorkbookSheetContext = {
  name: string
  headers: string[]
  rowCount: number
  records: Record<string, string>[]
}

export type WorkbookContext = {
  fileName: string
  sheets: WorkbookSheetContext[]
  totalRows: number
}

const MAX_RECORDS_PER_SHEET = 120

const normalizeCell = (value: unknown): string => {
  if (value == null) return ""
  return String(value).replace(/\s+/g, " ").trim()
}

const normalizeHeader = (value: unknown, index: number): string => {
  const header = normalizeCell(value)
  return header.length > 0 ? header : `column_${index + 1}`
}

const buildSheetContext = (sheetName: string, rows: unknown[][]): WorkbookSheetContext => {
  const headerRow = Array.isArray(rows[0]) ? rows[0] : []
  const headers = headerRow.map((cell, index) => normalizeHeader(cell, index))

  const dataRows = rows.slice(1).filter((row) =>
    Array.isArray(row) && row.some((cell) => normalizeCell(cell).length > 0),
  )

  const records = dataRows.slice(0, MAX_RECORDS_PER_SHEET).map((row) => {
    const record: Record<string, string> = {}

    headers.forEach((header, index) => {
      record[header] = normalizeCell(row[index])
    })

    return record
  })

  return {
    name: sheetName,
    headers,
    rowCount: dataRows.length,
    records,
  }
}

export const buildWorkbookContext = (
  fileName: string,
  sheets: Array<{ name: string; rows: unknown[][] }>,
): WorkbookContext => {
  const parsedSheets = sheets
    .map((sheet) => buildSheetContext(sheet.name, sheet.rows))
    .filter((sheet) => sheet.rowCount > 0 || sheet.headers.length > 0)

  const totalRows = parsedSheets.reduce((sum, sheet) => sum + sheet.rowCount, 0)

  return {
    fileName,
    sheets: parsedSheets,
    totalRows,
  }
}
