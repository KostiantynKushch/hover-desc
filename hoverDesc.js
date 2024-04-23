export default class HoverDesc {
  descId = 'desc'; //id of the element under cursor
  descContentId = 'descContent'; //id of the element content

  hoverAreaAttribute = 'data-desc'; //data attribute to mark area where to show HoverDesc
  hoverAreaContentAttribute = 'data-desc-content'; //data attribute to mark template with inner content for HoverDesc

  desc = null; //default variable to store HoverDesc element
  cursorX = 0; //X position of cursor
  cursorY = 0; //Y position of cursor

  width = 90; //width of HoverDesc element
  height = 90; //height of HoverDesc element
  isVisible = false; //visibility variable for optimization check

  constructor({ width, height, descId, descContentId } = {}) {
    // reassign default variables
    width && (this.width = width);
    height && (this.height = height);
    descId && (this.descId = descId);
    descContentId && (this.descContentId = descContentId);
    // count shift amount depending on width and height
    this.leftShift = this.width / 3;
    this.topShift = this.height / 4;
  }

  /**
   * method to init HoverDesc interaction
   */
  init() {
    // attach all event listeners needed for HoverDesc interaction
    document.addEventListener('mousemove', (e) => this.#handleMouseMove(e));
    document.addEventListener('mouseover', (e) => this.#handleMouseEnter(e));
    document.addEventListener('mouseout', (e) => this.#handleMouseLeave(e));
    document.addEventListener('scroll', () => this.#handleScroll());
    // append HoverDesc element to document
    this.#appendCursorDesc();
  }

  /**
   * method to create and append HoverDesc element
   */
  #appendCursorDesc() {
    // creating main element
    const desc = document.createElement('div');
    desc.id = this.descId;
    desc.className = 'isHidden';
    desc.style.width = `${this.width}px`;
    desc.style.height = `${this.height}px`;
    desc.style.top = `-${this.height}px`;
    desc.style.left = `-${this.width}px`;
    // creating content element
    const descContent = document.createElement('div');
    descContent.id = this.descContentId;
    desc.appendChild(descContent);
    // save element reference
    this.descContent = descContent;

    // append created element in document
    document.body.append(desc);
    document.body.style.overflowX = 'hidden';
    // save element reference
    this.desc = desc;
  }

  /**
   * method to update position of the HoverDesc element
   */
  #updateDescPosition() {
    this.desc.style.transform = `translate(${this.positionX}px, ${this.positionY}px)`;
  }

  /**
   * method to display the HoverDesc element
   * @param {HTMLElement} hoverArea - element over which should be displayed HoverDesc element
   */
  #showDescContent(hoverArea) {
    if (this.isVisible) return;
    // set desc content
    const content = hoverArea.querySelector(
      `[${this.hoverAreaContentAttribute}]`
    ).innerHTML;
    if (!content) return;
    this.descContent.innerHTML = content;

    // update styles
    this.desc.classList.add('isActive');
    this.desc.classList.remove('isHidden');
    this.isVisible = true;
  }

  /**
   * method to hide the HoverDesc element
   */
  #hideDescContent() {
    if (!this.isVisible) return;
    // clear desc content
    this.descContent.innerHTML = '';

    // update steles
    this.desc.classList.add('isHidden');
    this.desc.classList.remove('isActive');
    this.isVisible = false;
  }

  /**
   * event handler for updating the position of the HoverDesc on mouse movement
   * @param {Event} e - Mouse event
   */
  #handleMouseMove(e) {
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
    this.positionX = e.clientX + this.leftShift + window.scrollX;
    this.positionY = e.clientY + this.topShift + window.scrollY;
    this.#updateDescPosition();
  }

  /**
   * event handler for updating the position and visibility of the HoverDesc element of scroll
   */
  #handleScroll() {
    this.positionX = this.cursorX + this.leftShift + window.scrollX;
    this.positionY = this.cursorY + this.topShift + window.scrollY;
    this.#updateDescPosition();

    // update visibility of the descContent
    const hoverArea = document
      .elementFromPoint(this.cursorX, this.cursorY)
      ?.closest(`[${this.hoverAreaAttribute}]`);

    hoverArea ? this.#showDescContent(hoverArea) : this.#hideDescContent();
  }

  /**
   * event handler for mouse enter event
   * @param {Event} e - Mouse Event
   */
  #handleMouseEnter({ target }) {
    // check hover area
    const hoverArea = target.closest(`[${this.hoverAreaAttribute}]`);
    if (!hoverArea) return;

    this.#showDescContent(hoverArea);
  }

  /**
   * event handler for mouse leave event
   * @param {Event} e - Mouse Event
   */
  #handleMouseLeave({ target }) {
    // check hover area
    const hoverArea = target.closest(`[${this.hoverAreaAttribute}]`);
    if (!hoverArea) return;

    this.#hideDescContent();
  }
}
