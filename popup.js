chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrape,
      });
})

chrome.runtime.onMessage.addListener(
    function(request) {
        displayDistribution(buildDistribution(request.terms))
    }
);

function scrape() {
    chrome.runtime.sendMessage({
        terms: document.getElementsByTagName("body")[0].innerText.split(/\s+/)
    });
}

function buildDistribution(terms) {
    return terms.reduce((p,c) => {
        if (!p.has(c)) {
            p.set(c, 0)
        }
        p.set(c, p.get(c)+1)
        return p
    }, new Map())
}

function displayDistribution(distribution) {
    let table = document.getElementById("term-table")
    let tbody = document.createElement("tbody")
    distribution = mapToList(distribution)
    distribution.sort((a,b) => b[1] - a[1])

    for (let [term, count] of distribution) {
        let tr = document.createElement("tr")
        let tdCount = document.createElement("td")
        tdCount.innerText = count
        let tdTerm = document.createElement("td")
        tdTerm.innerText = term
        tr.appendChild(tdCount)
        tr.appendChild(tdTerm)
        tbody.appendChild(tr)
    }
    table.appendChild(tbody)
}


function mapToList(map) {
    let list = []
    for (let entry of map) {
        list.push(entry)
    }
    return list
}