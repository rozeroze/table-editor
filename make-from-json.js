(() => {
   te = TableEditor({
      element: document.querySelector('#c-table'),
      editable: true,
      top_as_header: true,
      entity: [
         [ 'name', 'from', 'self' ],
         [ 'table-editor', 'json', '1' ],
         [ 'table-editor', 'table', '0' ],
      ],
   });
})()
