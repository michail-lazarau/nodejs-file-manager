import { colorize } from './colors.js';

export const formatTableRow = (index, name, type) => {
  return `${index}\t${colorize(`'${name}'`, 'green')}\t${colorize(`'${type}'`, 'green')}`;
};

export const formatTable = (items) => {
  console.log('\n(index)\tName\t\tType');
  console.log('-------------------------------');
  
  items.forEach((item, index) => {
    console.log(formatTableRow(index, item.name, item.type));
  });
  
  console.log(''); // Empty line after table
};