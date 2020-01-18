/**
 * table-editor.js
 *   this is plugin make easily edit table on browser
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


