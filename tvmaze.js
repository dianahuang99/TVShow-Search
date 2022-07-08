"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

$episodesArea.hide();
// const $searchQuery = $("#search-query");
/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  if (res.data.length === 0) {
    alert("no show found!");
  } else {
    return res.data;
  }
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    if (show.show.image) {
      const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-6 col-lg-3">
         <div class="card" data-show-id="${show.show.id}">
           <img class="card-image-top"
              src="${show.show.image.medium}" alt="Not Found" onerror=this.src="https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300">
           <div class="card-body">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
             <button class="btn text-light btn-md btn-info Show-getEpisodes" data-bs-toggle="modal" data-bs-target="#episodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
       
      `
      );
      $showsList.append($show);
      makeEpisodeModal();
    } else {
      const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-6 col-lg-3">
        <div class="card" data-show-id="${show.show.id}">
          <img class="card-image-top"
            src="https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300">
          <div class="card-body">
            <h5 class="card-title">${show.show.name}</h5>
            <p class="card-text">${show.show.summary}</p>
            <button class="btn text-light btn-md btn-info Show-getEpisodes" data-bs-toggle="modal" data-bs-target="#episodes>
              Episodes
            </button>
          </div>
        </div>
      </div>
      `
      );
      $showsList.append($show);
      makeEpisodeModal();
    }
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  // $episodesArea.show();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  $("#search-query").val("");
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  return res.data;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    const $episode = $(
      `<img class="card-img-top" src=${episode.image.medium} alt="Card image cap">
      <div class="card" data-show-id="${episode.id}">
        <div class="card-body">
          <h5 class="card-title">Season ${episode.season} Episode ${episode.number}</h5>
          <p class="card-text">${episode.name}: ${episode.summary}</p>
        </div>
      </div>
      `
    );
    $episodesList.append($episode);
  }
  // $episodesArea.removeClass("display");
}

async function searchForEpisodesAndDisplay(id) {
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
}

$(".container").on("click", ".Show-getEpisodes", function (evt) {
  searchForEpisodesAndDisplay($(evt.target).closest(".Show").data("show-id"));
  $episodesArea.show();
});

function makeEpisodeModal() {
  const $episodesArea = $("#episodes-area");
  $episodesArea.html(`
      <div class="modal fade" id="episodes" tabindex="-1" aria-labelledby="episodesLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="episodesLabel">Episodes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="lead" id="eptitle"></p>
            <ul id="episodes-list">
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`);
}
