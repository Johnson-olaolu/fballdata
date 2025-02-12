$(document).ready(function () {

    const myModal = new bootstrap.Modal('#searchModal', {
        keyboard: false
    })

    function searchArticles(search) {
        if (search.trim() == "") {
            document.getElementById("modalArticleSearchResultsContainer").innerHTML = ' <p class="py-3 text-center mb-0">No search Results</p>'
            return;
        }
        fetch(`/article/query?search=${search}`)
            .then(response => response.json())
            .then(data => {
                let html = "";
                data.data.map(d => {
                    html += `
                    <a href="/article/${d.id}" class="text-decoration-none">
            <div class="row shadow-sm p-2 bg-body-tertiary rounded mb-2">
              <div class="col-md-2">
                <img src="${d.image}" class="img-fluid" alt="" />
              </div>
              <div class="col-md-auto">
                <p class="fw-bold mb-1">${d.title}</p>
                <div style="font-size: 14px" class="d-flex align-items-center">
                  <p class="me-2 mb-0"><strong>Author:</strong> ${d.author.fullName}</p>
                  <p class="mb-0"><strong>Tags:</strong> ${d.tags?.map(tag => tag.name).join(', ')}</p>
                </div>
              </div>
            </div>
          </a>
                `;
                })
                if (html) {
                    document.getElementById("modalArticleSearchResultsContainer").innerHTML = html
                } else {
                    document.getElementById("modalArticleSearchResultsContainer").innerHTML = ' <p class="py-3 text-center mb-0">No search Results</p>'
                }
            })
    }

    document.getElementById("articleSearhBar").addEventListener("click", () => {
        myModal.show()
        const modalArticleSearchBar = document.getElementById("modalArticleSearchBar")
        modalArticleSearchBar.focus()

        modalArticleSearchBar.addEventListener("keyup", (e) => {
            const search = e.target.value
            searchArticles(search)
        })

    })
})

