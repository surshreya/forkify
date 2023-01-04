import icons from "url:../../img/icons.svg";
import previewView from "./previewView";
import View from "./View";

class BookmarksView extends View {
  _parentEl = document.querySelector(".bookmarks");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new BookmarksView();
