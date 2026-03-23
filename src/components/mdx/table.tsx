interface Data {
  headers: string[]
  rows: string[][]
}

interface TableProps {
  data: Data
  caption?: string
}

export function Table({ data, caption }: TableProps) {
  return (
    <table>
      {caption && <caption className='sr-only'>{caption}</caption>}
      <thead>
        <tr>
          {data.headers.map((header, i) => (
            <th key={i} scope='col'>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
