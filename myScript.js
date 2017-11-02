var nextButton = document.getElementById('next'),
    previousButton = document.getElementById('previous'),
    numberOfPages = document.querySelector('span #numberOfPages'),
    currentNumberOfPage = document.getElementById('currentNumber').value,
    currentNumberOfPage = 1;

window.onload = function() {
    var key = "test",
        url = "http://content.guardianapis.com/search?page=" + currentNumberOfPage + "&api-key=";
    //get data for titles from The Guardian API
    $.getJSON(url + key,
        function(data, status) {
            numberOfPages.innerHTML = data.response.pages
            document.getElementById('currentNumber').value = data.response.currentPage;
            var acc = document.getElementsByClassName("accordion");
            var panels = document.getElementsByClassName("panel");

            // clear previous content
            $('#content').empty();

            // create elements
            for (var i = 0; i < data.response.results.length; i++) {
                var itemTitle = document.createElement('div');
                itemTitle.id = data.response.results[i].id;
                itemTitle.className = "accordion";
                itemTitle.innerHTML = data.response.results[i].webTitle;
                var itemContent = document.createElement('div');
                itemContent.className = "panel";
                var text = document.createElement('p');
                var link = document.createElement('a');
                link.target = "_blank";
                link.innerHTML = "Read full news"

                itemContent.appendChild(text)
                itemContent.appendChild(link)
                content.appendChild(itemTitle)
                content.appendChild(itemContent)
            }

            //call function for buttons "previous" and "next"
            buttonsAction()
            
            // call function to get full text
            getFullText();
            
            // error message
        }).fail(function(jqXHR) {
        if (jqXHR.status !== 200) {
            errorMessage(currentNumberOfPage, currentNumberOfPage)
        }
    });
}
//---------------------------------------------------------
// get body text of current article from The Guardian API
function getFullText() {
    var acc = document.getElementsByClassName("accordion");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', function(e) {
            var key = "test",
                url = "http://content.guardianapis.com/";
            // add accordion
            e.target.classList.toggle("active");
            var panel = e.target.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                // get full data
                $.getJSON(url + this.id + "?show-blocks=body&api-key=" + key,
                    function(data, status) {
                        e.target.nextElementSibling.childNodes[0].innerHTML = data.response.content.blocks.body[0].bodyTextSummary;
                        e.target.nextElementSibling.childNodes[1].href = data.response.content.webUrl;
                        panel.style.maxHeight = panel.scrollHeight + "px";
                        // error message
                    }).fail(function(jqXHR) {
                    if (jqXHR.status != 200) {
                        errorMessage()
                    }
                });
            }
        })
    }
}
//----------------------------------------------------------
//add hide effect for the buttons "previous" and "next"
function buttonsAction(){
       if (currentNumberOfPage >= Number(numberOfPages.innerHTML)) {
                nextButton.classList.add("hide");
            } else if (currentNumberOfPage < Number(numberOfPages.innerHTML) && currentNumberOfPage > 1) {
                nextButton.classList.remove("hide");
            }

            if (currentNumberOfPage < 2) {
                previousButton.classList.add("hide");
            } else if (currentNumberOfPage > 1) {
                previousButton.classList.remove("hide");
            }
}
//-----------------------
// refresh button event
var refreshButton = document.getElementsByTagName('button')
refreshButton[0].addEventListener("click", function() {
    document.getElementsByTagName('span')[0].style.display = "none";
    document.getElementById('paginationContainer').style.display = "block";
    window.onload()
})
//----------------------
//nextPage button event
nextButton.addEventListener('click', function(e) {
    currentNumberOfPage = +(currentNumberOfPage) + (+1);
    window.onload()
})
//---------------------
//previousPage button event
previousButton.addEventListener('click', function(e) {
    currentNumberOfPage -= 1;
    window.onload()
})
//---------------------
// input onchange event
var inputField = document.getElementById("currentNumber")
inputField.addEventListener('change', function() {
    currentNumberOfPage = inputField.value;
    window.onload()
})
//----------------------
// action for errors
function errorMessage(numberOfPages, currentPage) {
    $('#content').empty();
    console.log(numberOfPages + ' '+ currentPage)
    if(numberOfPages == currentPage ){
        currentNumberOfPage = 1
    }
    document.getElementById('paginationContainer').style.display = "none";
    document.getElementsByTagName('span')[0].style.display = "block";
}