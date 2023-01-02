import icons from "url:../../img/icons.svg";
import View from "./View";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "No recipes found for your search. Please try another :)";
  _message = "";

  _generateMarkup() {
    return this._data.map((result) => {
      return `<li class="preview">
            <a class="preview__link " href="#${result.id}">
                <figure class="preview__fig">
                <img src="${result.imageUrl}" alt="${result.title}" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    <p class="preview__publisher">${result.publisher}</p>
                </div>
            </a>
        </li>`;
    });
  }
}

export default new ResultsView();
