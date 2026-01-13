const fileData = [
   {name: "config.js"},
  {name: "jest.setup.ts"},
  {
    name: "Account",
    items: [
      {name: "index.tsx"},
      {name: "types.ts"},
      {name: "Account.tsx"},
      {
        name: "hooks",
        items: [
          {name: "useSettings.jsx"},
          {name: 'useAccountData.tsx'},
          {name: "useAccountPreferences.tsx"},
        ]
      }
    ]
  },
  {
    name: "Dashboard",
    items: [
      {name: "Dashboard.tsx"},
      {name: "index.tsx"}
    ]
  },
  {name: "package.json"},
];

const sortFolderData = (data = []) => {
  const files = [];
  const folders = [];
  let result = [];
  data.forEach(dataItem => {
    if (!dataItem.items) {
      files.push(dataItem);
    } else {
      const sortedData = sortFolderData(dataItem.items)
      folders.push({
        name: dataItem.name,
        items: sortedData
      });
    }
  });

  result = [
    ...folders.sort((folder1, folder2) => folder1.name.split(".")[0].localeCompare(folder2.name.split(".")[0])),
    ...files.sort((file1, file2) => file1.name.split(".")[0].localeCompare(file2.name.split(".")[0]))
  ];

  return result;
}

  const debounce = (fn, delay) => {
    let timerId = null;

    return function(...args) {
      clearTimeout(timerId);

      timerId = setTimeout(() => {
        fn.apply(this, args);
        timerId = null;
      }, delay);
    }
  }

export {
  fileData,
  sortFolderData,
  debounce
}