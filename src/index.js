import { Notify } from "notiflix/build/notiflix-notify-aio";
import gallery from "./component/simplelightbox";
import { getPosts } from "./component/api";
import { markupPosts } from "./component/markup";

const refs = {
  form: document.querySelector(".search-form"),
  input: document.querySelector("[name=searchQuery]"),
  buttonSearch: document.querySelector(".button-form-search"),
  galleryImg: document.querySelector(".gallery"),
  photo: document.querySelector(".photo-card a"),
  buttonLoadMore: document.querySelector(".load-more"),
};

const { form, input, galleryImg, photo, buttonLoadMore } = refs;

let currentPage = 1;
console.log("🚀 ~ currentPage:", currentPage);
let searchQuery = "";

const onSearch = (event) => {
  event.preventDefault();
  currentPage = 1;
  searchQuery = input.value;
  getPosts(searchQuery)
    .then((data) => {
      if (data.hits.length === 0) {
        buttonLoadMore.hidden = true;
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
      gallery();
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
    gallery();
  });
};

form.addEventListener("submit", onSearch);
buttonLoadMore.addEventListener("click", onLoad);
