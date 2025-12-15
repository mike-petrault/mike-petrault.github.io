
  
const url_hal = "https://api.archives-ouvertes.fr/search/?q=authIdHal_s:louis-roussel&fl=fileMain_s,authFullName_s,title_s,docType_s,publisher_s,citationRef_s,halId_s,releasedDateY_i,releasedDate_tdate&wt=json&sort=releasedDate_tdate desc";


async function getData(url) {
    const response = await fetch(url);
    return response.json();
}

// pubs is a list
function group_pubs_by_year(pubs){
    return group_list_by_filter(pubs, "releasedDateY_i")
}
function group_pubs_by_type(pubs){
    return group_list_by_filter(pubs, "docType_s")
}

function group_pubs_by_year_type(pubs){
    let res = group_pubs_by_year(pubs); 
    for (const[key, value] of Object.entries(res)) { 
        res[key] = group_pubs_by_type(value) 
    }  
    const sorted_res = dict_to_sorted_list_by_key_value(res); 
    return sorted_res;
}

function map_type_hal_to_str(type){
    let conv = {"POSTER": "Poster",
        "UNDEFINED":"Preprints, Working Papers, ...",
        "COMM":"Conference papers",
        "ART":"Journal articles",
    };

    if (conv[type]){
        return conv[type]
    }
    else{
        return type
    } 
}

function create_publi(pub){
    let div_pub = $('<div class="pub card"></div>');
    const link_title = '<a class="pub_title" href="https://hal.science/'+ pub.halId_s +'">'+ pub.title_s +'</a>'
    const link_pdf = '<a href="'+pub.fileMain_s+'"><img src="img/Haltools_pdf.png"></img></a>'
    const link_bib = '<a href="https://hal.science/'+ pub.halId_s +'/bibtex"><img src="img/Haltools_bibtex3.png"></img></a>'
    div_pub.append('<div class="links">'+ link_title + '&nbsp;' + link_pdf + '&nbsp;' + link_bib +'</div>') 
    div_pub.append('<p class=authors>'+pub.authFullName_s.join(", ")+'</p>')
    div_pub.append('<p class=cite_refs>'+pub.citationRef_s+'</p>')
    
    return div_pub;
}

// not used
async function create_publications_div_year_and_type() {
    const all_data_hal = await getData(url_hal);  
    const all_pubs =all_data_hal.response.docs 
    const all_pubs_grouped = group_pubs_by_year_type(all_pubs)  
    all_pubs_grouped.forEach(e => {
        let year = e[0];
        let pubs_per_year = e[1];
         
        let div_year = $('<div class="pubs_year_div"></div>');
        div_year.append('<h5 class="pubs_year">'+year+'</h5>');
        for (const[type, pubs_per_type] of Object.entries(pubs_per_year)) {
            let div_type = $('<div class="pubs_type_div"></div>');
            div_type.append('<h6 class="pubs_type">'+map_type_hal_to_str(type)+'</h6>');
            pubs_per_type.forEach(pub => {
                let div_pub = create_publi(pub)
                div_type.append(div_pub)
             });  
            div_year.append(div_type)
        } 
        $("#publications").append(div_year)
    });  
}
async function create_publications_div_type() {
    const all_data_hal = await getData(url_hal);  
    const all_pubs =all_data_hal.response.docs 
    let all_pubs_grouped = group_pubs_by_type(all_pubs)  
    let loop_on = ['UNDEFINED','ART','COMM','POSTER']
    loop_on.forEach(type => { 
        let pubs_per_type = all_pubs_grouped[type];
        let div_type = $('<div class="pubs_type_div"></div>');
        div_type.append('<h6 class="pubs_type">'+map_type_hal_to_str(type)+'</h6>');
        pubs_per_type.forEach(pub => {
            let div_pub = create_publi(pub)
            div_type.append(div_pub)
            });  
        $("#publications").append(div_type)
    });     
}

// Call the async function to fetch and log the data
// create_publications_div_year_and_type();
create_publications_div_type();