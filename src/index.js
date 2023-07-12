import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';


const axios = require('axios');



 async function fetchParameters(value, page) {
const API_KEY = '38219577-d029f76c48d8fd975b70c05f3';
const BASE_URL = 'https://pixabay.com/api/';
const result = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
return result;
};


const searchForm = document.querySelector('.search-form');
const galleryBox = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

loadMoreBtn.style.display = 'none';
let lightbox = new SimpleLightbox('.gallery a');


let pageCount = 1;
let inputValue = '';
let numberOfResponse = 0;



searchForm.addEventListener('submit', onSearch);

async function onSearch(evt) {
    evt.preventDefault();
    clearHtml();
    pageCount = 1;
    const { searchQuery } = evt.target;
    inputValue = searchQuery.value.trim();



    if (inputValue === '') {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    
        return
    }
    try {
        const fetchUrl = await fetchParameters(inputValue, pageCount);
        const { data: { hits, totalHits, total } } = fetchUrl;
        


        if (!total) {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }
        
        createMarkup(hits);
        lightbox.refresh();
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
        numberOfResponse = hits.length;
        loadMoreBtn.style.display = 'block';
    } catch (error) {
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    };

    function clearHtml() {
  galleryBox.innerHTML = '';
}


    loadMoreBtn.addEventListener('click', async () => {
        pageCount += 1;
        
        try {
            const fetchUrlForBtn = await fetchParameters(inputValue, pageCount);
            const { data: { hits: hitsForBtn, totalHits, total } } = fetchUrlForBtn;

            createMarkup(hitsForBtn);
            loadMoreBtn.disabled = false;
            lightbox.refresh();

            numberOfResponse += hitsForBtn.length;
          
        
            if (numberOfResponse === totalHits) {
                loadMoreBtn.style.display = 'none';
                return
            }
        

        } catch (error) {
            const { response: { status } } = err;

        if (status === 400) {
          Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`)
        }
        
        }
      
    });

    function createMarkup(data) {
    const markup = data.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  
  <div class="description">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="description-item">
      <b>Views</b>${views}
    </p>
    <p class="description-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="description-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`).join('');
        
        
  return galleryBox.insertAdjacentHTML('beforeend', markup);
}
};