import { Notify } from "notiflix/build/notiflix-notify-aio";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getPosts } from "./component/api";

const refs = {
  form: document.querySelector(".search-form"),
  input: document.querySelector("[name=searchQuery]"),
  buttonSearch: document.querySelector(".button-form-search"),
  galleryImg: document.querySelector(".gallery"),
  photo: document.querySelector(".photo-card a"),
  buttonLoadMore: document.querySelector(".load-more"),
};

const { form, input, galleryImg, photo, buttonLoadMore } = refs;
console.log("🚀 ~ photo:", photo);
let currentPage = 1;
let searchQuery = "";

// gallery.refresh();
const markupPosts = ({ hits }) => {
  return hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `
    
    
      <div class="photo-card">
  <a href="${largeImageURL}"> <img src="${webformatURL}" width="350px" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes - ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views - ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments - ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads - ${downloads}</b>
    </p>
  </div></a>
</div>`
  );
};

const onSearch = (event) => {
  event.preventDefault();
  searchQuery = input.value;
  getPosts(searchQuery)
    .then((data) => {
      if (data.hits.length === 0) {
        Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
      } else {
        Notify.success(`Hooray! We found ${data.total} images.`);
      }
      if (data.hits.length * currentPage !== data.totalHits) {
        buttonLoadMore.hidden = false;
      }
      galleryImg.innerHTML = markupPosts(data);
      let gallery = new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionDelay: 250,
        captionPosition: "bottom",
      });
    })
    .catch((error) => console.log(error))
    .finally(form.reset());
};
const onLoad = () => {
  currentPage += 1;
  buttonLoadMore.hidden = false;
  getPosts(searchQuery, currentPage).then((data) => {
    if (data.total === data.totalHits) {
      buttonLoadMore.hidden = true;
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    galleryImg.insertAdjacentHTML("beforeend", markupPosts(data));
    let gallery = new SimpleLightbox(".gallery a", {
      captionsData: "alt",
      captionDelay: 250,
      captionPosition: "bottom",
    });
  });
};

form.addEventListener("submit", onSearch);
buttonLoadMore.addEventListener("click", onLoad);
