
/*
 * component/Audioplayer
 */

const template = `
  <div class="audioplayer">
    <div class="audioplayer__toolbar">
      <button class="audioplayer__button-previous-song">
        <span class="icon icon--xl">skip_previous</span>
      </button>

      <button class="audioplayer__button-play-pause">
        <span class="icon icon--xl">play_circle_filled</span>
        <span class="icon icon--xl">pause_circle_filled</span>
      </button>

      <button class="audioplayer__button-stop">
        <span class="icon icon--xl">stop</span>
      </button>
      <button class="audioplayer__button-next-song">
        <span class="icon icon--xl">skip_next</span>
      </button>

    </div>
    <div class="audioplayer__infobox">
      <div class="audioplayer__textinfos">
      <h2 class="audioplayer__title">Artist</h2>
      <h3 class="audioplayer__artist">Title</h3>
      </div>
      <div class="audioplayer__duration">
      <p class="audioplayer__time-played">00:00</p>
      <div class="audioplayer__duration-indicator-wrap">
        <div class="audioplayer__duration-indicator"></div>
      </div>
      <p class="audioplayer__duration-number">00:00</p>
      </div>
    </div>
  </div>
`;

export default {
  name: 'Audioplayer',

  template,

  /*
    data,

    computed,

    methods,

    watch,
  */
};
