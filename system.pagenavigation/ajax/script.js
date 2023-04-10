document.addEventListener("DOMContentLoaded", function() {
    'use strict';

    /* YET - LOAD MORE */

    let yetInitialText,
        ctrlpanel,
        row;

    function loadXMLDoc(url, closestIDelem = false, yet) {
        let xmlhttp = new XMLHttpRequest(),
            newYet = null,
            posts = null,
            i = null,
            error = false,
            postsContainer,
            innerElements;

        xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState === XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
                if (xmlhttp.status === 200) {

                    // Парсим в DOM и находим элементы post
                    let newDoc = new DOMParser().parseFromString(xmlhttp.responseText, "text/html");

                    if (closestIDelem) {
                        postsContainer = newDoc.getElementById(closestIDelem.id);
                        if (!postsContainer) {
                            postsContainer = newDoc;
                        }
                    } else {
                        postsContainer = newDoc;
                    }

                    if (postsContainer) {
                        innerElements = Array.from(postsContainer.children);
                    } else {
                        error = "Контейнер с id «" + closestIDelem.id + "» не найден в запросе " + url + "\n";
                    }

                    if (innerElements) {
                        yet.parentNode.removeChild(yet);

                        innerElements.forEach((element) => {
                            if (element.classList.contains('more')) {
                                // Заменяем ссылку и текст в исходной кнопке (чтобы остался EventListener)
                                yet.href = element.href;
                                yet.innerText = yetInitialText;
                                closestIDelem.appendChild(yet);
                            } else {
                                closestIDelem.appendChild(element);
                            }
                        });

                    } else {
                        error += 'Элементы не найдены';
                    }

                    if (error) { console.warn(error); }

                } else if (xmlhttp.status == 400) {
                    console.warn('Ошибка 400 в ajax-запросе');
                } else {
                    console.warn('Неизвестная ошибка в ajax-запросе');
                }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    function getClosestIDelem(el) {
        while (el && el.parentNode) {
            el = el.parentNode;

            if (el && typeof el.id != 'undefined' && el.id != 'ctrl_panel') {
                return el;
            }
        }

        return null;
    }

    function ShowMoreClick(yet) {
        yet.addEventListener("click", function(e) {
            yetInitialText = yet.innerText;
            yet.innerHTML = 'Загрузка…';
            yet.disabled = true;
            if (this.href.indexOf('ajax_get') !== -1) {
                loadXMLDoc(this.href, getClosestIDelem(yet), yet);
            } else {
                loadXMLDoc(this.href + '&ajax_get=Y', getClosestIDelem(yet), yet);
            }
            e.preventDefault(); // Cancel the native event
            e.stopPropagation(); // Don't bubble/capture the event any further
        }, false);
    }

    let yets = document.getElementsByClassName('more');
    [].forEach.call(yets, function(yet) {
        ShowMoreClick(yet);
    });

});