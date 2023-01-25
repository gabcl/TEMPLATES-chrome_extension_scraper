import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataFrame } from '../../../models/DataFrame';

interface FileErrorDialogProps {
  content: DataFrame;
}

/**
 * Table that shows content gathered from the web page.
 *
 * @param  props.content Content to show on table.
 * @return JSX.Element.
 */
function ContentTable(props: FileErrorDialogProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {props.content.header.map((field: string, index: number) => (
              <TableCell key={index} component="th" scope="row">
                {field}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.content.values.map((row: any, index: number) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {row.map((field: string, index: number) => (
                <TableCell key={index} component="th" scope="row">
                  {field}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ContentTable;
