
/*
 * Store
 */

const StoreStructure = {
	state: {
		playlist: [],
	},

	mutations: {
		mutateSetPlaylist(state, playlist) {
			state.playlist = playlist;
		},
	},

	actions: {
		async loadPlaylist({ commit }, url) {
			const result = await fetch(url);

			if (!result.ok) {
				throw new Error(`Could not access ${this.url}`);
			}

			const playlist = await result.json();

			commit('mutateSetPlaylist', playlist);
		},
	},
};

export function createStore(Vuex) {
	return new Vuex.Store(StoreStructure);
};
