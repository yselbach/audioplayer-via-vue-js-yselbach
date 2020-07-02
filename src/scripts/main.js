// eslint-disable-next-line import/extensions
import Swipe from './modules/swipe.js';

// Config
const slideshowsContentUrl = './json/content.json';
const slideShowImagePath = './images';
const templateUrl = './templates/slideshow.html';

/**
* toogleMenu
*
* Blendet das Menü aus oder ein.
*
*/

function toogleMenu() {
  const interactionElementClass = '.js-navigation-interaction-element';
  const interactionElementAdditionalClass = 'hamburger-button--is-open';
  const menuElementClass = 'main-header__menu-bar-nav--is-open';

  const interactionElement = document.querySelector(interactionElementClass);
  const interactionTarget = interactionElement.dataset.jsInteractionTarget;
  const menuElement = document.querySelector(interactionTarget);

  interactionElement.addEventListener('click', () => {
    interactionElement.classList.toggle(interactionElementAdditionalClass);
    menuElement.classList.toggle(menuElementClass);
  });
}


/**
* Slideshow
*
* Erzeugt eine Slideshow aus einer JSON Datei und hängt sie ins DOM
*
*/

class Slideshow {
  constructor(data) {
    this.data = data;
    this.id = data.id;
    this.interactionElementNext = false;
    this.interactionElementPrevious = false;
    this.slideClassVisible = 'slide-show__slide--visible';
    this.slideShowElement = false;
    this.activeSlide = 0;
    this.slideTemplate = false;
    this.slideshowContainerTemplate = false;
    this.slidesHTML = [];
    this.slides = [];
  }

  init() {
    const [slideTemplate, slideshowContainerTemplate] = this._parseTemplates();
    this.slideTemplate = slideTemplate;
    this.slideshowContainerTemplate = slideshowContainerTemplate;
    this._createSlideshow();
    this._addInteractions();
    this.showSlide(this.activeSlide);
  }

  _addInteractions() {
    this.interactionElementNext.addEventListener('click', () => { this.changeSlide('next'); });
    this.interactionElementPrevious.addEventListener('click', () => { this.changeSlide('previous'); });

    const swiper = new Swipe(this.slideShowElement);
    swiper.onLeft = (() => {
      this.changeSlide('next');
    });
    swiper.onRight = (() => {
      this.changeSlide('previous');
    });
    swiper.init();

    this.slides.forEach((slide) => {
      slide.addEventListener('click', (e) => { Slideshow.toggleFullScreen(e); });
    });
  }

  _createSlideshow() {
    function buildSlides($this) {
      $this.data.images.forEach((src, index) => {
        const slideHTML = $this.slideTemplate.replace(/{{imgSrc}}/, `${slideShowImagePath}/${src}`);
        $this.slidesHTML.push(slideHTML);
      });
    }

    function injectSlides($this) {
      $this.slideshowContainerTemplate = $this.slideshowContainerTemplate.replace(/{{slides}}/, $this.slidesHTML.join(' '));

      let count = 0;
      while ($this.slideshowContainerTemplate.match(/{{(.*?)}}/) && count < 120) {
        const key = RegExp.$1;
        const pattern = `{{${key}}}`;
        const replacement = $this.data[key];
        $this.slideshowContainerTemplate = $this.slideshowContainerTemplate.replace(pattern, replacement);
        count++;
      }
    }

    function insertSlideshow($this) {
      const selector = `[data-js-slideshow=${$this.data.id}]`;
      const parser = new DOMParser();
      const slideshow = parser.parseFromString($this.slideshowContainerTemplate, 'text/html');
      document.querySelector(selector).appendChild(slideshow.body.childNodes[0]);
    }

    function registerDomElements($this) {
      $this.slideShowElement = document.querySelector(`[data-js-id=${$this.id}]`);
      $this.interactionElementNext = $this.slideShowElement.querySelector('[data-js-nav-next-slide]');
      $this.interactionElementPrevious = $this.slideShowElement.querySelector('[data-js-nav-previous-slide]');
      $this.slides = $this.slideShowElement.querySelectorAll('[data-js-slide]');
    }

    buildSlides(this);
    injectSlides(this);
    insertSlideshow(this);
    registerDomElements(this);
  }

  _parseTemplates() {
    const { template } = this.data;
    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');
    const slideTemplate = doc.querySelector('#slideshow-slide-template').innerHTML;
    const slideshowContainerTemplate = doc.querySelector('#slideshow-container-template').innerHTML;
    return [slideTemplate, slideshowContainerTemplate];
  }

  static toggleFullScreen(e) {
    const target = e.currentTarget;
    if (!document.fullscreenElement) {
      target.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  showSlide(activeSlideIndex) {
    this.slides[activeSlideIndex].classList.add(this.slideClassVisible);
  }

  hideSlide(activeSlideIndex) {
    this.slides[activeSlideIndex].classList.remove(this.slideClassVisible);
  }

  changeSlide(direction) {
    this.hideSlide(this.activeSlide);

    if (direction === 'next') {
      if (this.activeSlide + 1 < this.slides.length) {
        this.activeSlide += 1;
      } else if (this.wrapAround === true) {
        this.activeSlide = 0;
      }
    } else if (this.activeSlide - 1 < 0) {
      if (this.wrapAround === true) {
        this.activeSlide = this.slides.length - 1;
      }
    } else {
      this.activeSlide -= 1;
    }
    this.showSlide(this.activeSlide);
  }

  static toggleFullScreen(e) {
    const target = e.currentTarget;
    if (!document.fullscreenElement) {
      target.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

async function fetchSlideshowData(contentUrl, templateUrl) {
  const slideshowData = {};
  let response = await fetch(contentUrl);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  slideshowData.content = await response.json();

  response = await fetch(templateUrl);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  slideshowData.templateText = await response.text();

  return slideshowData;
}

const slideshows = [];
fetchSlideshowData(slideshowsContentUrl, templateUrl)
  .then((slideshowsData) => {
    const { templateText } = slideshowsData;
    slideshowsData.content.forEach((slideshowData, index) => {
      slideshowData.template = templateText;
      slideshows[index] = new Slideshow(slideshowData);
      slideshows[index].init();
    });
  })
  .catch((error) => { console.error(error); });

toogleMenu();
