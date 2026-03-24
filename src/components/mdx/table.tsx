interface Props {
  headers: string[]
  rows: string[][]
  caption?: string
}

export function Table({ headers, rows, caption }: Props) {
  return (
    <table>
      {caption && <caption className='sr-only'>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i} scope='col'>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
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
