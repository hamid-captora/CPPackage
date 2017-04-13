/**
 * Created by hamidhoseini on 4/6/17.
 */

//<script src="node_modules/cppackage/cpWidgetCall.js"></script>
//<script type="text/javascript">
//    cpwidget.init({
//          cdmContainer : 'cdmlinks',
//          key : "75728e5ece4448613e0bcf132124d515",
//          html: false,
//          cpclass: 'inline',
//          endpointURL: 'http://localhost:2000/',
//          pageGroup: 'page-group'
//      });
//    cpwidget.getCDMLinks();
//</script>


// this function would be a library in Captora CDN "cpwidget.js"
var cpwidget = cpwidget || (function(){
        var parameters = {
            cdmContainer : 'cdmlinks',
            key : '',
            html: false,
            cpclass: 'inline',
            endpointURL: 'http://localhost:2000/',
            pageGroup: 'page-group'
        };

        return {
            init : function(args) {
                for (var param in args){
                    parameters[param] = args[param];
                }
                // some other initialising
            },
            getCDMLinks : function() {

                // add the jquery library and Loading that if the library is missing
                document.addEventListener('DOMContentLoaded',function () {
                    var current_url = window.location.href;

                    // set ID for the element as a container of CDM links
                    var cdmLinks = document.querySelector('#'+parameters.cdmContainer);

                    // The URL for fetching CDM links from Captora server
                    var requestURL = parameters.endpointURL +  parameters.pageGroup;

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", requestURL);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.send(JSON.stringify({key: parameters.key, current_url: current_url}));
                    xhr.onreadystatechange = function (oEvent) {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {

                                cdmLinks.innerHTML = xhr.responseText;
                                if (parameters.html)
                                    changeLinkToHtml();

                                changeStyle();
                            } else {
                                console.log("Error", xhr.statusText);
                            }
                        }
                    };
                    xhr.send(null);

                    /**
                     * Desc : Adding .html to the existing links
                     * @param:
                     * @returns:
                     */
                    function changeLinkToHtml() {
                        var allLinks = document.querySelectorAll('#'+parameters.cdmContainer+' a');
                        allLinks.forEach(function (item) {
                            item.setAttribute("href", (item.getAttribute("href"))+".html");
                        });

                    }

                    /**
                     * Desc : Changing the style of CDM links
                     * @param:
                     * @returns:
                     */
                    function changeStyle(){

                        // Creating a style for the CDMs by three value in cpclass attribute (inline, bullet and no-bullet)
                        var style = document.createElement('style');

                        var cssRule = '';
                        switch (parameters.cpclass) {
                            case "inline":
                                cssRule = '#'+ parameters.cdmContainer+ ' ul li{ display: inline-block; margin-left: 10px}';
                                break;
                            case "bullet":
                                cssRule = '#'+ parameters.cdmContainer+ ' ul{ display: block; list-style: initial;}';
                                break;
                            case "no-bullet":
                                cssRule = '#'+ parameters.cdmContainer+ ' ul{ display: block; list-style: none;}';
                                break;
                        }
                        style.appendChild(document.createTextNode(cssRule));
                        // Add the <style> element to the page
                        document.head.appendChild(style);
                    }
                });

            }
        };
    }());
