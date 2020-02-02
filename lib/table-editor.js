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

   // make entity from itable
   te.get_itable = () => {
      let obj = [ ];
      for (let row of te.itable.rows) {
         let _r = [ ];
         for (let cell of row.cells) {
            _r.push(cell.innerText);
         }
         obj.push(_r);
      }
      return obj;
   };

   // make itable from entity-object
   te.structuring = entity => {
      te.itable.innerHTML = null;
      entity = entity || JSON.parse(te.get('entity'));
      for (let row of entity) {
         let tr = te.itable.insertRow();
         for (let data of row) {
            let td = tr.insertCell();
            td.innerText = data;
         }
      }
      te.distribute();
      te.set_itable_frame();
      te.set_editable();
   };

   // write entity from itable-values
   te.writing = () => {
      let object = te.get_itable();
      te.set('entity', JSON.stringify(object));
      te.set_entity_frame();
   };

   // clear all cells
   te.clear_itable = () => {
      for (let row of te.itable.rows) {
         for (let cell of row.cells) {
            cell.innerText = null;
         }
      }
   };

   // import data
   te.import_data = data => {
      te.structuring(data);
      te.set_itable_frame();
      te.valid_row_count();
      te.valid_column_count();
   };
   te.import_data_csv = text => {
      let lines = text.split('¥n');
      let data = lines.map(line => line.split(','));
      te.import_data(data);
   };
   te.import_data_tsv = text => {
      let lines = text.split('¥n');
      let data = lines.map(line => line.split('¥t'));
      te.import_data(data);
   };

   // row append / remove
   te.append_row = rownum => {
      let column = parseInt(te.get('itable-columns'));
      let tr;
      if (rownum != undefined) {
         tr = te.itable.insertRow(rownum - 1);
      } else {
         tr = te.itable.insertRow();
      }
      for (let c = 0; c < column; c++) {
         tr.insertCell();
      }
      te.distribute();
      te.set_editable();
      te.set_itable_frame();
   };
   te.remove_row = rownum => {
      let header = te.get('top-as-header');
      let row = parseInt(te.get('itable-rows'));
      if (header == 'true' && row == 1) {
         // cannot remove row, when just have only header
         return;
      }
      if (rownum != undefined) {
         te.itable.deleteRow(rownum - 1);
      } else {
         te.itable.deleteRow(te.itable.rows.length - 1);
      }
      te.distribute();
      te.set_itable_frame();
   };

   // column append / remove
   te.append_column = colnum => {
      let column = parseInt(te.get('itable-columns'));
      for (let row of te.itable.rows) {
         if (colnum != undefined) {
            row.insertCell(colnum - 1);
         } else {
            row.insertCell();
         }
      }
      te.distribute();
      te.set_editable();
      te.set_itable_frame();
   };
   te.remove_column = colnum => {
      let selector = 'td';
      if (colnum != undefined) {
         selector += '[te-column="' + colnum + '"]';
      } else {
         let _col = parseInt(te.get('itable-columns'));
         selector += '[te-column="' + _col + '"]';
      }
      for (let cell of te.itable.querySelectorAll(selector)) {
         cell.remove();
      }
      te.distribute();
      te.set_itable_frame();
   };

   // set editable
   te.set_editable = () => {
      let editable = te.get('editable');
      for (let row of te.itable.rows) {
         for (let cell of row.cells) {
            cell.contentEditable = editable;
         }
      }
   };

   // set te-entity-rows & te-entity-columns from entity
   te.set_entity_frame = () => {
      let entity = JSON.parse(te.get('entity'));
      let column = 0;
      for (let row of entity) {
         column = column < row.length ? row.length : column;
      }
      te.set('entity-rows', entity.length);
      te.set('entity-columns', column);
   };
   // set te-itable-rows & te-itable-columns from itable
   te.set_itable_frame = () => {
      let object = te.get_itable();
      let column = 0;
      for (let row of object) {
         column = column < row.length ? row.length : column;
      }
      te.set('itable-rows', object.length);
      te.set('itable-columns', column);
   };

   // distribute te-row & te-column to cells
   te.distribute = () => {
      let row_number = 1;
      let col_number = 1;
      for (let row of te.itable.rows) {
         row.setAttribute('te-row', row_number);
         col_number = 1;
         for (let cell of row.cells) {
            cell.setAttribute('te-row', row_number);
            cell.setAttribute('te-column', col_number);
            col_number++;
         }
         row_number++;
      }
   };

   // move focus
   te.activate = (rownum, colnum) => {
      let selector = 'td'
                   + '[te-row="' + rownum + '"]'
                   + '[te-column="' + colnum + '"]';
      let cell = te.itable.querySelector(selector);
      if (cell != null) {
         cell.focus();
      }
   };
   te.move_up = () => {
      let active = document.activeElement;
      let rownum = parseInt(active.getAttribute('te-row'));
      let colnum = parseInt(active.getAttribute('te-column'));
      te.activate(rownum - 1, colnum);
   };
   te.move_right = () => {
      let active = document.activeElement;
      let rownum = parseInt(active.getAttribute('te-row'));
      let colnum = parseInt(active.getAttribute('te-column'));
      te.activate(rownum, colnum + 1);
   };
   te.move_down = () => {
      let active = document.activeElement;
      let rownum = parseInt(active.getAttribute('te-row'));
      let colnum = parseInt(active.getAttribute('te-column'));
      te.activate(rownum + 1, colnum);
   };
   te.move_left = () => {
      let active = document.activeElement;
      let rownum = parseInt(active.getAttribute('te-row'));
      let colnum = parseInt(active.getAttribute('te-column'));
      te.activate(rownum, colnum - 1);
   };

   // query parse and execution
   te.parse = command => {
      // TODO: devs
      let instruction = { };
      let assets = command.split(/(select|insert|update|delete|from|where)/).filter(f => f.trim() != '');
      instruction.operand = assets[0];
      let group = '';
      for (let asset of assets) {
         switch (asset) {
            case 'select':
            case 'insert':
            case 'update':
            case 'delete':
            case 'from':
            case 'where':
               group = asset;
               instruction[group] = [ ];
               break;
            default:
               instruction[group].push(asset);
               break;
         }
      }
      if (instruction.select != undefined) {
         // [ ' col1, col2,col3  ,col4 ' ] -> [ 'col1', 'col2', 'col3', 'col4' ]
         instruction.select = instruction.select[0].split(',').map(m => m.trim()).filter(f => f != '');
      }
      if (instruction.insert != undefined) {
         // [ '  ,, 0, "test" ' ] -> [ '', '', '0', '"test"' ]
         // [ ' "test", ' ] -> [ '"test"', '' ]
         instruction.insert = instruction.insert[0].split(',').map(m => m.trim());
      }
      if (instruction.update != undefined) {
         // [ 'col2 = "data", col3 = 0' ] -> [ 'col2 = "data"', 'col3 = 0' ]
         instruction.update = instruction.update[0].split(',').map(m => m.trim()).filter(f => f != '');
      }
      if (instruction.delete != undefined) {
         // no-need
      }
      if (instruction.from != undefined) {
         // self
      }
      if (instruction.where != undefined) {
         // [ '  col2 = "json" or col3 = 0  ' ] -> [ 'col2 = "json"', 'or', 'col3 = 0' ]
         instruction.where = instruction.where[0].split(/ (and|or) /).map(m => m.trim());
      }
      return instruction;
   };
   te.execute = instruction => {
   };
   te.execute_select = (val, instruction) => {
   };
   te.execute_insert = (val, instruction) => {
   };
   te.execute_update = (val, instruction) => {
   };
   te.execute_delete = (val, instruction) => {
   };
   te.execute_from = instruction => {
   };
   te.execute_where = (val, instruction) => {
   };

   return te;
};


