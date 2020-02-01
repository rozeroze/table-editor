/**
 * table-editor.js
 *   this is plugin make easily edit table on browser
 *
 * sample:
 *   var tbl = TableEditor({
 *     element: document.querySelector('#target-table'),
 *     editable: true,
 *     top_as_header: true,
 *     entity: [
 *       [ 'column1', 'column2' ],
 *       [ 'data1-1', 'data1-2' ],
 *       [ 'data2-1', 'data2-2' ],
 *     ],
 *   });
 *
 * argument:
 *
 * attribute:
 *
 * todo:
 *
**/

// TableEditor
const TableEditor = option => {
   if (option.element == null)
      throw new Error('table-element not defined');

   let te = { };
   te.itable = option.element;

   // ...

   return te;
};


