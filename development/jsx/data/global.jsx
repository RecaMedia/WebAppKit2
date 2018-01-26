import Cookies from 'js-cookie';

// Process cookies.
var bookmarks = Cookies.get('bookmarks');

// Prepare bookmarks.
if (bookmarks == undefined) {
	bookmarks = {};
} else {
	bookmarks = JSON.parse(bookmarks);
}

// Default global properties.
const global = {
	cookies: {
		bookmarks
	},
	user: {}
};

export default global;