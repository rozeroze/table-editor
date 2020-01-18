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


