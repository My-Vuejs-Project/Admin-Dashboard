window.onclick = function(event) {
    if (!event.target.matches('.btn-dropdown')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }else{
        let domElements = event.target.closest('.group-dropdown').children;
        for(let i=0;i<domElements.length;i++){
            if(domElements[i].classList.contains("dropdown-content")){
                domElements[i].classList.toggle("show");
            }
        }
    }

    // if (event.target.matches('.overlay')) {
    //     let domElements = event.target.children;
    //     for(let i=0;i<domElements.length;i++){
    //         if(domElements[i].classList.contains("modal-md")){
    //             event.target.closest('.overlay-controller').innerHTML = "";
    //         }
    //     }
    // }
}