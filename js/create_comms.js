


function sort_list_of_comms_by_date(list){
    const sorted = list.sort((a,b) => {
        let date_a = new Date(a["when"]["start"]);
        let date_b = new Date(b["when"]["start"]); 
        return date_b - date_a
    })
    
    return sorted
}



function group_comms_by_year(comms){
    const grouped =  group_list_by_filter(comms, "when.year")
    return dict_to_sorted_list_by_key_value(grouped)
}


function create_comm_div(comm){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(comm.when.start)
    const formatted_date = date.toLocaleDateString("en-US", options);

    let div_comm = $('<div class="comm card"></div>');

    div_comm.append('<p  class = "comm_title">'+ comm.title +'</p>');
    let conf_url_name = comm.conf_name;
    if (comm.conf_url !== null) {
        conf_url_name = '<a href="' + comm.conf_url + '">' + comm.conf_name + '</a>';
    } 

    div_comm.append('<p  class = "comm_details">'+ 
        conf_url_name + 
        " " + 
        comm.where + 
        " (" + 
        formatted_date + 
        ")" +
        '</p>');  
    return div_comm
}


async function create_communications_div() {
    const all_comms_sorted = sort_list_of_comms_by_date(all_comms)
    const comms_by_year_sorted = group_comms_by_year(all_comms_sorted)
  
    // $("#communications").append("<pre>"+JSON.stringify(comms_by_year_sorted,null,'\t')+"</pre>");  

    comms_by_year_sorted.forEach(e => {
        let year = e[0];
        let comms_per_year = e[1];
        let div_year = $('<div class="comms_year_div"></div>');
        div_year.append('<h3 class="comms_year">'+year+'</h3>');

        comms_per_year.forEach(comm => {
            let div_comm = create_comm_div(comm)
            div_year.append(div_comm);
        });

        $("#communications").append(div_year);
    });

}

// Call the async function to fetch and log the data
create_communications_div();