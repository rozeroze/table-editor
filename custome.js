var te;
var c_editable;
var c_asheader;
var c_input;
var c_output;
var c_query;

var c_import_csv = () => {
   te.import_data_csv(c_input.value);
   c_input.value = '';
};
var c_import_tsv = () => {
   te.import_data_tsv(c_input.value);
   c_input.value = '';
};
var c_export_csv = () => {
   let data = te.get_itable();
   data = data.map(line => line.join(','));
   c_output.value = data.join('¥n');
};
var c_export_tsv = () => {
   let data = te.get_itable();
   data = data.map(line => line.join('¥t'));
   c_output.value = data.join('¥n');
};

(() => {
   // checkbox
   c_editable = document.querySelector('#c-table-editable');
   c_editable.checked = true; // hard coding: initial -> true
   c_editable.addEventListener('change', event => {
      te.set('editable', event.target.checked);
      te.set_editable();
   });
   c_asheader = document.querySelector('#c-top-as-header');
   c_asheader.checked = true; // hard coding: initial -> true
   c_asheader.addEventListener('change', event => {
      te.set('top-as-header', event.target.checked);
   });
   // textarea
   c_input = document.querySelector('#c-input');
   c_output = document.querySelector('#c-output');
})()

