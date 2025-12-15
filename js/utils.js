
function dict_to_sorted_list_by_key_value(dict){
    const keys = Object.keys(dict);
    keys.sort((a, b) => b - a); 
    const sorted = [];
    keys.forEach(key => {
        sorted.push([key, dict[key]]) 
    }); 
    return sorted
}


// example : str is attr1.attr2.attr3
function get_attribute_dict_from_str(dict, str){
    filters = str.split(".")
    // console.log(filters)
    let dict_cp = dict;
    filters.forEach(filter => {
        dict_cp = dict_cp[filter]
    });
    return dict_cp
}

function group_list_by_filter(list,filter){
    let res = {};
    list.forEach(p => {
        const key = get_attribute_dict_from_str(p,filter); 
        if (!(key in res)) {
            res[key] = [];
        }; 
        res[key].push(p);       
    });
    return res;
}
 
async function getData(url) {
    const response = await fetch(url);
    return response.json();
}