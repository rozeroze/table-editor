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
 *   element (require) - target table element
 *   editable          - cell value's editable ( default: false )
 *   top_as_header     - handling itable top row as header ( default: false )
 *   entity            - exists
 *                         initialize itable from use it
 *                       none
 *                         make te-entity from parse table element
 *
 * attribute:
 *   <table>
 *     te-editable:       user can/cannot edit itable on browser
 *     te-top-as-header:  handling itable top row as header
 *     te-entity:         table-editor's entity
 *     te-entity-rows:    te-entity row count
 *     te-entity-columns: te-entity column count
 *     te-itable-rows:    interface-table row count
 *     te-itable-columns: interface-table column count
 *   <row>
 *     te-row:            row-number
 *   <cell>
 *     te-row:            cell's row-number
 *     te-column:         cell's column-number
 *
 * todo:
 *   table-editor has been control all tables
 *   event binding where inner table-editor.js
 *   make update rhs evalable, e.g. col1 = '[' + col1 + ']'
**/

// TableEditor
const TableEditor = option => {
   if (option.element == null)
      throw new Error('table-element not defined');

   let te = { };
   te.itable = option.element;

   // getter and setter
   te.get = name => {
      return te.itable.getAttribute('te-' + name);
   };
   te.set = (name, value) => {
      te.itable.setAttribute('te-' + name, value);
   };

   return te;
};


