BASE_URL = "https://pixabay.com/api";
API_KEY = "29154782-64abcd202d8466e583ce5ca87";

export const getPosts = (query, page = 1) =>
  fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  ).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    currentPage = page;
    return resp.json();
  });
