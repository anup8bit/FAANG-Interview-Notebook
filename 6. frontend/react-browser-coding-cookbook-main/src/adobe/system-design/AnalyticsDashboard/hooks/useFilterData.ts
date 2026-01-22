export const useFilterData = (data: Record<string, any>[], searchText: string) => {
  if (searchText.length <= 0) return data;

  return data.filter((item: Record<string, any>) => {
    const keys = Object.keys(item);
    console.log("item : ", item, item[keys[1]].toLowerCase());
    return  Object.keys(item).some((key) => {
      const value: string = item[key].toString().toLowerCase();
      const searchValue: string = searchText.toLowerCase();
      if(value.indexOf(searchText) >= 0) return true;
      return false;
    })
  })
}
