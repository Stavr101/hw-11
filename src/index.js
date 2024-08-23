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
  target: document.querySelector(".js-guard"),
};

const { form, input, galleryImg, photo, buttonLoadMore, target } = refs;

let currentPage = 1;

let searchQuery = "";
let options = {
  root: null,
  rootMargin: "200px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      currentPage += 1;
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
    }
  });
}

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
        // buttonLoadMore.hidden = false;
      }
      galleryImg.innerHTML = markupPosts(data);
      observer.observe(target);
      gallery();
    })
    .catch((error) => console.log(error))
    .finally(form.reset());
};
// const onLoad = () => {
//   currentPage += 1;
//   buttonLoadMore.hidden = false;
//   getPosts(searchQuery, currentPage).then((data) => {
//     if (data.total === data.totalHits) {
//       buttonLoadMore.hidden = true;
//       Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     galleryImg.insertAdjacentHTML("beforeend", markupPosts(data));
//     gallery();
//   });
// };

form.addEventListener("submit", onSearch);
// buttonLoadMore.addEventListener("click", onLoad);
